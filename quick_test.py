import requests
import json
import time

# Base URL for the API
BASE_URL = "http://localhost:8000"

def quick_test_signup():
    """Quick test of signup endpoint with unique email"""
    print("Testing signup endpoint...")
    
    # Use a unique email for this test
    timestamp = str(int(time.time()))
    signup_data = {
        "name": "Quick Test User",
        "email": f"quick_test_{timestamp}@example.com",
        "password": "testpassword123"
    }
    
    try:
        # Make the signup request
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("[SUCCESS] Signup successful!")
            return True
        elif response.status_code == 409:
            print("[ERROR] Email already exists!")
            return False
        else:
            print(f"[ERROR] Signup failed with status {response.status_code}!")
            return False
            
    except requests.exceptions.ConnectionError:
        print("[ERROR] Cannot connect to server. Is the backend running?")
        return False
    except Exception as e:
        print(f"[ERROR] Exception occurred: {str(e)}")
        return False

if __name__ == "__main__":
    print("Quick signup test...")
    quick_test_signup()