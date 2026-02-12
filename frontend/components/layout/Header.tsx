// components/layout/Header.tsx

import { User } from '@/lib/types';
import { LogOut, CheckSquare } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 py-4 px-6 shadow-lg">
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow-primary">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-primary">Todo App</h1>
        </div>

        {user && (
          <div className="flex items-center space-x-6">
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
