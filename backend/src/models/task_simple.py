from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    user_id: uuid.UUID


class Task(TaskBase, table=True):
    """
    Task model representing a task created by a user.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = Field(default=False)


class TaskCreate(TaskBase):
    """
    Schema for creating a new task.
    """
    title: str


class TaskRead(TaskBase):
    """
    Schema for reading task data.
    """
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    completed: bool
    title: str


class TaskUpdate(SQLModel):
    """
    Schema for updating a task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None