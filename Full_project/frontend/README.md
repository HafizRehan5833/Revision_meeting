# Frontend (Vite React)

Local dev setup

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Ensure backend is running (see backend README). By default this project expects the API at `http://127.0.0.1:8000` — that's set in `.env` as `VITE_API_URL`.

3. Run the frontend dev server:

```powershell
npm run dev
```

Testing the integration

- Use curl to POST a message to the frontend-configured backend:

```powershell
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"message":"Hello from curl"}'
```

- In the UI, type a question and press Enter. The chat component will POST to `${VITE_API_URL}/chat` and display the response. If the backend is unreachable, the UI will display a local fallback response.
