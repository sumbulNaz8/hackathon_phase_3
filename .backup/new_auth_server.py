from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import os
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

# Create a new FastAPI app instance
app = FastAPI(title="New Working Auth API", version="1.0.0")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

# Models
class LoginRequest(BaseModel):
    email_or_username: str
    password: str

# Simple in-memory user store with a test user
users_db = {
    "testuser": {
        "id": "1",
        "email": "test@example.com",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "password_hash": "$2b$12$JYPyN6ZBFvdMVhCzwYKYAu.G.vpO34wAv9D6wv6w2N2oq.E5.oqZy"  # 'password' hashed with bcrypt
    }
}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/auth/login")
async def login(login_request: LoginRequest):
    """Authenticate user and return JWT token."""
    user = None

    # Find user by email or username
    for u in users_db.values():
        if u["email"] == login_request.email_or_username or u["username"] == login_request.email_or_username:
            user = u
            break

    if not user or not verify_password(login_request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email/username or password"
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]},
        expires_delta=timedelta(minutes=30)
    )

    return {
        "success": True,
        "data": {
            "user": {
                "id": user["id"],
                "email": user["email"],
                "username": user["username"],
                "first_name": user["first_name"],
                "last_name": user["last_name"]
            },
            "access_token": access_token,
            "token_type": "bearer"
        },
        "message": "Login successful"
    }

@app.get("/")
def read_root():
    return {"message": "New Working Auth API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8000)