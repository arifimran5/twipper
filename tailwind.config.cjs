/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"],
      },
      colors: {
        primary_dark: "#1A1A1A",
        accent: "#706DFF",
      },
    },
  },
  plugins: [],
};

module.exports = config;
