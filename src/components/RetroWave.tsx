'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * SovietGeometric — Angular constructivist pattern for Soviet retro-futuristic aesthetic
 * Enhanced with glowing horizon line, radar sweep, and taller mountain range.
 * Works in both light and dark modes on non-CV pages.
 * In dark mode, also visible on the CV page.
 * Hidden on print.
 */
export default function RetroWave() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Slow horizontal drift animation
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 0.3) % 200);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // Check if on CV landing page
  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;

  // Only show on CV page in dark mode; show on all other pages in both modes
  if (isCvPage && resolvedTheme !== 'dark') return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="print:hidden fixed bottom-0 left-0 right-0 pointer-events-none z-0 overflow-hidden">
      {/* Glowing horizon line */}
      <div
        className="absolute bottom-[280px] left-0 right-0 h-[2px]"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent 5%, rgba(143,0,0,0.4) 30%, rgba(219,91,0,0.6) 50%, rgba(143,0,0,0.4) 70%, transparent 95%)'
            : 'linear-gradient(90deg, transparent 5%, rgba(143,0,0,0.15) 30%, rgba(219,91,0,0.25) 50%, rgba(143,0,0,0.15) 70%, transparent 95%)',
          boxShadow: isDark
            ? '0 0 20px rgba(219,91,0,0.3), 0 0 60px rgba(143,0,0,0.15)'
            : '0 0 10px rgba(219,91,0,0.1)',
        }}
      />

      {/* Main mountain range SVG */}
      <svg
        width="100%"
        height="300"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isDark ? 'opacity-20' : 'opacity-10'}
      >
        <defs>
          {/* Soviet red-to-orange gradient */}
          <linearGradient id="soviet-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8f0000" stopOpacity={isDark ? 0.5 : 0.3} />
            <stop offset="50%" stopColor="#db5b00" stopOpacity={isDark ? 0.4 : 0.25} />
            <stop offset="100%" stopColor="#ffa500" stopOpacity={isDark ? 0.25 : 0.15} />
          </linearGradient>

          {/* Glow filter for mountains */}
          <filter id="mountain-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>

          {/* Radar sweep gradient */}
          <radialGradient id="radar-sweep" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#8f0000" stopOpacity={isDark ? 0.15 : 0.06} />
            <stop offset="30%" stopColor="#db5b00" stopOpacity={isDark ? 0.08 : 0.03} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Radar sweep — rotating glow at bottom center */}
        <g className="animate-radar-sweep" style={{ transformOrigin: '600px 300px' }}>
          <ellipse cx="600" cy="300" rx="600" ry="200" fill="url(#radar-sweep)" opacity="0.5" />
        </g>

        {/* Horizontal grid lines (perspective illusion) */}
        {[260, 240, 215, 185, 150].map((y, i) => (
          <line
            key={`hline-${i}`}
            x1="0"
            y1={y}
            x2="1200"
            y2={y}
            stroke="#8f0000"
            strokeWidth={0.5 + i * 0.3}
            opacity={(isDark ? 0.05 : 0.03) + i * (isDark ? 0.04 : 0.02)}
          />
        ))}

        {/* Constructivist angular pattern — triangular peaks */}
        <g transform={`translate(${-200 + offset}, 0)`}>
          {/* Main mountain range — large dramatic peaks */}
          <polygon points="0,300 80,100 160,300" fill="url(#soviet-gradient)" />
          <polygon points="120,300 220,140 320,300" fill="url(#soviet-gradient)" opacity="0.7" />
          <polygon points="280,300 400,60 520,300" fill="url(#soviet-gradient)" />
          <polygon points="460,300 560,110 660,300" fill="url(#soviet-gradient)" opacity="0.8" />
          <polygon points="600,300 720,80 840,300" fill="url(#soviet-gradient)" />
          <polygon points="780,300 880,130 980,300" fill="url(#soviet-gradient)" opacity="0.6" />
          <polygon points="940,300 1060,90 1180,300" fill="url(#soviet-gradient)" opacity="0.75" />

          {/* Secondary row (foreground, darker) */}
          <polygon points="60,300 130,180 200,300" fill="#8f0000" opacity={isDark ? 0.25 : 0.15} />
          <polygon points="220,300 330,160 440,300" fill="#db5b00" opacity={isDark ? 0.18 : 0.1} />
          <polygon points="400,300 490,190 580,300" fill="#8f0000" opacity={isDark ? 0.22 : 0.12} />
          <polygon points="560,300 680,150 800,300" fill="#db5b00" opacity={isDark ? 0.18 : 0.1} />
          <polygon points="760,300 860,175 960,300" fill="#8f0000" opacity={isDark ? 0.2 : 0.1} />
          <polygon points="960,300 1040,170 1120,300" fill="#db5b00" opacity={isDark ? 0.16 : 0.08} />

          {/* Repeating pattern for seamless loop */}
          <polygon points="1140,300 1260,100 1380,300" fill="url(#soviet-gradient)" />
        </g>

        {/* Glow line along mountain ridge */}
        <g filter="url(#mountain-glow)" transform={`translate(${-200 + offset}, 0)`}>
          <polyline
            points="0,300 80,100 160,300 220,140 320,300 400,60 520,300 560,110 660,300 720,80 840,300 880,130 980,300 1060,90 1180,300"
            fill="none"
            stroke="#db5b00"
            strokeWidth="1"
            opacity={isDark ? 0.4 : 0.2}
          />
        </g>
      </svg>
    </div>
  );
}
