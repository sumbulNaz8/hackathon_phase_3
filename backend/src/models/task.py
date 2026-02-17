from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid
from pydantic import field_validator
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
    title: str = Field(sa_column_kwargs={"nullable": False}, min_length=1, max_length=200)
    description: str = Field(default="", max_length=500)
    status: str = Field(default="pending")
    priority: str = Field(default="medium")
    due_date: str = Field(default="")
    user_id: str = Field(sa_column_kwargs={"nullable": False})


class Task(TaskBase, table=True):
    """
    Task model representing a task created by a user.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator('due_date')
    def due_date_must_be_future(cls, v):
        if v and v < datetime.utcnow():
            raise ValueError('Due date must be in the future')
        return v


class TaskCreate(TaskBase):
    """
    Schema for creating a new task.
    """
    pass


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