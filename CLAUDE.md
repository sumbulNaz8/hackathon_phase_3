# Project Documentation

All project specifications and documentation are located in the [/specs](./specs) folder.

## Overview

This monorepo follows an Agentic Architecture pattern and contains:

- **Frontend**: Next.js application in the `/frontend` folder
- **Backend**: FastAPI application in the `/backend` folder
- **Skills**: Reusable agent skills in the `/skills` folder
- **Subagents**: Specialized agents in the `/subagents` folder
- **Specifications**: All project documentation in the `/specs` folder

## Agentic Architecture

This project implements an Agentic Architecture where business logic is organized into:

- **Reusable Agent Skills**: Modular capabilities in the `/skills` folder
- **Specialized Subagents**: Task-focused agents in the `/subagents` folder

## Getting Started

### Frontend (Next.js)

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

### Backend (FastAPI)

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the development server:

```bash
uvicorn main:app --reload
```

## Project Structure

```
/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── skills/            # Reusable agent skills
├── subagents/         # Specialized agents
├── specs/             # Project specifications and documentation
├── CLAUDE.md          # This file
└── ...
```