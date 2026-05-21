/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#eef8ff',
          100: '#d8efff',
          200: '#b4e0ff',
          300: '#7ec6ff',
          400: '#47abff',
          500: '#1e8cff',
          600: '#126fe4',
          700: '#1357ba',
          800: '#154a96',
          900: '#173f79',
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(30, 140, 255, 0.18)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
