from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.database import init_db
from app.api.routes.research import router as research_router
from app.api.routes.conversations import router as conversations_router
from app.schemas.research import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure SQLite tables exist
    init_db()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Multi-Agent AI Research System powered by LangChain and Groq",
    lifespan=lifespan,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(research_router, prefix=settings.API_V1_STR)
app.include_router(conversations_router, prefix=settings.API_V1_STR)


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Health check endpoint to inspect server and API key status."""
    return HealthResponse(
        status="healthy",
        groq_configured=bool(settings.GROQ_API_KEY),
        tavily_configured=bool(settings.TAVILY_API_KEY),
        version=settings.VERSION,
    )


@app.get("/", tags=["Root"])
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
    }

