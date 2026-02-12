'use client'

import { useState } from 'react'

export default function DebugTestPage() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testConnection = async () => {
    addLog('🔵 Starting connection test...')

    try {
      addLog('🔵 Test 1: Checking backend health...')
      const response = await fetch('http://localhost:8000/health')
      const data = await response.json()
      addLog(`✅ Backend health: ${data.status}`)
    } catch (error: any) {
      addLog(`❌ Health check failed: ${error.message}`)
      return
    }

    try {
      addLog('🔵 Test 2: Creating test user...')
      const signupResponse = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Debug User',
          email: 'debug@test.com',
          password: 'test123456'
        })
      })
      const signupData = await signupResponse.json()
      if (signupResponse.ok) {
        addLog(`✅ User created: ${signupData.user.email}`)
        addLog(`   Token: ${signupData.access_token.substring(0, 30)}...`)
      } else {
        addLog(`❌ Signup failed: ${signupData.detail}`)
      }
    } catch (error: any) {
      addLog(`❌ Signup error: ${error.message}`)
      return
    }

    try {
      addLog('🔵 Test 3: Testing login...')
      const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'debug@test.com',
          password: 'test123456'
        })
      })
      const loginData = await loginResponse.json()
      if (loginResponse.ok) {
        addLog(`✅ Login successful!`)
        addLog(`   User: ${loginData.user.name}`)
        const token = loginData.access_token

        addLog('🔵 Test 4: Getting current user...')
        const meResponse = await fetch('http://localhost:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const meData = await meResponse.json()
        if (meResponse.ok) {
          addLog(`✅ Get user successful!`)
          addLog(`   Name: ${meData.name}`)
          addLog(`   Email: ${meData.email}`)
        } else {
          addLog(`❌ Get user failed: ${meData.detail}`)
        }
      } else {
        addLog(`❌ Login failed: ${loginData.detail}`)
      }
    } catch (error: any) {
      addLog(`❌ Login error: ${error.message}`)
    }

    addLog('✅ All tests completed!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gradient-primary">Backend Connection Test</h1>

        <button
          onClick={testConnection}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-102 hover:brightness-110 px-6 py-3 rounded-xl font-semibold shadow-glow-cyan transition-all duration-150 active:scale-95 mb-6"
        >
          Run Tests
        </button>

        <div className="glass-card rounded-2xl p-4 font-mono text-sm h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
        </div>

        <div className="mt-4 glass-card rounded-2xl p-4">
          <h2 className="font-bold mb-2 text-slate-300">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Click "Run Tests" button</li>
            <li>Watch the logs above</li>
            <li>Tell me what errors you see in red (❌)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
