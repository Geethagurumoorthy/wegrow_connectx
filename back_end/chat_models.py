
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    func,
)
from sqlalchemy.orm import relationship

from database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user_register.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("user_register.id"), nullable=False)

    message = Column(Text, nullable=False)
    reply_to_id = Column(
        Integer,
        ForeignKey("chat_messages.id"),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
    )
    is_edited = Column(Boolean, default=False, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    reply_to = relationship(
        "ChatMessage",
        remote_side=[id],
        foreign_keys=[reply_to_id],
    )
