'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would authenticate here
    // For now, just redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3E2723] p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#FFC107]">Login</h1>
          <p className="mt-2 text-[#BCAAA4]">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#BCAAA4]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-[#5D4037] border border-[#BCAAA4] rounded-md shadow-sm focus:outline-none focus:ring-[#FFC107] focus:border-[#FFC107] text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#BCAAA4]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-[#5D4037] border border-[#BCAAA4] rounded-md shadow-sm focus:outline-none focus:ring-[#FFC107] focus:border-[#FFC107] text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#FFC107] text-[#3E2723] font-bold rounded-md hover:bg-[#FFE082] transition-colors"
            >
              Login
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm text-[#BCAAA4]">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-[#FFC107] hover:text-[#FFE082]">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}