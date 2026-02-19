from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class UserBase(SQLModel):
    email: str = Field(sa_column_kwargs={"unique": True, "nullable": False})
    username: str = Field(sa_column_kwargs={"unique": True, "nullable": False})
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    """
    User model representing a registered user in the system.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str = Field(sa_column_kwargs={"nullable": False})
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(UserBase):
    """
    Schema for creating a new user.
    """
    password: str


class UserRead(UserBase):
    """
    Schema for reading user data (without password).
    """
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime