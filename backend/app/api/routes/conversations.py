from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database import repository
from app.schemas.research import (
    ConversationSummary,
    ConversationDetail,
    MessageSchema,
)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("", response_model=List[ConversationSummary], summary="List all conversations")
def list_conversations(db: Session = Depends(get_db)):
    """Retrieve all conversations ordered by recent update time."""
    conversations = repository.get_conversations(db)
    result = []
    for conv in conversations:
        result.append(
            ConversationSummary(
                id=conv.id,
                title=conv.title,
                created_at=conv.created_at,
                updated_at=conv.updated_at,
                message_count=len(conv.messages),
            )
        )
    return result


@router.get("/{conversation_id}", response_model=ConversationDetail, summary="Get conversation details")
def get_conversation_detail(
    conversation_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve a single conversation and all its messages and research results."""
    conversation = repository.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation {conversation_id} not found.",
        )

    messages = [
        MessageSchema.model_validate(msg) for msg in conversation.messages
    ]

    return ConversationDetail(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=messages,
    )


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete conversation")
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
):
    """Delete a conversation and all its related messages."""
    deleted = repository.delete_conversation(db, conversation_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation {conversation_id} not found.",
        )
    return None

