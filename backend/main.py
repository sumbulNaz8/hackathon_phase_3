from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import List, Optional
import asyncio
from collections import Counter

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession

from database import get_engine, create_tables
from models import Task, TaskCreate, TaskUpdate, TaskRead


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_tables()
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
    return {"message": "Welcome to the AI Productivity Engine!"}


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
    priority: Optional[str] = Query(None),
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

    def calculate_urgency_score(task):
        score = 0

        # Priority scoring
        if task.priority == PriorityEnum.HIGH:
            score += 30
        elif task.priority == PriorityEnum.MEDIUM:
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
        PriorityEnum.HIGH: f"This is a high priority task, '{task.title}'. Finish it before noon!",
        PriorityEnum.MEDIUM: f"This is a medium priority task, '{task.title}'. Try to complete it today.",
        PriorityEnum.LOW: f"This is a low priority task, '{task.title}'. You can schedule it for later."
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