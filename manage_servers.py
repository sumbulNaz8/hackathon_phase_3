#!/usr/bin/env python3
"""
Backend Server Manager

This script helps manage the backend servers for the AI Productivity Engine.
"""

import subprocess
import sys
import os
import argparse
import signal
import time

def run_working_server():
    """Run the working backend server with 8 endpoints."""
    print("🚀 Starting the working backend server...")
    print("   Available at: http://127.0.0.1:8000")
    print("   Endpoints: 8 (auth, tasks)")
    print("\n📋 Endpoints:")
    print("   GET    /")
    print("   GET    /health")
    print("   POST   /auth/register")
    print("   POST   /auth/login")
    print("   GET    /tasks")
    print("   POST   /tasks")
    print("   PUT    /tasks/{task_id}")
    print("   DELETE /tasks/{task_id}")
    
    os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
    subprocess.run([sys.executable, "-m", "uvicorn", "full_backend_server_fixed:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])

def run_complete_server():
    """Attempt to run the complete backend server with 14 endpoints."""
    print("🚀 Starting the complete backend server...")
    print("   Available at: http://127.0.0.1:8001")
    print("   Endpoints: 14 (auth, tasks, AI features, analytics)")
    print("\n📋 Full Endpoint List:")
    print("   Authentication Endpoints:")
    print("     GET    /")
    print("     POST   /auth/register")
    print("     POST   /auth/login")
    print("   Task Management Endpoints:")
    print("     POST   /tasks/ (response_model=TaskRead, status_code=201)")
    print("     GET    /tasks/ (with filtering options)")
    print("     GET    /tasks/{task_id}")
    print("     PUT    /tasks/{task_id}")
    print("     PATCH  /tasks/{task_id}")
    print("     DELETE /tasks/{task_id}")
    print("   AI-Powered Features:")
    print("     POST   /tasks/ai-sort")
    print("     GET    /tasks/{task_id}/ai-advice")
    print("   Analytics & Utility Endpoints:")
    print("     GET    /analytics/dashboard")
    print("     GET    /health")
    print("\n⚠️  Note: This server requires specific dependency versions.")
    print("   If you encounter import errors, stick with the working server.")
    
    os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
    subprocess.run([sys.executable, "-m", "uvicorn", "complete_server:app", "--reload", "--host", "0.0.0.0", "--port", "8001"])

def main():
    parser = argparse.ArgumentParser(description="Manage backend servers for AI Productivity Engine")
    parser.add_argument("action", choices=["working", "complete"], 
                       help="Choose which server to run: 'working' (8 endpoints) or 'complete' (14 endpoints)")
    
    args = parser.parse_args()
    
    if args.action == "working":
        run_working_server()
    elif args.action == "complete":
        run_complete_server()

if __name__ == "__main__":
    main()