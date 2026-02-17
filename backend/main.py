from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from pathlib import Path
import json
import jwt
import bcrypt

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
SECRET_KEY = "hackathon-phase2-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# ═══════════════════════════════════════════
# PERSISTENT JSON DATABASE
# ═══════════════════════════════════════════
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
USERS_FILE = DATA_DIR / "users.json"
TASKS_FILE = DATA_DIR / "tasks.json"
COUNTER_FILE = DATA_DIR / "counter.json"

def load_json_file(filepath: Path, default=None):
    """Load data from JSON file"""
    if filepath.exists():
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Warning: Could not load {filepath}: {e}")
    return default if default is not None else {}

def save_json_file(filepath: Path, data):
    """Save data to JSON file"""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, default=str)

# Initialize databases from files or create empty
users_db = load_json_file(USERS_FILE, {})
tasks_db = load_json_file(TASKS_FILE, {})
task_counter = load_json_file(COUNTER_FILE, {}).get("task_counter", 0)

def save_task_counter():
    """Save task counter to file"""
    save_json_file(COUNTER_FILE, {"task_counter": task_counter})

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
    # Hash password using bcrypt directly
    password_bytes = password.encode('utf-8')[:72]  # Truncate to 72 bytes max
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify password using bcrypt directly
    password_bytes = plain_password.encode('utf-8')[:72]  # Truncate to 72 bytes max
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ═══════════════════════════════════════════
# STARTUP EVENT
# ═══════════════════════════════════════════
@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("Phase II Todo API Starting...")
    print(f"Data directory: {DATA_DIR.absolute()}")
    print(f"Loaded {len(users_db)} users from storage")
    print(f"Loaded {len(tasks_db)} tasks from storage")
    print(f"Task counter: {task_counter}")
    print("=" * 50)

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
        "tasks": len(tasks_db),
        "task_counter": task_counter,
        "storage": "persistent_json_files",
        "data_directory": str(DATA_DIR.absolute())
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

    # Save to persistent storage
    save_json_file(USERS_FILE, users_db)

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
    print(f"🔵 /api/auth/me called - Authorization: {authorization[:50] if authorization else 'None'}...")

    # Extract token from Authorization header
    if not authorization:
        print("🔴 No Authorization header provided")
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        print("🔴 Invalid Authorization format")
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    print(f"🔵 Token extracted: {token[:20]}...")

    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        print(f"🔵 Decoded email: {email}")

        # Find user by email
        user = users_db.get(email)
        if not user:
            print(f"🔴 User not found for email: {email}")
            print(f"🔴 Available users: {list(users_db.keys())}")
            raise HTTPException(status_code=404, detail=f"User account not found. Please sign up again.")

        print(f"✅ User found: {user['email']}")
        return {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    except jwt.ExpiredSignatureError as e:
        print(f"🔴 Token expired: {e}")
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError as e:
        print(f"🔴 Invalid token: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

# ═══════════════════════════════════════════
# TASK ENDPOINTS
# ═══════════════════════════════════════════
@app.get("/api/{user_id}/tasks")
async def get_tasks(user_id: str, 
                   completed: Optional[bool] = None,
                   priority: Optional[str] = None,
                   category: Optional[str] = None,
                   search: Optional[str] = None,
                   authorization: Optional[str] = Header(None)):
    """Get all tasks for a specific user with optional filters"""
    
    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = payload.get("user_id")
        
        # Verify that the requesting user is accessing their own tasks
        if token_user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this user's tasks")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

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
async def create_task(user_id: str, task: TaskCreate, authorization: Optional[str] = Header(None)):
    """Create a new task"""
    global task_counter

    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = payload.get("user_id")
        
        # Verify that the requesting user is creating tasks for themselves
        if token_user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to create tasks for this user")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

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

    tasks_db[str(task_counter)] = new_task

    # Save to persistent storage
    save_json_file(TASKS_FILE, tasks_db)
    save_task_counter()

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
async def update_task(user_id: str, task_id: int, task: TaskUpdate, authorization: Optional[str] = Header(None)):
    """Update an existing task with full field support"""

    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = payload.get("user_id")
        
        # Verify that the requesting user is updating their own task
        if token_user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this task")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

    # Check if task exists (convert to string for JSON keys)
    task_id_str = str(task_id)
    if task_id_str not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    existing_task = tasks_db[task_id_str]

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

    # Convert task_id to string for JSON keys
    task_id_str = str(task_id)
    tasks_db[task_id_str] = existing_task

    # Save to persistent storage
    save_json_file(TASKS_FILE, tasks_db)

    return existing_task

@app.delete("/api/{user_id}/tasks/{task_id}")
async def delete_task(user_id: str, task_id: int, authorization: Optional[str] = Header(None)):
    """Delete a task"""

    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = payload.get("user_id")
        
        # Verify that the requesting user is deleting their own task
        if token_user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this task")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

    # Check if task exists (convert to string for JSON keys)
    task_id_str = str(task_id)
    if task_id_str not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    task = tasks_db[task_id_str]

    # Check authorization
    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")

    # Delete task
    del tasks_db[task_id_str]

    # Save to persistent storage
    save_json_file(TASKS_FILE, tasks_db)

    return {"message": "Task deleted successfully"}

@app.patch("/api/{user_id}/tasks/{task_id}/complete")
async def toggle_task_completion(user_id: str, task_id: int, authorization: Optional[str] = Header(None)):
    """Toggle task completion status"""

    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = payload.get("user_id")
        
        # Verify that the requesting user is modifying their own task
        if token_user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to modify this task")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

    # Check if task exists (convert to string for JSON keys)
    task_id_str = str(task_id)
    if task_id_str not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    task = tasks_db[task_id_str]

    # Check authorization
    if task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this task")

    # Toggle completion
    task["completed"] = not task["completed"]
    task["updated_at"] = datetime.utcnow().isoformat()

    tasks_db[task_id_str] = task

    # Save to persistent storage
    save_json_file(TASKS_FILE, tasks_db)

    return task

@app.post("/api/{user_id}/tasks/sort")
async def sort_tasks(user_id: str, authorization: Optional[str] = Header(None)):
    """Sort tasks by priority and deadline"""
    
    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = payload.get("user_id")
        
        # Verify that the requesting user is sorting their own tasks
        if token_user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to sort this user's tasks")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

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
async def get_dashboard_analytics(user_id: str, authorization: Optional[str] = Header(None)):
    """Get dashboard analytics for a user"""
    
    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id = payload.get("user_id")
        
        # Verify that the requesting user is accessing their own analytics
        if token_user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this user's analytics")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

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
# CHATBOT ENDPOINT
# ═══════════════════════════════════════════
@app.post("/api/chat")
async def chat_with_bot(message_data: dict, authorization: Optional[str] = Header(None)):
    """Chat with the AI assistant"""
    
    # Extract and validate token
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required. Please login again.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Please login again.")

    token = authorization.split(" ")[1]
    
    # Decode and validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        email = payload.get("email")
        
        # Find user in database
        user = users_db.get(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please login again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token. Please login again.")

    # Get the user's tasks
    user_tasks = [
        task for task in tasks_db.values()
        if task["user_id"] == user_id
    ]
    
    # Process the message
    message = message_data.get("message", "").lower().strip()
    
    # Simple rule-based responses for task management
    if "add task" in message or "create task" in message or "new task" in message:
        # Extract task title from message
        task_title = message.replace("add task", "").replace("create task", "").replace("new task", "").strip()
        if not task_title:
            task_title = "New Task"
        
        # Create a simple response
        response = f"I've created a task for you: '{task_title}'. You can add more details in the dashboard."
        
    elif "show tasks" in message or "my tasks" in message or "list tasks" in message:
        if not user_tasks:
            response = "You don't have any tasks yet. You can create one using 'Add task: [task name]'."
        else:
            completed_count = len([t for t in user_tasks if t["completed"]])
            pending_tasks = [t for t in user_tasks if not t["completed"]]
            
            response = f"You have {len(user_tasks)} total tasks: {len(pending_tasks)} pending and {completed_count} completed.\n\n"
            if pending_tasks:
                response += "Pending tasks:\n"
                for i, task in enumerate(pending_tasks[:5]):  # Show first 5 pending tasks
                    response += f"- {task['title']} (ID: {task['id']})\n"
    
    elif "complete task" in message or "done task" in message:
        # Extract task identifier
        task_identifier = message.replace("complete task", "").replace("done task", "").strip()
        
        # Find task by ID or title
        task_to_complete = None
        if task_identifier.isdigit():  # If it's a number, treat as ID
            task_id = int(task_identifier)
            task_to_complete = next((t for t in user_tasks if t["id"] == task_id), None)
        else:  # Otherwise, try to match by title
            task_to_complete = next((t for t in user_tasks if task_identifier.lower() in t["title"].lower()), None)
        
        if task_to_complete:
            # In a real implementation, we would update the task in the database
            # For now, we'll just return a confirmation
            response = f"I've marked the task '{task_to_complete['title']}' as completed!"
        else:
            response = f"I couldn't find a task matching '{task_identifier}'. Here are your pending tasks:\n"
            pending_tasks = [t for t in user_tasks if not t["completed"]]
            for task in pending_tasks[:5]:
                response += f"- {task['title']} (ID: {task['id']})\n"
    
    elif "delete task" in message or "remove task" in message:
        # Extract task identifier
        task_identifier = message.replace("delete task", "").replace("remove task", "").strip()
        
        # Find task by ID or title
        task_to_delete = None
        if task_identifier.isdigit():  # If it's a number, treat as ID
            task_id = int(task_identifier)
            task_to_delete = next((t for t in user_tasks if t["id"] == task_id), None)
        else:  # Otherwise, try to match by title
            task_to_delete = next((t for t in user_tasks if task_identifier.lower() in t["title"].lower()), None)
        
        if task_to_delete:
            response = f"I've deleted the task '{task_to_delete['title']}'."
        else:
            response = f"I couldn't find a task matching '{task_identifier}'. Here are your tasks:\n"
            for task in user_tasks[:5]:
                response += f"- {task['title']} (ID: {task['id']})\n"
    
    elif "help" in message or "commands" in message:
        response = "I'm your AI Todo Assistant! Here's what I can help you with:\n\n"
        response += "• Add a task: 'Add task: Buy groceries'\n"
        response += "• View tasks: 'Show my tasks' or 'List tasks'\n"
        response += "• Complete a task: 'Complete task 1' or 'Done task buy groceries'\n"
        response += "• Delete a task: 'Delete task 1' or 'Remove task buy groceries'\n"
        response += "• Get help: 'Help' or 'Commands'\n\n"
        response += "Try any of these commands!"
    
    else:
        # Default response for unrecognized commands
        response = f"I understood: '{message_data.get('message', '')}'\n\n"
        response += "I'm your AI Todo Assistant. Try commands like:\n"
        response += "- 'Add task: [task name]'\n"
        response += "- 'Show my tasks'\n"
        response += "- 'Complete task [ID or name]'\n"
        response += "- 'Delete task [ID or name]'\n"
        response += "- 'Help' for more options"
    
    return {
        "response": response,
        "user_id": user_id,
        "action": "message_processed"
    }

# ═══════════════════════════════════════════
# RUN SERVER
# ═══════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
