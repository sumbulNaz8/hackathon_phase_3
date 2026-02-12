'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, CheckSquare, Brain, Filter, Calendar, AlertTriangle, CheckCircle2, BarChart3, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Modal } from '@/components/ui/Modal'
import { Task } from '@/lib/types'
import { tasksAPI, analyticsAPI } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<{ completed?: boolean, priority?: string, category?: string, search?: string }>({})
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchAnalytics()
    }
  }, [user])

  const fetchTasks = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await tasksAPI.getAll(user.id, filter);

      if (!Array.isArray(data)) {
        setTasks([]);
        return;
      }

      const sortedTasks = data.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      setTasks(sortedTasks);
    } catch (error: any) {
      setTasks([]);
      toast.error(error.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    if (!user) return

    try {
      setAnalyticsLoading(true)
      const analyticsData = await analyticsAPI.getDashboard(user.id)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [filter, user])

  const handleCreateTask = async (title: string, description: string, priority: string, category: string, dueDate: string) => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }

    try {
      const newTask = await tasksAPI.create(user.id, title, description, priority, category, dueDate);
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully!')
    } catch (error) {
      toast.error('Failed to create task: ' + (error instanceof Error ? error.message : 'Unknown error'))
      throw error
    }
  }

  const handleUpdateTask = async (title: string, description: string, priority: string, category: string, dueDate: string) => {
    if (!user || !editingTask) {
      toast.error('User not authenticated or no task selected for editing')
      return
    }

    try {
      const updatedTask = await tasksAPI.update(user.id, editingTask.id, title, description, priority, category, dueDate)
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null)
      toast.success('Task updated successfully!')
    } catch (error) {
      toast.error('Failed to update task: ' + (error instanceof Error ? error.message : 'Unknown error'))
      throw error
    }
  }

  const handleToggleTask = async (taskId: number) => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }

    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    try {
      const updatedTask = await tasksAPI.toggleComplete(user.id, taskId)
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened')
    } catch (error) {
      setTasks(tasks);
      toast.error('Failed to update task status: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return

    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await tasksAPI.delete(user.id, taskId)
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleAISort = async () => {
    if (!user) return

    try {
      const sortedTasks = await tasksAPI.sortTasks(user.id)
      setTasks(sortedTasks)
      toast.success('Tasks sorted by AI!')
    } catch (error) {
      toast.error('Failed to sort tasks')
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
  }

  const cancelEditing = () => {
    setEditingTask(null)
  }

  const applyFilter = (newFilter: typeof filter) => {
    setFilter(newFilter)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute redirectTo="/login">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-50">
        <Header user={user} onLogout={logout} />

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="w-full max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">AI-Powered Task Dashboard</h1>
              <p className="text-slate-400">Organize your tasks with style and AI insights</p>
            </motion.div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card glass-card-hover rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 shadow-glow-primary">
                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Total Tasks</p>
                    <p className="text-xl font-bold text-white">{analytics?.total_tasks || tasks.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card glass-card-hover rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 shadow-glow-emerald">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Completed</p>
                    <p className="text-xl font-bold text-white">{analytics?.completed_tasks || tasks.filter(t => t.completed).length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card glass-card-hover rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/20 shadow-glow-rose">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Pending</p>
                    <p className="text-xl font-bold text-white">{analytics?.pending_tasks || tasks.filter(t => !t.completed).length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card glass-card-hover rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/20 shadow-glow-secondary">
                    <BarChart3 className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Efficiency</p>
                    <p className="text-xl font-bold text-white">{analytics?.efficiency_score || 0}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Task Creation & Filters */}
              <div className="lg:col-span-1 space-y-4">
                {/* Task Creation Form */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-indigo-500/20 shadow-glow-primary">
                      <Plus className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gradient-primary">Create New Task</h2>
                  </div>

                  <TaskForm
                    onSubmit={handleCreateTask}
                    submitLabel="Create Task"
                  />
                </div>

                {/* AI Sort Button */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-violet-500/20 shadow-glow-secondary">
                      <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-bold text-violet-400">AI Features</h3>
                  </div>

                  <button
                    onClick={handleAISort}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-lg shadow-glow-primary hover:scale-102 hover:brightness-110 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Sort
                  </button>
                </div>

                {/* Filters */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 shadow-glow-cyan">
                      <Filter className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400">Filters</h3>
                  </div>

                  <div className="space-y-3">
                    <select
                      value={filter.completed === undefined ? '' : filter.completed.toString()}
                      onChange={(e) => applyFilter({ ...filter, completed: e.target.value ? e.target.value === 'true' : undefined })}
                      className="w-full px-3 py-2 bg-slate-800/60 border-2 border-slate-600 rounded-lg text-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all duration-200"
                    >
                      <option value="">All Tasks</option>
                      <option value="true">Completed</option>
                      <option value="false">Pending</option>
                    </select>

                    <select
                      value={filter.priority || ''}
                      onChange={(e) => applyFilter({ ...filter, priority: e.target.value || undefined })}
                      className="w-full px-3 py-2 bg-slate-800/60 border-2 border-slate-600 rounded-lg text-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all duration-200"
                    >
                      <option value="">All Priorities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={filter.search || ''}
                      onChange={(e) => applyFilter({ ...filter, search: e.target.value || undefined })}
                      className="w-full px-3 py-2 bg-slate-800/60 border-2 border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Task List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-500/20 shadow-glow-primary">
                      <CheckSquare className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gradient-primary">
                      Your Tasks ({tasks.length})
                    </h2>
                  </div>
                </div>

                {Array.isArray(tasks) && (
                  <TaskList
                    tasks={tasks}
                    onToggle={handleToggleTask}
                    onEdit={startEditing}
                    onDelete={handleDeleteTask}
                  />
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Edit Task Modal */}
        <Modal
          isOpen={!!editingTask}
          onClose={cancelEditing}
          title="Edit Task"
        >
          {editingTask && (
            <TaskForm
              onSubmit={handleUpdateTask}
              initialTitle={editingTask.title}
              initialDescription={editingTask.description || ''}
              initialPriority={editingTask.priority || 'medium'}
              initialCategory={editingTask.category || ''}
              initialDueDate={editingTask.due_date || ''}
              submitLabel="Save Changes"
              onCancel={cancelEditing}
            />
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  )
}
