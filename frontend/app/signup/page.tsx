'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signup(name, email, password)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Signup error:', error)
      const errorMessage = error?.message || 'Signup failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything if redirecting
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-medium opacity-5 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light opacity-5 rounded-full blur-3xl floating-element-2"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto">
        {/* Signup Card */}
        <div className="relative z-10 elegant-card rounded-3xl p-8 md:p-10 w-full max-w-md mx-auto shadow-elegant-lg animate-scale-in backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <CheckSquare className="w-20 h-20 text-gold-medium mx-auto animate-glow-pulse" />
              <div className="absolute inset-0 bg-gold-medium opacity-20 blur-2xl"></div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Create Account
            </h1>
            <p className="text-cream text-lg text-subtle">Start managing tasks</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-cream font-semibold mb-2 text-lg">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none text-base elegant-input"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-cream font-semibold mb-2 text-lg">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none text-base elegant-input"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-cream font-semibold mb-2 text-lg">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-cream placeholder-cream/60 transition-all duration-300 outline-none text-base elegant-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg font-bold text-brown-dark rounded-xl btn-premium disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? 'Creating...' : 'Sign Up'}</span>
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-8 text-cream text-base text-subtle">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-light hover:text-gold-medium font-bold transition-colors underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}