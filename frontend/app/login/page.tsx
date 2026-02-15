'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#3E2723] text-[#FFE082] flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center shadow-lg mb-4">
            <Star className="w-10 h-10 text-[#3E2723]" />
          </div>
          <h1 className="text-3xl font-bold text-[#FFC107] mb-2">Welcome Back</h1>
          <p className="text-[#FFE082]">Login to manage your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#FFE082] font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-[#8D6E63] bg-[#5D4037] text-[#FFE082] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FFC107]"
            />
          </div>

          <div>
            <label className="block text-[#FFE082] font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-[#8D6E63] bg-[#5D4037] text-[#FFE082] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FFC107]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold text-[#3E2723] rounded-lg bg-gradient-to-r from-[#FFC107] to-[#FFE082] hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-[#FFE082]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#FFC107] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
