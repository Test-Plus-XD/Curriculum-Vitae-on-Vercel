/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          light: "#3b82f6",
          dark: "#60a5fa",
        },
      },
    },
  },
  plugins: [],
};
