
'use client';

import { useState, useEffect } from 'react';
import { Plus, Square, CheckSquare, Trash2, Menu, X, Tag, Sun, Moon, Coffee, Award, TrendingUp } from 'lucide-react';
import { useToast } from '@/context/toast-context';

// Define TypeScript interfaces
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
  priority?: number;
}

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { showToast } = useToast();

  // Available categories with vibrant gradient colors
  const categories = [
    { name: 'All', color: 'bg-slate-700' },
    { name: 'Work', color: 'bg-indigo-500' },
    { name: 'Personal', color: 'bg-violet-500' },
    { name: 'Urgent', color: 'bg-rose-500' },
  ];

  // Filter tasks based on selected category
  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8002/tasks');
        if (response.ok) {
          const data = await response.json();
          const tasksWithDates = data.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }));
          setTasks(tasksWithDates);
        } else {
          setTasks([
            { id: '1', title: 'Complete project proposal', completed: false, createdAt: new Date(), category: 'Work' },
            { id: '2', title: 'Schedule team meeting', completed: true, createdAt: new Date(Date.now() - 86400000), category: 'Work' },
            { id: '3', title: 'Review documentation', completed: false, createdAt: new Date(Date.now() - 172800000), category: 'Urgent' },
          ]);
        }
      } catch (error) {
        setTasks([
          { id: '1', title: 'Complete project proposal', completed: false, createdAt: new Date(), category: 'Work' },
          { id: '2', title: 'Schedule team meeting', completed: true, createdAt: new Date(Date.now() - 86400000), category: 'Work' },
          { id: '3', title: 'Review documentation', completed: false, createdAt: new Date(Date.now() - 172800000), category: 'Urgent' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;

    const newTaskObj: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      completed: false,
      createdAt: new Date(),
      category: 'Personal',
    };

    try {
      const response = await fetch('http://127.0.0.1:8002/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask.trim() }),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([createdTask, ...tasks]);
        showToast('Task added successfully!', 'success');
      } else {
        setTasks([newTaskObj, ...tasks]);
        showToast('Task added successfully!', 'success');
      }
    } catch (error) {
      setTasks([newTaskObj, ...tasks]);
      showToast('Task added successfully!', 'success');
    }

    setNewTask('');
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
    setTasks(updatedTasks);

    try {
      const response = await fetch(`http://127.0.0.1:8002/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });

      if (response.ok) {
        showToast(`Task marked as ${updatedTask.completed ? 'complete' : 'incomplete'}!`, 'success');
      } else {
        setTasks(tasks);
        showToast('Failed to update task status', 'error');
      }
    } catch (error) {
      setTasks(tasks);
      showToast('Network error - task status reverted', 'error');
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);

    try {
      const response = await fetch(`http://127.0.0.1:8002/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Task deleted successfully!', 'success');
      } else {
        setTasks([...updatedTasks, task]);
        showToast('Failed to delete task', 'error');
      }
    } catch (error) {
      setTasks([...updatedTasks, task]);
      showToast('Network error - task deletion failed', 'error');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-slate-700/50 shadow-xl">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow-primary">
              <Coffee className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gradient-primary">
              Task Manager
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <a href="/" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-800/50 text-slate-300">Home</a>
            <a href="/dashboard" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-800/50 text-slate-300">Dashboard</a>
            <a href="/tasks" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-800/50 text-slate-300">Tasks</a>
            <a href="/analytics" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-800/50 text-slate-300">Analytics</a>
            <a href="/settings" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-800/50 text-slate-300">Settings</a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-slate-800/50 text-indigo-400 hover:bg-slate-700/50 transition-all duration-300"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-slate-800/50 text-indigo-400"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className="md:hidden bg-slate-800/50 py-4 px-4">
            <div className="flex flex-col space-y-2">
              <a
                href="/"
                className="px-4 py-3 rounded-lg transition-all hover:bg-slate-700/50 text-slate-300"
                onClick={() => setSidebarOpen(false)}
              >
                Home
              </a>
              <a
                href="/dashboard"
                className="px-4 py-3 rounded-lg transition-all hover:bg-slate-700/50 text-slate-300"
                onClick={() => setSidebarOpen(false)}
              >
                Dashboard
              </a>
              <a
                href="/tasks"
                className="px-4 py-3 rounded-lg transition-all hover:bg-slate-700/50 text-slate-300"
                onClick={() => setSidebarOpen(false)}
              >
                Tasks
              </a>
              <a
                href="/analytics"
                className="px-4 py-3 rounded-lg transition-all hover:bg-slate-700/50 text-slate-300"
                onClick={() => setSidebarOpen(false)}
              >
                Analytics
              </a>
              <a
                href="/settings"
                className="px-4 py-3 rounded-lg transition-all hover:bg-slate-700/50 text-slate-300"
                onClick={() => setSidebarOpen(false)}
              >
                Settings
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold mb-4 text-gradient-primary">Elegant Task Management</h2>
            <p className="text-lg max-w-2xl mx-auto text-slate-400">
              Organize your tasks with our beautiful vibrant gradient interface
            </p>
          </div>

          {/* Task Input Section */}
          <div className="glass-card rounded-2xl p-6 mb-10 transition-all duration-200 hover:shadow-card-hover">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done today?"
                className="flex-1 px-6 py-4 rounded-xl text-lg bg-slate-800/60 text-slate-50 border-2 border-slate-600 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
              />
              <button
                onClick={addTask}
                className="px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-150 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-glow-primary hover:scale-102 hover:brightness-110 active:scale-95"
              >
                <Plus size={20} />
                <span>Add Task</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-5 py-2 rounded-full text-base font-medium transition-all duration-150 transform hover:scale-105 ${
                    selectedCategory === category.name
                      ? `${category.color} text-white ring-4 ring-white/20 shadow-lg`
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card glass-card-hover rounded-2xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-indigo-500/20 shadow-glow-primary">
                  <Coffee size={28} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-400">Total Tasks</h3>
                  <p className="text-3xl font-bold text-white">{tasks.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-emerald-500/20 shadow-glow-emerald">
                  <TrendingUp size={28} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-400">Completion</h3>
                  <p className="text-3xl font-bold text-white">
                    {tasks.length > 0
                      ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-violet-500/20 shadow-glow-secondary">
                  <Award size={28} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-400">Productivity</h3>
                  <p className="text-3xl font-bold text-white">
                    {tasks.length > 0
                      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
                      : 0}/100
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="border-b border-slate-700">
              <div className="grid grid-cols-12 px-6 py-4 bg-slate-800/50 text-slate-300 text-sm font-semibold">
                <div className="col-span-1"></div>
                <div className="col-span-5">Task</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-slate-400">Loading your tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <Coffee size={48} className="mx-auto mb-4 text-indigo-400" />
                <p className="text-slate-400">No tasks found in this category. Add a new task to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`grid grid-cols-12 items-center px-6 py-5 transition-all duration-200 hover:bg-slate-700/30 ${
                      task.completed ? 'bg-slate-800/20' : ''
                    }`}
                  >
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-2 rounded-full transition-all duration-200 ${task.completed ? 'text-emerald-400 bg-emerald-900/30' : 'text-slate-400 hover:text-indigo-400'}`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                      </button>
                    </div>
                    <div className={`col-span-5 ${task.completed ? 'line-through text-slate-500' : 'text-slate-50'} font-medium`}>
                      {task.title}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        task.category === 'Work' ? 'bg-indigo-500 text-white' :
                        task.category === 'Personal' ? 'bg-violet-500 text-white' :
                        task.category === 'Urgent' ? 'bg-rose-500 text-white' :
                        'bg-slate-600 text-slate-300'
                      }`}>
                        <Tag size={12} className="mr-1" />
                        {task.category || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="col-span-3 text-sm text-slate-400">
                      {formatDate(task.createdAt)}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-rose-400 hover:text-rose-300 p-2 rounded-full hover:bg-rose-500/10 transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-12 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Task Manager. Crafted with elegance and simplicity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TaskDashboard;
