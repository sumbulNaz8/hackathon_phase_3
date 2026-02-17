import sys
import os
from pathlib import Path

# Add the parent directory to the Python path to access auth module
current_dir = Path(__file__).resolve().parent.parent  # Go up to backend root
auth_dir = current_dir / "auth"
sys.path.insert(0, str(auth_dir))

from fastapi import Request, HTTPException, status
from jwt_handler import verify_token


async def jwt_middleware(request: Request, call_next):
    """
    Middleware to validate JWT tokens for protected routes.

    Args:
        request: The incoming request
        call_next: The next middleware or endpoint to call

    Returns:
        Response: The response from the next middleware or endpoint
    """
    # Skip authentication for public routes
    if request.url.path in ["/", "/health", "/docs", "/redoc", "/openapi.json"]:
        return await call_next(request)

    # Skip authentication for auth routes (handled by the auth endpoints themselves)
    if request.url.path.startswith("/auth"):
        return await call_next(request)

    # For all other routes, validate the JWT token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid",
        )

    token = auth_header[7:]  # Remove "Bearer " prefix
    try:
        payload = verify_token(token)
        # Add user info to request state for use in endpoints
        request.state.user = payload
    except HTTPException:
        # Re-raise the HTTPException from verify_token
        raise

    response = await call_next(request)
    return response