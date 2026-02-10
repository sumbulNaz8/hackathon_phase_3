import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8003))  # Changed to port 8003 to avoid conflicts
    host = os.getenv("HOST", "127.0.0.1")

    print(f"Starting server on {host}:{port}")
    print(f"Environment loaded. DATABASE_URL: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=False,  # Disable reload for clearer error messages
        log_level="info"
    )