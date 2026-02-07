'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext' // Ensure correct case for Linux/Vercel
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
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gold-medium opacity-5 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold-light opacity-5 rounded-full blur-3xl floating-element-2"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gold-dark opacity-5 rounded-full blur-3xl floating-element-3"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg mx-auto text-center animate-fade-in-up">
          {/* Logo with Glow */}
          <div className="mb-8 animate-scale-in">
            <div className="relative inline-block">
              <CheckSquare className="w-32 h-32 text-gold-medium animate-glow-pulse mx-auto" />
              <div className="absolute inset-0 bg-gold-medium opacity-20 blur-3xl animate-pulse"></div>
            </div>
          </div>
          
          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient tracking-tighter animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Todo App
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gold-light mb-12 tracking-wide animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Manage tasks with elegance
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link href="/login" className="flex-1">
              <button className="w-full px-8 py-5 text-xl font-bold text-brown-dark rounded-2xl btn-premium shadow-elegant-lg">
                Login
              </button>
            </Link>
            
            <Link href="/signup" className="flex-1">
              <button className="w-full px-8 py-5 text-xl font-bold text-white bg-gradient-to-r from-brown-light to-brown-medium rounded-2xl transition-all duration-300 shadow-elegant-lg hover:shadow-premium-lg hover:-translate-y-1.5 transform hover:scale-105">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}