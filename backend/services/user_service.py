import sys
import os
from pathlib import Path

# Add the src directory to the Python path
project_root = Path(__file__).resolve().parent.parent  # Go up twice to reach backend root
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Optional
from uuid import UUID
from auth.jwt_handler import get_password_hash, verify_password
from models.user import User, UserBase
from config import config
from sqlalchemy.ext.asyncio import create_async_engine


class UserService:
    def __init__(self):
        self.engine = create_async_engine(config.DATABASE_URL)

    async def create_user(self, user_data: UserBase, password: str):
        """Create a new user with hashed password"""
        password_hash = get_password_hash(password)

        db_user = User(
            email=user_data.email,
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            password_hash=password_hash
        )

        async with AsyncSession(self.engine) as session:
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)

        return db_user

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        async with AsyncSession(self.engine) as session:
            statement = select(User).where(User.email == email)
            result = await session.execute(statement)
            user = result.first()
            return user

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get a user by username"""
        async with AsyncSession(self.engine) as session:
            statement = select(User).where(User.username == username)
            result = await session.execute(statement)
            user = result.first()
            return user

    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get a user by ID"""
        async with AsyncSession(self.engine) as session:
            statement = select(User).where(User.id == user_id)
            result = await session.execute(statement)
            user = result.first()
            return user

    async def authenticate_user(self, email_or_username: str, password: str) -> Optional[User]:
        """Authenticate a user by email/username and password"""
        async with AsyncSession(self.engine) as session:
            # Try to find user by email first
            statement = select(User).where(User.email == email_or_username)
            result = await session.execute(statement)
            user = result.first()

            # If not found, try to find by username
            if not user:
                statement = select(User).where(User.username == email_or_username)
                result = await session.execute(statement)
                user = result.first()

            if user and verify_password(password, user.password_hash):
                return user
            return None

    async def update_user(self, user_id: UUID, updates: dict) -> Optional[User]:
        """Update a user's information"""
        async with AsyncSession(self.engine) as session:
            statement = select(User).where(User.id == user_id)
            result = await session.execute(statement)
            user = result.first()

            if not user:
                return None

            # Apply updates
            for field, value in updates.items():
                if hasattr(user, field):
                    setattr(user, field, value)

            # Update the timestamp
            user.updated_at = datetime.utcnow()
            await session.commit()
            await session.refresh(user)

            return user