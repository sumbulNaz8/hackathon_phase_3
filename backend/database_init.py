import asyncio
import logging
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text
from contextlib import asynccontextmanager

from config import config

# Import models from the correct location
import sys
import os
from pathlib import Path

# Add the src directory to the Python path
project_root = Path(__file__).resolve().parent  # Current directory (backend)
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

from models.user import User
from models.task import Task


# Create the async database engine
# Handle Neon PostgreSQL connection properly by using sslmode in connect_args
db_url = config.DATABASE_URL
# Remove sslmode from the URL and handle it separately for asyncpg
if '?sslmode=require' in db_url:
    db_url = db_url.replace('?sslmode=require', '')

# Determine if we're using PostgreSQL or SQLite and set appropriate connect_args
if db_url.startswith("postgresql"):
    connect_args = {
        "server_settings": {
            "application_name": "task_management_app",
        },
        "ssl": "require",  # This is needed for Neon
    }
else:
    # For SQLite, we don't need server_settings or ssl
    connect_args = {}

try:
    engine = create_async_engine(
        db_url,
        echo=True,
        connect_args=connect_args
    )
    print("Using PostgreSQL database")
except Exception as e:
    print(f"PostgreSQL connection failed: {e}. Falling back to SQLite.")
    # Fallback to SQLite
    db_url = "sqlite+aiosqlite:///./task_management_local.db"
    connect_args = {}
    engine = create_async_engine(
        db_url,
        echo=True,
        connect_args=connect_args
    )
    print("Using SQLite database as fallback")


async def create_db_and_tables():
    """
    Creates the database tables if they don't exist.
    This function should be called on application startup.
    """
    print("Creating database tables...")

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    print("Database tables created successfully!")


async def create_indexes():
    """
    Creates database indexes to optimize queries.
    This function should be called after table creation.
    """
    print("Creating database indexes...")

    async with engine.begin() as conn:
        # Index on user email for authentication
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);"))

        # Index on username for profile lookup
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);"))

        # Index on user_id for task isolation
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);"))

        # Index on task status for filtering
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);"))

        # Index on due_date for sorting and filtering
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);"))

        # Composite index for common task queries
        await conn.execute(text(
            "CREATE INDEX IF NOT EXISTS idx_tasks_user_status_priority ON tasks(user_id, status, priority);"
        ))

    print("Database indexes created successfully!")


async def check_database_connection():
    """
    Checks if the database connection is working.
    """
    try:
        async with engine.connect() as conn:
            # Execute a simple query to test the connection
            await conn.execute(text("SELECT 1"))
        print("Database connection successful!")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False


async def main():
    # Check if we're in a valid environment
    if not config.DATABASE_URL:
        print("DATABASE_URL is not set. Please set it in the .env file.")
        exit(1)

    # Check database connection
    if not await check_database_connection():
        print("Cannot proceed without a valid database connection.")
        exit(1)

    # Create tables
    await create_db_and_tables()

    # Create indexes
    await create_indexes()

    print("Database setup completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())