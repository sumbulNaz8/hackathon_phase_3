from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum


class PriorityEnum(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class TaskBase(SQLModel):
    title: str  # Required field without default in base
    description: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.MEDIUM
    category: Optional[str] = None
    due_date: Optional[datetime] = None


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = Field(default=False)


class TaskCreate(TaskBase):
    title: str  # Required in creation


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None


class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
    completed: bool