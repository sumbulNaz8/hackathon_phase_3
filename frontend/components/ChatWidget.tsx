'use client'

import { useState, useRef, useEffect } from 'react'
import { tasksAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface ChatWidgetProps {
  tasks: any[]
  onCreateTask: (title: string, description: string, priority: string, category: string, dueDate: string) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  onToggleTask: (taskId: number) => Promise<void>
  user: any
}

export default function ChatWidget({ tasks, onCreateTask, onDeleteTask, onToggleTask, user }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hello! 👋 I am your Todo Assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    const userMessage = input.trim()
    if (!userMessage) return

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)

    try {
      const processedMessage = userMessage.toLowerCase()
      let botResponse = ''
      let actionTaken = false

      // === TASK CREATION ===
      if (processedMessage.includes('add') || processedMessage.includes('create') || processedMessage.includes('new')) {
        // Extract task details from message
        const taskTitle = userMessage.replace(/add|create|new|task|todo/gi, '').trim() || 'New Task'
        const priority = processedMessage.includes('urgent') || processedMessage.includes('important') ? 'high' :
                        processedMessage.includes('low') ? 'low' : 'medium'
        const category = processedMessage.includes('work') ? 'Work' :
                        processedMessage.includes('personal') ? 'Personal' :
                        processedMessage.includes('shopping') ? 'Shopping' : 'General'

        await onCreateTask(taskTitle, '', priority, category, '')
        botResponse = `✅ Task created successfully!\n\n📝 **${taskTitle}**\n🎯 Priority: ${priority}\n📁 Category: ${category}\n\nWhat else would you like to do?`
        actionTaken = true
      }

      // === TASK DELETION ===
      else if (processedMessage.includes('delete') || processedMessage.includes('remove')) {
        // Find task by title or ID
        const taskTitle = userMessage.replace(/delete|remove|task|todo/gi, '').trim()
        const taskToDelete = tasks.find(t =>
          t.title.toLowerCase().includes(taskTitle.toLowerCase()) ||
          t.id.toString() === taskTitle
        )

        if (taskToDelete) {
          await onDeleteTask(taskToDelete.id)
          botResponse = `🗑️ Task deleted successfully!\n\n📝 **${taskToDelete.title}**\n\nWhat else would you like to do?`
          actionTaken = true
        } else if (tasks.length > 0) {
          botResponse = `❌ Task not found: "${taskTitle}"\n\nYour current tasks:\n${tasks.map(t => `• ${t.title} (ID: ${t.id})`).join('\n')}\n\nWhich task would you like to delete?`
        } else {
          botResponse = '❌ You have no tasks to delete. Create a task first!'
        }
      }

      // === COMPLETE TASK ===
      else if (processedMessage.includes('complete') || processedMessage.includes('done') || processedMessage.includes('finish')) {
        const taskTitle = userMessage.replace(/complete|done|finish|mark|task/gi, '').trim()
        const taskToComplete = tasks.find(t =>
          !t.completed &&
          (t.title.toLowerCase().includes(taskTitle.toLowerCase()) || t.id.toString() === taskTitle)
        )

        if (taskToComplete) {
          await onToggleTask(taskToComplete.id)
          botResponse = `✅ Task marked as complete!\n\n📝 **${taskToComplete.title}**\n\nGreat job! What else would you like to do?`
          actionTaken = true
        } else if (tasks.length > 0) {
          const incompleteTasks = tasks.filter(t => !t.completed)
          if (incompleteTasks.length > 0) {
            botResponse = `❌ Task not found: "${taskTitle}"\n\nYour pending tasks:\n${incompleteTasks.map(t => `• ${t.title} (ID: ${t.id})`).join('\n')}\n\nWhich task would you like to complete?`
          } else {
            botResponse = '🎉 All your tasks are already completed!'
          }
        } else {
          botResponse = '❌ You have no tasks to complete. Create a task first!'
        }
      }

      // === SHOW TASKS ===
      else if (processedMessage.includes('show') || processedMessage.includes('list') || processedMessage.includes('my tasks') || processedMessage.includes('what are my tasks')) {
        if (tasks.length === 0) {
          botResponse = '📋 You have no tasks yet.\n\nSay "add task [title]" to create your first task!'
        } else {
          const completed = tasks.filter(t => t.completed).length
          const pending = tasks.length - completed
          botResponse = `📋 **Your Tasks:**\n\n` +
            `✅ Completed: ${completed}\n⏳ Pending: ${pending}\n📊 Total: ${tasks.length}\n\n` +
            `**Pending Tasks:**\n${tasks.filter(t => !t.completed).map(t => `• ${t.title}`).join('\n') || 'None'}\n\n` +
            `**Completed Tasks:**\n${tasks.filter(t => t.completed).map(t => `• ${t.title}`).join('\n') || 'None'}`
        }
        actionTaken = true
      }

      // === HELP ===
      else if (processedMessage.includes('help') || processedMessage.includes('what can you do')) {
        botResponse = `🤖 **I can help you with:**

\n📝 **Create Tasks:**
• "Add task Buy groceries"
• "Create urgent task Finish report"
• "New task for work Call client"

\n🗑️ **Delete Tasks:**
• "Delete task Buy groceries"
• "Remove task 1"

\n✅ **Complete Tasks:**
• "Complete task Buy groceries"
• "Mark task 1 as done"
• "Finish Buy groceries"

\n📋 **View Tasks:**
• "Show my tasks"
• "What are my tasks?"
• "List all tasks"

\nTry any of these commands!`
      }

      // === GREETINGS ===
      else if (processedMessage.includes('hello') || processedMessage.includes('hi') || processedMessage.includes('hey')) {
        botResponse = 'Hello! 👋 I am your Todo Assistant.\n\nI can help you create, delete, complete, and view your tasks using natural language!\n\nSay "help" to see what I can do, or just tell me what you need!'
      }

      // === DEFAULT ===
      else {
        botResponse = `I understood: "${userMessage}"\n\nHere are some things I can do:\n` +
          `• Add task: "Add task Buy groceries"\n` +
          `• Delete task: "Delete task Buy groceries"\n` +
          `• Complete task: "Complete task Buy groceries"\n` +
          `• Show tasks: "Show my tasks"\n\n` +
          `Say "help" for more info! 💡`
      }

      // Add action delay for realistic feel
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
        setIsLoading(false)
      }, actionTaken ? 500 : 300)

    } catch (error: any) {
      console.error('Chatbot error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Sorry, something went wrong: ${error.message || 'Unknown error'}\n\nPlease try again!`
      }])
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                  : 'bg-slate-700/50 text-slate-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/50 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 bg-slate-800/60 border-2 border-slate-600 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all duration-200"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
