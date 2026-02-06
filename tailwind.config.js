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
      keyframes: {
        'soviet-pulse': {
          '0%, 100%': { opacity: '0.12' },
          '50%': { opacity: '0.2' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-breathe': {
          '0%, 100%': { textShadow: '0 0 20px rgba(143,0,0,0.7), 0 0 40px rgba(219,91,0,0.35)' },
          '50%': { textShadow: '0 0 30px rgba(143,0,0,0.9), 0 0 60px rgba(219,91,0,0.5), 0 0 100px rgba(143,0,0,0.2)' },
        },
        'slide-accent': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
        'corner-grow': {
          '0%': { width: '0px', height: '0px' },
          '100%': { width: '12px', height: '12px' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-10vh)', opacity: '0' },
        },
      },
      animation: {
        'soviet-pulse': 'soviet-pulse 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glow-breathe': 'glow-breathe 4s ease-in-out infinite',
        'slide-accent': 'slide-accent 6s linear infinite',
        'flicker': 'flicker 8s step-end infinite',
        'corner-grow': 'corner-grow 0.3s ease-out forwards',
        'radar-sweep': 'radar-sweep 12s linear infinite',
        'float-up': 'float-up 15s linear infinite',
      },
    },
  },
  plugins: [],
};
