/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        signal: {
          50: '#eef8ff',
          100: '#d8efff',
          200: '#b9e4ff',
          300: '#89d4ff',
          400: '#52bbff',
          500: '#2b9bfb',
          600: '#147cf0',
          700: '#0d63ce',
          800: '#114fa6',
          900: '#144483',
          950: '#112b52',
        },
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#1e293b/80',
          border: '#334155',
          chat: '#090d16',
          bubbleSelf: '#2b9bfb',
          bubbleOther: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
