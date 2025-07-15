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
        primary: { // Crimson Red
          50: '#fef3f5',
          100: '#fde6e9',
          500: '#DC143C',
          600: '#c51236',
          700: '#a6102e',
          900: '#881128',
        },
        secondary: { // Near Black
          50: '#f7f7f7',
          100: '#e3e3e3',
          500: '#1C1C1C',
          600: '#111111',
          700: '#000000',
          900: '#000000',
        },
        accent: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          500: '#a4a4a4',
          600: '#7d7d7d',
          900: '#1C1C1C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
} 