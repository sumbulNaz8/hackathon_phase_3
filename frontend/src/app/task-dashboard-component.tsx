'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Activity,
  Zap,
  Menu,
  X,
  Sparkles,
  Lightbulb,
  Check,
  Circle,
  Trash2,
  Plus,
  Calendar,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { useToast } from './context/toast-context';

// Define TypeScript interfaces
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  dueDate?: string;
  aiAdvice?: string;
}

interface AnalyticsData {
  efficiencyScore: number;
  activeTasks: number;
  mostProductiveCategory: string;
}

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [aiAdviceModal, setAiAdviceModal] = useState<{ taskId: string | null; advice: string | null }>({
    taskId: null,
    advice: null
  });
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('online');
  const [authToken, setAuthToken] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
  const [newTask, setNewTask] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showAdvancedForm, setShowAdvancedForm] = useState<boolean>(false);
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [taskMenuOpen, setTaskMenuOpen] = useState<string | null>(null);
  const { showToast } = useToast();

  // Fetch analytics data from the backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/analytics/dashboard', {
          headers: {
            'Authorization': `Bearer ${authToken || ''}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
          // Set fallback analytics data
          setAnalytics({
            efficiencyScore: 75,
            activeTasks: 12,
            mostProductiveCategory: 'Development'
          });
        }
      } catch (error) {
        setBackendStatus('offline');
        // Set fallback analytics data
        setAnalytics({
          efficiencyScore: 75,
          activeTasks: 12,
          mostProductiveCategory: 'Development'
        });
      }
    };

    fetchAnalytics();
  }, [authToken]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/tasks', {
          headers: {
            'Authorization': `Bearer ${authToken || ''}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
          // Set fallback tasks
          setTasks([
            { id: '1', title: 'Complete project proposal', completed: false, priority: 'high' },
            { id: '2', title: 'Schedule team meeting', completed: true, priority: 'medium' },
            { id: '3', title: 'Review documentation', completed: false, priority: 'low' },
          ]);
        }
      } catch (error) {
        setBackendStatus('offline');
        // Set fallback tasks
        setTasks([
          { id: '1', title: 'Complete project proposal', completed: false, priority: 'high' },
          { id: '2', title: 'Schedule team meeting', completed: true, priority: 'medium' },
          { id: '3', title: 'Review documentation', completed: false, priority: 'low' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [authToken]);

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return;

    const taskToAdd: Omit<Task, 'id'> = {
      title: newTask.trim(),
      description: newTaskDescription,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToAdd),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([createdTask, ...tasks]);

        // Update analytics counter
        if (analytics) {
          setAnalytics({
            ...analytics,
            activeTasks: analytics.activeTasks + 1
          });
        }

        showToast('Task added successfully!', 'success');
      } else {
        // If API fails, add to local state anyway
        const localTask: Task = {
          ...taskToAdd,
          id: Date.now().toString()
        };
        setTasks([localTask, ...tasks]);
        showToast('Task added locally (API failed)', 'warning');
      }
    } catch (error) {
      // If API fails, add to local state anyway
      const localTask: Task = {
        ...taskToAdd,
        id: Date.now().toString()
      };
      setTasks([localTask, ...tasks]);
      showToast('Task added locally (Network error)', 'warning');
    }

    // Reset form
    setNewTask('');
    setNewTaskDescription('');
    setNewTaskDueDate('');
    setShowAdvancedForm(false);
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
    setTasks(updatedTasks);

    // Update analytics counter
    if (analytics) {
      const activeCount = updatedTask.completed
        ? analytics.activeTasks - 1
        : analytics.activeTasks + 1;

      setAnalytics({
        ...analytics,
        activeTasks: activeCount
      });
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });

      if (!response.ok) {
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

  // Delete a task
  const deleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);

    // Update analytics counter
    if (analytics && !task.completed) {
      setAnalytics({
        ...analytics,
        activeTasks: analytics.activeTasks - 1
      });
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
        },
      });

      if (!response.ok) {
        // If API fails, restore the task
        setTasks([...updatedTasks, task]);
        showToast('Failed to delete task', 'error');
      } else {
        showToast('Task deleted successfully!', 'success');
      }
    } catch (error) {
      // If API fails, restore the task
      setTasks([...updatedTasks, task]);
      showToast('Network error - task deletion failed', 'error');
    }

    // Close menu if it was open for this task
    if (taskMenuOpen === id) {
      setTaskMenuOpen(null);
    }
  };

  // Get AI advice for a specific task
  const getAiAdvice = async (taskId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}/ai-advice`, {
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAiAdviceModal({ taskId, advice: data.advice || 'No advice available' });
      } else {
        setAiAdviceModal({ taskId, advice: 'Could not fetch AI advice. Please try again.' });
      }
    } catch (error) {
      setAiAdviceModal({ taskId, advice: 'Error connecting to AI service. Please try again.' });
    }
  };

  // Sort tasks using AI
  const sortTasksByAI = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tasks/ai-sort', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const sortedTasks = await response.json();
        setTasks(sortedTasks);
        showToast('Tasks sorted by AI!', 'success');
      } else {
        showToast('Failed to sort tasks with AI', 'error');
      }
    } catch (error) {
      showToast('Error sorting tasks with AI', 'error');
    }
  };

  // Get priority badge classes based on priority level
  const getPriorityBadgeClasses = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
    }
  };

  // Close AI advice modal
  const closeAiAdviceModal = () => {
    setAiAdviceModal({ taskId: null, advice: null });
  };

  return (
    <div className="flex h-screen bg-[#030712] text-white font-sans">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white shadow-lg backdrop-blur-md bg-opacity-20"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 bg-[#111827]/50 backdrop-blur-md border-r border-gray-800 h-full transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">AI Task Dashboard</h1>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center p-3 text-indigo-400 bg-indigo-900/30 rounded-lg backdrop-blur-sm">
                <BarChart3 size={20} className="mr-3" />
                <span className="font-medium">Overview</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-300 hover:bg-white/10 rounded-lg backdrop-blur-sm">
                <Activity size={20} className="mr-3" />
                <span className="font-medium">Analytics</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-300 hover:bg-white/10 rounded-lg backdrop-blur-sm">
                <Lightbulb size={20} className="mr-3" />
                <span className="font-medium">AI Insights</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="bg-gray-700 border-2 border-dashed rounded-xl w-10 h-10" />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">User Name</p>
              <p className="text-xs text-gray-400">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">AI Task Dashboard</h2>
              <p className="text-gray-400">Intelligent task management powered by AI</p>
            </div>

            {/* Backend Status Indicator */}
            <div className="flex items-center space-x-4">
              {backendStatus === 'offline' && (
                <div className="flex items-center px-3 py-1 rounded-full text-sm bg-red-900/30 text-red-400">
                  <AlertTriangle size={16} className="mr-1" />
                  Server Offline
                </div>
              )}
              <button
                onClick={sortTasksByAI}
                className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white backdrop-blur-md"
              >
                <Sparkles size={18} className="mr-2" />
                AI Sort
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Efficiency Score Card */}
            <div className="rounded-2xl shadow-2xl shadow-blue-500/20 p-6 backdrop-blur-md bg-[#111827]/50 border border-gray-800 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-400">Efficiency Score</h3>
                  <p className="text-3xl font-bold mt-2 text-white">
                    {analytics?.efficiencyScore || '--'}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-900/30">
                  <BarChart3 size={24} className="text-indigo-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${analytics?.efficiencyScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active Tasks Card */}
            <div className="rounded-2xl shadow-2xl shadow-blue-500/20 p-6 backdrop-blur-md bg-[#111827]/50 border border-gray-800 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-400">Active Tasks</h3>
                  <p className="text-3xl font-bold mt-2 text-white">
                    {analytics?.activeTasks || '--'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-900/30">
                  <Activity size={24} className="text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">
                  {tasks.filter(t => !t.completed).length} pending tasks
                </p>
              </div>
            </div>

            {/* Most Productive Category Card */}
            <div className="rounded-2xl shadow-2xl shadow-blue-500/20 p-6 backdrop-blur-md bg-[#111827]/50 border border-gray-800 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-400">Top Category</h3>
                  <p className="text-3xl font-bold mt-2 text-white">
                    {analytics?.mostProductiveCategory || '--'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-900/30">
                  <Zap size={24} className="text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">
                  Highest productivity area
                </p>
              </div>
            </div>
          </div>

          {/* Add Task Command Bar */}
          <div className="rounded-2xl shadow-xl shadow-blue-500/10 p-4 mb-8 backdrop-blur-md bg-[#111827]/50 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 bg-[#030712]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
              />

              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="px-4 py-3 bg-[#030712]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <button
                onClick={() => setShowAdvancedForm(!showAdvancedForm)}
                className="px-4 py-3 bg-[#030712]/50 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={addTask}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add
              </button>
            </div>

            {showAdvancedForm && (
              <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Add details about the task..."
                    className="w-full px-3 py-2 bg-[#030712]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#030712]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tasks List */}
          <div className="rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden backdrop-blur-md bg-[#111827]/50 border border-gray-800">
            <div className="border-b border-gray-800">
              <div className="grid grid-cols-12 px-6 py-4 bg-[#111827]/30 text-gray-400 text-sm font-medium">
                <div className="col-span-1">Status</div>
                <div className="col-span-5">Task</div>
                <div className="col-span-2">Priority</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">No tasks found. Add a new task to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-800/50 transition-colors ${
                      task.completed ? 'bg-green-900/10' : ''
                    }`}
                  >
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-1 rounded-full ${task.completed ? 'text-green-400' : 'text-gray-400'}`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? <Check size={20} /> : <Circle size={20} />}
                      </button>
                    </div>
                    <div className={`col-span-5 ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-400 mt-1">{task.description}</div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClasses(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      {task.dueDate ? (
                        <div className="text-gray-400 text-sm flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No due date</div>
                      )}
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setTaskMenuOpen(taskMenuOpen === task.id ? null : task.id)}
                          className="p-2 rounded-lg text-gray-400 hover:bg-gray-700/50"
                          aria-label="Task actions"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {taskMenuOpen === task.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-[#111827] border border-gray-800 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                getAiAdvice(task.id);
                                setTaskMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-t-lg flex items-center"
                            >
                              <Lightbulb size={16} className="mr-2" />
                              AI Advice
                            </button>
                            <button
                              onClick={() => {
                                toggleTaskCompletion(task.id);
                                setTaskMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 flex items-center"
                            >
                              {task.completed ? (
                                <>
                                  <Circle size={16} className="mr-2" />
                                  Mark Incomplete
                                </>
                              ) : (
                                <>
                                  <Check size={16} className="mr-2" />
                                  Mark Complete
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                deleteTask(task.id);
                                setTaskMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-b-lg flex items-center"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Advice Modal */}
        {aiAdviceModal.taskId && aiAdviceModal.advice && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md bg-[#111827]/70 border border-gray-800">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">AI Advice</h3>
                  <button
                    onClick={closeAiAdviceModal}
                    className="p-1 rounded-full hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="p-4 rounded-lg bg-indigo-900/20">
                    <div className="flex items-start">
                      <Lightbulb className="mr-3 flex-shrink-0 text-indigo-400" size={20} />
                      <p className="text-gray-200">{aiAdviceModal.advice}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeAiAdviceModal}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskDashboard;