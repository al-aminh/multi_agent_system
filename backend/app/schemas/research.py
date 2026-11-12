from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=1000, description="The research topic to investigate")
    conversation_id: Optional[str] = Field(None, description="Existing conversation ID to append to, or None to create a new one")


class ResearchResult(BaseModel):
    search_results: str
    scraped_content: str
    report: str
    feedback: str


class ResearchResponse(BaseModel):
    conversation_id: str
    user_message_id: str
    assistant_message_id: str
    result: ResearchResult


class MessageSchema(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime
    search_results: Optional[str] = None
    scraped_content: Optional[str] = None
    report: Optional[str] = None
    feedback: Optional[str] = None

    class Config:
        from_attributes = True


class ConversationSummary(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    class Config:
        from_attributes = True


class ConversationDetail(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageSchema] = []

    class Config:
        from_attributes = True


class StreamEvent(BaseModel):
    stage: str
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None


class HealthResponse(BaseModel):
    status: str
    groq_configured: bool
    tavily_configured: bool
    version: str

