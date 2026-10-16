import base64
import hashlib
import hmac
import json
import os
import re
import time
from collections.abc import Callable
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Cookie, Depends, HTTPException, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User

TOKEN_ISSUER = "wegrow-connectx"
TOKEN_COOKIE_NAME = "access_token"
ACCESS_TOKEN_LIFETIME = timedelta(hours=1)

    
ROLE_PERMISSIONS = {
    "admin": [
        "activity:read",
        "chat:read",
        "teams:read",
        "calendar:read",
        "files:read",
        "people:read",
        "admin:read",
    ],
    "hr": [
        "activity:read",
        "chat:read",
        "teams:read",
        "calendar:read",
        "files:read",
        "people:read",
    ],
    "employee": [
        "activity:read",
        "chat:read",
        "teams:read",
        "calendar:read",
        "files:read",
        "people:read",
    ],
}


_bearer_scheme = HTTPBearer(auto_error=False)


def normalize_role(role: str | None) -> str:
    normalized = re.sub(r"[\s-]+", "_", (role or "hr").strip().lower())
    if normalized not in ROLE_PERMISSIONS:
        raise HTTPException(status_code=403, detail="User has no supported role")
    return normalized


def get_permissions(role: str | None) -> list[str]:
    return ROLE_PERMISSIONS[normalize_role(role)].copy()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _signing_key() -> bytes:
    configured_key = os.getenv("JWT_SECRET_KEY") or os.getenv(
        "PASSWORD_RESET_SECRET"
    )
    if not configured_key:
        raise RuntimeError(
            "Configure JWT_SECRET_KEY or PASSWORD_RESET_SECRET for JWT signing"
        )
    return hashlib.sha256(
        f"wegrow-connectx-access-token:{configured_key}".encode("utf-8")
    ).digest()


def _encode_segment(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(user_id),
        "iss": TOKEN_ISSUER,
        "iat": int(now.timestamp()),
        "exp": int((now + ACCESS_TOKEN_LIFETIME).timestamp()),
    }
    signing_input = ".".join(
        (
            _encode_segment(json.dumps(header, separators=(",", ":")).encode()),
            _encode_segment(json.dumps(payload, separators=(",", ":")).encode()),
        )
    )
    signature = hmac.new(
        _signing_key(), signing_input.encode("ascii"), hashlib.sha256
    ).digest()
    return f"{signing_input}.{_encode_segment(signature)}"


def _decode_segment(segment: str) -> bytes:
    padding = "=" * (-len(segment) % 4)
    return base64.b64decode(
        segment + padding, altchars=b"-_", validate=True
    )


def decode_access_token(token: str) -> int:
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
        signing_input = f"{header_segment}.{payload_segment}"
        expected_signature = hmac.new(
            _signing_key(), signing_input.encode("ascii"), hashlib.sha256
        ).digest()
        if not hmac.compare_digest(
            expected_signature, _decode_segment(signature_segment)
        ):
            raise ValueError("Invalid signature")

        header: Any = json.loads(_decode_segment(header_segment))
        payload: Any = json.loads(_decode_segment(payload_segment))
        if not isinstance(header, dict) or header.get("alg") != "HS256":
            raise ValueError("Unsupported token algorithm")
        if not isinstance(payload, dict) or payload.get("iss") != TOKEN_ISSUER:
            raise ValueError("Invalid token issuer")

        expires_at = payload.get("exp")
        subject = payload.get("sub")
        if (
            not isinstance(expires_at, int)
            or expires_at <= int(time.time())
            or not isinstance(subject, str)
            or not subject.isdecimal()
            or int(subject) <= 0
        ):
            raise ValueError("Invalid or expired token")
        return int(subject)
    except (
        UnicodeDecodeError,
        ValueError,
        TypeError,
        json.JSONDecodeError,
    ) as exc:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    access_token_cookie: str | None = Cookie(
        default=None, alias=TOKEN_COOKIE_NAME
    ),
    db: Session = Depends(get_db),
) -> User:
    token = (
        credentials.credentials
        if credentials is not None
        else access_token_cookie
    )
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = decode_access_token(token)
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")
    normalize_role(user.role)
    return user


def require_roles(*allowed_roles: str) -> Callable[..., User]:
    normalized_roles = {normalize_role(role) for role in allowed_roles}

    def check_role(user: User = Depends(get_current_user)) -> User:
        if normalize_role(user.role) not in normalized_roles:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource",
            )
        return user

    return check_role


def set_access_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=TOKEN_COOKIE_NAME,
        value=token,
        max_age=int(ACCESS_TOKEN_LIFETIME.total_seconds()),
        httponly=True,
        secure=os.getenv("COOKIE_SECURE", "false").strip().lower()
        in {"1", "true", "yes"},
        samesite="lax",
        path="/",
    )


def clear_access_cookie(response: Response) -> None:
    response.delete_cookie(
        key=TOKEN_COOKIE_NAME,
        httponly=True,
        secure=os.getenv("COOKIE_SECURE", "false").strip().lower()
        in {"1", "true", "yes"},
        samesite="lax",
        path="/",
    )