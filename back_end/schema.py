
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    fullname: str
    email: EmailStr
    password: str
    role: str | None = None
    emp_id: str | None = None
    job_title: str | None = None
    department: str | None = None
    team_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyResetOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(pattern=r"^[0-9]{6}$")


class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str = Field(min_length=8, max_length=128)
