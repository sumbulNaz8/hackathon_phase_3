'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { CheckSquare, Loader2, ArrowRight, LayoutDashboard, Check, Plus, Sparkles } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-slate-900 animate-spin" strokeWidth={2} />
          <p className="text-sm text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
                <CheckSquare className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <span className="text-xl font-semibold text-slate-900">
                Todo App
              </span>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {user && (
                <div className="flex items-center gap-6">
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 py-24 lg:py-32">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px'
            }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto lg:max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-600 mb-8 border border-slate-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Craft your productivity</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4">
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Manage tasks with
                </span>{' '}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  simplicity
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto">
                The modern way to stay organized and focused. Built for professionals who value clarity over complexity.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
                {[
                  {
                    icon: Check,
                    title: 'Create Tasks',
                    description: 'Add and organize your to-dos with ease'
                  },
                  {
                    icon: Plus,
                    title: 'Custom Lists',
                    description: 'Organize your way, your rules'
                  },
                  {
                    icon: LayoutDashboard,
                    title: 'Smart Dashboard',
                    description: 'Analytics that actually matter'
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* User logged in info */}
              {user && (
                <div className="mb-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                      <Check className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-base text-slate-900 font-medium mb-1">
                        Welcome back, <span className="font-semibold text-indigo-600">{user.email}</span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Ready to continue where you left off
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                      <span>Go to Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* CTA Buttons - NOT logged in */}
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Link href="/login" className="flex-1">
                    <button className="w-full px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <button className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      Get Started Free
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Social Proof / Trust Section */}
        <section className="bg-white py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Trusted by thousands
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Join professionals who rely on Todo App every day to stay organized and productive.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-5xl mx-auto">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '500K+', label: 'Tasks Created' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support Available' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mt-16">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
                  Loved by professionals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Sarah Chen', role: 'Product Designer', company: 'Figma', text: 'Todo App helped me organize my design tasks beautifully. The clean interface keeps me focused on what matters.' },
                    { name: 'Marcus Johnson', role: 'Software Engineer', company: 'Google', text: 'Finally, a task management tool that respects my intelligence. Simple, fast, and powerful.' },
                    { name: 'Emily Rodriguez', role: 'Marketing Lead', company: 'Stripe', text: 'I\\'ve tried many todo apps, but this one nails the balance between features and simplicity.' }
                  ].map((testimonial, index) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-semibold text-indigo-600">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div>
                            <p className="text-base font-medium text-slate-900 mb-2">{testimonial.text}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-sm text-slate-600">{testimonial.role}</span>
                              <span className="text-sm font-semibold text-slate-400">• {testimonial.company}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Product</h3>
                <p className="text-sm text-slate-600">Built with Next.js 15 + FastAPI</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Company</h3>
                <p className="text-sm text-slate-600">Designed for clarity & productivity</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Legal</h3>
                <p className="text-sm text-slate-600">© 2025 Todo App. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
