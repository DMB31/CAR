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
        },
        // Variables pour shadcn/ui
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "hsl(215 20.2% 65.1%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        muted: {
          DEFAULT: "hsl(210 40% 96%)",
          foreground: "hsl(215.4 16.3% 46.9%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('@tailwindcss/typography'),
  ],
} 