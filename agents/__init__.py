"""Agents package for multi-agent research system."""
import sys
from pathlib import Path

# Ensure the agents folder is on sys.path for local relative imports
_current_dir = str(Path(__file__).parent.resolve())
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

try:
    from .agents import (
        search_agent,
        reader_agent,
        writer_chain,
        critic_chain,
        llm,
    )
    from .tools import web_search, scrape_url
    from .pipeline import research_pipeline
except ImportError:
    from agents import (
        search_agent,
        reader_agent,
        writer_chain,
        critic_chain,
        llm,
    )
    from tools import web_search, scrape_url
    from pipeline import research_pipeline

__all__ = [
    "search_agent",
    "reader_agent",
    "writer_chain",
    "critic_chain",
    "llm",
    "web_search",
    "scrape_url",
    "research_pipeline",
]

