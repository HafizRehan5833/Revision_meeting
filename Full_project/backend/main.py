from agents import Agent, OpenAIChatCompletionsModel, ModelSettings, Runner#type:ignore
from openai import AsyncOpenAI#type:ignore
import os
from dotenv import load_dotenv#type:ignore
load_dotenv()
from tools.tools import read_students, add_student, delete_student,update_student
from fastapi import FastAPI, HTTPException, Body#type:ignore
from fastapi.responses import FileResponse#type:ignore
from fastapi.middleware.cors import CORSMiddleware#type:ignore
from pydantic import BaseModel#type:ignore
from typing import Dict, Optional


app = FastAPI()


# Allow local frontend (Vite) to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = AsyncOpenAI(
    api_key=os.getenv('GEMINI_API_KEY'),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

agent=Agent(
    name="Student Management Expert.",
    instructions="You are an expert in managing student data. You can add, delete, and fetch student information from the database.",
    model=OpenAIChatCompletionsModel(model="gemini-2.5-flash", openai_client=client),
    tools=[read_students, add_student, delete_student,update_student],
    model_settings=ModelSettings(temperature=0.7, max_tokens=1000),
)


class ChatRequest(BaseModel):
    # Accept either `user_input` (existing) or `message` (frontend) for flexibility.
    user_input: Optional[str] = None
    message: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to the Student Management API"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest = Body(...)) -> Dict[str, str]:
    try:
        # Determine which field the client used.
        user_text = None
        if request.user_input and request.user_input.strip():
            user_text = request.user_input.strip()
        elif request.message and isinstance(request.message, str) and request.message.strip():
            user_text = request.message.strip()

        if not user_text:
            raise HTTPException(status_code=400, detail="User input cannot be empty.")

        result = await Runner.run(
            agent,
            user_text,
        )
        print("Agent response:", result.final_output)
        return {"response": result.final_output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
