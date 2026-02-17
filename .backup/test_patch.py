from fastapi.testclient import TestClient
import asyncio

# Import your app
from main import app

def test_patch_endpoint():
    client = TestClient(app)

    # First, let's create a task
    response = client.post("/tasks/", json={
        "title": "Test Task",
        "description": "This is a test task",
        "priority": "High",
        "category": "Work"
    })
    print("Create task response:", response.status_code, response.json())

    # Now let's try to update just the completed status
    response = client.patch("/tasks/1", json={"completed": True})
    print("Patch task response:", response.status_code, response.text)

    # Let's also try to get the task to see its state
    response = client.get("/tasks/1")
    print("Get task response:", response.status_code, response.json())

if __name__ == "__main__":
    test_patch_endpoint()