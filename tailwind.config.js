/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx, html}", './**/*.{js,jsx,ts,tsx, html', 
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pic01': "url('/src/images/pic01.jpg')"
      }
    },
  },
  plugins: [],
}
