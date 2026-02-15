@echo off
cd /d "C:\Users\A`S Computer`s\Desktop\hackathon_2\frontend"
echo Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo npm install failed with error level %errorlevel%
    pause
    exit /b %errorlevel%
)
echo Frontend dependencies installed successfully!
pause