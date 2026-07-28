/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary — Zaposli.ba Orange (#F97316)
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        brand: {
          orange: '#f97316',
          'orange-dark': '#ea580c',
          amber: '#f59e0b',
          emerald: '#10b981',
          'emerald-dark': '#059669',
          red: '#ef4444',
          purple: '#8b5cf6',
        },
        // Brand dark navy (#021117)
        ink: {
          DEFAULT: '#021117',
          950: '#021117',
          900: '#04191f',
          800: '#062630',
          700: '#0a3542',
          600: '#10485a',
        },
        // Brand grays (#687280 / #E5E7EB / #F0FAFC)
        steel: {
          DEFAULT: '#687280',
          600: '#687280',
          500: '#7d8794',
          400: '#98a1ac',
        },
        mist: '#e5e7eb',
        cloud: '#f0fafc',
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        navy: {
          800: '#062630',
          900: '#04191f',
          950: '#021117',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #021117 0%, #062630 55%, #0a3542 100%)',
        'gradient-cta': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'gradient-brand': 'linear-gradient(135deg, #fbbf24 0%, #f97316 55%, #ea580c 100%)',
        'gradient-card': 'linear-gradient(135deg, #f0fafc 0%, #fff7ed 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'gradient-ink': 'linear-gradient(135deg, #062630 0%, #021117 100%)',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(249, 115, 22, 0.18)',
        'glow-orange': '0 0 30px rgba(249, 115, 22, 0.25)',
        'glow-sm': '0 4px 20px rgba(2, 17, 23, 0.08)',
        'card': '0 4px 6px -1px rgba(2, 17, 23, 0.05), 0 10px 15px -3px rgba(2, 17, 23, 0.05)',
        'card-hover': '0 20px 40px -12px rgba(2, 17, 23, 0.14)',
        'float': '0 20px 60px -15px rgba(2, 17, 23, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
