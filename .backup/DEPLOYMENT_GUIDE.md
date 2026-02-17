# 🚀 Vercel Deployment Guide - No 404 Errors!

## 📋 Prerequisites
- Vercel account (free)
- GitHub repository with this code
- Both frontend & backend ready to deploy

---

## 🔧 Step 1: Deploy Backend FIRST

### 1.1 Push code to GitHub
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

### 1.2 Deploy Backend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **IMPORTANT**: Click **"Edit Configuration"**
5. Set these settings:
   - **Root Directory**: `backend`
   - **Framework Preset**: Python
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
6. Click **"Deploy"**

### 1.3 Get Backend URL
After deployment completes, Vercel will give you a URL like:
```
https://hackathon-2-backend.vercel.app
```

**📝 Copy this URL!** You'll need it for the frontend.

---

## 🎨 Step 2: Deploy Frontend

### 2.1 Update Frontend Environment Variable

**Option A: Via Vercel Dashboard** (Recommended)
1. Go to your frontend project on Vercel
2. Go to **Settings → Environment Variables**
3. Add variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://hackathon-2-backend.vercel.app`
   - **Environments**: Production, Preview, Development
4. Click **"Save"**
5. **Redeploy** the frontend

**Option B: Update vercel.json**
Edit `frontend/vercel.json` and replace the backend URL:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "YOUR_BACKEND_URL_HERE"
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "YOUR_BACKEND_URL_HERE/api/:path*"
    }
  ]
}
```

### 2.2 Deploy Frontend on Vercel
1. Click **"Add New Project"** on Vercel
2. Import the same GitHub repository
3. Set these settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **"Deploy"**

---

## ✅ Step 3: Verify No 404 Errors

### 3.1 Check Backend Health
Visit: `https://hackathon-2-backend.vercel.app/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "users": 0,
  "tasks": 0
}
```

### 3.2 Check Frontend Homepage
Visit: `https://hackathon-2-frontend.vercel.app`

Expected: **Todo App** page with Login/Signup buttons

### 3.3 Test Authentication
1. Click **"Sign Up"**
2. Create an account
3. Verify you're redirected to dashboard

### 3.4 Test API Endpoints
```bash
# Test health endpoint
curl https://hackathon-2-backend.vercel.app/health

# Test signup endpoint
curl -X POST https://hackathon-2-backend.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

---

## 🐛 Common 404 Issues & Solutions

### Issue 1: Backend returns 404
**Cause**: Wrong file structure
**Solution**:
- Make sure `backend/api/index.py` exists
- Verify `backend/vercel.json` points to `api/index.py`

### Issue 2: Frontend can't reach backend
**Cause**: Wrong API URL
**Solution**:
- Check `NEXT_PUBLIC_API_URL` in Vercel settings
- Hard refresh frontend (Cmd/Ctrl + Shift + R)

### Issue 3: "Cannot GET /api/..."
**Cause**: Vercel routes not configured
**Solution**:
- Verify `backend/vercel.json` has correct `routes` section
- Redeploy backend

### Issue 4: Database errors on Vercel
**Cause**: File-based storage doesn't work on serverless
**Solution**:
- For demo/hackathon: **This is expected behavior**
- Data will reset on each deployment
- For production: Add Vercel Postgres or similar

---

## 📊 Architecture After Deployment

```
User Browser
    ↓
Frontend (Vercel Next.js)
    ↓
Backend API (Vercel Python/FastAPI)
    ↓
JSON Files (ephemeral, resets on deployment)
```

---

## 🔐 Important Notes

### ⚠️ Data Persistence
**This project uses JSON file storage** which will **NOT persist** on Vercel:
- Each deployment = fresh data
- Serverless functions = ephemeral filesystem
- For hackathon/demo: OK
- For production: Use Vercel Postgres or similar

### 🚀 For Production
Replace JSON storage with:
- Vercel Postgres (recommended)
- Supabase
- PlanetScale
- Or any cloud database

---

## 🎯 Quick Test Commands

```bash
# Test backend
curl https://hackathon-2-backend.vercel.app/health

# Test frontend
curl -I https://hackathon-2-frontend.vercel.app

# Test API (after signing up)
curl https://hackathon-2-backend.vercel.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✨ Success Checklist

- [ ] Backend deployed and `/health` returns 200
- [ ] Frontend deployed and homepage loads
- [ ] Signup works
- [ ] Login works
- [ ] Dashboard loads without 404
- [ ] Create task works
- [ ] All API endpoints respond

**When all checked = Successfully deployed! 🎉**

---

## 📞 Need Help?

If you get 404 errors:
1. Check Vercel deployment logs
2. Verify file structure (especially `backend/api/index.py`)
3. Confirm `NEXT_PUBLIC_API_URL` is set
4. Try redeploying both frontend and backend

Good luck! 🚀
