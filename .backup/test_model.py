from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

# Define the models exactly as in models.py
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    priority: str = Field(default="Medium", regex="^(High|Medium|Low)$")  # High/Medium/Low
    category: Optional[str] = Field(default=None, max_length=50)
    due_date: Optional[datetime] = Field(default=None)


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    priority: Optional[str] = Field(default=None)  # Removed regex for optional field
    category: Optional[str] = Field(default=None, max_length=50)
    due_date: Optional[datetime] = Field(default=None)
    completed: Optional[bool] = Field(default=None)


# Test creating an instance with just the completed field
try:
    update_data = TaskUpdate(completed=True)
    print("Success: Created TaskUpdate instance with completed=True")
    print(f"update_data.completed: {update_data.completed}")
    print(f"update_data.title: {update_data.title}")
    print(f"update_data.priority: {update_data.priority}")
except Exception as e:
    print(f"Error: {e}")

# Test with empty dict
try:
    update_data = TaskUpdate()
    print("\nSuccess: Created TaskUpdate instance with no params")
    print(f"update_data.completed: {update_data.completed}")
    print(f"update_data.title: {update_data.title}")
    print(f"update_data.priority: {update_data.priority}")
except Exception as e:
    print(f"\nError with empty: {e}")