from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from pathlib import Path

load_dotenv()

app = FastAPI(title="Portfolio API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get base directory (Portfolio folder)
BASE_DIR = Path(__file__).parent.parent.parent

# Mount static files - FIXED: Mount at root level for direct access
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
app.mount("/images", StaticFiles(directory=str(BASE_DIR / "static" / "images")), name="images")
app.mount("/css", StaticFiles(directory=str(BASE_DIR / "static" / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(BASE_DIR / "static" / "js")), name="js")

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')  # Updated model name

# Load portfolio data
DATA_PATH = Path(__file__).parent.parent / "data" / "portfolio.json"
CONTEXT_PATH = Path(__file__).parent.parent / "data" / "ai_context.txt"
TEMPLATES_PATH = BASE_DIR / "templates"

def load_portfolio_data():
    with open(DATA_PATH, 'r') as f:
        return json.load(f)

def load_ai_context():
    with open(CONTEXT_PATH, 'r') as f:
        return f.read()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open(TEMPLATES_PATH / "index.html", "r") as f:
        return f.read()

@app.get("/api/portfolio")
async def get_portfolio():
    """Get all portfolio data"""
    try:
        data = load_portfolio_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects")
async def get_projects():
    """Get all projects"""
    try:
        data = load_portfolio_data()
        return {"projects": data.get("projects", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}")
async def get_project(project_id: int):
    """Get specific project by ID"""
    try:
        data = load_portfolio_data()
        projects = data.get("projects", [])
        project = next((p for p in projects if p["id"] == project_id), None)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Chat with AI about the portfolio"""
    try:
        # Check if API key is set
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            return ChatResponse(
                response="Sorry, the AI chatbot is not configured yet. Please contact Misha directly at mishaparveen33@gmail.com"
            )
        
        context = load_ai_context()
        portfolio_data = load_portfolio_data()
        
        # Create prompt with context
        prompt = f"""{context}

Portfolio Data:
Designer: {portfolio_data['designer']['name']}
Experience: {portfolio_data['designer']['experience']}
Skills: {', '.join(portfolio_data['designer']['skills'][:5])}
Projects: {len(portfolio_data['projects'])} completed

User Question: {message.message}

Assistant Response (Keep it friendly, concise, and helpful):"""
        
        # Generate response with updated API call
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": 500,
            }
        )
        
        return ChatResponse(response=response.text)
        
    except Exception as e:
        print(f"Chat error details: {str(e)}")  # More detailed logging
        return ChatResponse(
            response="I'm having trouble connecting right now. Please reach out to Misha directly at mishaparveen33@gmail.com or call +92-3167409931. 😊"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
