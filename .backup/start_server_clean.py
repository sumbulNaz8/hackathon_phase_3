import os
import sys

# Set the environment variable before importing anything else
os.environ['DATABASE_URL'] = 'sqlite:///./hackathon_tasks.db'

if __name__ == "__main__":
    # Use uvicorn with import string to enable reload
    import subprocess
    import sys

    print("Starting server with SQLite database...")
    print(f"Database URL: {os.environ.get('DATABASE_URL')}")

    # Run uvicorn as a subprocess with the import string
    result = subprocess.run([
        sys.executable, "-m", "uvicorn",
        "main:app",
        "--host", "127.0.0.1",
        "--port", "8000",
        "--reload"
    ], cwd=os.path.dirname(__file__))