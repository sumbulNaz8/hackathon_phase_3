'use client'

export default function FloatingChatbot() {
  return (
    <div>
      <button
        onClick={() => alert('Chatbot available on dashboard! Please login or signup first.')}
        title="Chat with Todo Assistant"
      >
        🤖
      </button>
    </div>
  )
}
