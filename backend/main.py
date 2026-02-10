from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

# Initialize FastAPI
app = FastAPI(title="Phase II Todo API", version="1.0.0")

# ═══════════════════════════════════════════
# CORS CONFIGURATION (CRITICAL - MUST BE FIRST)
# ═══════════════════════════════════════════
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════
# SECURITY & AUTH SETUP
# ═══════════════════════════════════════════
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "hackathon-phase2-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# ═══════════════════════════════════════════
# IN-MEMORY DATABASE
# ═══════════════════════════════════════════
users_db = {}
tasks_db = {}
task_counter = 0

# ═══════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Optional[str] = "medium"
    category: Optional[str] = ""
    due_date: Optional[str] = ""
    tags: Optional[list] = []
    status: Optional[str] = "todo"
    subtasks: Optional[list] = []
    reminder: Optional[str] = ""

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None
    tags: Optional[list] = []
    status: Optional[str] = None  # "todo", "in_progress", "completed", "archived"
    subtasks: Optional[list] = []  # List of subtask objects
    reminder: Optional[str] = None  # Reminder time

# ═══════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ═══════════════════════════════════════════
# ROOT ENDPOINTS
# ═══════════════════════════════════════════
@app.get("/")
async def root():
    return {
        "message": "Phase II Todo API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "users": len(users_db),
        "tasks": len(tasks_db)
    }

# ═══════════════════════════════════════════
# AUTHENTICATION ENDPOINTS
# ═══════════════════════════════════════════
@app.post("/api/auth/signup")
async def signup(user: UserSignup):
    """Register a new user"""
    
    # Validate input
    if not user.name or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    # Check if email already exists
    if user.email in users_db:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Create new user
    user_id = f"user_{len(users_db) + 1}"
    users_db[user.email] = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Generate JWT token
    access_token = create_access_token({
        "user_id": user_id,
        "email": user.email
    })
    
    # Return response
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user.email,
            "name": user.name
        }
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """Login existing user"""
    
    # Validate input
    if not credentials.email or not credentials.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    # Find user by email
    user = users_db.get(credentials.email)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate JWT token
    access_token = create_access_token({
        "user_id": user["id"],
        "email": user["email"]
    })
    
    # Return response
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    }

