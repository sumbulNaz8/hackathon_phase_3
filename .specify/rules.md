# Phase II Coding Standards

## Backend Development Standards

### FastAPI Framework
- All API endpoints must be defined using FastAPI's modern async capabilities
- Use Pydantic models for request/response validation
- Implement proper type hints throughout the codebase
- Follow RESTful API design principles
- Use dependency injection for shared services

### SQLModel Integration
- Define all database models using SQLModel
- Use proper relationships between models
- Implement proper indexing strategies
- Follow ACID properties for transactions
- Use proper session management

### Neon DB Integration
- Configure connections using connection pooling
- Implement proper error handling for database operations
- Use environment variables for database credentials
- Implement retry mechanisms for transient failures
- Monitor and optimize query performance

## Frontend Development Standards

### Next.js 16+ (App Router)
- Use the App Router architecture exclusively
- Implement proper component organization
- Follow React best practices and hooks
- Use TypeScript for type safety
- Implement proper error boundaries

### Tailwind CSS
- Use utility-first approach for styling
- Create reusable component classes
- Follow consistent design system
- Implement responsive design patterns
- Optimize for accessibility

## Security Standards

### Authentication & Authorization
- Implement 'Better Auth' for all authentication needs
- Use JWT tokens for session management
- Implement role-based access controls
- Secure all endpoints appropriately
- Follow OWASP security guidelines

## Architecture Standards

### Business Logic Separation
- Business logic must never be in API routes (main.py)
- All business logic must reside in the /skills folder
- Create reusable agent skills for common operations
- Maintain clear separation of concerns
- Follow DRY (Don't Repeat Yourself) principles

### User Isolation
- Every database query must include user_id checks
- Prevent unauthorized cross-user data access
- Implement proper tenant isolation
- Validate user permissions for all operations
- Log all access attempts for audit purposes

## Code Quality Standards

### Testing
- Write comprehensive unit tests for all business logic
- Implement integration tests for API endpoints
- Use property-based testing where appropriate
- Maintain high code coverage (>80%)
- Test edge cases and error conditions

### Documentation
- Document all public interfaces
- Include usage examples in README files
- Maintain up-to-date API documentation
- Comment complex algorithms and business rules
- Follow consistent documentation style

### Performance
- Optimize database queries
- Implement caching where appropriate
- Minimize network requests
- Use lazy loading for resources
- Profile and monitor application performance