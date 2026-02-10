# Hackathon Backend

This is a clean, robust backend built for hackathons with Neon PostgreSQL integration.

## Features

- FastAPI framework for high-performance API development
- SQLModel for database modeling
- Neon PostgreSQL integration with proper SSL handling
- Advanced task models with title, description, priority, category, and due_date
- Full CRUD operations for tasks
- AI-powered task sorting endpoint
- CORS enabled for frontend integration
- Comprehensive API documentation at `/docs`

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure your database connection in `.env`:
```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname
DEV_DATABASE_URL=postgresql://localhost:5432/hackathon_db
PORT=8002
HOST=127.0.0.1
```

3. Run the server:
```bash
python run_server.py
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /tasks/` - Create a new task
- `GET /tasks/` - Get all tasks with filtering options
- `GET /tasks/{task_id}` - Get a specific task
- `PUT /tasks/{task_id}` - Update a specific task
- `DELETE /tasks/{task_id}` - Delete a specific task
- `POST /tasks/ai-sort` - Get tasks sorted by AI-powered urgency algorithm
- `GET /docs` - Interactive API documentation

## Task Model Fields

- `id` - Unique identifier (auto-generated)
- `title` - Task title (required, 1-100 chars)
- `description` - Task description (optional, up to 500 chars)
- `priority` - Task priority (High/Medium/Low, defaults to Medium)
- `category` - Task category (optional, up to 50 chars)
- `due_date` - Task due date (optional)
- `created_at` - Timestamp when task was created (auto-generated)
- `updated_at` - Timestamp when task was last updated (auto-generated)
- `completed` - Boolean indicating if task is completed (defaults to False)

## AI Sorting Algorithm

The `/tasks/ai-sort` endpoint uses an intelligent algorithm to sort tasks based on:
- Priority level (High/Medium/Low)
- Due date proximity and overdue status
- Completion status
- Urgency calculation

## Development

For development, the server runs on `http://127.0.0.1:8002` with automatic reloading enabled.