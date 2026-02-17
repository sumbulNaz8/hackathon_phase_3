'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Modal } from '@/components/ui/Modal'
import { Loading } from '@/components/ui/Loading'
import { Task } from '@/lib/types'
import { tasksAPI, analyticsAPI } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import ChatWidget from '@/components/ChatWidget'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<any>({})
  const [analytics, setAnalytics] = useState<any>(null)
  const [showChat, setShowChat] = useState(true)
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const fetchTasks = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await tasksAPI.getAll(user.id, filter)
      if (Array.isArray(data)) {
        const sortedTasks = data.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
        setTasks(sortedTasks)
      }
    } catch (error: any) {
      console.error('Error fetching tasks:', error)
      setTasks([])
      toast.error(error.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    if (!user) return
    try {
      const analyticsData = await analyticsAPI.getDashboard(user.id)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchAnalytics()
    }
  }, [user])

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
      const newTask = await tasksAPI.create(user.id, title, description, priority, category, dueDate)
      setTasks([newTask, ...tasks])
      toast.success('Task created successfully!')
    } catch (error) {
      toast.error('Failed to create task')
      throw error
    }
  }

  const handleUpdateTask = async (title: string, description: string, priority: string, category: string, dueDate: string) => {
    if (!user || !editingTask) {
      toast.error('User not authenticated or no task selected for editing')
      return
    }
    try {
      console.log('Updating task:', editingTask.id, title)
      const updatedTask = await tasksAPI.update(user.id, editingTask.id, title, description, priority, category, dueDate)
      console.log('Task updated successfully:', updatedTask)
      setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t))
      setEditingTask(null)
      toast.success('Task updated successfully!')
    } catch (error: any) {
      console.error('Update task error:', error)
      toast.error(error?.message || 'Failed to update task')
      throw error
    }
  }

  // New function for chatbot - takes taskId directly
  const handleUpdateTaskById = async (taskId: number, title: string, description: string, priority: string, category: string, dueDate: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }
    try {
      console.log('Updating task by ID:', taskId, title)
      const updatedTask = await tasksAPI.update(user.id, taskId, title, description, priority, category, dueDate)
      console.log('Task updated successfully:', updatedTask)
      setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t))
      return updatedTask
    } catch (error: any) {
      console.error('Update task error:', error)
      throw error
    }
  }

  const handleToggleTask = async (taskId: number) => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }
    try {
      const updatedTask = await tasksAPI.toggleComplete(user.id, taskId)
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
      toast.success('Task completed!')
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }
    try {
      await tasksAPI.delete(user.id, taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
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

  const applyFilter = (newFilter: any) => {
    setFilter(newFilter)
  }

  if (authLoading) {
    return React.createElement(Loading)
  }

  if (!isAuthenticated) {
    router.push('/login')
    return React.createElement(Loading)
  }

  return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300' },
    React.createElement(Header, { user: user, onLogout: logout }),
    React.createElement('main', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'heading-glow heading-shimmer text-5xl md:text-6xl', 'data-text': 'AI-Powered Task Dashboard' }, 'AI-Powered Task Dashboard'),
        React.createElement('p', { className: 'text-xl text-gradient-gold font-semibold mt-4' }, 'Organize your tasks with AI insights'),
        React.createElement('div', { style: { padding: '1.5rem', border: '3px solid #8B6914', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.5)', marginBottom: '2rem', boxShadow: '0 0 0 2px rgba(139, 105, 20, 0.3), 0 4px 16px rgba(139, 105, 20, 0.2)' } },
          React.createElement('div', null,
            React.createElement('h2', null, 'Create New Task'),
            React.createElement(TaskForm, {
              onSubmit: handleCreateTask,
              submitLabel: 'Create Task'
            })
          ),
          React.createElement('div', { style: { marginTop: '2rem' } },
            React.createElement('h2', null, 'Your Tasks (', tasks.length, ')'),
            Array.isArray(tasks) && React.createElement(TaskList, {
              tasks: tasks,
              onToggle: handleToggleTask,
              onEdit: startEditing,
              onDelete: handleDeleteTask
            })
          )
        )
      )
    ),
    editingTask ? React.createElement(Modal, {
      isOpen: true,
      onClose: cancelEditing,
      title: 'Edit Task',
      children: React.createElement(TaskForm, {
        onSubmit: handleUpdateTask,
        initialTitle: editingTask.title,
        initialDescription: editingTask.description || '',
        initialPriority: editingTask.priority || 'medium',
        initialCategory: editingTask.category || '',
        initialDueDate: editingTask.due_date || '',
        submitLabel: 'Save Changes',
        onCancel: cancelEditing
      })
    }) : null,
    showChat ? React.createElement('div', { className: 'chat-panel open' },
      React.createElement(ChatWidget, {
        tasks: tasks,
        onCreateTask: handleCreateTask,
        onDeleteTask: handleDeleteTask,
        onToggleTask: handleToggleTask,
        onUpdateTask: handleUpdateTaskById,
        user: user,
        onClose: () => setShowChat(false)
      })
    ) : React.createElement('div', { className: 'chat-floating-btn', onClick: () => setShowChat(true) }, '🤖')
  )
}
