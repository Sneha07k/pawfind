/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, welcoming palette per PawFind UI guidelines
        primary: {
          50: '#f0f9f4',
          100: '#dbf0e3',
          400: '#4fa87e',
          500: '#358a63',
          600: '#256e4e',
        },
        accent: {
          400: '#7fb8d9',
          500: '#4f9bc4',
        },
        neutral: {
          50: '#faf8f5',
          100: '#f2ede6',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
