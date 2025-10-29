import sys
from pathlib import Path

# Add the project root to Python path
root = Path(__file__).parent.parent
sys.path.insert(0, str(root))

from mangum import Mangum
from backend.app.main import app

# Create the handler for Vercel
handler = Mangum(app, lifespan="off")
