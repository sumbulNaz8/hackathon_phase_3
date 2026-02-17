'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🔵 Login Page - isAuthenticated:', isAuthenticated)
    // Don't redirect from useEffect - let the form submission handle it
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔵 Starting login process...')
      const result = await login(email, password)
      console.log('✅ Login function completed, result:', result)

      toast.success('Welcome back! Redirecting to dashboard...')

      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('🔵 Navigating to dashboard...')
      // Use router.push instead of window.location.href to maintain React state
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ultra Luxury Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-400/10 to-amber-300/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-300/10 to-amber-200/10 rounded-full blur-3xl animate-float stagger-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-200/6 to-amber-300/6 rounded-full blur-3xl" />

        {/* Multiple Sparkle Effects */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gradient-to-br from-amber-400 to-amber-300 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-gradient-to-br from-amber-300 to-amber-200 rounded-full animate-pulse stagger-1 shadow-lg shadow-amber-300/50" />
        <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-amber-300 rounded-full animate-pulse stagger-2 shadow-lg shadow-amber-400/50" />
        <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-gradient-to-br from-amber-300 to-amber-200 rounded-full animate-pulse stagger-3 shadow-lg shadow-amber-300/50" />
      </div>

      {/* Ultra Luxury Login Card */}
      <div className="glass-card p-14 md:p-16 max-w-lg w-full relative z-10 fade-in-up">
        {/* Diamond Logo with Glow */}
        <div className="text-center mb-14">
          <div className="w-28 h-28 mx-auto mb-10 rounded-[2.5rem] bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 flex items-center justify-center shadow-2xl shadow-amber-300/60 animate-float luxury-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 to-transparent animate-pulse" />
            <span className="text-6xl relative z-10">💎</span>
          </div>
          <h1 className="text-6xl font-display font-black heading-glow heading-shimmer heading-underline-double" data-text="Welcome Back">
            Welcome Back
          </h1>
          <p className="text-deep-brown/70 font-heading text-xl font-semibold">
            
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-3">
            <label className="block mb-2.5 text-sm font-bold text-deep-brown font-heading tracking-wide uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-field text-base"
            />
          </div>

          <div className="space-y-3">
            <label className="block mb-2.5 text-sm font-bold text-deep-brown font-heading tracking-wide uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-field text-base"
            />
          </div>

          {/* Login Button - Centered */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xl shadow-2xl hover:shadow-amber-300/60 premium-border inline-flex items-center justify-center px-12"
            >
              {loading ? 'Signing in...' : 'Login'}
              <span className="text-3xl ml-2">→</span>
            </button>
          </div>

          {/* Fallback button if automatic redirect doesn't work */}
          {loading && (
            <div className="mt-6 text-center">
              <p className="text-sm text-deep-brown/70 mb-3">Redirecting to dashboard...</p>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
          )}
        </form>

        {/* Don't have an account text - with premium Sign Up button */}
        <div className="text-center mt-10">
          <p className="text-deep-brown/70 font-semibold text-lg mb-3">
            Don't have an account?
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="btn-primary text-lg shadow-2xl hover:shadow-amber-300/60 premium-border inline-flex items-center justify-center px-8"
          >
            Sign Up
            <span className="text-2xl ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
