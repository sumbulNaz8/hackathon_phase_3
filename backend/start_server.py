from main import app
import uvicorn
import sys
import traceback

if __name__ == "__main__":
    try:
        print("Starting server...")
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8000,
            log_level="debug",
            reload=False
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        traceback.print_exc()
        sys.exit(1)