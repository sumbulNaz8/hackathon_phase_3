# Backend Setup and Run Guide

## Issue Identified
The backend requires certain environment variables and dependencies to run properly. The main issue was the missing `DATABASE_URL` in the environment variables.

## Solution Applied
I have created a `.env` file in the backend directory with appropriate configuration values.

## Steps to Run the Backend Server

### Step 1: Open Command Prompt or Terminal
Open your command prompt, PowerShell, or terminal as an administrator.

### Step 2: Navigate to the Backend Directory
Due to the special characters in your username (`A'S Computer's`), you may need to navigate carefully:

```bash
cd "C:\Users\A`S Computer`s\Desktop\hackathon_2\backend"
```

### Step 3: Install Dependencies
Install the required Python packages:

```bash
pip install -r requirements.txt
```

If you encounter issues with psycopg2-binary on Windows, you might need to install it separately:
```bash
pip install psycopg2
```
Or skip it initially and use SQLite instead (already configured in the .env file I created).

### Step 4: Run the Backend Server
Once dependencies are installed, run the server:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Alternative: Using a Virtual Environment (Recommended)
For a cleaner setup, create a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Expected Result
Once successfully running, you should see output similar to:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started reloader process [PID]
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

You can then access the API at `http://localhost:8000` and view the API documentation at `http://localhost:8000/docs`.

## Troubleshooting
- If you get a database connection error, make sure your `.env` file has the correct `DATABASE_URL` setting
- If you get import errors, ensure all dependencies from `requirements.txt` are installed
- If port 8000 is busy, you can use a different port: `--port 8001`

## API Endpoints Available
- GET `/` - Welcome message
- GET `/docs` - Interactive API documentation
- GET `/redoc` - Alternative API documentation
- GET `/health` - Health check endpoint
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- And many more endpoints as defined in main.py