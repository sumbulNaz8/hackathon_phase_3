@echo off
cd /d "C:\Users\AG Computer\Desktop\hackathon_2\backend"
echo Starting backend server...
python -m uvicorn main:app --host 127.0.0.1 --port 8000
pause