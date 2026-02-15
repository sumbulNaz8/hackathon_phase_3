// app/dashboard/layout.tsx

'use client';

import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-animate relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-medium opacity-5 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light opacity-5 rounded-full blur-3xl floating-element-2"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
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
      </div>

      {/* ChatBot Placeholder - Chatbot will be rendered here by page.tsx */}
      <div id="chatbot-container"></div>
    </div>
  );
}