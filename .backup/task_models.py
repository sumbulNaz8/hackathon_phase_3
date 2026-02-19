from datetime import datetime
from typing import Optional
import uuid
from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# Simple Task model
class Task(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    completed: bool = Field(default=False)
    category: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Pydantic schemas for API
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    completed: bool = False
    category: Optional[str] = None


class TaskRead(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str]
    priority: TaskPriority
    due_date: Optional[datetime]
    completed: bool
    category: Optional[str]
    created_at: datetime
    updated_at: datetime


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None
    category: Optional[str] = None