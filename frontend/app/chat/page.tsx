'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ChatPage() {
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()
  const [messageInput, setMessageInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#3E2723] text-[#FFE082] flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-[#FFC107] mb-4">
            Login Required / لاگن کی ضرورت ہے
          </h1>
          <p className="text-[#FFE082] mb-6">
            Please login to access the AI Chatbot / براہم لاگن کریں
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 bg-gradient-to-r from-[#FFC107] to-[#FFE082] text-[#3E2723] font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Go to Login / لاگن پر جائیں
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
    <div className="min-h-screen bg-[#3E2723] text-[#FFE082] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[#FFE082] hover:text-[#FFC107] transition-colors flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="text-right">
            <p className="text-sm text-[#FFE082]">Logged in as:</p>
            <p className="font-semibold text-[#FFC107]">{user?.name || 'User'}</p>
          </div>
        </div>

        {/* Main Chat Interface */}
        <h1 className="text-4xl font-bold text-[#FFC107] mb-2 text-center">
          AI Todo Assistant 🤖
        </h1>
        <p className="text-center text-[#FFE082] mb-8 opacity-80">
          Manage your tasks with natural language / قدرتی way طبع language میں اپنے ٹوو منیج کریں
        </p>

        <div className="bg-[#5D4037] rounded-lg p-6 shadow-xl border border-[#BCAAA4]">
          {/* Welcome Message */}
          <div className="mb-6 pb-6 border-b border-[#BCAAA4]">
            <h2 className="text-xl font-semibold text-[#FFC107] mb-3">
              Welcome! How can I help you? / میں مدد کیسے کر سکتا ہوں؟
            </h2>
            <p className="text-[#FFE082] mb-4">Try these commands / ان کمانڈز آزمائیں:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#8D6E63] rounded-lg p-4">
                <p className="font-semibold text-[#FFC107] mb-2">✨ Create Task:</p>
                <p className="text-sm opacity-90">"Add task: Buy groceries tomorrow"</p>
                <p className="text-xs text-[#FFE082]60">"ٹاٹ task: کل خریدنا کل"</p>
              </div>
              <div className="bg-[#8D6E63] rounded-lg p-4">
                <p className="font-semibold text-[#FFC107] mb-2">📋 View Tasks:</p>
                <p className="text-sm opacity-90">"Show my pending tasks"</p>
                <p className="text-xs text-[#FFE082]60">"میرے under consideration کام دکھاؤ"</p>
              </div>
              <div className="bg-[#8D6E63] rounded-lg p-4">
                <p className="font-semibold text-[#FFC107] mb-2">✅ Complete Task:</p>
                <p className="text-sm opacity-90">"Complete task 1"</p>
                <p className="text-xs text-[#FFE0828]60">"ٹاسک 1 مکمل کرو"</p>
              </div>
              <div className="bg-[#8D6E63] rounded-lg p-4">
                <p className="font-semibold text-[#FFC107] mb-2">❌ Delete Task:</p>
                <p className="text-sm opacity-90">"Delete task called groceries"</p>
                <p className="text-xs text-[#FFE082]60">"گروسریز ٹاسک delete کرو"</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="min-h-[400px] bg-[#8D6E63] rounded-lg p-4 mb-4 border border-[#BCAAA4]">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-[#FFE082] opacity-70">
                  Start chatting...
                  <br />
                  <span className="text-sm">
                    بات شروع کریں...
                  </span>
                </p>
                <p className="text-xs opacity-50 mt-4">
                  Full ChatKit integration coming soon!
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
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
              placeholder="Type your message... / یہاں پیغام لکھیں"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded bg-[#3E2723] border border-[#FFC107] text-white placeholder:text-[#FFE082] focus:outline-none focus:ring-2 focus:ring-[#FFC107] disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isLoading}
              className="bg-[#FFC107] text-[#3E2723] px-6 py-3 rounded font-bold hover:bg-[#FFE082] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#3E2723] border-t-[#FFC107]"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send →
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-[#8D6E63] rounded-lg p-4 border border-[#BCAAA4]">
          <p className="text-sm text-[#FFE082]">
            <strong>📌 Note:</strong> This is a basic chat interface. Full OpenAI ChatKit integration with streaming responses and advanced AI features is coming in the next update!
            <br />
            <span className="text-xs opacity-70">
              یہا ایک بنی کچ اینٹرفیس ہے OpenAI ChatKit کی full integration اگلے اپ ڈیٹ میں!
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
