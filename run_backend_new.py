import subprocess
import sys
import os
from pathlib import Path

# Change to the backend directory
os.chdir(r"C:\Users\AG Computer\Desktop\hackathon_2\backend")

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent  # Current directory
sys.path.insert(0, str(project_root))

# Add the src directory to the Python path
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

# Add the services directory to the Python path
services_path = project_root / "services"
sys.path.insert(0, str(services_path))

# Add the auth directory to the Python path
auth_path = project_root / "auth"
sys.path.insert(0, str(auth_path))

# Check if dependencies are already installed
print("Checking if dependencies are installed...")
try:
    import fastapi
    import uvicorn
    import sqlmodel
    import asyncpg
    print("Dependencies already installed.")
except ImportError:
    print("Some dependencies are missing. Installing...")
    # Try installing with increased timeout
    result = subprocess.run([
        sys.executable, "-m", "pip", "install",
        "-r", "requirements.txt",
        "--timeout", "1000"  # Increase timeout to 1000 seconds
    ])
    if result.returncode != 0:
        print("Failed to install dependencies. Trying individual packages...")
        packages = ["fastapi==0.104.1", "pydantic>=2.3.0", "sqlmodel>=0.0.8", "asyncpg>=0.29.0", "uvicorn[standard]"]
        for package in packages:
            print(f"Installing {package}...")
            result = subprocess.run([sys.executable, "-m", "pip", "install", package, "--timeout", "1000"])
            if result.returncode != 0:
                print(f"Failed to install {package}")

print("Attempting to start the backend server with auth endpoints...")
# Run the server directly with the correct app
import uvicorn
from minimal_server_test import app
uvicorn.run(app, host='127.0.0.1', port=8000)