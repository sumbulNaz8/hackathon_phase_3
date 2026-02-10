import sys
import os
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent  # Current directory
sys.path.insert(0, str(project_root))

# Add the src directory to the Python path
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

# Now import and run the app from minimal_server_test
from minimal_server_test import app

if __name__ == "__main__":
    import uvicorn
    print("Starting server with auth endpoints...")
    uvicorn.run(app, host='127.0.0.1', port=8000)