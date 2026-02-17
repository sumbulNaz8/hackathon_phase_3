from datetime import datetime
from typing import Optional
import uuid
from sqlmodel import SQLModel, Field
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# Temporarily commenting out User model due to import issues
# class User(SQLModel, table=True):
#     """
#     User model representing a user.
#     """
#     id: Optional[int] = Field(default=None, primary_key=True)
#     username: str = Field(unique=True, min_length=1, max_length=100)
#     email: str = Field(unique=True, min_length=1, max_length=100)
#     hashed_password: str = Field(min_length=1)
#     created_at: datetime = Field(default_factory=datetime.utcnow)


class TaskBase(SQLModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    completed: bool = Field(default=False)
    category: Optional[str] = Field(default=None, max_length=100)


class Task(TaskBase, table=True):
    """
    Task model representing a task.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(SQLModel):
    """
    Schema for creating a new task.
    """
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    completed: bool = Field(default=False)
    category: Optional[str] = Field(default=None, max_length=100)


class TaskRead(TaskBase):
    """
    Schema for reading task data.
    """
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    """
    Schema for updating a task.
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    status: Optional[TaskStatus] = Field(default=None)
    priority: Optional[TaskPriority] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    completed: Optional[bool] = Field(default=None)
    category: Optional[str] = Field(default=None, max_length=100)