'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { CheckSquare, Loader2, Sparkles, ArrowRight, Zap, Star } from 'lucide-react'

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('🔵 HomePage: State check', {
      loading,
      hasUser: !!user,
      userEmail: user?.email || 'none',
      isAuthenticated
    })

    if (!loading && user) {
      console.log('✅ HomePage: Redirecting to dashboard for', user.email)
      router.push('/dashboard')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 text-violet-400 animate-spin" />
          <p className="text-xl text-slate-300 font-medium animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-violet-600/30 to-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.75s'}}></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDuration: '2.5s', animationDelay: '1.5s'}}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className={`${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-1000 ease-out`}>
            <div className="text-center mb-16">
              {/* Logo with spectacular animation */}
              <div className="mb-12 animate-scale-in" style={{animationDuration: '0.8s', animationFillMode: 'both'}}>
                <div className="relative inline-block group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>

                  {/* Logo container */}
                  <div className="relative w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent"></div>
                    <CheckSquare className="w-16 h-16 text-white relative z-10" strokeWidth={2} />
                  </div>

                  {/* Floating sparkles */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" style={{animationDuration: '2s'}}>
                    <Sparkles className="w-full h-full fill-yellow-400" strokeWidth={2} />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-5 h-5 text-violet-400 animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.3s'}}>
                    <Star className="w-full h-full fill-violet-400" strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Title with gradient text */}
              <h1 className="text-7xl md:text-8xl font-bold mb-6 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
                <div className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Todo App
                </div>
              </h1>

              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-slate-300 mb-8 animate-fade-in-up font-light" style={{animationDelay: '0.4s', animationFillMode: 'both'}}>
                Manage tasks with{' '}
                <span className="font-semibold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  elegance
                </span>
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{animationDelay: '0.6s', animationFillMode: 'both'}}>
                <div className="px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center gap-2 hover:bg-slate-800/70 transition-colors duration-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-300">Lightning Fast</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center gap-2 hover:bg-slate-800/70 transition-colors duration-300">
                  <Star className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-slate-300">Beautiful Design</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center gap-2 hover:bg-slate-800/70 transition-colors duration-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-slate-300">Smooth Experience</span>
                </div>
              </div>

              {/* Debug Info - shown only when logged in */}
              {user && (
                <div className="max-w-md mx-auto mb-8 p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-violet-500/30 animate-fade-in-up" style={{animationDelay: '0.7s', animationFillMode: 'both'}}>
                  <p className="text-base text-slate-300 mb-2 flex items-center justify-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Already logged in as</span>
                    <span className="text-violet-400 font-semibold">{user.email}</span>
                  </p>
                  <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Redirecting to dashboard...</span>
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.8s', animationFillMode: 'both'}}>
                <Link href="/login" className="flex-1 group">
                  <button className="w-full px-10 py-5 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 shadow-2xl hover:scale-105 hover:shadow-violet-500/50 active:scale-95 transition-all duration-300 border border-white/10 relative overflow-hidden">
                    {/* Button inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      Login
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>

                <Link href="/signup" className="flex-1 group">
                  <button className="w-full px-10 py-5 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-2xl hover:scale-105 hover:shadow-cyan-500/50 active:scale-95 transition-all duration-300 border border-white/10 relative overflow-hidden">
                    {/* Button inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      Get Started Free
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center animate-fade-in-up" style={{animationDelay: '1s', animationFillMode: 'both'}}>
              <p className="text-sm text-slate-500">
                Built with{' '}
                <span className="text-violet-400 font-medium">Next.js</span>
                {' '}+{' '}
                <span className="text-indigo-400 font-medium">FastAPI</span>
                {' '}•{' '}
                <span className="text-purple-400 font-medium">Beautiful by Design</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
