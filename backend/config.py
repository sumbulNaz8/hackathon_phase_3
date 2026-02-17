import os
from dotenv import load_dotenv
from typing import Optional

# Force reload environment variables from .env file
load_dotenv(verbose=True, override=True)

class Config:
    """Configuration class to manage environment variables safely"""

    # Database configuration
    # Explicitly read from .env file to ensure we get the value from there
    _raw_db_url = None
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    _raw_db_url = line.split("=", 1)[1].strip().strip('"\'')
                    break
    except FileNotFoundError:
        pass

    DATABASE_URL: str = _raw_db_url or os.getenv("DATABASE_URL", "")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")

    # JWT configuration
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-super-secret-jwt-secret-key-change-in-production")
    if JWT_SECRET == "your-super-secret-jwt-secret-key-change-in-production":
        print("WARNING: Using default JWT_SECRET. Change this in production!")

    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # Better Auth configuration
    AUTH_SECRET: str = os.getenv("AUTH_SECRET", "your-better-auth-secret-key-change-in-production")
    if AUTH_SECRET == "your-better-auth-secret-key-change-in-production":
        print("WARNING: Using default AUTH_SECRET. Change this in production!")

    # Application configuration
    APP_NAME: str = os.getenv("APP_NAME", "Task Management API")
    API_V1_STR: str = "/v1"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Database connection pool settings
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "20"))
    DB_POOL_OVERFLOW: int = int(os.getenv("DB_POOL_OVERFLOW", "0"))

    # Other settings
    MAX_LOGIN_ATTEMPTS: int = int(os.getenv("MAX_LOGIN_ATTEMPTS", "5"))
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", "3600"))  # in seconds

# Create a single instance of the config
config = Config()

# Validate that critical environment variables are set
def validate_config():
    """Validate that all critical configuration values are properly set"""
    errors = []

    if not config.DATABASE_URL:
        errors.append("DATABASE_URL is not set")

    if config.JWT_SECRET == "your-super-secret-jwt-secret-key-change-in-production":
        errors.append("JWT_SECRET is using default value - change in production")

    if config.AUTH_SECRET == "your-better-auth-secret-key-change-in-production":
        errors.append("AUTH_SECRET is using default value - change in production")

    if errors:
        raise ValueError(f"Configuration validation failed: {'; '.join(errors)}")

# Validate configuration on import
validate_config()