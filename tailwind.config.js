/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // React components
    './public/index.html', // Include HTML file if it uses classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
