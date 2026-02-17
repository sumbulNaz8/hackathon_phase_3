import requests
import json
import time

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_signup(email):
    """Test the signup endpoint"""
    print("Testing signup endpoint...")
    
    signup_data = {
        "name": "Test User",
        "email": email,
        "password": "testpassword123"
    }
    
    # Make the signup request
    response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("[SUCCESS] Signup successful!")
        return response.json()
    else:
        print("[ERROR] Signup failed!")
        return None

def test_login(email):
    """Test the login endpoint"""
    print("\nTesting login endpoint...")
    
    login_data = {
        "email": email,
        "password": "testpassword123"
    }
    
    # Make the login request
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("[SUCCESS] Login successful!")
        return response.json()
    else:
        print("[ERROR] Login failed!")
        return None

def test_create_task(token):
    """Test creating a task"""
    print("\nTesting create task endpoint...")
    
    # Prepare task data
    task_data = {
        "title": "Test Task",
        "description": "This is a test task"
    }
    
    # Make the create task request
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.post(f"{BASE_URL}/api/user_1/tasks", json=task_data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("[SUCCESS] Task creation successful!")
        return response.json()
    else:
        print("[ERROR] Task creation failed!")
        return None

def test_update_task(token, task_id):
    """Test updating a task"""
    print("\nTesting update task endpoint...")
    
    # Prepare update data
    update_data = {
        "title": "Updated Test Task",
        "description": "This is an updated test task"
    }
    
    # Make the update task request
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.put(f"{BASE_URL}/api/user_1/tasks/{task_id}", json=update_data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("[SUCCESS] Task update successful!")
        return response.json()
    else:
        print("[ERROR] Task update failed!")
        return None

def test_toggle_task_completion(token, task_id):
    """Test toggling task completion"""
    print("\nTesting toggle task completion endpoint...")
    
    # Make the toggle completion request
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.patch(f"{BASE_URL}/api/user_1/tasks/{task_id}/complete", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("[SUCCESS] Toggle task completion successful!")
        return response.json()
    else:
        print("[ERROR] Toggle task completion failed!")
        return None

def test_delete_task(token, task_id):
    """Test deleting a task"""
    print("\nTesting delete task endpoint...")
    
    # Make the delete task request
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(f"{BASE_URL}/api/user_1/tasks/{task_id}", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("[SUCCESS] Task deletion successful!")
        return response.json()
    else:
        print("[ERROR] Task deletion failed!")
        return None

if __name__ == "__main__":
    print("Starting API tests...\n")
    
    # Generate a unique email for this test run
    timestamp = str(int(time.time()))
    email = f"test_{timestamp}@example.com"
    
    # Test signup
    signup_result = test_signup(email)
    if not signup_result:
        print("\nStopping tests due to signup failure.")
        exit(1)
    
    # Extract token from signup result
    token = signup_result.get("access_token")
    if not token:
        print("\nNo token received from signup. Stopping tests.")
        exit(1)
    
    # Test login
    login_result = test_login(email)
    if not login_result:
        print("\nStopping tests due to login failure.")
        exit(1)
    
    # Test create task
    task_result = test_create_task(token)
    if not task_result:
        print("\nContinuing tests despite task creation failure.")
    else:
        task_id = task_result.get("id")
        
        if task_id:
            # Test update task
            update_result = test_update_task(token, task_id)
            
            # Test toggle task completion
            toggle_result = test_toggle_task_completion(token, task_id)
            
            # Test delete task
            delete_result = test_delete_task(token, task_id)
    
    print("\nAPI tests completed!")