"""Mock task manager for the backend application."""

from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from pydantic import BaseModel
from models.task import Task
from sqlmodel import select, Session


class TaskData(BaseModel):
    """Pydantic TaskData class to match expected interface."""
    id: Optional[uuid.UUID] = None
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"
    due_date: Optional[datetime] = None
    user_id: Optional[uuid.UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __init__(self, **data):
        super().__init__(**data)
        if self.id is None:
            self.id = uuid.uuid4()
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.updated_at is None:
            self.updated_at = datetime.utcnow()


class MockTaskManager:
    """Mock task manager to handle task operations."""

    def __init__(self):
        self.tasks = {}

    async def get_tasks(self, user_id: uuid.UUID, status: Optional[str] = None,
                        priority: Optional[str] = None, limit: int = 10, offset: int = 0) -> List[TaskData]:
        """Get tasks for a user with optional filters."""
        # Return empty list for now
        return []

    async def get_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[TaskData]:
        """Get a specific task by ID."""
        # Return None for now
        return None

    async def create_task(self, task_data: TaskData) -> TaskData:
        """Create a new task."""
        # Return the task data as is for now
        return task_data

    async def update_task(self, task_id: uuid.UUID, user_id: uuid.UUID, updates: Dict[str, Any]) -> Optional[TaskData]:
        """Update an existing task."""
        # Return None for now
        return None

    async def delete_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a task."""
        # Return False for now
        return False


# Create a mock task manager instance
task_manager = MockTaskManager()