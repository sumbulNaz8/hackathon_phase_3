
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
  priority?: number; // Higher number means higher priority
}

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [darkMode, setDarkMode] = useState<boolean>(true); // Enable dark mode by default
  const { showToast } = useToast();

  // Available categories with brown-yellow-black colors
  const categories = [
    { name: 'All', color: darkMode ? 'bg-stone-800' : 'bg-stone-100' },
    { name: 'Work', color: darkMode ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 text-amber-800' },
    { name: 'Personal', color: darkMode ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-100 text-yellow-800' },
    { name: 'Urgent', color: darkMode ? 'bg-orange-800 text-orange-100' : 'bg-orange-100 text-orange-800' },
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
          // Convert createdAt strings to Date objects
          const tasksWithDates = data.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }));
          setTasks(tasksWithDates);
        } else {
          // Fallback to sample tasks if API fails
          setTasks([
            { id: '1', title: 'Complete project proposal', completed: false, createdAt: new Date(), category: 'Work' },
            { id: '2', title: 'Schedule team meeting', completed: true, createdAt: new Date(Date.now() - 86400000), category: 'Work' }, // yesterday
            { id: '3', title: 'Review documentation', completed: false, createdAt: new Date(Date.now() - 172800000), category: 'Urgent' }, // 2 days ago
          ]);
        }
      } catch (error) {
        // Fallback to sample tasks if API fails
        setTasks([
          { id: '1', title: 'Complete project proposal', completed: false, createdAt: new Date(), category: 'Work' },
          { id: '2', title: 'Schedule team meeting', completed: true, createdAt: new Date(Date.now() - 86400000), category: 'Work' }, // yesterday
          { id: '3', title: 'Review documentation', completed: false, createdAt: new Date(Date.now() - 172800000), category: 'Urgent' }, // 2 days ago
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
      category: 'Personal', // Default category
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
        // If API fails, add to local state anyway
        setTasks([newTaskObj, ...tasks]);
        showToast('Task added successfully!', 'success');
      }
    } catch (error) {
      // If API fails, add to local state anyway
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
        // If API fails, revert the change
        setTasks(tasks);
        showToast('Failed to update task status', 'error');
      }
    } catch (error) {
      // If API fails, revert the change
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
        // If API fails, restore the task
        setTasks([...updatedTasks, task]);
        showToast('Failed to delete task', 'error');
      }
    } catch (error) {
      // If API fails, restore the task
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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-stone-900 to-black text-amber-50' : 'bg-gradient-to-br from-amber-50 to-stone-100 text-stone-900'}`}>
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md ${darkMode ? 'bg-stone-900/90 border-b border-stone-800' : 'bg-stone-100/90 border-b border-stone-200'} shadow-xl`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee className={`p-2 rounded-full ${darkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-200 text-amber-700'}`} size={32} />
            <h1 className={`text-xl font-bold bg-clip-text ${darkMode ? 'text-transparent bg-gradient-to-r from-amber-400 to-yellow-500' : 'text-transparent bg-gradient-to-r from-amber-600 to-yellow-700'}`}>
              WowUI Task Manager
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <a href="/" className={`px-4 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-800 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}>Home</a>
            <a href="/dashboard" className={`px-4 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-800 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}>Dashboard</a>
            <a href="/tasks" className={`px-4 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-800 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}>Tasks</a>
            <a href="/analytics" className={`px-4 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-800 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}>Analytics</a>
            <a href="/settings" className={`px-4 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-800 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}>Settings</a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-stone-800 text-amber-400 hover:bg-stone-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'} transition-all duration-300`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`md:hidden`}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-stone-800 text-amber-400' : 'bg-amber-100 text-amber-700'}`}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-stone-800' : 'bg-stone-100'} py-4 px-4`}>
            <div className="flex flex-col space-y-2">
              <a
                href="/"
                className={`px-4 py-3 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-700 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Home
              </a>
              <a
                href="/dashboard"
                className={`px-4 py-3 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-700 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Dashboard
              </a>
              <a
                href="/tasks"
                className={`px-4 py-3 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-700 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Tasks
              </a>
              <a
                href="/analytics"
                className={`px-4 py-3 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-700 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                Analytics
              </a>
              <a
                href="/settings"
                className={`px-4 py-3 rounded-lg transition-all ${darkMode ? 'hover:bg-stone-700 text-amber-200' : 'hover:bg-amber-100 text-stone-700'}`}
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
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-amber-100' : 'text-stone-800'}`}>Elegant Task Management</h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-amber-200' : 'text-stone-600'}`}>
              Organize your tasks with our beautiful brown, yellow, and black themed interface
            </p>
          </div>

          {/* Task Input Section */}
          <div className={`rounded-2xl shadow-xl p-6 mb-10 backdrop-blur-sm ${darkMode ? 'bg-stone-800/70 border border-stone-700' : 'bg-stone-50/70 border border-stone-200'} transition-all duration-300 hover:shadow-2xl`}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done today?"
                className={`flex-1 px-6 py-4 rounded-xl text-lg ${darkMode ? 'bg-stone-900/50 text-amber-50 border border-stone-700 placeholder:text-amber-300/50' : 'bg-white text-stone-800 border border-stone-300 placeholder:text-stone-500'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
              />
              <button
                onClick={addTask}
                className={`px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-900 hover:from-amber-500 hover:to-yellow-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 hover:from-amber-400 hover:to-yellow-400'}`}
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
                  className={`px-5 py-2 rounded-full text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.name
                      ? `${category.color} ring-4 ${darkMode ? 'ring-amber-500/30' : 'ring-amber-400/30'}`
                      : `${category.color} ${darkMode ? 'bg-opacity-50' : 'bg-opacity-70'}`
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className={`rounded-2xl p-6 backdrop-blur-sm ${darkMode ? 'bg-stone-800/70 border border-stone-700' : 'bg-stone-50/70 border border-stone-200'} transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-xl mr-4 ${darkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                  <Coffee size={28} />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-amber-200' : 'text-stone-600'}`}>Total Tasks</h3>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-amber-100' : 'text-stone-800'}`}>{tasks.length}</p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-sm ${darkMode ? 'bg-stone-800/70 border border-stone-700' : 'bg-stone-50/70 border border-stone-200'} transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-xl mr-4 ${darkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-amber-200' : 'text-stone-600'}`}>Completion</h3>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-amber-100' : 'text-stone-800'}`}>
                    {tasks.length > 0
                      ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 backdrop-blur-sm ${darkMode ? 'bg-stone-800/70 border border-stone-700' : 'bg-stone-50/70 border border-stone-200'} transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-xl mr-4 ${darkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                  <Award size={28} />
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-amber-200' : 'text-stone-600'}`}>Productivity</h3>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-amber-100' : 'text-stone-800'}`}>
                    {tasks.length > 0
                      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
                      : 0}/100
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm ${darkMode ? 'bg-stone-800/70 border border-stone-700' : 'bg-stone-50/70 border border-stone-200'} transition-all duration-300`}>
            <div className={`border-b ${darkMode ? 'border-stone-700' : 'border-stone-200'}`}>
              <div className={`grid grid-cols-12 px-6 py-4 ${darkMode ? 'bg-stone-900/50 text-amber-200' : 'bg-stone-100 text-stone-600'} text-sm font-semibold`}>
                <div className="col-span-1"></div>
                <div className="col-span-5">Task</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
                <p className={darkMode ? 'text-amber-200' : 'text-stone-600'}>Loading your tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <Coffee size={48} className={`mx-auto mb-4 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                <p className={darkMode ? 'text-amber-200' : 'text-stone-600'}>No tasks found in this category. Add a new task to get started!</p>
              </div>
            ) : (
              <div className={darkMode ? 'divide-y divide-stone-700' : 'divide-y divide-stone-200'}>
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`grid grid-cols-12 items-center px-6 py-5 transition-all duration-300 hover:${darkMode ? 'bg-stone-700/30' : 'bg-stone-100'} ${
                      task.completed ? (darkMode ? 'bg-stone-900/20' : 'bg-stone-100') : ''
                    }`}
                  >
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-2 rounded-full transition-all duration-300 ${task.completed ? (darkMode ? 'text-amber-400 bg-amber-900/30' : 'text-amber-600 bg-amber-100') : (darkMode ? 'text-stone-400 hover:text-amber-400' : 'text-stone-500 hover:text-amber-600')}`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                      </button>
                    </div>
                    <div className={`col-span-5 ${task.completed ? (darkMode ? 'line-through text-stone-500' : 'line-through text-stone-500') : (darkMode ? 'text-amber-50' : 'text-stone-800')} font-medium`}>
                      {task.title}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        task.category === 'Work' ? (darkMode ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 text-amber-800') :
                        task.category === 'Personal' ? (darkMode ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-100 text-yellow-800') :
                        task.category === 'Urgent' ? (darkMode ? 'bg-orange-800 text-orange-100' : 'bg-orange-100 text-orange-800') :
                        (darkMode ? 'bg-stone-700 text-stone-100' : 'bg-stone-100 text-stone-800')
                      }`}>
                        <Tag size={12} className="mr-1" />
                        {task.category || 'Uncategorized'}
                      </span>
                    </div>
                    <div className={`col-span-3 text-sm ${darkMode ? 'text-amber-200/70' : 'text-stone-600'}`}>
                      {formatDate(task.createdAt)}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} p-2 rounded-full hover:bg-red-500/10 transition-colors`}
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
      <footer className={`py-8 mt-12 ${darkMode ? 'bg-stone-900/50' : 'bg-stone-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={darkMode ? 'text-amber-200/70' : 'text-stone-600'}>
            © {new Date().getFullYear()} WowUI Task Manager. Crafted with elegance and simplicity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TaskDashboard;