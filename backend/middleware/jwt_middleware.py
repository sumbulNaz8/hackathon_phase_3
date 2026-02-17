from fastapi import Request, HTTPException, status
from auth.jwt_handler import verify_token


async def jwt_middleware(request: Request, call_next):
    """Middleware to validate JWT tokens for protected routes."""
    # Skip authentication for public routes
    if request.url.path in ["/", "/health", "/docs", "/redoc"]:
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