'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { CheckSquare, Loader2, Sparkles, ArrowRight, Zap, Star, Award, Layers, Gem, Crown } from 'lucide-react'

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 100,
        y: (e.clientY / window.innerHeight - 0.5) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
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
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Premium loading state */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '0s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-violet-400 animate-spin" strokeWidth={1.5} />
            <p className="text-xl text-white/90 font-light tracking-wide animate-pulse">Loading experience...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden" ref={containerRef}>
      {/* PREMIUM 3D Background with Mouse Tracking */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic gradient mesh */}
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-700"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.15) 0%,
              transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.1) 0%,
              transparent 50%
            `
          }}
        ></div>

        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/40 via-purple-600/30 to-indigo-600/40 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-violet-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-600/25 to-pink-600/25 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>

        {/* Floating premium particles */}
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-violet-500/60 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-indigo-500/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-500/60 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-pink-500/60 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>

        {/* Noise texture for premium feel */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'linear\' slope=\'0.6\'/%3E%3C/fecolormatrix%3E%3C/filter%3E%3CfeComponentTransfer%3E%3CfeFuncR type=\'linear\' slope=\'1.2\'/%3E%3C/filt%3E%3CfeFuncG type=\'linear\' slope=\'1.2\'/%3E%3C/filt%3E%3CfeComponentTransfer%3E%3CfeFuncB type=\'discrete\' tableValues=\'0 1 1 1\'/%3E%3C/filt%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'0 1 1 1\'/%3E%3C/fil%3E%3C/svg%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'transparent\'/%3E%3C/svg%3E")',
        }}></div>
      </div>

      {/* Premium Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-5xl mx-auto">
          <div className={`${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-1000 ease-out`}>
            <div className="text-center relative">

              {/* PREMIUM Logo Section */}
              <div className="mb-16 relative">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-600/50 to-indigo-600/50 blur-3xl animate-pulse"></div>
                </div>

                {/* Logo container with 3D effect */}
                <div className="relative inline-block group mb-8">
                  <div className="relative w-40 h-40 transition-transform duration-500 group-hover:scale-110 group-active:scale-95">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-500 opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>

                    {/* Middle ring */}
                    <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-30 group-hover:opacity-40 transition-opacity duration-500 blur-lg"></div>

                    {/* Main logo card */}
                    <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl overflow-hidden">
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
                        background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                        backgroundSize: '200% 200%',
                      }}></div>

                      {/* Icon container with subtle animation */}
                      <div className="relative z-10">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Crown className="w-12 h-12 text-amber-400/80 animate-pulse" strokeWidth={1.5} />
                        </div>
                        <CheckSquare className="w-20 h-20 text-white relative z-20" strokeWidth={1.5}>
                          <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg"></div>
                        </CheckSquare>
                      </div>
                    </div>

                    {/* Floating badge */}
                    <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                      <Gem className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Premium Typography - Main Title */}
                <div className="mb-6">
                  <h1 className="text-7xl md:text-9xl font-bold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    <div className="relative inline-block">
                      <div className="bg-gradient-to-br from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                        Todo
                      </div>
                    </div>
                    <div className="relative inline-block">
                      <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                        App
                      </div>
                    </div>
                  </h1>
                </div>

                {/* Premium Subtitle */}
                <div className="space-y-3 mb-12">
                  <p className="text-2xl md:text-3xl font-light tracking-wide text-white/90 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    Manage tasks with{' '}
                    <span className="font-semibold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                      precision
                    </span>
                  </p>
                  <p className="text-lg text-white/70 font-light tracking-wide animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                    The most elegant task management experience
                  </p>
                </div>

                {/* Premium Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
                  {[
                    { icon: Award, title: 'Pro Design', desc: 'Crafted with attention to detail' },
                    { icon: Layers, title: 'Powerful', desc: 'Built for professionals' },
                    { icon: Star, title: 'Beautiful', desc: 'Delightful to use' },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/15 animate-fade-in-up"
                      style={{
                        animationDelay: `${0.8 + idx * 0.15}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      {/* Inner glow */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10">
                        <div className={`w-12 h-12 mb-3 text-violet-400 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}>
                          <feature.icon strokeWidth={2} />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1 tracking-wide">{feature.title}</h3>
                        <p className="text-xs text-white/70 font-light">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Debug Info - Premium styled */}
                {user && (
                  <div className="max-w-md mx-auto mb-10 p-6 rounded-3xl bg-gradient-to-br from-violet-950/90 to-indigo-950/90 backdrop-blur-3xl border border-violet-500/30 shadow-2xl animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <CheckSquare className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm text-white/90 font-medium mb-1">
                          Welcome back, <span className="font-semibold text-violet-300">{user.email}</span>
                        </p>
                        <p className="text-xs text-white/70 flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin mr-2" />
                          <span>Redirecting to your workspace...</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PREMIUM CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-3xl mx-auto mb-8">
                  <Link href="/login" className="flex-1 group">
                    <button className="relative w-full px-12 py-6 text-lg font-semibold text-white rounded-2xl bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 shadow-2xl hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden border border-white/10 group-hover:border-white/20">
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer opacity-0 group-hover:opacity-30" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.2))',
                        backgroundSize: '200% 100%',
                      }}></div>

                      <span className="relative flex items-center justify-center gap-3">
                        <span>Enter Workspace</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                      </span>
                    </button>
                  </Link>

                  <Link href="/signup" className="flex-1 group">
                    <button className="relative w-full px-12 py-6 text-lg font-semibold text-white rounded-2xl bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700 shadow-2xl hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden border border-white/10 group-hover:border-white/20">
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer opacity-0 group-hover:opacity-30" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.2))',
                        backgroundSize: '200% 100%',
                      }}></div>

                      <span className="relative flex items-center justify-center gap-3">
                        <span>Get Started Free</span>
                        <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2} />
                      </span>
                    </button>
                  </Link>
                </div>

                {/* Premium Footer */}
                <div className="animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
                  <div className="flex items-center justify-center gap-6 text-white/60">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500"></div>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500"></div>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                    </div>

                    <p className="text-sm font-light tracking-wide">
                      Engineered with{' '}
                      <span className="font-semibold text-white/80">Next.js 15</span>
                      {' '}+{' '}
                      <span className="font-semibold text-white/80">FastAPI</span>
                      {' '}•{' '}
                      <span className="font-semibold text-violet-400">Premium</span>
                      {' '}design
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
