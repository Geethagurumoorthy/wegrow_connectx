
import os
import smtplib
import ssl
from email.message import EmailMessage

from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent / ".env", override=True)


def send_otp_email(to_email: str, otp: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_user or not smtp_password:
        raise RuntimeError("SMTP credentials are not configured")

    message = EmailMessage()
    message["Subject"] = "Wegrow ConnectX - Password Reset OTP"
    message["From"] = smtp_user
    message["To"] = to_email
    message.set_content(
        f"Your Wegrow ConnectX password reset OTP is: {otp}\n\n"
        "This code expires in 5 minutes. "
        "If you did not request this, ignore this email."
    )

    context = ssl.create_default_context()

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        server.starttls(context=context)
        server.login(smtp_user, smtp_password)
        server.send_message(message)
