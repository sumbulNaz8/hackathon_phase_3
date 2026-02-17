from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import SQLModel, Field, create_engine, Session, select
from sqlmodel.ext.asyncio.session import AsyncSession
from contextlib import asynccontextmanager
import uuid
from enum import Enum

import bcrypt
import jwt
from passlib.context import CryptContext
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import create_async_engine
from datetime import datetime, timedelta
import os

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# User Models
class UserBase(SQLModel):
    email: str = Field(sa_column_kwargs={"unique": True, "nullable": False})
    username: str = Field(sa_column_kwargs={"unique": True, "nullable": False})
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    """
    User model representing a registered user in the system.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str = Field(sa_column_kwargs={"nullable": False})
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    """
    Schema for creating a new user.
    """
    password: str

class UserRead(UserBase):
    """
    Schema for reading user data (without password).
    """
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

# Database setup
DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_async_engine(DATABASE_URL)

async def create_db_and_tables():
    """Create database tables"""
    from sqlmodel import SQLModel
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

# FastAPI app
app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserService:
    def __init__(self):
        self.engine = engine

    async def create_user(self, user_data: UserBase, password: str):
        """Create a new user with hashed password"""
        password_hash = get_password_hash(password)

        db_user = User(
            email=user_data.email,
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            password_hash=password_hash
        )

        async with AsyncSession(self.engine) as session:
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)

        return db_user

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        async with AsyncSession(self.engine) as session:
            statement = select(User).where(User.email == email)
            result = await session.execute(statement)
            user = result.first()
            return user

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get a user by username"""
        async with AsyncSession(self.engine) as session:
            statement = select(User).where(User.username == username)
            result = await session.execute(statement)
            user = result.first()
            return user

    async def authenticate_user(self, email_or_username: str, password: str) -> Optional[User]:
        """Authenticate a user by email/username and password"""
        async with AsyncSession(self.engine) as session:
            # Try to find user by email first
            statement = select(User).where(User.email == email_or_username)
            result = await session.execute(statement)
            user = result.first()

            # If not found, try to find by username
            if not user:
                statement = select(User).where(User.username == email_or_username)
                result = await session.execute(statement)
                user = result.first()

            if user and verify_password(password, user.password_hash):
                return user
            return None

@app.post("/auth/register")
async def register(user_data: UserCreate):
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

    # Create new user (extract password from user_data and pass separately)
    user_base = UserBase(
        email=user_data.email,
        username=user_data.username,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    user = await user_service.create_user(user_base, user_data.password)

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
    return {"message": "Auth server is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8000)