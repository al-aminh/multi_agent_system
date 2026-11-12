import asyncio
import json
import logging
from typing import AsyncGenerator, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import repository
from app.schemas.research import ResearchResult, ResearchResponse

logger = logging.getLogger("research_service")


def derive_title(topic: str) -> str:
    """Generate a clean conversation title from the research topic."""
    cleaned = topic.strip().replace("\n", " ")
    if len(cleaned) <= 50:
        return cleaned
    return cleaned[:47] + "..."


def get_research_pipeline():
    """Import and return the research pipeline function flexibly."""
    try:
        from agents import research_pipeline
        return research_pipeline
    except (ImportError, ModuleNotFoundError):
        try:
            from agents.pipeline import research_pipeline
            return research_pipeline
        except (ImportError, ModuleNotFoundError):
            from pipeline import research_pipeline
            return research_pipeline


class ResearchService:
    @staticmethod
    def _check_api_keys():
        """Ensure required API keys are configured."""
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not set. Please configure it in your .env file.")
        if not settings.TAVILY_API_KEY:
            raise ValueError("TAVILY_API_KEY is not set. Please configure it in your .env file.")

    @classmethod
    def execute_research_sync(
        cls,
        topic: str,
        progress_callback=None,
    ) -> Dict[str, Any]:
        """Synchronously execute the research pipeline."""
        cls._check_api_keys()
        pipeline_fn = get_research_pipeline()
        return pipeline_fn(topic, progress_callback=progress_callback)

    @classmethod
    async def execute_research(
        cls,
        db: Session,
        topic: str,
        conversation_id: Optional[str] = None,
    ) -> ResearchResponse:
        """Run research non-streaming in a thread pool and persist results."""
        cls._check_api_keys()

        # Get or create conversation
        if conversation_id:
            conv = repository.get_conversation(db, conversation_id)
            if not conv:
                conv = repository.create_conversation(db, title=derive_title(topic), conv_id=conversation_id)
        else:
            conv = repository.create_conversation(db, title=derive_title(topic))

        # Save user message
        user_msg = repository.create_message(
            db=db,
            conversation_id=conv.id,
            role="user",
            content=topic,
        )

        # Run pipeline in thread pool
        raw_result = await asyncio.to_thread(cls.execute_research_sync, topic)

        # Save assistant message
        asst_msg = repository.create_message(
            db=db,
            conversation_id=conv.id,
            role="assistant",
            content=raw_result.get("report", ""),
            search_results=raw_result.get("search_results"),
            scraped_content=raw_result.get("scraped_content"),
            report=raw_result.get("report"),
            feedback=raw_result.get("feedback"),
        )

        return ResearchResponse(
            conversation_id=conv.id,
            user_message_id=user_msg.id,
            assistant_message_id=asst_msg.id,
            result=ResearchResult(
                search_results=raw_result.get("search_results", ""),
                scraped_content=raw_result.get("scraped_content", ""),
                report=raw_result.get("report", ""),
                feedback=raw_result.get("feedback", ""),
            ),
        )

    @classmethod
    async def stream_research(
        cls,
        topic: str,
        conversation_id: Optional[str],
        db_factory,
    ) -> AsyncGenerator[str, None]:
        """
        Execute research in background thread and stream progress events
        via Server-Sent Events (SSE).
        """
        queue: asyncio.Queue = asyncio.Queue()
        loop = asyncio.get_running_loop()
        SENTINEL = object()

        # Early check for API keys
        if not settings.GROQ_API_KEY or not settings.TAVILY_API_KEY:
            missing = []
            if not settings.GROQ_API_KEY:
                missing.append("GROQ_API_KEY")
            if not settings.TAVILY_API_KEY:
                missing.append("TAVILY_API_KEY")
            error_msg = f"Missing required API key(s): {', '.join(missing)}. Please configure them in .env"
            yield f"data: {json.dumps({'stage': 'error', 'status': 'failed', 'message': error_msg})}\n\n"
            return

        # Prepare DB session for conversation creation
        db: Session = db_factory()
        try:
            if conversation_id:
                conv = repository.get_conversation(db, conversation_id)
                if not conv:
                    conv = repository.create_conversation(db, title=derive_title(topic), conv_id=conversation_id)
            else:
                conv = repository.create_conversation(db, title=derive_title(topic))
            actual_conv_id = conv.id

            user_msg = repository.create_message(
                db=db,
                conversation_id=actual_conv_id,
                role="user",
                content=topic,
            )
            user_msg_id = user_msg.id
        finally:
            db.close()

        # Emit initial conversation-ready event
        init_event = {
            "stage": "init",
            "status": "started",
            "message": "Research task initialized.",
            "data": {
                "conversation_id": actual_conv_id,
                "user_message_id": user_msg_id,
            },
        }
        yield f"data: {json.dumps(init_event)}\n\n"

        def progress_callback(stage: str, status: str, message: str, data: Optional[Dict[str, Any]] = None):
            event = {
                "stage": stage,
                "status": status,
                "message": message,
                "data": data,
            }
            loop.call_soon_threadsafe(queue.put_nowait, event)

        def run_worker():
            try:
                pipeline_fn = get_research_pipeline()
                res = pipeline_fn(topic, progress_callback=progress_callback)
                loop.call_soon_threadsafe(queue.put_nowait, ("SUCCESS", res))
            except Exception as exc:
                logger.exception("Pipeline worker encountered an error")
                loop.call_soon_threadsafe(queue.put_nowait, ("ERROR", str(exc)))
            finally:
                loop.call_soon_threadsafe(queue.put_nowait, SENTINEL)

        # Launch worker in thread pool
        worker_task = asyncio.to_thread(run_worker)
        asyncio.create_task(worker_task)

        # Stream queue items to client
        final_result = None
        error_result = None

        while True:
            item = await queue.get()
            if item is SENTINEL:
                break

            if isinstance(item, tuple):
                tag, val = item
                if tag == "SUCCESS":
                    final_result = val
                elif tag == "ERROR":
                    error_result = val
            elif isinstance(item, dict):
                yield f"data: {json.dumps(item)}\n\n"

        # Handle final state persistence
        db = db_factory()
        try:
            if error_result:
                error_event = {
                    "stage": "error",
                    "status": "failed",
                    "message": error_result,
                    "data": {"conversation_id": actual_conv_id},
                }
                yield f"data: {json.dumps(error_event)}\n\n"
            elif final_result:
                asst_msg = repository.create_message(
                    db=db,
                    conversation_id=actual_conv_id,
                    role="assistant",
                    content=final_result.get("report", ""),
                    search_results=final_result.get("search_results"),
                    scraped_content=final_result.get("scraped_content"),
                    report=final_result.get("report"),
                    feedback=final_result.get("feedback"),
                )

                complete_event = {
                    "stage": "complete",
                    "status": "completed",
                    "message": "Research completed successfully.",
                    "data": {
                        "conversation_id": actual_conv_id,
                        "user_message_id": user_msg_id,
                        "assistant_message_id": asst_msg.id,
                        "result": {
                            "search_results": final_result.get("search_results", ""),
                            "scraped_content": final_result.get("scraped_content", ""),
                            "report": final_result.get("report", ""),
                            "feedback": final_result.get("feedback", ""),
                        },
                    },
                }
                yield f"data: {json.dumps(complete_event)}\n\n"
        finally:
            db.close()
