/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#06205c',
          light: '#1a3470',
          dark: '#041845'
        },
        secondary: {
          DEFAULT: '#a4343a',
          light: '#b54950',
          dark: '#8a2d32'
        },
        neutral: {
          DEFAULT: '#e6e6e6',
          light: '#f0f0f0',
          dark: '#cccccc'
        }
      },
      borderRadius: {
        none: '0'
      }
    },
  },
  plugins: [],
};