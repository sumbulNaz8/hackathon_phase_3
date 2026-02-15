
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
from pydantic import BaseModel

# Import simplified versions to avoid model conflicts
def create_access_token(data: dict, expires_delta: timedelta = None):
    return "mock_access_token"

def create_refresh_token(data: dict):
    return "mock_refresh_token"

def verify_token(token: str):
    return {"sub": "mock_user_id", "type": "access"}

# Define simplified user model using Pydantic
class UserBase(BaseModel):
    email: str = ""
    username: str = ""
    first_name: str = ""
    last_name: str = ""

class MockUserService:
    async def create_user(self, user_data, password):
        # Create a mock user with a UUID
        return UserBase(
            email=user_data.email,
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )
    
    async def get_user_by_email(self, email):
        # Return None to indicate user doesn't exist
        return None
    
    async def get_user_by_username(self, username):
        # Return None to indicate user doesn't exist
        return None
    
    async def authenticate_user(self, email_or_username, password):
        # Return a mock user for testing
        return UserBase(
            email=email_or_username,
            username=email_or_username
        )

# JWT middleware (simplified)
async def jwt_middleware(request: Request, call_next):
    # Skip authentication for this version
    response = await call_next(request)
    return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Skip database initialization for now to avoid model issues
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
    # Return a mock user for testing
    return {"user_id": uuid.uuid4()}

@app.post("/auth/register")
async def register(user_data: UserBase, password: str = ""):
    """Register a new user account."""
    user_service = MockUserService()

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
        data={"sub": str(uuid.uuid4()), "email": user.email},
        expires_delta=access_token_expires
    )

    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": str(uuid.uuid4())})

    return {
        "success": True,
        "data": {
            "user": {
                "id": str(uuid.uuid4()),
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
    user_service = MockUserService()

    user = await user_service.authenticate_user(email_or_username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email/username or password"
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(uuid.uuid4()), "email": user.email},
        expires_delta=access_token_expires
    )

    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": str(uuid.uuid4())})

    return {
        "success": True,
        "data": {
            "user": {
                "id": str(uuid.uuid4()),
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

# Add the task-related endpoints that would be in a full Todo app
@app.get("/tasks")
async def get_tasks():
    """Get all tasks for the authenticated user."""
    return {"tasks": []}

@app.post("/tasks")
async def create_task(title: str, description: str = ""):
    """Create a new task for the authenticated user."""
    task_id = str(uuid.uuid4())
    return {
        "id": task_id,
        "title": title,
        "description": description,
        "completed": False
    }

@app.put("/tasks/{task_id}")
async def update_task(task_id: str, title: str = None, description: str = None, completed: bool = None):
    """Update a task for the authenticated user."""
    return {
        "id": task_id,
        "title": title,
        "description": description,
        "completed": completed
    }

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task for the authenticated user."""
    return {"message": f"Task {task_id} deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    print("Starting server with mock implementations...")
    uvicorn.run(app, host='127.0.0.1', port=8000, reload=True)