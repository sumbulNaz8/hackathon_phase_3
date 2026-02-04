module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'espresso-brown': '#2C1810',
        'light-cream': '#FFFDF5',
        'golden-yellow': '#FFC107',
        'warm-toffee': '#5D4037',
        'ivory-white': '#FFFFFF',
        'rich-brown': '#3E2723',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(255,193,7,0.6)',
        'golden-glow': '0 0 15px rgba(255, 193, 7, 0.5), 0 0 5px rgba(255, 193, 7, 0.8)',
        'glow-green': '0 0 30px rgba(102,187,106,0.6)',
        'glow-red': '0 0 30px rgba(239,83,80,0.6)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0,0,0,0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37), inset 0 0 20px rgba(255, 193, 7, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,193,7,0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255,193,7,0.8)' },
        },
      }
    },
  },
  plugins: [],
}
