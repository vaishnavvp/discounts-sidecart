/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#19b5c1',       // header & active toggle
          tealDark: '#0ea3ae',
          blueStrip: '#e7f4f6',  // light teal strip in Overview
          line: '#e8edf1',       // row/section borders
          bg: '#f3f5f7',         // page background
          textMuted: '#6b7280',  // gray-500
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};
