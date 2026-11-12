from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.models import Conversation, Message


def create_conversation(db: Session, title: str, conv_id: Optional[str] = None) -> Conversation:
    """Create and persist a new conversation."""
    conversation = Conversation(
        id=conv_id,
        title=title,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def get_conversations(db: Session) -> List[Conversation]:
    """Retrieve all conversations ordered by recent activity."""
    return db.query(Conversation).order_by(Conversation.updated_at.desc()).all()


def get_conversation(db: Session, conversation_id: str) -> Optional[Conversation]:
    """Retrieve a single conversation by ID with its messages."""
    return db.query(Conversation).filter(Conversation.id == conversation_id).first()


def delete_conversation(db: Session, conversation_id: str) -> bool:
    """Delete a conversation and all its messages."""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        return False
    db.delete(conversation)
    db.commit()
    return True


def create_message(
    db: Session,
    conversation_id: str,
    role: str,
    content: str,
    search_results: Optional[str] = None,
    scraped_content: Optional[str] = None,
    report: Optional[str] = None,
    feedback: Optional[str] = None,
) -> Message:
    """Create and persist a message with optional research artifacts."""
    msg = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        created_at=datetime.utcnow(),
        search_results=search_results,
        scraped_content=scraped_content,
        report=report,
        feedback=feedback,
    )
    db.add(msg)

    # Touch conversation updated_at
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        conv.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(msg)
    return msg

