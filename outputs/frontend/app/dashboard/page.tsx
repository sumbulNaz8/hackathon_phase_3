'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TaskList } from '@/components/tasks/TaskList';
import { Header } from '@/components/layout/Header';
import { User } from '@/lib/types';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      })));
    }

    // Simulate user data (in a real app, this would come from authentication)
    setUser({
      id: 1,
      name: 'Alex',
      email: 'alex@example.com',
      createdAt: new Date(),
    });
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTitle.trim() === '') return;

    const newTask: Task = {
      id: Date.now(),
      title: newTitle,
      description: newDescription || '',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDescription('');
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
  };

  const saveEdit = () => {
    if (!editingTask || editingTask.title.trim() === '') return;

    setTasks(tasks.map(task =>
      task.id === editingTask.id
        ? { ...task, title: editingTask.title, description: editingTask.description, updatedAt: new Date() }
        : task
    ));

    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens
    localStorage.removeItem('tasks');
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#3E2723] text-white">
      <Header user={user} onLogout={handleLogout} />

      <main className="container mx-auto p-4 max-w-2xl">
        {/* Create New Task Card */}
        <div className="mb-8 p-6 bg-[#8D6E63] rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-[#FFC107] mb-4">Create New Task</h2>

          {editingTask ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#BCAAA4] mb-1">Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="w-full px-4 py-2 bg-[#5D4037] border border-[#BCAAA4] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#BCAAA4] mb-1">Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value || ''})}
                  className="w-full px-4 py-2 bg-[#5D4037] border border-[#BCAAA4] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  rows={2}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={saveEdit}
                  className="py-2 px-4 bg-[#FFC107] text-[#3E2723] font-medium rounded-md hover:bg-[#FFE082] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="py-2 px-4 bg-[#8D6E63] text-white font-medium rounded-md hover:bg-[#BCAAA4] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#BCAAA4] mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-[#5D4037] border border-[#BCAAA4] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#BCAAA4] mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-[#5D4037] border border-[#BCAAA4] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  placeholder="Enter task description"
                  rows={2}
                />
              </div>

              <button
                onClick={addTask}
                className="py-2 px-4 bg-[#FFC107] text-[#3E2723] font-medium rounded-md hover:bg-[#FFE082] transition-colors"
              >
                Create Task
              </button>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div>
          <h2 className="text-xl font-bold text-[#FFC107] mb-4">
            Your Tasks ({tasks.length})
          </h2>

          <TaskList
            tasks={tasks}
            onToggle={toggleTaskCompletion}
            onEdit={startEditing}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}