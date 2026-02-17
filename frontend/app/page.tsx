'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #8B6914 0, #8B6914 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Ultra Luxury Decorative Elements */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-amber-400/15 to-amber-300/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-amber-300/15 to-amber-200/15 rounded-full blur-3xl animate-float stagger-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-400/8 to-amber-300/8 rounded-full blur-3xl" />

      {/* Floating Diamonds */}
      <div className="absolute top-[10%] left-[8%] text-6xl animate-bounce stagger-1 opacity-60">💎</div>
      <div className="absolute top-[15%] right-[12%] text-5xl animate-bounce stagger-2 opacity-60">💎</div>
      <div className="absolute bottom-[25%] left-[15%] text-4xl animate-bounce stagger-3 opacity-60">💎</div>

      {/* Diamond Luxury Main Content */}
      <div className="glass-card p-16 md:p-24 max-w-6xl w-full text-center relative z-10 fade-in-up">
        {/* Diamond Logo with Glow */}
        <div className="w-40 h-40 mx-auto mb-12 rounded-[2.5rem] bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 flex items-center justify-center shadow-2xl shadow-amber-300/60 animate-float luxury-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 to-transparent animate-pulse" />
          <span className="text-8xl relative z-10">💎</span>
        </div>

        {/* Ultra Luxury Heading */}
        <h1 className="mb-10 animate-float stagger-1 text-7xl md:text-8xl font-display font-black heading-glow heading-shimmer" data-text="Todo App">
          Todo App
        </h1>

        {/* Premium Subtitle */}
        <p className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-deep-brown via-amber-700 to-amber-600 mb-20 font-heading font-bold fade-in-up stagger-2 text-luxury-shadow">
          Experience Ultra Luxury Task Management
        </p>

        {/* Diamond CTA Buttons - Using Link for faster navigation */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center fade-in-up stagger-3">
          <Link
            href="/signup"
            onClick={handleClick}
            className="btn-primary text-xl shadow-2xl hover:shadow-amber-300/60 premium-border inline-flex items-center justify-center"
          >
            {clicked ? 'Loading...' : 'Get Started Free'}
            <span className="text-3xl ml-2">→</span>
          </Link>
        </div>

        {/* Hero Robot Section */}
        <div className="my-20 flex flex-col items-center justify-center fade-in-up">
          <div className="relative">
            {/* Glow Effect Behind Robot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 md:w-[500px] md:h-[500px] bg-gradient-to-br from-amber-400/20 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Robot Body */}
            <div className="relative animate-float" style={{ animationDuration: '3s' }}>
              {/* Robot Head */}
              <div className="relative mb-6">
                {/* Antenna */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-20">
                  <div className="w-3 h-14 bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-full shadow-xl" style={{
                    boxShadow: '0 6px 12px rgba(139, 105, 20, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                  }}></div>
                  <div className="w-3 h-14 bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-full shadow-xl" style={{
                    boxShadow: '0 6px 12px rgba(139, 105, 20, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                  }}></div>
                </div>

                {/* Robot Face - Large */}
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-[3.5rem] bg-gradient-to-br from-amber-300 via-amber-200 to-amber-100 border-[8px] border-amber-700 flex flex-col items-center justify-center mx-auto relative overflow-hidden" style={{
                  boxShadow: '0 25px 70px rgba(139, 105, 20, 0.6), inset 0 15px 35px rgba(255, 255, 255, 0.7), inset 0 -15px 35px rgba(139, 105, 20, 0.4)'
                }}>
                  {/* 3D Highlight overlay */}
                  <div className="absolute inset-0 rounded-[3.5rem]" style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, transparent 45%, rgba(139, 105, 20, 0.25) 100%)',
                    pointerEvents: 'none'
                  }}></div>

                  {/* Screen/Display Area */}
                  <div className="w-56 h-40 md:w-72 md:h-48 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-3xl border-[6px] border-amber-600 flex flex-col items-center justify-center gap-4 relative overflow-hidden" style={{
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 5px 15px rgba(255, 255, 255, 0.1), inset 0 -5px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    {/* Screen Glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/10 to-blue-400/10 animate-pulse"></div>

                    {/* Eyes - Animated */}
                    <div className="flex gap-8 relative z-10">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 animate-pulse shadow-lg shadow-cyan-400/50" style={{
                        animationDelay: '0s',
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.8), inset 0 3px 6px rgba(255, 255, 255, 0.5)'
                      }}></div>
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 animate-pulse shadow-lg shadow-cyan-400/50" style={{
                        animationDelay: '0.5s',
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.8), inset 0 3px 6px rgba(255, 255, 255, 0.5)'
                      }}></div>
                    </div>

                    {/* Smile Display */}
                    <div className="w-40 h-8 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent rounded-full relative z-10 animate-pulse"></div>
                  </div>

                  {/* Cheeks */}
                  <div className="absolute bottom-12 left-12 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-12 right-12 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full opacity-60" style={{ animationDelay: '0.3s' }}></div>
                </div>

                {/* Ears */}
                <div className="absolute top-24 -left-8 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-amber-200 rounded-full border-[5px] border-amber-700 shadow-xl" style={{
                  boxShadow: '0 8px 20px rgba(139, 105, 20, 0.6), inset 0 3px 8px rgba(255, 255, 255, 0.6)'
                }}></div>
                <div className="absolute top-24 -right-8 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-amber-200 rounded-full border-[5px] border-amber-700 shadow-xl" style={{
                  boxShadow: '0 8px 20px rgba(139, 105, 20, 0.6), inset 0 3px 8px rgba(255, 255, 255, 0.6)'
                }}></div>
              </div>

              {/* Robot Body */}
              <div className="w-64 h-32 md:w-80 md:h-40 bg-gradient-to-br from-amber-400 to-amber-300 rounded-[2.5rem] border-[6px] border-amber-700 mx-auto relative flex items-center justify-center" style={{
                boxShadow: '0 15px 40px rgba(139, 105, 20, 0.5), inset 0 8px 20px rgba(255, 255, 255, 0.6)'
              }}>
                {/* Body Panel */}
                <div className="w-48 h-24 md:w-60 md:h-28 bg-gradient-to-br from-amber-100 to-white rounded-2xl border-[4px] border-amber-600 flex items-center justify-center" style={{
                  boxShadow: 'inset 0 4px 10px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="text-6xl animate-bounce">🤖</div>
                </div>
              </div>

              {/* Arms - Waving */}
              <div className="flex justify-center gap-8 mt-6">
                <div className="w-10 h-28 md:w-12 md:h-32 bg-gradient-to-b from-amber-500 to-amber-400 rounded-full border-[5px] border-amber-700 animate-wave shadow-xl" style={{
                  boxShadow: '0 10px 25px rgba(139, 105, 20, 0.6), inset 0 3px 8px rgba(255, 255, 255, 0.5)'
                }}></div>
                <div className="w-10 h-28 md:w-12 md:h-32 bg-gradient-to-b from-amber-500 to-amber-400 rounded-full border-[5px] border-amber-700 animate-wave shadow-xl" style={{
                  animationDelay: '0.3s',
                  boxShadow: '0 10px 25px rgba(139, 105, 20, 0.6), inset 0 3px 8px rgba(255, 255, 255, 0.5)'
                }}></div>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="mt-10 relative z-10">
              <div className="bg-white border-[5px] border-amber-700 rounded-3xl px-10 py-5 shadow-2xl relative" style={{
                boxShadow: '0 10px 30px rgba(139, 105, 20, 0.5)'
              }}>
                <p className="text-deep-brown font-black text-2xl md:text-3xl">
                  Let's organize your tasks! 🎯
                </p>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-7 h-7 bg-amber-700 rotate-45" style={{
                  boxShadow: '0 5px 15px rgba(139, 105, 20, 0.3)'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="my-20 grid grid-cols-3 gap-8 fade-in-up">
          <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-50 border-[4px] border-amber-600 shadow-xl hover:scale-105 transition-transform">
            <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-2">10K+</div>
            <div className="text-lg md:text-xl font-bold text-amber-900">Active Users</div>
          </div>
          <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-50 border-[4px] border-amber-600 shadow-xl hover:scale-105 transition-transform">
            <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-2">1M+</div>
            <div className="text-lg md:text-xl font-bold text-amber-900">Tasks Created</div>
          </div>
          <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-50 border-[4px] border-amber-600 shadow-xl hover:scale-105 transition-transform">
            <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-2">99%</div>
            <div className="text-lg md:text-xl font-bold text-amber-900">Satisfaction</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 fade-in-up stagger-4">
          <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md border-[4px] border-amber-600 hover:shadow-2xl hover:shadow-amber-400/40 hover:scale-105 transition-all duration-500" style={{
            boxShadow: '0 8px 24px rgba(139, 105, 20, 0.3)'
          }}>
            <div className="text-7xl mb-6">💎</div>
            <h3 className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-4">Diamond Design</h3>
            <p className="text-deep-brown/80 text-lg font-semibold">Ultra-premium interface</p>
          </div>
          <div className="text-center p-10 rounded-3xl backdrop-blur-md border-[4px] hover:shadow-2xl hover:scale-105 transition-all duration-500" style={{
            background: 'linear-gradient(135deg, #d4a543 0%, #e8c87a 100%)',
            borderColor: '#b8860b',
            boxShadow: '0 8px 24px rgba(139, 105, 20, 0.4)'
          }}>
            <div className="text-7xl mb-6">🤖</div>
            <h3 className="font-display font-black text-3xl mb-4" style={{ color: '#000000' }}>AI Assistant</h3>
            <p className="text-black/90 text-lg font-semibold">Natural language commands</p>
          </div>
          <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md border-[4px] border-amber-600 hover:shadow-2xl hover:shadow-amber-400/40 hover:scale-105 transition-all duration-500" style={{
            boxShadow: '0 8px 24px rgba(139, 105, 20, 0.3)'
          }}>
            <div className="text-7xl mb-6">⚡</div>
            <h3 className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-4">Lightning Fast</h3>
            <p className="text-deep-brown/80 text-lg font-semibold">Instant sync and updates</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t-[3px] border-amber-200">
          <div className="text-center">
            <p className="text-lg font-bold text-amber-900 mb-4">Made with 💎 for productive people</p>
            <p className="mt-6 text-sm text-amber-700">© 2025 Todo App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
