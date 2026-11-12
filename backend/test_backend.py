import sys
from pathlib import Path

# Add backend to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.database.database import init_db

init_db()
client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200, f"Health check failed: {response.text}"
    data = response.json()
    assert data["status"] == "healthy"
    assert data["groq_configured"] is True
    assert data["tavily_configured"] is True
    print("✓ Health check passed:", data)

def test_conversations():
    # List conversations
    resp = client.get("/api/conversations")
    assert resp.status_code == 200
    print(f"✓ Conversations list retrieved: {len(resp.json())} items")

if __name__ == "__main__":
    test_health()
    test_conversations()
    print("All basic backend tests passed!")

