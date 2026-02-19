
import os
import sys
import subprocess

# Change to the backend directory
backend_dir = r"C:\Users\A`S Computer`s\Desktop\hackathon_2\backend"
os.chdir(backend_dir)

# Add the project root to the Python path
project_root = os.path.dirname(backend_dir)
sys.path.insert(0, project_root)

# Try to import and run the app directly
try:
    from main import app
    import uvicorn
    
    print("Successfully imported the app!")
    print("App title:", getattr(app, 'title', 'Unknown'))
    
    # If we got here, the imports are working correctly
    print("\nThe backend should now work properly. To run the server manually:")
    print("cd \"C:\\Users\\A`S Computer`s\\Desktop\\hackathon_2\\backend\"")
    print("python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    
except Exception as e:
    print(f"Error running the app: {e}")
    import traceback
    traceback.print_exc()