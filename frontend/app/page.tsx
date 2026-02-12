'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { CheckSquare } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Static Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg mx-auto text-center animate-fade-in-up">
          {/* Logo with Glow */}
          <div className="mb-8 animate-scale-in">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-glow-primary">
                <CheckSquare className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient-primary tracking-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Todo App
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Manage tasks with style
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link href="/login" className="flex-1">
              <button className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl shadow-glow-primary hover:scale-102 hover:brightness-110 transition-all duration-150 active:scale-95">
                Login
              </button>
            </Link>

            <Link href="/signup" className="flex-1">
              <button className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-glow-blue hover:scale-102 hover:brightness-110 transition-all duration-150 active:scale-95">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
