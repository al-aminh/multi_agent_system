
# ==========================================
# IMPORTS
# ==========================================

import time
from typing import Optional, Callable, Dict, Any

try:
    from agents import (
        search_agent,
        reader_agent,
        writer_chain,
        critic_chain,
    )
except ImportError:
    from agents.agents import (
        search_agent,
        reader_agent,
        writer_chain,
        critic_chain,
    )


# ==========================================
# CONFIGURATION
# ==========================================

SEPARATOR = "=" * 50
SEARCH_PREVIEW_LENGTH = 1000


# ==========================================
# UTILITY FUNCTIONS
# ==========================================

def print_step_header(step: int, message: str) -> None:
    """Display a formatted heading for each pipeline step."""

    print(f"\n{SEPARATOR}")
    print(f"STEP {step} - {message}")
    print(SEPARATOR)


# ==========================================
# RESEARCH PIPELINE
# ==========================================

def research_pipeline(
    topic: str,
    progress_callback: Optional[Callable[[str, str, str, Optional[Dict[str, Any]]], None]] = None,
) -> dict:
    """
    Execute the complete research workflow:

    1. Search for relevant information.
    2. Scrape the most relevant resource.
    3. Generate a research report.
    4. Evaluate the report using the critic chain.

    Args:
        topic: The research topic.
        progress_callback: Optional callback for real-time progress updates.
                           Signature: (stage, status, message, data=None)

    Returns:
        A dictionary containing search results,
        scraped content, the final report, and feedback.
    """

    def emit(stage: str, status: str, message: str, data: Optional[Dict[str, Any]] = None) -> None:
        """Helper to invoke the progress callback safely."""
        if progress_callback is not None:
            try:
                progress_callback(stage, status, message, data)
            except Exception as e:
                print(f"[Warning] Progress callback error: {e}")

    state = {}

    try:
        # --------------------------------------
        # STEP 1: SEARCH AGENT
        # --------------------------------------

        print_step_header(1, "Search Agent is working...")
        emit("search", "running", "Searching the web for reliable sources...")

        src_agent = search_agent()

        search_result = src_agent.invoke({
            "messages": [
                (
                    "user",
                    f"Find recent, reliable and detailed information about: {topic}"
                )
            ]
        })

        state["search_results"] = search_result["messages"][-1].content

        print("\nSearch Results:\n")
        print(state["search_results"])
        emit("search", "completed", "Search completed successfully.", {"search_results": state["search_results"]})

        # --------------------------------------
        # STEP 2: READER AGENT
        # --------------------------------------

        print_step_header(2, "Reader Agent is scraping top resources...")
        emit("reader", "running", "Analyzing relevant webpages and extracting content...")

        reader = reader_agent()

        reader_result = reader.invoke({
            "messages": [
                (
                    "user",
                    f"Based on the following search results about '{topic}', "
                    f"pick the most relevant URL and scrape it for deeper content.\n\n"
                    f"Search Results:\n"
                    f"{state['search_results'][:SEARCH_PREVIEW_LENGTH]}"
                )
            ]
        })

        state["scraped_content"] = reader_result["messages"][-1].content

        print("\nScraped Content:\n")
        print(state["scraped_content"])
        emit("reader", "completed", "Webpage analysis completed successfully.", {"scraped_content": state["scraped_content"]})

        # --------------------------------------
        # STEP 3: WRITER CHAIN
        # --------------------------------------

        print_step_header(3, "Writer is drafting the research report...")
        emit("writer", "running", "Generating your research report...")

        research_combined = (
            f"SEARCH RESULTS:\n"
            f"{state['search_results']}\n\n"
            f"DETAILED SCRAPED CONTENT:\n"
            f"{state['scraped_content']}"
        )

        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined,
        })

        print("\nFinal Research Report:\n")
        print(state["report"])
        emit("writer", "completed", "Research report generated successfully.", {"report": state["report"]})

        # --------------------------------------
        # STEP 4: CRITIC CHAIN
        # --------------------------------------

        print_step_header(4, "Critic is reviewing the report...")
        emit("critic", "running", "Evaluating the research report...")

        for attempt in range(3):
            try:
                state["feedback"] = critic_chain.invoke({
                    "report": state["report"],
                })
                break
            except Exception as e:
                err_str = str(e)
                if ("429" in err_str or "rate_limit" in err_str.lower()) and attempt < 2:
                    print(f"\n[Notice] Rate limit encountered. Waiting 18s before retry (attempt {attempt + 1}/3)...")
                    emit("critic", "running", f"Rate limit reached, pausing briefly before retry (attempt {attempt + 1})...")
                    time.sleep(18)
                    continue
                raise

        print("\nCritic Report:\n")
        print(state["feedback"])
        emit("critic", "completed", "Evaluation completed successfully.", {"feedback": state["feedback"]})

        # --------------------------------------
        # RETURN RESULTS
        # --------------------------------------

        print(f"\n{SEPARATOR}")
        print("RESEARCH PIPELINE COMPLETED")
        print(SEPARATOR)

        emit("complete", "completed", "Research pipeline completed successfully.", state)

        return state

    except Exception as e:
        emit("error", "failed", f"Research pipeline error: {str(e)}", {"error": str(e)})
        raise


# ==========================================
# MAIN EXECUTION
# ==========================================

if __name__ == "__main__":

    topic = input("\nEnter a research topic: ").strip()

    if topic:
        research_pipeline(topic)
    else:
        print("Please enter a valid research topic.")
