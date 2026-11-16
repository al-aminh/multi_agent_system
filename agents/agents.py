import os
from dotenv import load_dotenv

from langchain.agents import create_agent
from langchain_groq import ChatGroq

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

try:
    from tools import web_search, scrape_url, web_open
except ImportError:
    from agents.tools import web_search, scrape_url, web_open



# ENVIRONMENT CONFIGURATION

load_dotenv()


# LLM CONFIGURATION

model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

llm = ChatGroq(
    model=model_name,
    temperature=0,
    max_tokens=4096,
)

SEARCH_SYSTEM_PROMPT = (
    "You are a dedicated web search assistant. "
    "Your objective is to find recent, reliable, and detailed information about the user's topic. "
    "You have access to the `web_search` tool. "
    "You MUST call `web_search(query=...)` exactly once with a focused search query string. "
    "Do not call any undefined tools. Once you receive search results, synthesize and summarize them clearly without calling any further tools."
)

READER_SYSTEM_PROMPT = (
    "You are a dedicated webpage reader assistant. "
    "Your objective is to pick the single most relevant URL from search results and extract its content. "
    "You have access to the `scrape_url` tool. "
    "You MUST call `scrape_url(url=...)` exactly once with a full http or https URL. "
    "Do not call any undefined tools. Once you receive the webpage content, present and summarize it clearly without calling any further tools."
)

# RESEARCH AGENTS

def search_agent():
    """
    Creates an agent responsible for searching
    the web and gathering relevant information.
    """

    return create_agent(
        model=llm,
        tools=[web_search, web_open],
        system_prompt=SEARCH_SYSTEM_PROMPT,
    )


def reader_agent():
    """
    Creates an agent responsible for visiting
    URLs and extracting webpage content.
    """

    return create_agent(
        model=llm,
        tools=[scrape_url, web_open],
        system_prompt=READER_SYSTEM_PROMPT,
    )



# WRITER CHAIN

writer_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert research writer. "
        "Write clear, structured and insightful reports."
    ),
    (
        "human",
        """Write a detailed research report on the topic below.

Topic: {topic}

Research Gathered:
{research}

Structure the report as:
- Introduction
- Key Findings (minimum 3 well-explained points)
- Conclusion
- Sources (list all URLs found in the research)

Be detailed, factual and professional."""
    ),
])

writer_chain = (
    writer_prompt
    | llm
    | StrOutputParser()
)



# CRITIC CHAIN

critic_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a sharp and constructive research critic. "
        "Be honest and specific."
    ),
    (
        "human",
        """Review the research report below and evaluate it strictly.

Report:
{report}

Respond in this exact format:

Score: X/10

Strengths:
- ...
- ...

Areas to Improve:
- ...
- ...

One line verdict:
..."""
    ),
])

critic_chain = (
    critic_prompt
    | llm
    | StrOutputParser()
)
