import sys
from pathlib import Path

# Add the current directory to Python path (we're at root)
root = Path(__file__).parent
sys.path.insert(0, str(root))

# Import the FastAPI app from backend
from backend.app.main import app

# Vercel will automatically detect 'app' variable
