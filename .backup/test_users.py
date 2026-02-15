import sys
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

from complete_server import users_db, get_password_hash

print("Current users_db state:", users_db)
print("Length of users_db:", len(users_db))

# Test creating a fresh user
test_password = "password123"
password_hash = get_password_hash(test_password)
test_user = {
    "id": "1",
    "email": "admin@example.com",
    "username": "admin",
    "first_name": "Admin",
    "last_name": "User",
    "password_hash": password_hash,
    "is_active": True
}

users_db["1"] = test_user
print("Added test user to users_db")

# Test the login manually
for user in users_db.values():
    print(f"User ID: {user['id']}")
    print(f"Email: {user['email']}")
    print(f"Username: {user['username']}")
    print(f"Password hash: {user['password_hash'][:20]}...")  # Show first 20 chars