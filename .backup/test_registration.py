import asyncio
import json
from pure_auth_server import app
from fastapi.testclient import TestClient

# Create a test client
client = TestClient(app)

print("Testing registration endpoint...")

# Test registration
response = client.post(
    "/auth/register",
    json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass123"
    }
)

print(f"Response status: {response.status_code}")
print(f"Response content: {response.text}")