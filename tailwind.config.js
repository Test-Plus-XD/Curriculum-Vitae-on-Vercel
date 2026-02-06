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
        neon: {
          cyan: "#06b6d4",
          purple: "#a855f7",
        },
      },
      fontFamily: {
        title: ["var(--font-title)", "serif"],
      },
    },
  },
  plugins: [],
};
