# Deployment Guide for Hackathon_2 Monorepo

## Project Structure
```
hackathon_2/
├── frontend/          # Next.js application
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   ├── package.json
│   └── vercel.json
├── backend/          # FastAPI application
│   ├── main.py       # FastAPI server
│   ├── requirements.txt
│   └── auth_env/     # Python virtual environment
├── vercel.json       # Vercel configuration (ROOT)
├── .gitignore
└── README.md
```

## Windows Terminal Commands

### 1. Navigate to Project
```powershell
cd "C:\Users\AG Computer\Desktop\hackathon_2"
```

### 2. Check Git Status
```powershell
git status
```

### 3. Add New vercel.json
```powershell
git add vercel.json
```

### 4. Commit Changes
```powershell
git commit -m "Add vercel.json for proper frontend routing"
```

### 5. Force Push to GitHub (Bypass "Everything up-to-date")
```powershell
# Option A: If you want to keep history
git push origin main --force-with-lease

# Option B: If you want to completely reset (WARNING: loses commit history)
git push origin main --force
```

### 6. Verify Push
```powershell
git status
```

Should show: "Your branch is up-to-date with 'origin/main'."

## Vercel Deployment

### Automatic Deployment
1. Push to GitHub
2. Vercel will auto-deploy
3. Visit your Vercel dashboard

### Manual Deployment
```powershell
npx vercel --prod
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

## Troubleshooting

### "Everything up-to-date" Issue
```powershell
# Create a dummy commit
git commit --allow-empty -m "Trigger deployment"

# Or touch a file and commit
echo " " >> .gitkeep
git add .gitkeep
git commit -m "Trigger deployment"
git push origin main
```

### 404 Errors on Vercel
1. Ensure vercel.json is in ROOT directory
2. Check that frontend/ folder exists
3. Verify Next.js is in frontend/
4. Redeploy on Vercel

### Build Failures
```powershell
# Clean install frontend
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
```

## Backend Deployment

### Option 1: Render/Railway/Fly.io
1. Connect GitHub repo
2. Set root directory to `backend/`
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Option 2: Vercel Serverless
Create `api/users/[id]/route.ts` in frontend/ to proxy requests

## Quick Deploy Script (Windows)

Save as `deploy.bat`:
```batch
@echo off
cd /d "C:\Users\AG Computer\Desktop\hackathon_2"
echo Adding files...
git add .
echo Committing...
git commit -m "Deploy changes"
echo Pushing to GitHub...
git push origin main
echo Done! Check Vercel for deployment status.
pause
```

## Support

- Frontend Issues: Check frontend/vercel.json
- Backend Issues: Check backend/main.py
- Vercel Issues: Check root vercel.json
- GitHub Issues: Check .gitignore
