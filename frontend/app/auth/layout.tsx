'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </div>
    </div>
  );
}
