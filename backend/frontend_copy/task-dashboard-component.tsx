
'use client';

import { useState, useEffect } from 'react';
import { Plus, Square, CheckSquare, Trash2, Menu, X, Tag } from 'lucide-react';
import { useToast } from './context/toast-context';

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

  // Available categories with colors
  const categories = [
    { name: 'All', color: darkMode ? 'bg-gray-700' : 'bg-gray-100' },
    { name: 'Work', color: darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800' },
    { name: 'Personal', color: darkMode ? 'bg-blue-700 text-blue-100' : 'bg-blue-100 text-blue-800' },
    { name: 'Urgent', color: darkMode ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-800' },
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
        showToast('Task added locally (API failed)', 'warning');
      }
    } catch (error) {
      // If API fails, add to local state anyway
      setTasks([newTaskObj, ...tasks]);
      showToast('Task added locally (Network error)', 'warning');
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
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile sidebar toggle button */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-md ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'} shadow-lg`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg h-full transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Wow UI</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Task Management Dashboard</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className={`flex items-center p-3 ${darkMode ? 'text-indigo-400 bg-indigo-900' : 'text-indigo-600 bg-indigo-50'} rounded-lg`}>
                <span className="ml-3 font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center p-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg`}>
                <span className="ml-3 font-medium">Projects</span>
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center p-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg`}>
                <span className="ml-3 font-medium">Calendar</span>
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center p-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg`}>
                <span className="ml-3 font-medium">Team</span>
              </a>
            </li>
            <li>
              <a href="#" className={`flex items-center p-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg`}>
                <span className="ml-3 font-medium">Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={`absolute bottom-0 w-full p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 border-dashed rounded-xl w-10 h-10`} />
            <div className="ml-3">
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Name</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>user@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Task Dashboard</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage your tasks efficiently</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {/* Task Input Section */}
          <div className={`rounded-xl shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className={`flex-1 px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              <button
                onClick={addTask}
                className={`text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors flex items-center ${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'}`}
              >
                <Plus size={20} className="mr-1" />
                Add
              </button>
              <button
                onClick={() => {
                  // Simple AI prioritization algorithm: prioritize shorter tasks that are not completed
                  const prioritizedTasks = [...tasks].sort((a, b) => {
                    // Completed tasks come last
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;

                    // Prioritize shorter titles (assumes they're simpler)
                    const lengthDiff = a.title.length - b.title.length;

                    // If lengths are similar, prioritize newer tasks
                    return lengthDiff !== 0 ? lengthDiff : b.createdAt.getTime() - a.createdAt.getTime();
                  });

                  setTasks(prioritizedTasks);
                  showToast('Tasks sorted by AI!', 'info');
                }}
                className={`text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors flex items-center ${darkMode ? 'bg-purple-600' : 'bg-purple-600'}`}
              >
                AI Sort
              </button>
            </div>

            {/* Category Filter */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === category.name
                      ? `${category.color} ring-2 ring-offset-2 ${darkMode ? 'ring-indigo-500' : 'ring-indigo-500'}`
                      : `${category.color}`
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`grid grid-cols-12 px-6 py-3 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'} text-sm font-medium`}>
                <div className="col-span-1"></div>
                <div className="col-span-5">Task</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-8 text-center">
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No tasks found in this category. Add a new task!</p>
              </div>
            ) : (
              <div className={darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-100'}>
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`grid grid-cols-12 items-center px-6 py-4 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors ${
                      task.completed ? (darkMode ? 'bg-green-900/20' : 'bg-green-50') : ''
                    }`}
                  >
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-1 rounded-full ${task.completed ? (darkMode ? 'text-green-400' : 'text-green-500') : (darkMode ? 'text-gray-400' : 'text-gray-400')}`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </div>
                    <div className={`col-span-5 ${task.completed ? (darkMode ? 'line-through text-gray-500' : 'line-through text-gray-500') : (darkMode ? 'text-gray-200' : 'text-gray-800')}`}>
                      {task.title}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.category === 'Work' ? (darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800') :
                        task.category === 'Personal' ? (darkMode ? 'bg-blue-700 text-blue-100' : 'bg-blue-100 text-blue-800') :
                        task.category === 'Urgent' ? (darkMode ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-800') :
                        (darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800')
                      }`}>
                        <Tag size={12} className="mr-1" />
                        {task.category || 'Uncategorized'}
                      </span>
                    </div>
                    <div className={`col-span-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(task.createdAt)}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} p-1 rounded-full`}
                        aria-label="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Tasks</h3>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{tasks.length}</p>
            </div>
            <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progress</h3>
              <div className="mt-2">
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`}>
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className={`text-sm font-medium mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {tasks.length > 0
                    ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}% Complete`
                    : '0% Complete'}
                </p>
              </div>
            </div>
            <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Productivity Score</h3>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {tasks.length > 0
                  ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
                  : 0}/100
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDashboard;