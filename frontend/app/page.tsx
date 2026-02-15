export default function Home() {
  return (
    <main className="min-h-screen bg-[#3E2723] text-[#FFE082] flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-12 max-w-2xl w-full text-center">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center shadow-lg mb-8">
          <svg className="w-12 h-12 text-[#3E2723]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-[#FFC107] mb-4">Todo App</h1>
        <p className="text-xl text-[#FFE082] mb-12">Experience task management at its finest</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="px-8 py-4 text-lg font-semibold text-[#3E2723] rounded-lg bg-gradient-to-r from-[#FFC107] to-[#FFE082] hover:brightness-110 transition-all"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-8 py-4 text-lg font-semibold text-[#FFE082] border-2 border-[#FFC107] rounded-lg hover:bg-[#5D4037] transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  )
}
