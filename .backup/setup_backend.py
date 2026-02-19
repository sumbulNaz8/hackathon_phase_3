import os
import sys
import subprocess

# Define the path with proper escaping
backend_path = r'C:\Users\A`S Computer`s\Desktop\hackathon_2\backend'

# Change to the backend directory
os.chdir(backend_path)

# Install dependencies
print("Installing dependencies...")
try:
    result = subprocess.run([
        sys.executable, 
        "-m", 
        "pip", 
        "install", 
        "-r", 
        "requirements.txt"
    ], check=True, capture_output=True, text=True)
    
    print("Installation output:", result.stdout)
    if result.stderr:
        print("Installation errors:", result.stderr)
        
    print("Dependencies installed successfully!")
    
    # Now try to run the server
    print("\nStarting the backend server...")
    subprocess.run([
        sys.executable,
        "-m",
        "uvicorn", 
        "main:app", 
        "--reload", 
        "--host", "0.0.0.0", 
        "--port", "8000"
    ])
    
except subprocess.CalledProcessError as e:
    print(f"Error installing dependencies: {e}")
    print(f"Error output: {e.stderr}")
except FileNotFoundError:
    print("File not found. Please check the path and file existence.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")