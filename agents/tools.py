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
def web_search(query: str) -> str:
    """
    Perform a web search using Tavily and return the top result's url, title and snippet.
    """
    try:
        results = tavily_client.search(query = query, max_results=5)
        out = []

        for r in results['results']:
            out.append(
                f"Title: {r['title']}\nURL: {r['url']}\nSnippet: {r['content'][:300]}\n"
            )
        
        return "\n----\n".join(out)
    except Exception as e:
        return f"An error occurred during the web search: {e}"


@tool
def scrape_url(url: str) -> str:
    """
    Scrape the content of a given URL and return the text content.
    """
    try:
        response = requests.get(url, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()  # Raise an error for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')
        for tag in soup(['script', 'style', 'nav', 'footer', 'aside']):
            tag.decompose()  # Remove script and style elements
        text_content = soup.get_text(separator='\n', strip=True)
        return text_content[:3000]  # Return the first 1000 characters
    except Exception as e:
        return f"An error occurred while scraping the URL: {e}"

# print(scrape_url.invoke("https://neurosity.co/guides/10-20-electrode-system-explained"))