module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brown-darkest': '#4E342E',  // Lighter dark brown
        'brown-dark': '#6D4C41',     // Lighter brown
        'brown-medium': '#8D6E63',   // Lighter medium brown
        'brown-light': '#A1887F',    // Lighter light brown
        'brown-lighter': '#D7CCC8',  // Lighter brown background
        'gold-dark': '#D4AF37',
        'gold-medium': '#FFC107',
        'gold-light': '#FFD54F',
        'gold-glow': '#FFE082',
        'cream': '#FFFBF5',
        success: '#66BB6A',
        error: '#EF5350',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 3s infinite',
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
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 193, 7, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 193, 7, 0.8)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(255, 193, 7, 0.6)',
        'glow-gold-strong': '0 0 50px rgba(255, 193, 7, 0.9)',
        'glow-green': '0 0 25px rgba(102, 187, 106, 0.6)',
        'glow-red': '0 0 25px rgba(239, 83, 80, 0.6)',
        'premium': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'premium-lg': '0 20px 60px rgba(0, 0, 0, 0.4)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'elegant-lg': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        'serif-display': ['Playfair Display', 'serif'],
        'sans-body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
