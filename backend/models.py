from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)


class Task(TaskBase, table=True):
    """
    Task model representing a task.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = Field(default=False)


class TaskCreate(TaskBase):
    """
    Schema for creating a new task.
    """
    pass


class TaskRead(TaskBase):
    """
    Schema for reading task data.
    """
    id: int
    created_at: datetime
    updated_at: datetime
    completed: bool


class TaskUpdate(SQLModel):
    """
    Schema for updating a task.
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    priority: Optional[TaskPriority] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    completed: Optional[bool] = Field(default=None)