@echo off
cd /d "C:\Users\AG Computer\Desktop\hackathon_2\backend"
call auth_env\Scripts\activate.bat
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
