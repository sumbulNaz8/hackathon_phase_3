@echo off
echo ========================================
echo Hackathon_2 Deployment Script
echo ========================================
echo.

cd /d "C:\Users\AG Computer\Desktop\hackathon_2"

echo [1/5] Checking Git status...
git status
echo.

echo [2/5] Adding all changes...
git add vercel.json DEPLOYMENT_GUIDE.md
echo.

echo [3/5] Committing changes...
git commit -m "Add vercel.json and deployment guide - fix routing"
echo.

echo [4/5] Pushing to GitHub...
git push origin main
echo.

echo [5/5] Verifying push...
git status
echo.

echo ========================================
echo Deployment complete!
echo Check Vercel dashboard for build status
echo ========================================
echo.
pause
