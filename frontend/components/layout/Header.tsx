// components/layout/Header.tsx

import { User } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { LogOut, CheckSquare } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-[#5D4037] shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-8 h-8 text-[#FFC107]" />
          <h1 className="text-xl font-bold text-[#FFC107]">Todo App</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white">Hello, {user.name}</span>
            <Button 
              variant="secondary" 
              size="md"
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};