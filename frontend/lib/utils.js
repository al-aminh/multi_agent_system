/**
 * Utility functions for Research AI frontend.
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Group conversations into "Today", "Previous 7 Days", and "Older"
 */
export function groupConversations(conversations = []) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;

  const groups = {
    today: [],
    previous7Days: [],
    older: [],
  };

  conversations.forEach((conv) => {
    const convTime = new Date(conv.updated_at || conv.created_at).getTime();
    if (convTime >= todayStart) {
      groups.today.push(conv);
    } else if (convTime >= sevenDaysAgo) {
      groups.previous7Days.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  return groups;
}

/**
 * Parse structured critic review from critic output text.
 */
export function parseCriticReview(feedbackText = "") {
  if (!feedbackText) {
    return {
      score: null,
      strengths: [],
      improvements: [],
      verdict: "",
      raw: "",
    };
  }

  const result = {
    score: null,
    strengths: [],
    improvements: [],
    verdict: "",
    raw: feedbackText,
  };

  try {
    // Extract Score: e.g. "Score: 8/10" or "Score: 8.5/10"
    const scoreMatch = feedbackText.match(/Score:\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*10/i);
    if (scoreMatch) {
      result.score = parseFloat(scoreMatch[1]);
    } else {
      const genericScore = feedbackText.match(/([0-9]+(?:\.[0-9]+)?)\s*\/\s*10/);
      if (genericScore) {
        result.score = parseFloat(genericScore[1]);
      }
    }

    // Extract Strengths section
    const strengthsMatch = feedbackText.match(/Strengths:?\s*([\s\S]*?)(?=Areas to Improve:|Weaknesses:|One line verdict:|Verdict:|$)/i);
    if (strengthsMatch) {
      result.strengths = strengthsMatch[1]
        .split(/\n-|\n\*/)
        .map((s) => s.trim().replace(/^[-*]\s*/, ""))
        .filter((s) => s.length > 0 && !s.toLowerCase().startsWith("strengths"));
    }

    // Extract Areas to Improve
    const improveMatch = feedbackText.match(/(?:Areas to Improve|Weaknesses):?\s*([\s\S]*?)(?=One line verdict:|Verdict:|$)/i);
    if (improveMatch) {
      result.improvements = improveMatch[1]
        .split(/\n-|\n\*/)
        .map((s) => s.trim().replace(/^[-*]\s*/, ""))
        .filter((s) => s.length > 0 && !s.toLowerCase().startsWith("areas to improve"));
    }

    // Extract One line verdict
    const verdictMatch = feedbackText.match(/(?:One line verdict|Verdict):?\s*([^\n\r]+)/i);
    if (verdictMatch) {
      result.verdict = verdictMatch[1].trim();
    }
  } catch (err) {
    console.error("Error parsing critic review:", err);
  }

  return result;
}

/**
 * Extract structured sources from search results text.
 * Tavily format: Title: ... \n URL: ... \n Snippet: ... \n ---- \n
 */
export function parseSources(searchResults = "", scrapedContent = "") {
  const sources = [];
  const seenUrls = new Set();

  if (searchResults) {
    const blocks = searchResults.split(/----+/);
    blocks.forEach((block) => {
      const titleMatch = block.match(/Title:\s*(.+)/i);
      const urlMatch = block.match(/URL:\s*(https?:\/\/[^\s]+)/i);
      const snippetMatch = block.match(/Snippet:\s*([\s\S]+)/i);

      if (urlMatch && urlMatch[1]) {
        const url = urlMatch[1].trim();
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          sources.push({
            title: titleMatch ? titleMatch[1].trim() : new URL(url).hostname,
            url: url,
            snippet: snippetMatch ? snippetMatch[1].trim() : "",
            type: "search",
          });
        }
      }
    });

    // Fallback: extract any URLs found in searchResults if blocks didn't match
    if (sources.length === 0) {
      const urlRegex = /(https?:\/\/[^\s)"]+)/g;
      const matches = searchResults.match(urlRegex) || [];
      matches.forEach((url) => {
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          try {
            sources.push({
              title: new URL(url).hostname,
              url: url,
              snippet: "",
              type: "search",
            });
          } catch {
            // ignore malformed
          }
        }
      });
    }
  }

  return sources;
}

