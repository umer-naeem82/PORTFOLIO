import sys
from pathlib import Path

# Add the project root to Python path
root = Path(__file__).parent.parent
sys.path.insert(0, str(root))

# Import the FastAPI app from backend
from backend.app.main import app

# Vercel will automatically detect 'app' variable
