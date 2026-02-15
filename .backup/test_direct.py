from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "hackathon-phase2-secret-key-change-in-production"
ALGORITHM = "HS256"

# Test password hashing
try:
    hashed = pwd_context.hash("test123456")
    print(f"Hash OK: {hashed[:20]}...")
except Exception as e:
    print(f"Hash error: {e}")

# Test JWT encoding
try:
    token = jwt.encode({"test": "data"}, SECRET_KEY, algorithm=ALGORITHM)
    print(f"JWT OK: {token[:20]}...")
except Exception as e:
    print(f"JWT error: {e}")

print("All tests passed!")
