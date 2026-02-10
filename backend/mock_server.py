from contextlib import asynccontextmanager
from datetime import timedelta
from typing import Dict, Any
import uuid

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Minimal implementations without the problematic models
class MockUser:
    def __init__(self, id, email, username):
        self.id = id
        self.email = email
        self.username = username

class MockUserService:
    async def create_user(self, user_data, password):
        # Return a mock user
        return MockUser(str(uuid.uuid4()), user_data.email, user_data.username)
    
    async def get_user_by_email(self, email):
        return None  # Return None for now
    
    async def get_user_by_username(self, username):
        return None  # Return None for now
    
    async def authenticate_user(self, email_or_username, password):
        return None  # Return None for now

# Define simple token functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    return "mock_access_token"

def create_refresh_token(data: dict):
    return "mock_refresh_token"

def verify_token(token: str):
    return {"sub": "mock_user_id", "type": "access"}

# JWT middleware (simplified)
async def jwt_middleware(request: Request, call_next):
    # Skip authentication for this minimal version
    response = await call_next(request)
    return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Skip database initialization for now
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

# Mock user data for testing
MOCK_USERS = {}

@app.post("/auth/register")
async def register(request: Request):
    """Mock register endpoint."""
    try:
        body = await request.json()
        email = body.get('email', '')
        username = body.get('username', '')
        
        # Create mock response
        mock_user = {
            "id": str(uuid.uuid4()),
            "email": email,
            "username": username,
            "first_name": body.get('first_name', ''),
            "last_name": body.get('last_name', '')
        }
        
        return {
            "success": True,
            "data": {
                "user": mock_user,
                "access_token": "mock_token",
                "token_type": "bearer"
            },
            "message": "Registration successful"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login")
async def login(request: Request):
    """Mock login endpoint."""
    try:
        body = await request.json()
        email_or_username = body.get('email_or_username', '')
        
        # Create mock response
        mock_user = {
            "id": str(uuid.uuid4()),
            "email": email_or_username,
            "username": email_or_username,
            "first_name": "",
            "last_name": ""
        }
        
        return {
            "success": True,
            "data": {
                "user": mock_user,
                "access_token": "mock_token",
                "token_type": "bearer"
            },
            "message": "Login successful"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Backend API!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    print("Starting server with mock implementations...")
    uvicorn.run(app, host='127.0.0.1', port=8000, reload=True)