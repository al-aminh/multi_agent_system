from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.database import get_db, SessionLocal
from app.schemas.research import ResearchRequest, ResearchResponse
from app.services.research_service import ResearchService

router = APIRouter(prefix="/research", tags=["Research"])


@router.post("", response_model=ResearchResponse, summary="Start research (synchronous)")
async def execute_research(
    request: ResearchRequest,
    db: Session = Depends(get_db),
):
    """
    Start the 4-step multi-agent research pipeline and wait for the complete result.
    """
    if not request.topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic cannot be empty.",
        )

    try:
        response = await ResearchService.execute_research(
            db=db,
            topic=request.topic.strip(),
            conversation_id=request.conversation_id,
        )
        return response
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(ve),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Research execution failed: {str(e)}",
        )


@router.post("/stream", summary="Start research with real-time SSE progress")
async def stream_research(
    request: ResearchRequest,
):
    """
    Start the 4-step multi-agent research pipeline and stream agent progress events
    via Server-Sent Events (SSE).
    """
    if not request.topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic cannot be empty.",
        )

    event_generator = ResearchService.stream_research(
        topic=request.topic.strip(),
        conversation_id=request.conversation_id,
        db_factory=SessionLocal,
    )

    return StreamingResponse(
        event_generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

