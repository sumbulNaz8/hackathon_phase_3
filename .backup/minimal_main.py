from contextlib import asynccontextmanager
from datetime import timedelta
from typing import Dict, Any
import uuid

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database_init import create_db_and_tables
from auth.jwt_handler import create_access_token, create_refresh_token, verify_token
from services.user_service import UserService
from models.user import User, UserBase
from skills.task_manager import task_manager, TaskData
from middleware.jwt_middleware import jwt_middleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    await create_db_and_tables()
    yield


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


# Simple health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Backend API!"}