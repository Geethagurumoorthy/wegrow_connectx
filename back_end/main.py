

import os
import hmac
import hashlib
import secrets
import logging

from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pwdlib import PasswordHash

from database import Base, engine
from models import User
from password_reset import PasswordResetOTP
from schema import (
    UserCreate,
    LoginRequest,
    ForgotPasswordRequest,
    VerifyResetOTPRequest,
    ResetPasswordRequest,
)
from database import Base, engine
from email_utils import send_otp_email
from rolebased import (
    clear_access_cookie,
    create_access_token,
    get_current_user,
    get_db,
    get_permissions,
    normalize_role,
    require_roles,
    set_access_cookie,
)
from database import Base, engine
from pydantic import BaseModel, Field
import models
import chat_models
from chat_models import ChatMessage

Base.metadata.create_all(bind=engine)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Wegrow ConnectX API",
    description="Backend API for the Wegrow ConnectX project",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

password_hash = PasswordHash.recommended()

# Both models must be imported before creating the tables.
Base.metadata.create_all(bind=engine)


def hash_reset_value(value: str) -> str:
    secret = os.getenv("PASSWORD_RESET_SECRET")
    if not secret:
        raise RuntimeError("PASSWORD_RESET_SECRET is not configured")

    return hmac.new(
        secret.encode("utf-8"),
        value.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


# ---------------- REGISTER API ----------------

@app.post("/users/register")
def register_user(
    data: UserCreate,
    db: Session = Depends(get_db),
):
    role = normalize_role(data.role)
    if role == "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin accounts must be provisioned by a database administrator",
        )

    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    user = User(
        fullname=data.fullname,
        email=data.email,
        password=password_hash.hash(data.password),
        role=role,
        emp_id=data.emp_id,
        job_title=data.job_title,
        department=data.department,
        team_name=data.team_name,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "Registration successful",
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Registration failed: email may already exist",
        )


# ---------------- LOGIN API ----------------

@app.post("/users/login")
def login_user(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None or not password_hash.verify(
        data.password, user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    role = normalize_role(user.role)
    token = create_access_token(user.id)
    set_access_cookie(response, token)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "role": role,
            "permissions": get_permissions(role),
            "emp_id": user.emp_id,
            "job_title": user.job_title,
            "department": user.department,
            "team_name": user.team_name,
        },
    }


@app.get("/users/me")
def get_authenticated_user(user: User = Depends(get_current_user)):
    role = normalize_role(user.role)
    return {
        "id": user.id,
        "fullname": user.fullname,
        "email": user.email,
        "role": role,
        "permissions": get_permissions(role),
        "emp_id": user.emp_id,
        "job_title": user.job_title,
        "department": user.department,
        "team_name": user.team_name,
    }


@app.post("/users/logout")
def logout_user(response: Response):
    clear_access_cookie(response)
    return {"message": "Logout successful"}


@app.get("/admin")
def admin_access(user: User = Depends(require_roles("admin"))):
    return {
        "message": "Admin access granted",
        "user": {
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "role": normalize_role(user.role),
        },
    }


# ---------------- FORGOT PASSWORD API ----------------

@app.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    # Return the same message whether the email exists or not.
    response = {
        "message": (
            "If the email is registered, password recovery "
            "instructions will be sent."
        )
    }

    if user is None:
        return response

    now = datetime.now(timezone.utc)

    # Invalidate previous recovery requests for this user.
    db.query(PasswordResetOTP).filter(
        PasswordResetOTP.user_id == user.id
    ).delete(synchronize_session=False)

    otp = f"{secrets.randbelow(1_000_000):06d}"

    record = PasswordResetOTP(
        user_id=user.id,
        otp_hash=hash_reset_value(otp),
        expires_at=now + timedelta(minutes=5),
        attempts=0,
        verified=False,
    )

    try:
        db.add(record)
        db.commit()

        # Never return the OTP in the API response.
        send_otp_email(user.email, otp)

    except Exception:
        db.rollback()
        logger.exception("Password recovery request failed")

        # Keep the external response generic.
        return response

    return response


# ---------------- VERIFY OTP API ----------------

@app.post("/verify-reset-otp")
def verify_reset_otp(
    data: VerifyResetOTPRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP",
        )

    record = db.query(PasswordResetOTP).filter(
        PasswordResetOTP.user_id == user.id,
        PasswordResetOTP.verified.is_(False),
    ).order_by(
        PasswordResetOTP.id.desc()
    ).first()

    now = datetime.now(timezone.utc)

    if (
        record is None
        or record.expires_at <= now
        or record.attempts >= 5
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP",
        )

    submitted_hash = hash_reset_value(data.otp)

    if not hmac.compare_digest(
        submitted_hash, record.otp_hash
    ):
        record.attempts += 1
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP",
        )

    reset_token = secrets.token_urlsafe(32)

    record.verified = True
    record.reset_token_hash = hash_reset_value(reset_token)
    record.reset_token_expires_at = now + timedelta(minutes=10)

    db.commit()

    return {
        "message": "OTP verified successfully",
        "reset_token": reset_token,
        "expires_in_seconds": 600,
    }


