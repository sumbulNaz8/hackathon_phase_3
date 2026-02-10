'use client';

import { User } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { LogOut, CheckSquare } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-[#5D4037] shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FFC107] flex items-center gap-2">
          <CheckSquare className="w-8 h-8" />
          Todo App
        </h1>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-white">Hello, {user.name}</span>
            <Button variant="secondary" onClick={onLogout}>
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </div>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}