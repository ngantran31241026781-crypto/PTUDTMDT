/** @type {import('tailwindcss').Config} */
export default {
  content: ['./Bai1.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        ink: '#202520',
        muted: '#858b84',
        line: '#e9ece7',
        green: '#466b4b',
        lime: '#d9f27d',
        canvas: '#f7f8f5',
      },
      boxShadow: {
        soft: '0 8px 32px rgba(30,42,30,.06)',
      },
    },
  },
  plugins: [],
};
