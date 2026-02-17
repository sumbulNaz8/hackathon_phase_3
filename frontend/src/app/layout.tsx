import { ReactNode } from 'react';
import { ToastProvider } from '@/context/toast-context';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
