"""
Vercel serverless function entry point
"""
import sys
from pathlib import Path

# Add the project root to Python path
root = Path(__file__).parent.parent
sys.path.insert(0, str(root))

from mangum import Mangum
from backend.app.main import app as fastapi_app

# Wrap FastAPI app with Mangum for AWS Lambda/Vercel compatibility
handler = Mangum(fastapi_app, lifespan="off")

# Also export as 'app' for compatibility
app = fastapi_app
