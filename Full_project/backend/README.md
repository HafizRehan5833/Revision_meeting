# Backend (FastAPI)

Quick start (assuming you have Python 3.11+ and a virtualenv):

```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -U pip
pip install -r requirements.txt
# or: pip install fastapi[all] python-dotenv openai
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Test the chat endpoint with curl:

```powershell
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'
```

Notes:
- CORS is enabled for local dev origins so the frontend can call the API.
- If you see import errors for `fastapi` or `pydantic`, install dependencies as shown above.
