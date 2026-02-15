# Troubleshooting Guide: "Fail to Fetch" Error for Signup

## Issue Description
The signup functionality is experiencing a "fail to fetch" error when trying to connect to the backend API.

## Root Causes and Solutions

### 1. Backend Server Status
- **Issue**: Backend server may not be running
- **Solution**: Ensure the backend server is running on port 8000
  - Run: `cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000`

### 2. Reload Flag Issue
- **Issue**: Using `--reload` flag with uvicorn can cause internal server errors
- **Solution**: Start the server without the `--reload` flag
  - Fixed command: `python -m uvicorn main:app --host 127.0.0.1 --port 8000`
  - Updated start_backend.bat to remove the `--reload` flag

### 3. Network Connectivity
- **Issue**: Frontend cannot reach the backend
- **Solution**: Verify that both servers are running:
  - Backend: `http://localhost:8000`
  - Frontend: `http://localhost:3000`

### 4. Environment Variables
- **Issue**: Incorrect API URL in frontend
- **Solution**: Verify NEXT_PUBLIC_API_URL is set to `http://localhost:8000` in `.env.local`

### 5. CORS Configuration
- **Issue**: Cross-origin requests blocked
- **Solution**: Backend already configured with `allow_origins=["*"]`

### 6. Firewall/Security Software
- **Issue**: Local firewall blocking connections
- **Solution**: Temporarily disable firewall or add exceptions for ports 8000 and 3000

## Steps to Verify the Fix

1. Check if backend is running:
   ```bash
   curl http://localhost:8000/health
   ```

2. Test signup endpoint directly:
   ```bash
   curl -X POST http://localhost:8000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"testpassword123"}'
   ```

3. Check frontend console for detailed error messages

4. Verify environment variables are loaded in frontend

## Additional Notes

- Improved error handling has been added to provide more specific error messages
- The signup form now enforces minimum 8-character passwords
- Detailed logging has been added to track request/response cycles
- Removed `--reload` flag from backend startup to prevent internal server errors