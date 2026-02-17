# Next.js Task Manager - Vercel Deployment Guide

## Project Structure
```
hackathon_2/                 # Root repository
├── backend/
├── frontend/                # Next.js application (this directory)
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── next.config.mjs
│   ├── package.json
│   └── ...
└── ...
```

## Vercel Configuration

### 1. Environment Variables
Add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### 2. Build Settings (Vercel Dashboard)
- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Build Command: `cd ../frontend && npm run build`
- Output Directory: `../frontend/.next`
- Install Command: `cd ../frontend && npm install`

### 3. Alternative: vercel.json (place in frontend/ directory)
```json
{
  "rootDirectory": ".",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

## Important Notes
- The `next.config.mjs` file is configured to ignore TypeScript and ESLint build errors
- The project uses the App Router (`app/` directory)
- Static export is configured in the next.config.mjs (remove `output: 'export'` if using SSR)
- Make sure your API endpoints are properly configured with the correct base URL