# ---------------- RESET PASSWORD API ----------------

@app.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    token_hash = hash_reset_value(data.reset_token)
    now = datetime.now(timezone.utc)

    record = db.query(PasswordResetOTP).filter(
        PasswordResetOTP.reset_token_hash == token_hash,
        PasswordResetOTP.verified.is_(True),
    ).first()

    if (
        record is None
        or record.reset_token_expires_at is None
        or record.reset_token_expires_at <= now
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token",
        )

    user = db.query(User).filter(
        User.id == record.user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token",
        )

    try:
        user.password = password_hash.hash(data.new_password)

        # Deleting the recovery record makes the token single-use.
        db.query(PasswordResetOTP).filter(
            PasswordResetOTP.user_id == user.id
        ).delete(synchronize_session=False)

        db.commit()

    except Exception:
        db.rollback()
        logger.exception("Password reset failed")
        raise HTTPException(
            status_code=500,
            detail="Unable to reset password. Please try again.",
        )

    return {"message": "Password reset successful"}

class ChatMessageCreate(BaseModel):
    receiver_id: int
    message: str = Field(min_length=1, max_length=5000)
    reply_to_id: int | None = None

# ---------------- CHAT BOX APIs ----------------

# 1. Search registered users by name
@app.get("/chat/users")
def search_chat_users(
    search: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(User).filter(User.id != current_user.id)

    if search.strip():
        query = query.filter(
            User.fullname.ilike(f"%{search.strip()}%")
        )

    users = query.order_by(User.fullname).limit(20).all()

    return [
        {
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "role": user.role,
            "emp_id": user.emp_id,
        }
        for user in users
    ]


# 2. Send a message
@app.post("/chat/messages")
def send_chat_message(
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    receiver = db.query(User).filter(
        User.id == data.receiver_id
    ).first()

    if receiver is None:
        raise HTTPException(
            status_code=404,
            detail="Receiver not found",
        )

    if data.receiver_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot send a message to yourself",
        )

    if not data.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    if data.reply_to_id is not None:
        original = db.query(ChatMessage).filter(
            ChatMessage.id == data.reply_to_id,
            or_(
                (
                    (ChatMessage.sender_id == current_user.id)
                    & (ChatMessage.receiver_id == receiver.id)
                ),
                (
                    (ChatMessage.sender_id == receiver.id)
                    & (ChatMessage.receiver_id == current_user.id)
                ),
            ),
            ChatMessage.is_deleted.is_(False),
        ).first()

        if original is None:
            raise HTTPException(
                status_code=404,
                detail="Original message not found in this conversation",
            )

    chat_message = ChatMessage(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        message=data.message.strip(),
        reply_to_id=data.reply_to_id,
    )

    try:
        db.add(chat_message)
        db.commit()
        db.refresh(chat_message)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save message",
        )

    return {
        "message": "Message sent successfully",
        "data": {
            "id": chat_message.id,
            "sender_id": chat_message.sender_id,
            "receiver_id": chat_message.receiver_id,
            "message": chat_message.message,
            "reply_to_id": chat_message.reply_to_id,
            "created_at": chat_message.created_at,
            "is_edited": chat_message.is_edited,
        },
    }


# 3. Get conversation history
@app.get("/chat/messages/{other_user_id}")
def get_chat_history(
    other_user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    other_user = db.query(User).filter(
        User.id == other_user_id
    ).first()

    if other_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    messages = db.query(ChatMessage).filter(
        or_(
            (
                (ChatMessage.sender_id == current_user.id)
                & (ChatMessage.receiver_id == other_user_id)
            ),
            (
                (ChatMessage.sender_id == other_user_id)
                & (ChatMessage.receiver_id == current_user.id)
            ),
        )
    ).order_by(ChatMessage.created_at.asc(), ChatMessage.id.asc()).all()

    return {
        "conversation_with": {
            "id": other_user.id,
            "fullname": other_user.fullname,
        },
        "messages": [
            {
                "id": msg.id,
                "sender_id": msg.sender_id,
                "receiver_id": msg.receiver_id,
                "message": (
                    "[This message was deleted]"
                    if msg.is_deleted
                    else msg.message
                ),
                "reply_to_id": msg.reply_to_id,
                "created_at": msg.created_at,
                "updated_at": msg.updated_at,
                "is_edited": msg.is_edited,
                "is_deleted": msg.is_deleted,
            }
            for msg in messages
        ],
    }
