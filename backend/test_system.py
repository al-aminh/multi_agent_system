import sys
import json
import time
from pathlib import Path

# Add paths
root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "backend"
agents_dir = root_dir / "agents"

sys.path.insert(0, str(root_dir))
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(agents_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.database.database import init_db

print("Initializing DB...")
init_db()

client = TestClient(app)

print("\n1. Testing GET /api/health...")
res = client.get("/api/health")
assert res.status_code == 200, f"Health check failed: {res.text}"
health_data = res.json()
print("   Health response:", health_data)
assert health_data["status"] == "healthy"
assert health_data["groq_configured"] is True
assert health_data["tavily_configured"] is True

print("\n2. Testing GET /api/conversations...")
res = client.get("/api/conversations")
assert res.status_code == 200
print(f"   Existing conversations: {len(res.json())}")

print("\n3. Testing POST /api/research/stream with real pipeline...")
print("   Starting research topic: 'Python dataclass vs Pydantic'")

stages_seen = []
final_data = None
conv_id = None

with client.stream(
    "POST",
    "/api/research/stream",
    json={"topic": "Python dataclass vs Pydantic"},
) as response:
    assert response.status_code == 200, f"Stream request failed: {response.status_code}"
    
    for line in response.iter_lines():
        line = line.strip()
        if not line or not line.startswith("data:"):
            continue
        
        event_str = line[5:].strip()
        try:
            event = json.loads(event_str)
            stage = event.get("stage")
            status = event.get("status")
            msg = event.get("message")
            stages_seen.append((stage, status))
            print(f"   [SSE Event] Stage: {stage:<10} | Status: {status:<10} | Message: {msg[:60]}...")
            
            if stage == "init" and event.get("data"):
                conv_id = event["data"].get("conversation_id")
            
            if stage == "complete" and event.get("data"):
                final_data = event["data"]
            
            if stage == "error":
                print("   [ERROR Event received]:", event)
        except Exception as e:
            print("   Parse error:", e, line)

print(f"\n   Total events received. Stages traversed: {[s[0] for s in stages_seen]}")
assert "search" in [s[0] for s in stages_seen], "Search stage missing"
assert "reader" in [s[0] for s in stages_seen], "Reader stage missing"
assert "writer" in [s[0] for s in stages_seen], "Writer stage missing"
assert "critic" in [s[0] for s in stages_seen], "Critic stage missing"
assert "complete" in [s[0] for s in stages_seen], "Complete stage missing"

assert final_data is not None, "Final data missing"
result = final_data.get("result", {})
assert len(result.get("report", "")) > 50, "Report too short or missing"
assert len(result.get("feedback", "")) > 10, "Critic feedback missing"
assert len(result.get("search_results", "")) > 20, "Search results missing"
assert len(result.get("scraped_content", "")) > 20, "Scraped content missing"
assert conv_id is not None, "Conversation ID missing"

print("\n4. Testing GET /api/conversations/{conv_id} to verify SQLite persistence...")
res = client.get(f"/api/conversations/{conv_id}")
assert res.status_code == 200, f"Failed to get conversation: {res.text}"
conv_detail = res.json()
print("   Conversation Title:", conv_detail.get("title"))
print("   Message count:", len(conv_detail.get("messages", [])))
assert len(conv_detail.get("messages", [])) == 2  # user + assistant

asst_msg = conv_detail["messages"][1]
assert asst_msg["role"] == "assistant"
assert len(asst_msg.get("report") or "") > 50
assert len(asst_msg.get("feedback") or "") > 10
print("   Assistant message report length:", len(asst_msg.get("report") or ""))
print("   Assistant message critic length:", len(asst_msg.get("feedback") or ""))

print("\n5. Testing DELETE /api/conversations/{conv_id}...")
res = client.delete(f"/api/conversations/{conv_id}")
assert res.status_code == 204, f"Delete failed: {res.status_code}"
print("   Deleted conversation successfully.")

# Verify it's gone
res = client.get(f"/api/conversations/{conv_id}")
assert res.status_code == 404
print("   Verified 404 after deletion.")

print("\n=======================================================")
print("ALL BACKEND & PIPELINE INTEGRATION TESTS PASSED 100%!")
print("=======================================================")

