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
        soviet: {
          red: "#8f0000",        // Deep Soviet red
          orange: "#db5b00",     // Warm orange-red
          beige: "#e3d5c1",      // Aged paper
          gray: "#8c8670",       // Concrete/industrial
          gold: "#ffa500",       // Space age gold
        },
      },
      fontFamily: {
        title: ["var(--font-title)", "serif"],
      },
    },
  },
  plugins: [],
};