@app.get("/api/auth/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current authenticated user"""
    # Extract token from Authorization header
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    token = authorization.split(" ")[1]

    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")

        # Find user by email
        user = users_db.get(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ═══════════════════════════════════════════
# TASK ENDPOINTS
# ═══════════════════════════════════════════
@app.get("/api/{user_id}/tasks")
async def get_tasks(user_id: str, 
                   completed: Optional[bool] = None,
                   priority: Optional[str] = None,
                   category: Optional[str] = None,
                   search: Optional[str] = None):
    """Get all tasks for a specific user with optional filters"""
    user_tasks = [
        task for task in tasks_db.values()
        if task["user_id"] == user_id
    ]
    
    # Apply filters if provided
    if completed is not None:
        user_tasks = [task for task in user_tasks if task["completed"] == completed]
    
    if priority:
        user_tasks = [task for task in user_tasks if task.get("priority", "medium") == priority]
    
    if category:
        user_tasks = [task for task in user_tasks if category.lower() in task.get("category", "").lower()]
    
    if search:
        user_tasks = [task for task in user_tasks if search.lower() in task["title"].lower() or search.lower() in task.get("description", "").lower()]
    
    return user_tasks

@app.post("/api/{user_id}/tasks")
async def create_task(user_id: str, task: TaskCreate):
    """Create a new task"""
    global task_counter
    
    # Validate input
    if not task.title or not task.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")
    
    task_counter += 1
    
    new_task = {
        "id": task_counter,
        "user_id": user_id,
        "title": task.title.strip(),
        "description": (task.description or "").strip(),
        "completed": False,
        "priority": task.priority or "medium",
        "category": task.category or "",
        "due_date": task.due_date or "",
        "tags": task.tags or [],
        "status": task.status or "todo",
        "subtasks": task.subtasks or [],
        "reminder": task.reminder or "",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    tasks_db[task_counter] = new_task
    return new_task

@app.get("/api/{user_id}/tasks/{task_id}")
async def get_task(user_id: str, task_id: int):
    """Get a specific task"""
    task = tasks_db.get(task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this task")
    
    return task

@app.put("/api/{user_id}/tasks/{task_id}")
async def update_task(user_id: str, task_id: int, task: TaskUpdate):
    """Update an existing task with full field support"""

    # Check if task exists
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    existing_task = tasks_db[task_id]

    # Check authorization
    if existing_task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    # Track changes for history
    changes = []
    old_values = existing_task.copy()

    # Update fields only if provided (partial update support)
    if task.title is not None:
        if task.title.strip():
            existing_task["title"] = task.title.strip()
            changes.append({"field": "title", "old": old_values.get("title"), "new": task.title.strip()})

    if task.description is not None:
        existing_task["description"] = (task.description or "").strip()
        changes.append({"field": "description", "old": old_values.get("description"), "new": (task.description or "").strip()})

    if task.priority is not None:
        existing_task["priority"] = task.priority
        changes.append({"field": "priority", "old": old_values.get("priority"), "new": task.priority})

    if task.category is not None:
        existing_task["category"] = task.category
        changes.append({"field": "category", "old": old_values.get("category"), "new": task.category})

    if task.due_date is not None:
        existing_task["due_date"] = task.due_date
        changes.append({"field": "due_date", "old": old_values.get("due_date"), "new": task.due_date})

    if task.completed is not None:
        existing_task["completed"] = task.completed
        changes.append({"field": "completed", "old": old_values.get("completed"), "new": task.completed})

    if task.tags is not None:
        existing_task["tags"] = task.tags
        changes.append({"field": "tags", "old": old_values.get("tags", []), "new": task.tags})

    if task.status is not None:
        existing_task["status"] = task.status
        changes.append({"field": "status", "old": old_values.get("status"), "new": task.status})

    if task.subtasks is not None:
        existing_task["subtasks"] = task.subtasks
        changes.append({"field": "subtasks", "old": old_values.get("subtasks", []), "new": task.subtasks})

    if task.reminder is not None:
        existing_task["reminder"] = task.reminder
        changes.append({"field": "reminder", "old": old_values.get("reminder"), "new": task.reminder})

    # Update timestamp
    existing_task["updated_at"] = datetime.utcnow().isoformat()

    # Add change history if any changes were made
    if changes:
        if "change_history" not in existing_task:
            existing_task["change_history"] = []
        existing_task["change_history"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "changes": changes
        })

    tasks_db[task_id] = existing_task
    return existing_task

@app.delete("/api/{user_id}/tasks/{task_id}")
async def delete_task(user_id: str, task_id: int):
    """Delete a task"""
    
    # Check if task exists
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks_db[task_id]
    
    # Check authorization
    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")
    
    # Delete task
    del tasks_db[task_id]
    return {"message": "Task deleted successfully"}

@app.patch("/api/{user_id}/tasks/{task_id}/complete")
async def toggle_task_completion(user_id: str, task_id: int):
    """Toggle task completion status"""
    
    # Check if task exists
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks_db[task_id]
    
    # Check authorization
    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this task")
    
    # Toggle completion
    task["completed"] = not task["completed"]
    task["updated_at"] = datetime.utcnow().isoformat()
    
    tasks_db[task_id] = task
    return task

@app.post("/api/{user_id}/tasks/sort")
async def sort_tasks(user_id: str):
    """Sort tasks by priority and deadline"""
    user_tasks = [
        task for task in tasks_db.values()
        if task["user_id"] == user_id
    ]
    
    # Sort by priority (high > medium > low) and then by due date (if any)
    def sort_key(task):
        # Handle tasks that might not have priority field (backward compatibility)
        priority = task.get("priority", "medium")
        priority_order = {"high": 0, "medium": 1, "low": 2}
        priority_value = priority_order.get(priority, 1)  # Default to medium if not found

        # Handle tasks that might not have due_date field (backward compatibility)
        due_date = task.get("due_date")
        if due_date:
            # Convert to datetime object for comparison
            try:
                import datetime
                due_datetime = datetime.datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                timestamp = due_datetime.timestamp()
            except (ValueError, OSError):
                # If parsing fails, use a large far-future timestamp (year 2100)
                timestamp = 4102444800  # 2100-01-01 00:00:00 UTC
        else:
            # If no due date, use a large far-future timestamp (year 2100)
            timestamp = 4102444800  # 2100-01-01 00:00:00 UTC

        return (priority_value, timestamp)
    
    sorted_tasks = sorted(user_tasks, key=sort_key)
    return sorted_tasks

@app.get("/api/{user_id}/analytics/dashboard")
async def get_dashboard_analytics(user_id: str):
    """Get dashboard analytics for a user"""
    user_tasks = [
        task for task in tasks_db.values()
        if task["user_id"] == user_id
    ]
    
    total_tasks = len(user_tasks)
    completed_tasks = len([task for task in user_tasks if task["completed"]])
    pending_tasks = total_tasks - completed_tasks
    
    efficiency_score = 0
    if total_tasks > 0:
        efficiency_score = int((completed_tasks / total_tasks) * 100)
    
    analytics = {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "efficiency_score": efficiency_score,
        "by_priority": {
            "high": len([task for task in user_tasks if task.get("priority") == "high"]),
            "medium": len([task for task in user_tasks if task.get("priority") == "medium"]),
            "low": len([task for task in user_tasks if task.get("priority") == "low"])
        }
    }
    
    return analytics

# ═══════════════════════════════════════════
# RUN SERVER
# ═══════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
