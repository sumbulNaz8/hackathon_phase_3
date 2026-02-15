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
from task_models import Task, TaskCreate, TaskUpdate, TaskRead, TaskPriority

# Initialize password hashing context with pbkdf2 as it's more reliable
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
    """Verify a plain password against its hash using bcrypt."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a hash for the given password using bcrypt."""
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

from database import get_engine, create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_tables()

    # Initialize test user
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
    async with AsyncSession(await get_engine()) as session:
        yield session

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Productivity Engine with Authentication!"}

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

@app.post("/tasks/", response_model=TaskRead, status_code=201)
async def create_task(task: TaskCreate, session: AsyncSession = Depends(get_session)):
    db_task = Task.from_orm(task) if hasattr(Task, 'from_orm') else Task(**task.dict())
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[TaskRead])
async def read_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=0, le=100),
    completed: Optional[bool] = Query(None),
    priority: Optional[TaskPriority] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search in title or category"),
    session: AsyncSession = Depends(get_session)
):
    query = select(Task)

    if completed is not None:
        query = query.where(Task.completed == completed)

    if priority:
        query = query.where(Task.priority == priority)

    if category:
        query = query.where(Task.category == category)

    if search:
        query = query.where(
            (Task.title.contains(search)) |
            (Task.category.contains(search))
        )

    query = query.offset(skip).limit(limit).order_by(Task.created_at.desc())

    tasks = await session.exec(query)
    return tasks.all()

@app.get("/tasks/{task_id}", response_model=TaskRead)
async def read_task(task_id: int, session: AsyncSession = Depends(get_session)):
    query = select(Task).where(Task.id == task_id)
    task = await session.exec(query).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task

@app.put("/tasks/{task_id}", response_model=TaskRead)
async def update_task(task_id: int, task: TaskUpdate, session: AsyncSession = Depends(get_session)):
    query = select(Task).where(Task.id == task_id)
    db_task = await session.exec(query).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update only the fields that are provided
    update_data = task.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    # Update the updated_at timestamp
    db_task.updated_at = datetime.utcnow()

    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)

    return db_task

@app.patch("/tasks/{task_id}", response_model=TaskRead)
async def patch_task(task_id: int, task: TaskUpdate, session: AsyncSession = Depends(get_session)):
    query = select(Task).where(Task.id == task_id)
    db_task = await session.exec(query).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update only the fields that are provided
    update_data = task.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    # Update the updated_at timestamp
    db_task.updated_at = datetime.utcnow()

    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)

    return db_task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int, session: AsyncSession = Depends(get_session)):
    query = select(Task).where(Task.id == task_id)
    task = await session.exec(query).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await session.delete(task)
    await session.commit()

    return {"message": "Task deleted successfully"}

def calculate_urgency_score(task):
    score = 0

    # Priority scoring
    if task.priority == TaskPriority.HIGH:
        score += 30
    elif task.priority == TaskPriority.MEDIUM:
        score += 20
    else:  # LOW
        score += 10

    # Due date scoring
    if task.due_date:
        time_diff = (task.due_date - datetime.utcnow()).total_seconds()

        if time_diff < 0:  # Overdue
            score += 50
        elif time_diff <= 86400:  # Due within 24 hours
            score += 40
        elif time_diff <= 172800:  # Due within 48 hours
            score += 30
        else:
            score += 20
    else:
        # Tasks without due date get lower score
        score -= 10

    # Completed tasks get lower scores
    if task.completed:
        score -= 100

    return score

@app.post("/tasks/ai-sort", response_model=List[TaskRead])
async def ai_sort_tasks(session: AsyncSession = Depends(get_session)):
    """
    AI-powered sorting endpoint that sorts tasks based on urgency and importance.
    Priority logic:
    1. Overdue tasks (past due date) with High priority
    2. Tasks with High priority and near due date (within 24 hours)
    3. Tasks with High priority
    4. Tasks with Medium priority and near due date
    5. Tasks with Medium priority
    6. Tasks with Low priority and near due date
    7. Tasks with Low priority
    8. Tasks without due date (sorted by priority)
    """
    query = select(Task)
    tasks = await session.exec(query)
    all_tasks = tasks.all()

    # Sort tasks by urgency score (descending)
    sorted_tasks = sorted(all_tasks, key=calculate_urgency_score, reverse=True)

    return sorted_tasks

@app.get("/tasks/{task_id}/ai-advice")
async def get_ai_advice(task_id: int, session: AsyncSession = Depends(get_session)):
    query = select(Task).where(Task.id == task_id)
    result = await session.exec(query)
    task = result.first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    advice_messages = {
        TaskPriority.HIGH: f"This is a high priority task, '{task.title}'. Finish it before noon!",
        TaskPriority.MEDIUM: f"This is a medium priority task, '{task.title}'. Try to complete it today.",
        TaskPriority.LOW: f"This is a low priority task, '{task.title}'. You can schedule it for later."
    }

    advice = advice_messages.get(task.priority, f"Complete the task '{task.title}' as per your schedule.")

    return {"advice": advice, "task_title": task.title, "priority": task.priority.value}

@app.get("/analytics/dashboard")
async def get_analytics(session: AsyncSession = Depends(get_session)):
    # Get all tasks
    query = select(Task)
    tasks_result = await session.exec(query)
    all_tasks = tasks_result.all()

    total_tasks = len(all_tasks)
    completed_tasks = sum(1 for task in all_tasks if task.completed)

    # Calculate efficiency score
    efficiency_score = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

    # Category distribution
    categories = [task.category for task in all_tasks if task.category]
    category_counter = Counter(categories)
    category_distribution = dict(category_counter)

    # Daily trend (last 7 days)
    today = datetime.utcnow().date()
    daily_trend = {}
    for i in range(7):
        day = today - timedelta(days=i)
        day_tasks = [task for task in all_tasks
                     if task.completed and task.updated_at.date() == day]
        daily_trend[day.strftime("%Y-%m-%d")] = len(day_tasks)

    # Format daily trend as a list of values for the last 7 days
    daily_trend_list = [daily_trend.get((today - timedelta(days=i)).strftime("%Y-%m-%d"), 0)
                        for i in range(6, -1, -1)]

    analytics = {
        "efficiency_score": round(efficiency_score, 2),
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": total_tasks - completed_tasks,
        "category_distribution": category_distribution,
        "daily_trend": daily_trend_list
    }

    return analytics

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    print("Starting Complete Server with Authentication...")
    print("Test credentials:")
    print("Email/Username: admin@example.com or admin")
    print("Password: password123")
    print("Server available at: http://127.0.0.1:8000")
    print("Authentication endpoints:")
    print("- POST /auth/login")
    print("- POST /auth/register")
    uvicorn.run(app, host='127.0.0.1', port=8000)