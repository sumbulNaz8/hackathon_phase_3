# Vercel serverless function entry point
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import the FastAPI app
from main import app

# Export the app for Vercel
handler = app
