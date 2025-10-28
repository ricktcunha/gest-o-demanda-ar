/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Status dos cards
        'status-not-started': '#9CA3AF', // gray-400
        'status-in-progress': '#3B82F6', // blue-500
        'status-change': '#F59E0B', // amber-500
        'status-completed': '#10B981', // emerald-500
        
        // Alertas de prazo
        'alert-overdue': '#EF4444', // red-500
        'alert-today': '#F59E0B', // amber-500
        'alert-upcoming': '#3B82F6', // blue-500
        'alert-normal': '#6B7280', // gray-500
        
        // Interface
        'bg-primary': '#F9FAFB', // gray-50
        'text-primary': '#111827', // gray-900
        'text-secondary': '#6B7280', // gray-500
        'border-primary': '#E5E7EB', // gray-200
        'hover-primary': '#F3F4F6', // gray-100
        'accent': '#3B82F6', // blue-500
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

