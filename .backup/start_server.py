import asyncio
import sys
import os

# Add the current directory to the path
sys.path.insert(0, '.')

from main import app
import uvicorn

print("Attempting to start the server...")

if __name__ == "__main__":
    print("Starting server on http://127.0.0.1:8002")
    try:
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8002,  # Changed to port 8002 to match the API URL in frontend
            log_level="info",
            reload=False
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()