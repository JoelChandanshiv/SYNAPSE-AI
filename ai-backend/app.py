from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests

app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- ENV ----------
HF_API_URL = os.getenv(
    "HF_API_URL",
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
)
HF_API_KEY = os.getenv("HF_API_KEY", "")

HEADERS = {
    "Authorization": f"Bearer {HF_API_KEY}"
} if HF_API_KEY else {}

# ---------- MODELS ----------
class Message(BaseModel):
    text: str
    sender: str

class MessagesPayload(BaseModel):
    messages: list[Message]

# ---------- HELPERS ----------
def safe_hf_request(payload):
    if not HF_API_KEY:
        return None, "HF_API_KEY not set"

    try:
        r = requests.post(HF_API_URL, headers=HEADERS, json=payload, timeout=20)
        r.raise_for_status()
        return r.json(), None
    except Exception as e:
        return None, str(e)

# ---------- ROUTES ----------

@app.post("/api/summarize")
async def summarize(data: MessagesPayload):
    combined = " ".join([m.text for m in data.messages])

    hf_res, err = safe_hf_request({"inputs": combined})

    if err or not hf_res:
        return {
            "summary": "Summary unavailable",
            "error": err or "HF failed"
        }

    return {
        "summary": hf_res[0].get("summary_text", "No summary")
    }

@app.post("/api/sentiment")
async def sentiment(data: MessagesPayload):
    text = " ".join([m.text for m in data.messages])

    # Dummy sentiment (safe fallback)
    return {
        "sentiment": "positive" if "good" in text.lower() else "neutral"
    }

@app.post("/api/emotion")
async def emotion(data: MessagesPayload):
    return {
        "emotion": "calm"
    }

@app.post("/api/health")
async def health():
    return {"status": "ok"}

