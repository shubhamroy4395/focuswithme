/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6366F1',
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
        },
        accent: {
          light: '#F472B6',
          DEFAULT: '#EC4899',
          dark: '#DB2777',
        },
        neutral: {
          dark: '#0F172A',
          DEFAULT: '#1E293B',
          light: '#94A3B8',
          lightest: '#F8FAFC',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 