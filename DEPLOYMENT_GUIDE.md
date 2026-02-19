# 🚀 Vercel Deployment Guide

## Step 1: Deploy Backend (Render.com - FREE)

1. **Go to** https://render.com

2. **Sign up/Login** with GitHub

3. **Click "New +" → "Web Service"**

4. **Connect your GitHub repo**

5. **Fill the form:**
   - Name: `hackathon-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `PYTHON_VERSION`: `3.11`

6. **Click "Deploy Web Service"**

7. **Note your backend URL** (like `https://hackathon-backend.onrender.com`)

---

## Step 2: Deploy Frontend (Vercel)

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Go to frontend folder:**
   ```bash
   cd "/mnt/c/Users/AG Computer/Desktop/hackathon_phase_3/frontend"
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Set environment variable:**
   - When asked for `NEXT_PUBLIC_API_URL`, enter your backend URL:
     - `https://hackathon-backend.onrender.com` (from Step 1)

6. **Done!** 🎉

### Option B: Using Vercel Dashboard

1. **Go to** https://vercel.com

2. **Click "Add New Project"**

3. **Import your Git repository**

4. **Configure:**
   - Framework Preset: **Next.js**
   - Root Directory: `frontend`
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: `https://hackathon-backend.onrender.com`

5. **Click "Deploy"**

---

## 🔧 Important Files

### Frontend Configuration
- ✅ `frontend/vercel.json` - Already configured
- ✅ `frontend/package.json` - Scripts ready
- ✅ API URL uses `NEXT_PUBLIC_API_URL` env var

### Backend Requirements
- ✅ `backend/requirements.txt` - Dependencies listed
- ✅ `backend/main.py` - FastAPI app ready

---

## ✅ Pre-deployment Checklist

- [ ] Backend deployed on Render (or Railway)
- [ ] Backend URL copied
- [ ] Frontend linked to GitHub
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Test deployment

---

## 📝 Notes

- **Backend hosting options:** Render (Free), Railway (Free), Fly.io
- **Frontend hosting:** Vercel (Free tier available)
- **Environment variable:** `NEXT_PUBLIC_API_URL` must point to your deployed backend

---

## 🆘 Still Facing Issues?

1. **Build errors:** Check terminal for specific error messages
2. **API errors:** Verify `NEXT_PUBLIC_API_URL` is correct
3. **CORS issues:** Backend needs to allow your Vercel domain

Good luck! 🚀
