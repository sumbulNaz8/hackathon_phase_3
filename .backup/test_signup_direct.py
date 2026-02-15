import sys
sys.path.insert(0, r'C:\Users\AG Computer\Desktop\hackathon_2\backend')

from main import app, UserSignup, hash_password, create_access_token, users_db

# Test creating a user directly
print("Testing user creation...")

try:
    user_data = UserSignup(
        name="Test User",
        email="test@test.com",
        password="test123456"
    )
    print(f"[OK] UserSignup model created: {user_data.name}")
except Exception as e:
    print(f"[ERROR] UserSignup failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test password hashing
try:
    hashed = hash_password("test123456")
    print(f"[OK] Password hashed: {hashed[:20]}...")
except Exception as e:
    print(f"[ERROR] Hash failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test token creation
try:
    token = create_access_token({"user_id": "test_1", "email": "test@test.com"})
    print(f"[OK] Token created: {token[:30]}...")
except Exception as e:
    print(f"[ERROR] Token failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test user DB add
try:
    users_db["test@test.com"] = {
        "id": "user_1",
        "name": "Test User",
        "email": "test@test.com",
        "password_hash": hashed,
        "created_at": "2024-01-01T00:00:00"
    }
    print(f"[OK] User added to DB")
except Exception as e:
    print(f"[ERROR] DB add failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n=== ALL DIRECT TESTS PASSED ===")
print("This means the backend logic works. The issue might be with FastAPI/Uvicorn.")
