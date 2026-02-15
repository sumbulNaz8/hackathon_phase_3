'use client'

export default function FloatingChatbot() {
  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button
        onClick={() => alert('Chatbot available on dashboard! Please login or signup first.')}
        className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 border-4 border-white animate-pulse"
        style={{ boxShadow: '0 0 60px rgba(220, 38, 38, 1), 0 0 100px rgba(220, 38, 38, 0.8)' }}
        title="Chat with Todo Assistant"
      >
        <span className="text-4xl">🤖</span>
      </button>
    </div>
  )
}
