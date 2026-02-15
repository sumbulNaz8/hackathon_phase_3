import sys
import os
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent  # Current directory
sys.path.insert(0, str(project_root))

from contextlib import asynccontextmanager
from datetime import timedelta
from typing import Dict, Any
import uuid

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from auth.jwt_handler import create_access_token, create_refresh_token, verify_token
from services.user_service import UserService
from models.user import User, UserBase
from skills.task_manager import task_manager, TaskData
from middleware.jwt_middleware import jwt_middleware
import sqlite3

# Override the database URL to use SQLite for testing
import config
original_config = config.config.DATABASE_URL
config.config.DATABASE_URL = "sqlite:///./test_task_management.db"
print(f"Using test database: {config.config.DATABASE_URL}")

from database_init import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    await create_db_and_tables()
    yield
    # Perform cleanup on shutdown if needed

app = FastAPI(
    title="Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add JWT authentication middleware
app.middleware("http")(jwt_middleware)

# Security scheme for JWT
security = HTTPBearer()

# Helper function to get current user from token
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    # Verify that the token is an access token
    token_type = payload.get("type")
    if token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # In a real app, you would fetch user details from the database
    # For now, we'll just return the user ID
    return {"user_id": uuid.UUID(user_id)}

@app.post("/auth/register")
async def register(user_data: UserBase, password: str):
    """Register a new user account."""
    user_service = UserService()

    # Check if user already exists
    existing_user = await user_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    existing_username = await user_service.get_user_by_username(user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this username already exists"
        )

    # Create new user
    user = await user_service.create_user(user_data, password)

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return {
        "success": True,
        "data": {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name
            },
            "access_token": access_token,
            "token_type": "bearer"
        },
        "message": "Registration successful"
    }

@app.post("/auth/login")
async def login(email_or_username: str, password: str):
    """Authenticate user and return JWT token."""
    user_service = UserService()

    user = await user_service.authenticate_user(email_or_username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email/username or password"
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return {
        "success": True,
        "data": {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name
            },
            "access_token": access_token,
            "token_type": "bearer"
        },
        "message": "Login successful"
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the Backend API!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    print("Starting server with SQLite database...")
    uvicorn.run(app, host='127.0.0.1', port=8000, reload=True)