import subprocess
import sys
import os

# Change to the backend directory
os.chdir(r"C:\Users\AG Computer\Desktop\hackathon_2\backend")

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

print("Attempting to start the backend server...")
subprocess.run([sys.executable, "-m", "uvicorn", "minimal_server_test:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])