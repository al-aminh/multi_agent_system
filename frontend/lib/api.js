/**
 * Centralized API Client for Research AI backend
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Health check
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return {
      status: "unreachable",
      groq_configured: false,
      tavily_configured: false,
      error: err.message,
    };
  }
}

/**
 * Retrieve all conversations
 */
export async function getConversations() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/conversations`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch {
    // When backend is offline or starting up, return empty list gracefully
    return [];
  }
}

/**
 * Retrieve a specific conversation with messages
 */
export async function getConversation(conversationId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 204) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Start research via SSE stream
 */
export async function streamResearch({
  topic,
  conversationId = null,
  onEvent,
  onError,
  onComplete,
  signal,
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/research/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        topic,
        conversation_id: conversationId,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.detail || errorMsg;
      } catch {
        errorMsg = errorText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep partial line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const dataStr = trimmed.slice(5).trim();
        if (!dataStr) continue;

        try {
          const parsed = JSON.parse(dataStr);
          if (onEvent) onEvent(parsed);

          if (parsed.stage === "error") {
            if (onError) onError(parsed.message || "An unexpected error occurred");
          } else if (parsed.stage === "complete") {
            if (onComplete) onComplete(parsed.data);
          }
        } catch (e) {
          console.error("Failed to parse SSE event chunk:", dataStr, e);
        }
      }
    }
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Research stream aborted by client.");
      return;
    }
    if (onError) {
      onError(err.message || "Failed to communicate with research backend.");
    }
  }
}

