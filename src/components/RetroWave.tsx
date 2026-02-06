'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * SovietGeometric — Angular constructivist pattern for Soviet retro-futuristic aesthetic
 * Inspired by 1960s Soviet space age graphics
 * Only visible in dark mode, hidden on print
 */
export default function RetroWave() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Slow horizontal drift animation
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 0.5) % 200);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch + only show in dark mode
  if (!mounted || resolvedTheme !== 'dark') return null;

  return (
    <div className="print:hidden fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-15 overflow-hidden">
      <svg
        width="100%"
        height="200"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soviet red-to-orange gradient */}
          <linearGradient id="soviet-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8f0000" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#db5b00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffa500" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Constructivist angular pattern — triangular peaks */}
        <g transform={`translate(${-200 + offset}, 0)`}>
          {/* First row of triangles */}
          <polygon points="0,200 100,80 200,200" fill="url(#soviet-gradient)" />
          <polygon points="200,200 300,120 400,200" fill="url(#soviet-gradient)" opacity="0.7" />
          <polygon points="400,200 500,60 600,200" fill="url(#soviet-gradient)" />
          <polygon points="600,200 700,100 800,200" fill="url(#soviet-gradient)" opacity="0.8" />
          <polygon points="800,200 900,90 1000,200" fill="url(#soviet-gradient)" />
          <polygon points="1000,200 1100,110 1200,200" fill="url(#soviet-gradient)" opacity="0.6" />

          {/* Second row (offset pattern) */}
          <polygon points="100,200 150,140 200,200" fill="#8f0000" opacity="0.2" />
          <polygon points="300,200 400,130 500,200" fill="#db5b00" opacity="0.15" />
          <polygon points="500,200 600,150 700,200" fill="#8f0000" opacity="0.2" />
          <polygon points="700,200 850,120 1000,200" fill="#db5b00" opacity="0.15" />

          {/* Repeating pattern for seamless loop */}
          <polygon points="1200,200 1300,80 1400,200" fill="url(#soviet-gradient)" />
        </g>

        {/* Horizontal constructivist lines */}
        <line x1="0" y1="150" x2="1200" y2="150" stroke="#8f0000" strokeWidth="1" opacity="0.2" />
        <line x1="0" y1="120" x2="1200" y2="120" stroke="#db5b00" strokeWidth="0.5" opacity="0.15" />
      </svg>
    </div>
  );
}
