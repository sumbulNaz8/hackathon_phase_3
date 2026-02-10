'use client'

import { useState } from 'react'
import { useEffect } from 'react'

export default function ApiConfigPage() {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    // Show what API URL the frontend is using
    setConfig({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      nodeEnv: process.env.NODE_ENV,
      // Try a direct fetch test
      fetchTest: 'Click button below'
    })
  }, [])

  const testDirectFetch = async () => {
    const results: any = { config: process.env.NEXT_PUBLIC_API_URL, tests: [] }

    // Test 1: Simple fetch
    try {
      const res = await fetch('http://localhost:8000/health')
      const data = await res.json()
      results.tests.push({ test: 'Health Check', status: 'SUCCESS', data })
    } catch (e: any) {
      results.tests.push({ test: 'Health Check', status: 'FAILED', error: e.message })
    }

    // Test 2: Login with exact credentials
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">API Configuration Test</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Current Configuration:</h2>
          <pre className="bg-black p-4 rounded overflow-x-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        <button
          onClick={testDirectFetch}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold mb-6"
        >
          Test Direct Fetch
        </button>

        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
          <h2 className="font-bold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Look at "Current Configuration" above</li>
            <li>The API URL should be: http://localhost:8000</li>
            <li>Click "Test Direct Fetch"</li>
            <li>If you see errors, take a screenshot and tell me</li>
          </ol>
        </div>

        <div className="mt-6 bg-blue-900 border border-blue-600 rounded-lg p-4">
          <h2 className="font-bold mb-2">Guaranteed Working Credentials:</h2>
          <p>Email: <code className="bg-black px-2 py-1 rounded">working@test.com</code></p>
          <p>Password: <code className="bg-black px-2 py-1 rounded">test123456</code></p>
        </div>
      </div>
    </div>
  )
}
