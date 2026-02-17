import { User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  const { tokenExpiry } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const isTokenExpiringSoon = tokenExpiry && (tokenExpiry.getTime() - Date.now()) < (24 * 60 * 60 * 1000);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border-b-2 border-amber-200/50 dark:border-amber-700/50 shadow-2xl shadow-amber-900/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Diamond Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 flex items-center justify-center shadow-xl shadow-amber-300/40 animate-float relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
              <span className="text-3xl relative z-10">💎</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-deep-brown via-amber-700 to-amber-600 heading-shimmer dark:from-amber-200 dark:via-amber-300 dark:to-amber-400" data-text="Todo App">
                Todo App
              </h1>
              {isTokenExpiringSoon && (
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold fade-in-up mt-0.5">
                  ⏰ Session expiring soon
                </p>
              )}
            </div>
          </div>

          {/* Diamond Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="px-6 py-3 rounded-2xl text-base font-black hover:scale-105 hover:shadow-lg flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button
              onClick={() => router.push('/chat')}
              className="px-6 py-3 rounded-2xl text-base font-black hover:scale-105 hover:shadow-lg flex items-center gap-2 transition-all duration-300"
              style={{ color: '#000000', background: 'linear-gradient(135deg, #d4a543 0%, #e8c87a 100%)' }}
            >
              <span className="text-2xl">🤖</span> AI Assistant
            </button>
          </nav>

          {/* Diamond User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-deep-brown dark:text-amber-100">{user.name}</p>
                <p className="text-xs text-deep-brown/60 dark:text-amber-200/60">{user.email}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 flex items-center justify-center text-deep-brown font-bold text-xl shadow-xl shadow-amber-300/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
                <span className="relative z-10">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-6 py-3 rounded-2xl text-sm font-bold text-rose-700 dark:text-rose-400 border-2 border-rose-400 dark:border-rose-500 hover:bg-gradient-to-r hover:from-rose-100 hover:to-rose-50 dark:hover:from-rose-900 dark:hover:to-rose-800 hover:border-rose-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
