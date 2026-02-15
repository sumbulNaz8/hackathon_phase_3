// components/layout/Header.tsx

import { User } from '@/lib/types';
import { LogOut, Check, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  const { tokenExpiry } = useAuth();
  const router = useRouter();

  // Calculate if token is expiring soon (less than 24 hours)
  const isTokenExpiringSoon = tokenExpiry && (tokenExpiry.getTime() - Date.now()) < (24 * 60 * 60 * 1000);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 py-4 px-6 shadow-lg">
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow-primary">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gradient-primary">Todo App</h1>
            {isTokenExpiringSoon && (
              <div className="flex items-center space-x-1 text-amber-400 text-sm mt-1">
                <Clock size={14} />
                <span>Session expiring soon</span>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl shadow-glow-secondary hover:scale-102 hover:brightness-110 transition-all duration-150 active:scale-95"
            >
              <MessageSquare size={18} />
              <span className="font-semibold">AI Assistant</span>
            </button>
            <span className="text-slate-300 text-lg">Hello, <span className="text-violet-400 font-semibold">{user.name}</span></span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl shadow-glow-rose hover:scale-102 hover:brightness-110 transition-all duration-150 active:scale-95"
            >
              <LogOut size={18} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
