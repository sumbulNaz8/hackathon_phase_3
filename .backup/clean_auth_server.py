from fastapi import FastAPI, HTTPException, status, Request
from pydantic import BaseModel
import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import Optional
import json
from contextlib import asynccontextmanager
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Create a new FastAPI app instance
app = FastAPI(title="Simple Auth API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-super-secret-jwt-secret-key-change-in-production")
ALGORITHM = "HS256"

# In-memory storage for users (in production, use a proper database)
users_db = {}

# Models
class UserBase(BaseModel):
    email: str
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class LoginRequest(BaseModel):
    email_or_username: str
    password: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a hash for the given password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create a new access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """Create a new refresh token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user account."""
    # Check if user already exists
    for user in users_db.values():
        if user["email"] == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )
        if user["username"] == user_data.username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this username already exists"
            )

    # Create new user
    user_id = str(len(users_db) + 1)
    password_hash = get_password_hash(user_data.password)

    user = {
        "id": user_id,
        "email": user_data.email,
        "username": user_data.username,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "password_hash": password_hash,
        "is_active": True
    }

    users_db[user_id] = user

    # Create access token
    access_token = create_access_token(
        data={"sub": user_id, "email": user_data.email}
    )

    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": user_id})

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
        "message": "Registration successful"
    }

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

    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": user["id"]})

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
    return {"message": "Simple Auth API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Add a test user for immediate use
def initialize_test_user():
    """Initialize a test user for immediate access."""
    if not users_db:
        test_user_id = "1"
        test_password = "password123"
        password_hash = get_password_hash(test_password)

        test_user = {
            "id": test_user_id,
            "email": "admin@example.com",
            "username": "admin",
            "first_name": "Admin",
            "last_name": "User",
            "password_hash": password_hash,
            "is_active": True
        }

        users_db[test_user_id] = test_user
        print("Test user created:")
        print(f"Email/Username: admin@example.com or admin")
        print(f"Password: password123")

# Initialize the test user
initialize_test_user()

if __name__ == "__main__":
    print("Starting Simple Auth Server...")
    print("Test credentials:")
    print("Email/Username: admin@example.com or admin")
    print("Password: password123")
    uvicorn.run(app, host='127.0.0.1', port=8000)