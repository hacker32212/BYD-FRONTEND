/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        byd: {
          dark: '#0B0D10',
          card: '#12161F',
          silver: '#E1E4EB',
          accent: '#1890FF',
          cyan: '#00F2FE',
          gray: '#8C9099',
        },
        ink: {
          DEFAULT: '#0B0D10',
          50: '#F5F6F8',
          200: '#C9CDD6',
          400: '#8C9099',
          800: '#171B24',
          900: '#12161F',
          950: '#0B0D10',
        },
        volt: {
          DEFAULT: '#1890FF',
          soft: '#4DA9FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.25em',
        ultra: '.35em',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
};