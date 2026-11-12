
# ==========================================
# IMPORTS
# ==========================================

from agents import (
    search_agent,
    reader_agent,
    writer_chain,
    critic_chain,
)


# ==========================================
# CONFIGURATION
# ==========================================

SEPARATOR = "=" * 50
SEARCH_PREVIEW_LENGTH = 800


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

def research_pipeline(topic: str) -> dict:
    """
    Execute the complete research workflow:

    1. Search for relevant information.
    2. Scrape the most relevant resource.
    3. Generate a research report.
    4. Evaluate the report using the critic chain.

    Args:
        topic: The research topic.

    Returns:
        A dictionary containing search results,
        scraped content, the final report, and feedback.
    """

    state = {}

    # --------------------------------------
    # STEP 1: SEARCH AGENT
    # --------------------------------------

    print_step_header(1, "Search Agent is working...")

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

    # --------------------------------------
    # STEP 2: READER AGENT
    # --------------------------------------

    print_step_header(2, "Reader Agent is scraping top resources...")

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

    # --------------------------------------
    # STEP 3: WRITER CHAIN
    # --------------------------------------

    print_step_header(3, "Writer is drafting the research report...")

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

    # --------------------------------------
    # STEP 4: CRITIC CHAIN
    # --------------------------------------

    print_step_header(4, "Critic is reviewing the report...")

    state["feedback"] = critic_chain.invoke({
        "report": state["report"],
    })

    print("\nCritic Report:\n")
    print(state["feedback"])

    # --------------------------------------
    # RETURN RESULTS
    # --------------------------------------

    print(f"\n{SEPARATOR}")
    print("RESEARCH PIPELINE COMPLETED")
    print(SEPARATOR)

    return state


# ==========================================
# MAIN EXECUTION
# ==========================================

if __name__ == "__main__":

    topic = input("\nEnter a research topic: ").strip()

    if topic:
        research_pipeline(topic)
    else:
        print("Please enter a valid research topic.")
