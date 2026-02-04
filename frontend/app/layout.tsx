// app/layout.tsx

'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import '@/app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialias">
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
      </body>
    </html>
  );
}