import os
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from urllib.parse import urlparse, quote_plus


def get_database_connection_string():
    """Extract and return the database connection string."""
    # For development purposes, use SQLite by default
    # You can override this by setting DATABASE_URL in your environment
    database_url = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    print(f"Using database URL: {database_url}")

    # For SQLite, we need to handle the connection string differently
    if database_url.startswith("sqlite"):
        # For SQLite, we need to use a different async driver
        if database_url.startswith("sqlite:///"):
            # Handle the case where the path starts with three slashes
            path = database_url[len("sqlite:///"):]  # Get the path part after sqlite:///
            database_url = f"sqlite+aiosqlite:///{path}"
        elif database_url.startswith("sqlite://"):
            # Handle the case where the path starts with two slashes
            path = database_url[len("sqlite://"):]  # Get the path part after sqlite://
            database_url = f"sqlite+aiosqlite:///{path}"
        else:
            # Fallback for other formats
            database_url = database_url.replace("sqlite:", "sqlite+aiosqlite:")

    # For PostgreSQL with asyncpg, we need to ensure the driver is correct
    elif database_url.startswith("postgresql://"):
        # Replace with the asyncpg driver
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

    return database_url


# Create the async engine with proper configuration
async def create_db_engine() -> AsyncEngine:
    connection_string = get_database_connection_string()

    engine = create_async_engine(
        connection_string,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=300,    # Recycle connections every 5 minutes
        echo=False           # Set to True for debugging SQL queries
    )

    return engine


# Global engine instance
engine = None


async def get_engine() -> AsyncEngine:
    global engine
    if engine is None:
        engine = await create_db_engine()
    return engine


async def create_tables():
    """Create all tables defined in the models."""
    from models import Task  # Import here to avoid circular imports

    async with (await get_engine()).begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)