from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum


class PriorityEnum(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


# Define the base fields separately to avoid potential issues
class TaskBase(SQLModel):
    title: str = Field(sa_column_kwargs={"nullable": False})
    description: Optional[str] = Field(default=None)
    priority: PriorityEnum = Field(default=PriorityEnum.MEDIUM)
    category: Optional[str] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = Field(default=False)


class TaskCreate(TaskBase):
    title: str
    pass


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
    title: str