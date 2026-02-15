@echo off
echo Starting both backend (localhost:8000) and frontend (localhost:3000) servers...

:: Start backend server in a new window
start "Backend Server" cmd /k "cd /d C:\Users\AG Computer\Desktop\hackathon_2\backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

:: Give the backend a moment to start
timeout /t 5 /nobreak >nul

:: Start frontend server in a new window
start "Frontend Server" cmd /k "cd /d C:\Users\AG Computer\Desktop\hackathon_2\frontend && npm run dev"

:: Wait a bit for the frontend to start
timeout /t 10 /nobreak >nul

:: Open both localhost addresses in the browser
start "" "http://localhost:8000"
start "" "http://localhost:3000"

echo Backend and frontend servers have been started and opened in your browser.
pause