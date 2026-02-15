from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import List, Optional
import asyncio
from collections import Counter
import sys
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
import os
import jwt
from pydantic import BaseModel
from enum import Enum
from passlib.context import CryptContext

# Import from our models
try:
    from models import Task, TaskCreate, TaskUpdate, TaskRead, TaskPriority
except ImportError:
    # If models are not available, define minimal models for auth only
    from pydantic import BaseModel
    from typing import Optional

    class TaskPriority(str, Enum):
        LOW = "low"
        MEDIUM = "medium"
        HIGH = "high"

    class TaskBase(BaseModel):
        title: str
        description: Optional[str] = None
        completed: bool = False
        priority: TaskPriority = TaskPriority.MEDIUM
        category: Optional[str] = None
        due_date: Optional[datetime] = None

    class Task(TaskBase):
        id: Optional[int] = None

    class TaskCreate(TaskBase):
        pass

    class TaskUpdate(BaseModel):
        title: Optional[str] = None
        description: Optional[str] = None
        completed: Optional[bool] = None
        priority: Optional[TaskPriority] = None
        category: Optional[str] = None
        due_date: Optional[datetime] = None

    class TaskRead(TaskBase):
        id: int
        created_at: datetime
        updated_at: datetime

# Initialize password hashing context
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-super-secret-jwt-secret-key-change-in-production")
ALGORITHM = "HS256"

# In-memory storage for users (in production, use a proper database)
users_db = {}

# Models for authentication
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
    """Verify a plain password against its hash using pbkdf2_sha256."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a hash for the given password using pbkdf2_sha256."""
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

try:
    from database import get_engine, create_tables
    HAS_DATABASE = True
except ImportError:
    HAS_DATABASE = False
    async def get_engine():
        pass
    async def create_tables():
        pass

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if HAS_DATABASE:
        await create_tables()

    # Always initialize test user (don't check if users_db is empty)
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
    print(f"Users in DB: {len(users_db)}")

    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)

# Allow all origins for hackathon development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_session():
    if HAS_DATABASE:
        async with AsyncSession(await get_engine()) as session:
            yield session
    else:
        # Mock session if no database
        yield None

@app.get("/")
async def root():
    return {"message": "Authentication Server Running!"}

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

if __name__ == "__main__":
    import uvicorn
    print("Starting Fixed Authentication Server on port 8000...")
    print("Test credentials:")
    print("Email/Username: admin@example.com or admin")
    print("Password: password123")
    print("Server available at: http://localhost:8000 or http://127.0.0.1:8000")
    print("Authentication endpoints:")
    print("- POST /auth/login")
    print("- POST /auth/register")
    uvicorn.run(app, host='0.0.0.0', port=8000)  # Bind to all interfaces