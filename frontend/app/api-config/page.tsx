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
    <div>
      <div>
        <h1>API Configuration Test</h1>

        <div>
          <h2>Current Configuration:</h2>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>

        <button onClick={testDirectFetch}>
          Test Direct Fetch
        </button>

        <div>
          <h2>Instructions:</h2>
          <ol>
            <li>Look at "Current Configuration" above</li>
            <li>The API URL should be: http://localhost:8000</li>
            <li>Click "Test Direct Fetch"</li>
            <li>If you see errors, take a screenshot and tell me</li>
          </ol>
        </div>

        <div>
          <h2>Guaranteed Working Credentials:</h2>
          <p>Email: working@test.com</p>
          <p>Password: test123456</p>
        </div>
      </div>
    </div>
  )
}
