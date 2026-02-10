# Backend Guidelines for Claude

This document provides specific guidelines for Claude when making changes to the backend codebase.

## Architecture Overview

- **Framework**: FastAPI with async support
- **Database**: SQLModel (combines SQLAlchemy + Pydantic)
- **Authentication**: JWT-based with bcrypt password hashing
- **Patterns**: Dependency injection, async/await, type hints everywhere

## File Structure

```
backend/
├── main.py              # Main application entry point
├── models/              # Data models (SQLModel)
│   ├── __init__.py
│   ├── user.py          # User-related models
│   └── task.py          # Task-related models
├── auth/                # Authentication modules
│   ├── __init__.py
│   └── jwt_handler.py   # JWT token handling
├── middleware/          # Request/response middleware
│   ├── __init__.py
│   └── jwt_middleware.py # Authentication middleware
├── services/            # Business logic layer
│   ├── __init__.py
│   └── user_service.py  # User management services
├── database.py          # Database connection and setup
├── config.py            # Configuration settings
├── requirements.txt     # Dependencies
├── .env                 # Environment variables (not committed)
├── .env.example         # Template for .env
├── README.md            # User documentation
└── CLAUDE.md            # Claude-specific guidelines (this file)
```

## Core Principles

### 1. Type Safety
- Always use type hints
- Use Pydantic models for request/response validation
- Leverage SQLModel for database models
- Use enums for fixed sets of values

### 2. Async Operations
- Use `async`/`await` for all I/O operations
- Use async database operations with SQLModel
- Don't block the event loop

### 3. Security
- Hash passwords with bcrypt
- Validate JWT tokens in middleware
- Sanitize all user inputs
- Use parameterized queries to prevent SQL injection

### 4. Error Handling
- Use HTTPException for API errors
- Provide meaningful error messages
- Log errors appropriately
- Don't expose internal errors to clients

## Adding New Features

### 1. New API Endpoint
1. Add the endpoint in `main.py`
2. Create appropriate Pydantic models in `models/`
3. Add authentication/authorization if needed
4. Implement business logic in `services/`
5. Add proper error handling
6. Include docstrings

### 2. New Database Model
1. Create model in `models/` directory
2. Follow SQLModel patterns
3. Include proper relationships
4. Add validation constraints
5. Update `database.py` if needed

### 3. New Service
1. Place in `services/` directory
2. Use dependency injection
3. Include proper error handling
4. Write unit tests

## Authentication Flow

1. User registers/login through auth endpoints
2. JWT token is generated and returned
3. Client sends token in Authorization header: `Bearer {token}`
4. Middleware validates token before processing request
5. User info is attached to request state

## Database Best Practices

- Use SQLModel for all database interactions
- Always use async session operations
- Handle transactions properly
- Use proper indexing
- Consider database migration strategy

## Testing Guidelines

- Write unit tests for all business logic
- Use pytest for testing framework
- Include integration tests for API endpoints
- Mock external dependencies
- Test error conditions

## Performance Considerations

- Use database indexes appropriately
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize database queries
- Use connection pooling

## Common Patterns

### CRUD Operation Example
```python
@app.post("/items/", response_model=ItemRead)
async def create_item(item: ItemCreate, session: AsyncSession = Depends(get_session)):
    db_item = Item.model_validate(item)
    session.add(db_item)
    await session.commit()
    await session.refresh(db_item)
    return db_item
```

### Dependency Injection
```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return decode_token(token, credentials_exception)
```

## Before Making Changes

1. Read existing code to understand patterns
2. Check for similar implementations
3. Consider backward compatibility
4. Plan database migrations if needed
5. Think about security implications
6. Consider performance impact

## Code Quality Standards

- Follow PEP 8 style guide
- Write meaningful variable names
- Include docstrings for public functions
- Keep functions focused and small
- Use meaningful commit messages
- Write tests for new functionality

## Troubleshooting

Common issues and solutions:
- Database connection errors: Check DATABASE_URL
- Authentication failures: Verify JWT secret and algorithm
- Validation errors: Check Pydantic model constraints
- Async issues: Ensure all database calls are awaited