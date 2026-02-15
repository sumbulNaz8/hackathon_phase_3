import sys
import os

# Add the backend directory to the Python path
backend_path = r'C:\Users\A`S Computer`s\Desktop\hackathon_2\backend'
sys.path.insert(0, backend_path)

# Change to the backend directory to load .env
os.chdir(backend_path)

# Import and test the main components
try:
    # Test importing the main module
    import main
    print("✓ Successfully imported main module")
    
    # Test importing config
    import config
    print("✓ Successfully imported config module")
    
    # Test that the config validation passes
    config.validate_config()
    print("✓ Configuration validation passed")
    
    # Test importing other modules
    import auth.jwt_handler
    print("✓ Successfully imported jwt_handler module")
    
    import database_init
    print("✓ Successfully imported database_init module")
    
    import models.user
    print("✓ Successfully imported user model")
    
    print("\nAll imports successful! The backend should work correctly once dependencies are installed.")
    print("\nTo run the backend server:")
    print("1. Open command prompt as administrator")
    print("2. Navigate to the backend directory:")
    print("   cd \"C:\\Users\\A`S Computer`s\\Desktop\\hackathon_2\\backend\"")
    print("3. Install dependencies: pip install -r requirements.txt")
    print("4. Run the server: python -m uvicorn main:app --reload")
    
except ImportError as e:
    print(f"✗ Import error: {e}")
except Exception as e:
    print(f"✗ Error: {e}")