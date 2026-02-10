// components/layout/Header.tsx

import { User } from '@/lib/types';
import { LogOut, CheckSquare } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-brown-dark to-brown-medium py-5 px-6 shadow-elegant">
      <div className="container mx-auto max-w-4xl flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gold-medium/20 backdrop-blur-sm elegant-border">
            <CheckSquare className="w-10 h-10 text-gold-medium" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Todo App</h1>
        </div>

        {user && (
          <div className="flex items-center space-x-6">
            <span className="text-cream font-medium text-lg text-subtle">Hello, <span className="text-gold-light font-semibold">{user.name}</span></span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-error to-red-600 text-white rounded-xl hover:from-red-600 hover:to-error transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-105"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};