'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, isAuthenticated } = useAuth()
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
          <h1 className="text-3xl font-bold text-[#FFC107] mb-2">Create Account</h1>
          <p className="text-[#FFE082]">Start managing your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#FFE082] font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-[#8D6E63] bg-[#5D4037] text-[#FFE082] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FFC107]"
            />
          </div>

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
              placeholder="•••••••"
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#8D6E63] bg-[#5D4037] text-[#FFE082] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FFC107]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold text-[#3E2723] rounded-lg bg-gradient-to-r from-[#FFC107] to-[#FFE082] hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-[#FFE082]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#FFC107] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
