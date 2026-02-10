import os
import subprocess
import sys

# Change to the frontend directory
frontend_dir = r"C:\Users\A`S Computer`s\Desktop\hackathon_2\frontend"
os.chdir(frontend_dir)

print("Installing frontend dependencies...")

try:
    # Run npm install
    result = subprocess.run([
        "npm", "install"
    ], check=True, capture_output=True, text=True)
    
    print("Installation completed successfully!")
    print("STDOUT:", result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
        
except subprocess.CalledProcessError as e:
    print(f"Error during installation: {e}")
    print(f"Error output: {e.stderr}")
except FileNotFoundError:
    print("npm is not found. Please make sure Node.js and npm are installed.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")