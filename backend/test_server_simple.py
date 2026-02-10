import sys
sys.path.insert(0, r'C:\Users\AG Computer\Desktop\hackathon_2\backend')

# Test all imports
try:
    from fastapi import FastAPI, HTTPException
    print("[OK] FastAPI imported")
except Exception as e:
    print(f"[ERROR] FastAPI: {e}")
    sys.exit(1)

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("[OK] Passlib imported")
except Exception as e:
    print(f"[ERROR] Passlib: {e}")
    sys.exit(1)

try:
    import jwt
    print("[OK] JWT imported")
except Exception as e:
    print(f"[ERROR] JWT: {e}")
    sys.exit(1)

try:
    from pydantic import BaseModel
    print("[OK] Pydantic imported")
except Exception as e:
    print(f"[ERROR] Pydantic: {e}")
    sys.exit(1)

# Test password hash
try:
    test_hash = pwd_context.hash("test123456")
    print(f"[OK] Password hash: {test_hash[:20]}...")
except Exception as e:
    print(f"[ERROR] Hash: {e}")
    sys.exit(1)

# Test JWT encode
try:
    token = jwt.encode({"test": "data"}, "secret", algorithm="HS256")
    print(f"[OK] JWT encode: {token[:20]}...")
except Exception as e:
    print(f"[ERROR] JWT encode: {e}")
    sys.exit(1)

print("\n=== ALL TESTS PASSED ===")
