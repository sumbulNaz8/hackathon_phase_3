from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum


class PriorityEnum(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


if __name__ == "__main__":
    print("Model definition successful!")
    task_base = TaskBase(title="Test Task")
    print(f"Created task: {task_base.title}")