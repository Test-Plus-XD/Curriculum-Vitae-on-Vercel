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
          warmBg: "#f5efe6",     // Light mode warm background
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
        'glow-breathe-light': {
          '0%, 100%': { textShadow: '0 0 8px rgba(143,0,0,0.15), 0 0 20px rgba(219,91,0,0.08)' },
          '50%': { textShadow: '0 0 12px rgba(143,0,0,0.22), 0 0 30px rgba(219,91,0,0.12)' },
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
        'twinkle': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        'shooting-star': {
          '0%': { opacity: '0', strokeDashoffset: '100%' },
          '5%': { opacity: '0.6' },
          '15%': { opacity: '0', strokeDashoffset: '0' },
          '100%': { opacity: '0' },
        },
        'morse-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'morse-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slow-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'telemetry-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        'aurora': {
          '0%, 100%': { backgroundPosition: '0% 0' },
          '50%': { backgroundPosition: '100% 0' },
        },
        'radar-ping': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'holo-stripe': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 40px' },
        },
        'scan-sweep-down': {
          '0%': { top: '-5%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '105%', opacity: '0' },
        },
        'holo-border-spin': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'electromagnetic-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(219, 91, 0, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(219, 91, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(219, 91, 0, 0)' },
        },
        'stamp-in': {
          '0%': { transform: 'scale(3) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(0.95) rotate(0deg)', opacity: '1' },
          '80%': { transform: 'scale(1.02) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'chromatic-aberration': {
          '0%': { textShadow: '-1px 0 #8f0000, 1px 0 #ffa500' },
          '25%': { textShadow: '1px 0 #8f0000, -1px 0 #ffa500' },
          '50%': { textShadow: '-1px 1px #8f0000, 1px -1px #ffa500' },
          '75%': { textShadow: '1px -1px #8f0000, -1px 1px #ffa500' },
          '100%': { textShadow: '-1px 0 #8f0000, 1px 0 #ffa500' },
        },
        /* ── Dada / Deconstructivist keyframes ──────────────────── */
        'dada-drift': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(var(--dada-rotate, 0deg))' },
          '25%': { transform: 'translate(3px, -2px) rotate(calc(var(--dada-rotate, 0deg) + 0.5deg))' },
          '50%': { transform: 'translate(-2px, 3px) rotate(calc(var(--dada-rotate, 0deg) - 0.3deg))' },
          '75%': { transform: 'translate(1px, -1px) rotate(calc(var(--dada-rotate, 0deg) + 0.2deg))' },
        },
        'dada-flicker': {
          '0%, 100%': { opacity: 'var(--dada-opacity, 0.3)' },
          '15%': { opacity: 'calc(var(--dada-opacity, 0.3) * 0.4)' },
          '16%': { opacity: 'var(--dada-opacity, 0.3)' },
          '45%': { opacity: 'var(--dada-opacity, 0.3)' },
          '46%': { opacity: 'calc(var(--dada-opacity, 0.3) * 0.6)' },
          '48%': { opacity: 'var(--dada-opacity, 0.3)' },
          '78%': { opacity: 'calc(var(--dada-opacity, 0.3) * 0.7)' },
          '80%': { opacity: 'var(--dada-opacity, 0.3)' },
        },
        'dada-tear-reveal': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        'soviet-pulse': 'soviet-pulse 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glow-breathe': 'glow-breathe 4s ease-in-out infinite',
        'glow-breathe-light': 'glow-breathe-light 6s ease-in-out infinite',
        'slide-accent': 'slide-accent 6s linear infinite',
        'flicker': 'flicker 8s step-end infinite',
        'corner-grow': 'corner-grow 0.3s ease-out forwards',
        'radar-sweep': 'radar-sweep 12s linear infinite',
        'float-up': 'float-up 15s linear infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'shooting-star': 'shooting-star 8s ease-in-out infinite',
        'morse-scroll': 'morse-scroll 30s linear infinite',
        'morse-fade-in': 'morse-fade-in 2s ease-out forwards',
        'slow-rotate': 'slow-rotate 60s linear infinite',
        'telemetry-blink': 'telemetry-blink 2s ease-in-out infinite',
        'aurora': 'aurora 15s ease-in-out infinite',
        'radar-ping': 'radar-ping 3s ease-in-out infinite',
        'holo-stripe': 'holo-stripe 2s linear infinite',
        'scan-sweep': 'scan-sweep-down 1.2s ease-in-out infinite',
        'holo-border': 'holo-border-spin 4s linear infinite',
        'em-pulse': 'electromagnetic-pulse 2s ease-out infinite',
        'stamp-in': 'stamp-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'chromatic': 'chromatic-aberration 0.3s steps(4) 1',
        /* ── Dada / Deconstructivist animations ───────────────── */
        'dada-drift': 'dada-drift 12s ease-in-out infinite',
        'dada-flicker': 'dada-flicker 6s step-end infinite',
        'dada-tear': 'dada-tear-reveal 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
