module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1', // indigo-500
          light: '#818CF8',   // indigo-400
          dark: '#4F46E5',    // indigo-600
        },
        secondary: {
          DEFAULT: '#8B5CF6', // violet-500
          light: '#A78BFA',   // violet-400
          dark: '#7C3AED',    // violet-600
        },
        accent: {
          blue: '#3B82F6',    // blue-500
          cyan: '#06B6D4',    // cyan-500
          pink: '#EC4899',    // pink-500
          rose: '#F43F5E',    // rose-500
          red: '#EF4444',     // red-500
          orange: '#F97316',  // orange-500
          amber: '#F59E0B',   // amber-500
          emerald: '#10B981', // emerald-500
          teal: '#14B8A6',    // teal-500
        },
        success: '#10B981',   // emerald-500
        error: '#EF4444',     // red-500
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(99, 102, 241, 0.4)',
        'glow-secondary': '0 0 30px rgba(139, 92, 246, 0.4)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.4)',
        'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'glow-rose': '0 0 30px rgba(244, 63, 94, 0.4)',
        'glow-red': '0 0 30px rgba(239, 68, 68, 0.4)',
        'glow-orange': '0 0 30px rgba(249, 115, 22, 0.4)',
        'glow-amber': '0 0 30px rgba(245, 158, 11, 0.4)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
        'glow-teal': '0 0 30px rgba(20, 184, 166, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
