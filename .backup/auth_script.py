import requests
import json
import time

# Base URL for the API
BASE_URL = "http://localhost:8000"

def signup_user(name, email, password):
    """Function to signup a user"""
    signup_data = {
        "name": name,
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"Signup successful!")
            print(f"Access Token: {result['access_token']}")
            print(f"User: {result['user']['name']} ({result['user']['email']})")
            return result
        elif response.status_code == 409:
            print("Error: Email already exists. Please use a different email.")
            return None
        else:
            print(f"Signup failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to server. Is the backend running on http://localhost:8000?")
        return None
    except Exception as e:
        print(f"Error during signup: {str(e)}")
        return None

def login_user(email, password):
    """Function to login a user"""
    login_data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"Login successful!")
            print(f"Access Token: {result['access_token']}")
            print(f"User: {result['user']['name']} ({result['user']['email']})")
            return result
        else:
            print(f"Login failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to server. Is the backend running on http://localhost:8000?")
        return None
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return None

if __name__ == "__main__":
    print("User Authentication Script")
    print("="*30)
    
    action = input("Enter 'signup' or 'login': ").strip().lower()
    
    if action == "signup":
        name = input("Enter your name: ")
        email = input("Enter your email: ")
        password = input("Enter your password: ")
        
        signup_user(name, email, password)
        
    elif action == "login":
        email = input("Enter your email: ")
        password = input("Enter your password: ")
        
        login_user(email, password)
        
    else:
        print("Invalid action. Please enter 'signup' or 'login'.")