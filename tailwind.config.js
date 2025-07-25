/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3A86FF',
        'background': '#F5F7FA',
        'navbar': '#2C3E50',
        'header-text': '#222',
        'subtitle-text': '#555',
        'button-blue': '#3A86FF',
        'report-button-red': '#FF595E',
        'footer': '#ECECEC',
        'dropdown-background': '#FFFFFF',
        'dropdown-hover': '#F2F2F2',
      },
    },
  },
  plugins: [],
}

