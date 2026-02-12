'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { CheckSquare, Loader2, Sparkles, Crown, Gem, Stars, Zap } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" strokeWidth={2} />
          <p className="text-sm text-slate-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 relative overflow-hidden">
      {/* Premium animated background with shimmer */}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-shimmer"
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-indigo-600/30 rounded-full blur-3xl animate-shimmer"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      ></div>

      {/* Main compact container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-5xl mx-auto">

          {/* Premium compact hero */}
          <div className="text-center mb-16">
            {/* Logo with premium badge */}
            <div className="relative inline-block mb-8">
              <div className="absolute -top-2 -right-2 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
                <Crown className="w-4 h-4 text-white" strokeWidth={2} />
              </div>

              {/* Logo with glassmorphism */}
              <div className="relative w-24 h-24 transition-transform duration-500 hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex items-center justify-center shadow-2xl">
                  <CheckSquare className="w-12 h-12 text-white relative z-10" strokeWidth={2} />
                </div>
              </div>

              {/* Premium gradient title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="bg-gradient-to-br from-indigo-600 via-violet-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                Todo App
              </div>
            </h1>

            {/* Premium subtitle */}
            <p className="text-lg md:text-2xl text-slate-700 font-light animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              Premium task management for professionals
            </p>

            {/* Feature highlights */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-indigo-300 transition-all duration-500">
                <Zap className="w-8 h-8 text-amber-500" strokeWidth={2} />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Lightning Fast</h3>
                  <p className="text-sm text-slate-600">Quick task creation with instant sync</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-indigo-300 transition-all duration-500">
                <Stars className="w-8 h-8 text-purple-500" strokeWidth={2} />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Beautiful Design</h3>
                  <p className="text-sm text-slate-600">Elegant interface crafted for clarity</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-indigo-300 transition-all duration-500">
                <Sparkles className="w-8 h-8 text-indigo-500" strokeWidth={2} />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Premium Experience</h3>
                  <p className="text-sm text-slate-600">Sophisticated features throughout</p>
                </div>
              </div>
            </div>

            {/* User logged in info */}
            {user && (
              <div className="max-w-md mx-auto mb-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50/10 backdrop-blur-sm border border-indigo-200/50 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <CheckSquare className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-base text-slate-800 font-medium mb-1">Welcome back, <span className="text-indigo-600 font-semibold">{user.email}</span></p>
                    <p className="text-sm text-slate-600">Ready to continue where you left off</p>
                  </div>
                  <Link href="/dashboard" className="shrink-0">
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                      Continue to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Premium CTAs - NOT logged in */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-12">
                <Link href="/login" className="flex-1">
                  <button className="w-full px-8 py-4 bg-white text-slate-900 rounded-2xl font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <button className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-300">
                    Get Started Free
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
