'use client'

import { useState } from 'react'
import { useEffect } from 'react'

export default function ApiConfigPage() {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    setConfig({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      nodeEnv: process.env.NODE_ENV,
      fetchTest: 'Click button below'
    })
  }, [])

  const testDirectFetch = async () => {
    const results: any = { config: process.env.NEXT_PUBLIC_API_URL, tests: [] }

    try {
      const res = await fetch('http://localhost:8000/health')
      const data = await res.json()
      results.tests.push({ test: 'Health Check', status: 'SUCCESS', data })
    } catch (e: any) {
      results.tests.push({ test: 'Health Check', status: 'FAILED', error: e.message })
    }

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'working@test.com',
          password: 'test123456'
        })
      })
      const data = await res.json()
      results.tests.push({ test: 'Login', status: res.ok ? 'SUCCESS' : 'FAILED', response: data })
    } catch (e: any) {
      results.tests.push({ test: 'Login', status: 'ERROR', error: e.message })
    }

    setConfig(results)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gradient-primary">API Configuration Test</h1>

        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-slate-300">Current Configuration:</h2>
          <pre className="bg-slate-950 p-4 rounded-xl overflow-x-auto text-sm">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        <button
          onClick={testDirectFetch}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-102 hover:brightness-110 px-6 py-3 rounded-xl font-semibold shadow-glow-emerald transition-all duration-150 active:scale-95 mb-6"
        >
          Test Direct Fetch
        </button>

        <div className="glass-card rounded-2xl p-4 border border-amber-500/30">
          <h2 className="font-bold mb-2 text-amber-400">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Look at "Current Configuration" above</li>
            <li>The API URL should be: http://localhost:8000</li>
            <li>Click "Test Direct Fetch"</li>
            <li>If you see errors, take a screenshot and tell me</li>
          </ol>
        </div>

        <div className="mt-6 glass-card rounded-2xl p-4 border border-indigo-500/30">
          <h2 className="font-bold mb-2 text-indigo-400">Guaranteed Working Credentials:</h2>
          <p className="text-slate-300">Email: <code className="bg-slate-800 px-2 py-1 rounded text-indigo-400">working@test.com</code></p>
          <p className="text-slate-300">Password: <code className="bg-slate-800 px-2 py-1 rounded text-indigo-400">test123456</code></p>
        </div>
      </div>
    </div>
  )
}
