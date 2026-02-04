import sys
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent  # Current directory (backend)
sys.path.insert(0, str(project_root))

# Add the src directory to the Python path
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

# Add the services directory to the Python path
services_path = project_root / "services"
sys.path.insert(0, str(services_path))

# Add the auth directory to the Python path
auth_path = project_root / "auth"
sys.path.insert(0, str(auth_path))

# Now import the necessary modules
from contextlib import asynccontextmanager
from datetime import timedelta
from typing import Dict, Any
import uuid

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from auth.jwt_handler import create_access_token, create_refresh_token
from services.user_service import UserService
from src.models.user import User, UserBase

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    from database_init import create_db_and_tables
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

# No JWT middleware for now to test auth endpoints

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
    print("Starting server with auth endpoints (no middleware)...")
    uvicorn.run(app, host='127.0.0.1', port=8000)