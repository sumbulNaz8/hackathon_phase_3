# Test the signup functionality

import requests
import json

# Test the signup endpoint
def test_signup():
    url = "http://localhost:8000/api/auth/signup"
    
    # Test data
    payload = {
        "name": "Test User",
        "email": "testsignup@example.com",
        "password": "securepassword123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print("Status Code:", response.status_code)
        print("Response:", response.text)
        
        if response.status_code == 200:
            print("\nSignup test PASSED!")
            return True
        else:
            print("\nSignup test FAILED with status", response.status_code)
            return False
            
    except Exception as e:
        print("Error during signup test:", str(e))
        return False

if __name__ == "__main__":
    print("Testing signup functionality...")
    test_signup()