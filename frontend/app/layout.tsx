// app/layout.tsx

'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/toast-context';
import '@/app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialias">
        <div className="min-h-screen bg-gradient-animate relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold-medium opacity-5 rounded-full blur-3xl floating-element"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light opacity-5 rounded-full blur-3xl floating-element-2"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-6xl mx-auto">
            <ToastProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ToastProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
