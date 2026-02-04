@echo off
cd /d "C:\Users\A`S Computer`s\Desktop\hackathon_2\backend"
echo Starting backend server...
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause