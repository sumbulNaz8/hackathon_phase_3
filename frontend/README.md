# Wow UI - Task Management Dashboard

This is a task management dashboard application built with Next.js, Tailwind CSS, and TypeScript. It connects to a backend API to manage tasks with features like adding, completing, and deleting tasks.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Task Management**: Add, complete, and delete tasks
- **Real-time Updates**: Connects to backend API for task data
- **Fallback Support**: Shows sample tasks if API is unavailable
- **Clean UI**: Professional dashboard interface with sidebar navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Setup Instructions

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Access the application at `http://localhost:3000`

## API Integration

The application connects to a backend API at `http://127.0.0.1:8002` for task management operations. If the API is unavailable, the application falls back to displaying sample tasks.

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   ├── task-dashboard-component.tsx  # Shared dashboard component
│   └── todo-dashboard/
│       └── page.tsx        # Todo dashboard page
```

## Components

- **Sidebar**: Navigation sidebar with menu items
- **Task Input**: Form to add new tasks
- **Task List**: Display and manage tasks with completion toggle and delete functionality
- **Stats Summary**: Show total, completed, and pending task counts