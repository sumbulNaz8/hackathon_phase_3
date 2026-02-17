'use client'

import { useState } from 'react'

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

  const handleSend = async () => {
    setIsLoading(true)

    const userMessage = input.trim()

    if (!userMessage) {
      alert('Please enter a message')
      return
    }

    const responses = [
      'Hello! How can I help you today?',
      'You can add tasks, delete tasks, or view your dashboard.',
      'What would you like to do?',
      'I am your AI assistant. Ask me anything!'
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: 'assistant',
      content: randomResponse,
      timestamp: new Date().toISOString()
    }])

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div>
      <div>
        <div>🤖</div>
        <div>I am your Todo Assistant</div>
        <div>I'm here to help you with your Todo list</div>
        <div>
          <input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button
          type="submit"
          onClick={handleSend}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  )
}
