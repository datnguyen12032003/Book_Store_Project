/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        times: ['"Se"', 'Times', 'serif', 'Times New Roman'],
      },
      fontWeight: {
        thin: '100',
      },
    },
  },
  plugins: [],
}
