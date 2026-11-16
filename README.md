# Research AI – Multi-Agent AI Research Workspace

A full-stack, autonomous multi-agent research system featuring a **FastAPI** backend and a **Next.js** frontend designed with a high-end editorial publication aesthetic ("Forest & Bone" and "Ink & Brass" themes), real-time Server-Sent Events (SSE), and persistent SQLite storage.

🌐 **Live Demo**: [https://research-with-multi-agent.onrender.com/](https://research-with-multi-agent.onrender.com/)

---

## 🌟 Overview

Users enter any research topic, and the system executes a coordinated 4-stage multi-agent pipeline in real time:

1. **Search Agent (Tavily)** – Scours the web for reliable, recent sources and citations.
2. **Reader Agent (BeautifulSoup)** – Investigates top search results and extracts deep webpage content.
3. **Writer Chain (Groq LLM)** – Synthesizes the gathered findings into a structured research report with Introduction, Key Findings, Conclusion, and Sources.
4. **Critic Chain (AI Reviewer)** – Strictly evaluates the generated report, providing a 10-point score, strengths, areas to improve, and a one-line verdict.

Progress is streamed live to the frontend using **Server-Sent Events (SSE)**, with persistent conversation history stored in **SQLite**.

---

## 🏗️ Architecture

```text
multi-agent-system/
│
├── agents/                       # LangChain Multi-Agent Implementation
│   ├── agents.py                 # Search Agent, Reader Agent, Writer Chain, Critic Chain
│   ├── tools.py                  # Tavily search & BeautifulSoup web scraping tools
│   ├── pipeline.py               # Sequential 4-step research execution workflow
│   └── requirements.txt
│
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── main.py               # FastAPI application, CORS, lifespan
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── research.py   # Synchronous and SSE streaming research endpoints
│   │   │       └── conversations.py # Conversation history and deletion endpoints
│   │   ├── core/
│   │   │   └── config.py         # Resilient multi-location env loader & settings
│   │   ├── schemas/
│   │   │   └── research.py       # Pydantic validation schemas
│   │   ├── services/
│   │   │   └── research_service.py # Async/sync thread pool bridge & SSE event emitter
│   │   └── database/
│   │       ├── database.py       # SQLAlchemy engine & session factory
│   │       ├── models.py         # Conversation and Message SQLite models
│   │       └── repository.py     # Database CRUD operations
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                     # Next.js Frontend (JavaScript, App Router)
│   ├── app/
│   │   ├── layout.js             # Root layout with dark theme & typography
│   │   ├── page.js               # Entry point mounting MainLayout
│   │   └── globals.css           # Atmospheric lighting, glows & markdown styles
│   ├── components/
│   │   ├── layout/               # Sidebar, Header, BackgroundAtmosphere
│   │   ├── chat/                 # ChatWorkspace, WelcomeScreen, ChatInput, UserMessage, AssistantMessage
│   │   └── research/             # ResearchProgress, ResearchTabs, ResearchReport, SourcesPanel, CriticReview
│   ├── lib/
│   │   ├── api.js                # Centralized API client with SSE stream reader
│   │   └── utils.js              # Conversation date groupers & parsers
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, SQLite, Pydantic, sse-starlette, python-dotenv
- **AI / Agent Engine**: LangChain, Groq API (`openai/gpt-oss-120b`), Tavily Search API, BeautifulSoup4, Requests
- **Frontend**: Next.js 16 (App Router), React 19, JavaScript, Tailwind CSS, Lucide React, React Markdown, Remark GFM, Framer Motion

---

## 🚀 Quick Start

### 1. Prerequisites & Environment Setup

Obtain API keys:
- **Groq API Key**: [console.groq.com](https://console.groq.com)
- **Tavily API Key**: [tavily.com](https://tavily.com)

Create a `.env` file in the project root or `backend/` directory:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
TAVILY_API_KEY=tvly-your_tavily_api_key_here
HOST=0.0.0.0
PORT=8000
DATABASE_URL=sqlite:///./research.db
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

---

### 2. Start the FastAPI Backend

```bash
# From the project root or backend folder:
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

---

### 3. Start the Next.js Frontend

```bash
# In a new terminal:
cd frontend
npm install
npm run dev
```

- Web Application: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check backend & API key status |
| `POST` | `/api/research/stream` | Execute multi-agent research with real-time SSE progress |
| `POST` | `/api/research` | Execute multi-agent research (synchronous result) |
| `GET` | `/api/conversations` | Retrieve all persistent conversations |
| `GET` | `/api/conversations/{id}` | Retrieve conversation detail with full research artifacts |
| `DELETE` | `/api/conversations/{id}` | Delete conversation and related messages |

---

## 🎨 UI/UX Features

- **High-End Editorial Design**: Designed to feel like a private research library or editorial publication (Financial Times / Kinfolk style) rather than a software dashboard.
- **Dual Themes**:
  - **Forest & Bone (Light)**: Warm paper background (`#F3EFE6`), sidebar (`#EBE6D9`), deep forest green accents (`#1F3D2F`), and muted brass highlights (`#A67C52`).
  - **Ink & Brass (Dark)**: Deep charcoal-black background (`#14120F`), surface (`#1C1915`), bone text (`#EDE6D8`), and antique brass accents (`#B8975A`).
- **Quiet Vertical Timeline**: Subtle step-by-step progress tracking (*"Searching sources..."*, *"Reading documents..."*, *"Editorial review..."*) with soft blinking cursor state.
- **Magazine-Style Article Rendering**: Reports formatted with serif typography, pull-quotes for key findings, and footnotes for source citations.
- **Tabbed Research Materials**: Easily inspect the generated report, underlying scraped webpage excerpts, and the AI Critic's 10-point evaluation.
- **Persistent Inquiry History**: Automatic SQLite storage of conversations with collapsible sidebar, instant switching, and one-click deletion.
- **Mobile Responsive**: Fully responsive layout with smooth off-canvas sidebar transitions on mobile screens.

