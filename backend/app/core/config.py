import json
import os
import sys
from pathlib import Path
from typing import List, Union
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Resolve project paths
# This file is located at <project_root>/backend/app/core/config.py
CURRENT_FILE = Path(__file__).resolve()
APP_DIR = CURRENT_FILE.parent.parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent
AGENTS_DIR = PROJECT_ROOT / "agents"

# Add root and backend to sys.path
for p in [str(PROJECT_ROOT), str(BACKEND_DIR), str(AGENTS_DIR)]:
    if p in sys.path:
        sys.path.remove(p)
    sys.path.insert(0, p)

# Load environment variables from possible locations in order of fallback
env_candidates = [
    BACKEND_DIR / ".env",
    PROJECT_ROOT / ".env",
    AGENTS_DIR / ".env",
]

for env_path in env_candidates:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)


class Settings(BaseSettings):
    PROJECT_NAME: str = "Research AI Multi-Agent System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # API Keys
    GROQ_API_KEY: str = ""
    TAVILY_API_KEY: str = ""

    # SQLite Database File: store inside backend or project root
    DATABASE_URL: str = f"sqlite:///{PROJECT_ROOT / 'research.db'}"

    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    class Config:
        case_sensitive = True
        extra = "ignore"

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            try:
                parsed = json.loads(self.CORS_ORIGINS)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return [orig.strip() for orig in self.CORS_ORIGINS.split(",") if orig.strip()]
        return self.CORS_ORIGINS


settings = Settings(
    GROQ_API_KEY=os.getenv("GROQ_API_KEY", ""),
    TAVILY_API_KEY=os.getenv("TAVILY_API_KEY", ""),
)
