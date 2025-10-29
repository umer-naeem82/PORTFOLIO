"""
Vercel serverless function entry point
"""
from backend.app.main import app

# Export the FastAPI app for Vercel
handler = app
