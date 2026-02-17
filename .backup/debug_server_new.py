import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    port = 8005  # Using a different port
    host = "127.0.0.1"

    print(f"Starting server on {host}:{port}")
    print(f"Environment loaded. DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}")

    try:
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=False,  # Disable reload for clearer error messages
            log_level="info"
        )
    except Exception as e:
        print(f"Error starting server: {e}")