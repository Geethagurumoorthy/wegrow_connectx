

from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Boolean
)
from database import Base


class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otp"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("user_register.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    otp_hash = Column(String(64), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    attempts = Column(Integer, default=0, nullable=False)
    verified = Column(Boolean, default=False, nullable=False)
    reset_token_hash = Column(String(64), nullable=True)
    reset_token_expires_at = Column(DateTime(timezone=True), nullable=True)
