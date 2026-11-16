from langchain.tools import tool
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
import os
from dotenv import load_dotenv
from rich import print
load_dotenv()
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def web_search(query: str = "", **kwargs) -> str:
    """
    Perform a web search using Tavily and return the top result's url, title and snippet.
    Always pass the search query as a string.
    """
    search_q = query
    if not search_q:
        for k in ("q", "search_query", "text", "query_str"):
            if k in kwargs and kwargs[k]:
                search_q = str(kwargs[k])
                break
    if not search_q and kwargs:
        for v in kwargs.values():
            if isinstance(v, str) and v.strip():
                search_q = v.strip()
                break

    if not search_q:
        return "No search query provided."

    try:
        results = tavily_client.search(query=search_q, max_results=5)
        out = []

        for r in results.get('results', []):
            out.append(
                f"Title: {r.get('title', 'Untitled')}\nURL: {r.get('url', '')}\nSnippet: {r.get('content', '')[:300]}\n"
            )
        
        return "\n----\n".join(out) if out else "No relevant search results found."
    except Exception as e:
        return f"An error occurred during the web search: {e}"


@tool
def scrape_url(url: str = "", **kwargs) -> str:
    """
    Scrape the content of a given URL and return the text content.
    Always pass a full http or https URL.
    """
    target_url = url
    if not target_url:
        for k in ("target", "href", "link", "url_str"):
            if k in kwargs and kwargs[k]:
                target_url = str(kwargs[k])
                break
    if not target_url and kwargs:
        for v in kwargs.values():
            if isinstance(v, str) and (v.startswith("http://") or v.startswith("https://")):
                target_url = v.strip()
                break

    if not target_url:
        return "Error: No valid URL provided to scrape."

    try:
        response = requests.get(target_url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()  # Raise an error for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')
        for tag in soup(['script', 'style', 'nav', 'footer', 'aside', 'noscript']):
            tag.decompose()  # Remove script and style elements
        text_content = soup.get_text(separator='\n', strip=True)
        return text_content[:3000] if text_content else "No extractable text found on webpage."
    except Exception as e:
        return f"An error occurred while scraping the URL: {e}"


@tool
def web_open(url: str = "", **kwargs) -> str:
    """
    Open and inspect the content of a webpage URL.
    """
    return scrape_url.invoke({"url": url, **kwargs})

# print(scrape_url.invoke("https://neurosity.co/guides/10-20-electrode-system-explained"))