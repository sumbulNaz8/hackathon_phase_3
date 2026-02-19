'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ChatPage() {
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()
  const [messageInput, setMessageInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isAuthenticated) {
    return (
      <div>
        <div>
          <div>🔐</div>
          <h1>Login Required</h1>
          <p>Please login to access the AI Chatbot</p>
          <button onClick={() => router.push('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !token) return

    const userMessage = messageInput.trim()
    setMessageInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      alert(`Response: ${JSON.stringify(data, null, 2)}`)
    } catch (error: any) {
      console.error('Chat error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div>
        <div>
          <button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </button>
          <div>
            <p>Logged in as:</p>
            <p>{user?.name || 'User'}</p>
          </div>
        </div>

        <h1>AI Todo Assistant 🤖</h1>
        <p>Manage your tasks with natural language</p>

        <div>
          <div>
            <h2>Welcome! How can I help you?</h2>
            <p>Try these commands:</p>
            <div>
              <div>
                <p>Create Task:</p>
                <p>"Add task: Buy groceries tomorrow"</p>
              </div>
              <div>
                <p>View Tasks:</p>
                <p>"Show my pending tasks"</p>
              </div>
              <div>
                <p>Complete Task:</p>
                <p>"Complete task 1"</p>
              </div>
              <div>
                <p>Delete Task:</p>
                <p>"Delete task called groceries"</p>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div>
                <div>💬</div>
                <p>Start chatting...</p>
                <p>Full ChatKit integration coming soon!</p>
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isLoading}
            >
              {isLoading ? 'Sending...' : 'Send →'}
            </button>
          </div>
        </div>

        <div>
          <p>
            <strong>Note:</strong> This is a basic chat interface. Full OpenAI ChatKit integration with streaming responses and advanced AI features is coming in the next update!
          </p>
        </div>
      </div>
    </div>
  )
}
