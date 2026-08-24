/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        ink: '#090909',
        panel: '#111111',
        gold: { 300: '#e8cf91', 400: '#d4af62', 500: '#b99042' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: { glow: '0 20px 60px rgba(185, 144, 66, 0.10)' },
    },
  },
  plugins: [],
}
