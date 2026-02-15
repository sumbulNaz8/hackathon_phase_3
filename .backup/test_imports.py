#!/usr/bin/env python3
"""
Test script to check if the backend imports correctly and identify any errors
"""

import sys
import os
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent  # Current directory
sys.path.insert(0, str(project_root))

print("Testing imports...")

try:
    print("1. Importing FastAPI modules...")
    from fastapi import FastAPI, Depends, HTTPException, status
    from fastapi.middleware.cors import CORSMiddleware
    print("   SUCCESS: FastAPI modules imported successfully")

    print("2. Importing SQLModel and related modules...")
    from sqlmodel import SQLModel, select
    from sqlmodel.ext.asyncio.session import AsyncSession
    print("   SUCCESS: SQLModel modules imported successfully")

    print("3. Importing other dependencies...")
    from datetime import timedelta
    import uuid
    print("   SUCCESS: Basic modules imported successfully")

    print("4. Testing config import...")
    from config import config
    print(f"   SUCCESS: Config imported successfully. Database URL: {config.DATABASE_URL[:50]}...")

    print("5. Testing auth module...")
    from auth.jwt_handler import create_access_token, verify_token
    print("   SUCCESS: Auth module imported successfully")

    print("6. Testing user service...")
    from services.user_service import UserService
    print("   SUCCESS: User service imported successfully")

    print("7. Testing models...")
    from models.user import User, UserBase
    from models.task import Task
    print("   SUCCESS: Models imported successfully")

    print("8. Testing middleware...")
    from middleware.jwt_middleware import jwt_middleware
    print("   SUCCESS: Middleware imported successfully")

    print("9. Testing skills...")
    from skills.task_manager import task_manager, TaskData
    print("   SUCCESS: Skills imported successfully")

    print("\nSUCCESS: All imports successful! No syntax errors detected.")
    print("\nThe backend should run without import-related errors.")
    print("\nNote: Actual runtime errors may still occur due to:")
    print("- Missing or incorrect environment variables")
    print("- Database connection issues")
    print("- Dependencies that couldn't be installed")

except ImportError as e:
    print(f"\nERROR: Import error: {e}")
    print("This suggests there might be missing dependencies or import issues.")
    sys.exit(1)
except Exception as e:
    print(f"\nERROR: Unexpected error during import test: {e}")
    sys.exit(1)