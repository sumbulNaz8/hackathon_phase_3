// app/auth/layout.tsx

'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-medium opacity-5 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light opacity-5 rounded-full blur-3xl floating-element-2"></div>
      </div>
      
      {/* Centered Container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#3E2723',
                color: '#FFC107',
                borderRadius: '8px',
                padding: '12px 16px',
              },
            }}
          />
        </AuthProvider>
      </div>
    </div>
  );
}