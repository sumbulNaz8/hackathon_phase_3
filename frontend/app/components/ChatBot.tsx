'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Send } from 'lucide-react'

interface Message {
  id: string
  user: 'assistant' | 'user'
  content: string
  timestamp: string
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'user', content: 'Hello!', timestamp: '2025-02-15 12:00:00' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle send
  const handleSend = async () => {
    setIsLoading(true)

    const userMessage = input.trim()

    if (!userMessage) {
      alert('Please enter a message')
      return
    }

    // Simulated AI response
    const responses = [
      'Hello! How can I help you today?',
      'You can add tasks, delete tasks, or view your dashboard.',
    'What would you like to do?',
    'I am your AI assistant. Ask me anything!'
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    const botMessage: randomResponse

    setMessages(prev => [...prev, botMessage])

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Process user message
    const processedMessage = userMessage.toLowerCase()

    // Check for keywords
    const keywords = ['hello', 'help', 'add task', 'delete task', 'view dashboard', 'what', 'how', 'why', 'who are you', 'create', 'show', 'tell me']
    const hasKeyword = keywords.some(kw => processedMessage.includes(kw))

    if (hasKeyword) {
      // Pre-configured responses
      if (processedMessage.includes('hello')) {
        botMessage = 'Hello! 👋 I am your Todo Assistant. How can I help you today?'
      } else if (processedMessage.includes('help')) {
        botMessage = 'I can help you with tasks, delete tasks, view dashboard, or tell you about myself! I am a simple AI assistant designed to help you manage your Todo list efficiently. What do you need?'
      } else if (processedMessage.includes('add task')) {
        botMessage = 'Great! 📝 To add a new task, tell me the task title and description.'
      } else if (processedMessage.includes('delete task')) {
        botMessage = 'Task deleted! 🗑️ Tell me the task ID if you want to remove it.'
      } else if (processedMessage.includes('view dashboard')) {
        botMessage = 'Here is your dashboard summary. You have analytics, filters, and task management.'
      } else if (processedMessage.includes('what')) {
        botMessage = 'I am your Todo Assistant. I help you do daily tasks, track your progress, and provide intelligent insights! 💪'
      } else if (processedMessage.includes('why')) {
        botMessage = 'I am a friendly AI chatbot designed to help you with your Todo app. I can provide information, answer questions, and help you stay productive!'
      } else if (processedMessage.includes('who')) {
      botMessage = 'I am Todo Assistant - your AI helper for this Todo application. I help you organize tasks efficiently with categories and due dates!'
      } else if (processedMessage.includes('create')) {
        botMessage = 'I can help you create a new task! Just tell me the title, description, priority, due date, and category.'
      } else if (processedMessage.includes('show')) {
        botMessage = 'Here are your tasks sorted by priority: High, Medium, Low. I can show them to you!'
      } else if (processedMessage.includes('how')) {
      botMessage = 'I can help you in many ways:
         • Add tasks: Just type tasks
         • View dashboard: See your analytics and progress
         • Delete tasks: Remove tasks you completed or don't need
         • Ask questions: I can answer questions about your tasks'
         • Chat: Have a conversation with me'
      }
    } else {
      // Unknown - default response
      botMessage = 'I can help you with: ' + processedMessage + '". Try asking "how" or "help" for more info.'
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-indigo-950 rounded-2xl p-4 text-center">
        <div className="w-24 h-24 text-center font-bold text-gradient-primary">
          🤖
        </div>
        <div className="text-xl font-bold text-slate-400 mb-4">
          I am your Todo Assistant
        </div>
        <div className="text-lg text-slate-400 mt-2">
          I'm here to help you with your Todo list
        </div>
        <div className="glass-card rounded-2xl p-4">
          <input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border-2 border-indigo-500 bg-slate-800 bg-indigo-200 text-slate-100 placeholder-slate-500 placeholder-slate-500 transition-all duration-200 focus:ring-indigo-500 focus:ring-indigo-500 focus:ring-indigo-500"
          />
          </div>
          <button
            type="submit"
            onClick={handleSend}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-lg shadow-glow-violet-500 hover:scale-102 hover:brightness-110 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="text-sm">Send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
