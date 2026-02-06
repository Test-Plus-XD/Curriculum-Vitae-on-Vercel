'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Wave from 'react-wavify';

/**
 * RetroWave — Enlarged animated mountain range + animated wave + radar sweep.
 * Soviet retro-futuristic horizon inspired by Atomic Heart/Arknights Lone Trail.
 * Works in both light and dark modes (including CV page in dark mode).
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
      {/* Glowing horizon line — more prominent */}
      <div
        className="absolute bottom-[420px] left-0 right-0 h-[3px]"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent 5%, rgba(143,0,0,0.5) 25%, rgba(219,91,0,0.8) 50%, rgba(143,0,0,0.5) 75%, transparent 95%)'
            : 'linear-gradient(90deg, transparent 5%, rgba(143,0,0,0.2) 25%, rgba(219,91,0,0.35) 50%, rgba(143,0,0,0.2) 75%, transparent 95%)',
          boxShadow: isDark
            ? '0 0 30px rgba(219,91,0,0.5), 0 0 80px rgba(143,0,0,0.25), 0 -5px 30px rgba(219,91,0,0.15)'
            : '0 0 15px rgba(219,91,0,0.15), 0 0 40px rgba(143,0,0,0.08)',
        }}
      />

      {/* Secondary horizon glow — diffused */}
      <div
        className="absolute bottom-[415px] left-0 right-0 h-[8px]"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent 10%, rgba(143,0,0,0.15) 30%, rgba(219,91,0,0.25) 50%, rgba(143,0,0,0.15) 70%, transparent 90%)'
            : 'linear-gradient(90deg, transparent 10%, rgba(143,0,0,0.06) 30%, rgba(219,91,0,0.1) 50%, rgba(143,0,0,0.06) 70%, transparent 90%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Animated wave layer using react-wavify */}
      <div className="absolute bottom-[380px] left-0 right-0" style={{ height: '60px' }}>
        <Wave
          fill={isDark ? 'rgba(143, 0, 0, 0.12)' : 'rgba(143, 0, 0, 0.05)'}
          paused={false}
          style={{ display: 'flex', height: '60px' }}
          options={{
            height: 15,
            amplitude: 20,
            speed: 0.15,
            points: 5,
          }}
        />
      </div>
      <div className="absolute bottom-[370px] left-0 right-0" style={{ height: '50px' }}>
        <Wave
          fill={isDark ? 'rgba(219, 91, 0, 0.08)' : 'rgba(219, 91, 0, 0.035)'}
          paused={false}
          style={{ display: 'flex', height: '50px' }}
          options={{
            height: 10,
            amplitude: 15,
            speed: 0.2,
            points: 4,
          }}
        />
      </div>

      {/* Main mountain range SVG — enlarged */}
      <svg
        width="100%"
        height="440"
        viewBox="0 0 1200 440"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isDark ? 'opacity-30' : 'opacity-15'}
      >
        <defs>
          {/* Soviet red-to-orange gradient */}
          <linearGradient id="soviet-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8f0000" stopOpacity={isDark ? 0.6 : 0.35} />
            <stop offset="50%" stopColor="#db5b00" stopOpacity={isDark ? 0.5 : 0.3} />
            <stop offset="100%" stopColor="#ffa500" stopOpacity={isDark ? 0.3 : 0.2} />
          </linearGradient>

          {/* Glow filter for mountains */}
          <filter id="mountain-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>

          {/* Radar sweep gradient */}
          <radialGradient id="radar-sweep" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#8f0000" stopOpacity={isDark ? 0.2 : 0.08} />
            <stop offset="30%" stopColor="#db5b00" stopOpacity={isDark ? 0.12 : 0.05} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Radar sweep — rotating glow at bottom center */}
        <g className="animate-radar-sweep" style={{ transformOrigin: '600px 440px' }}>
          <ellipse cx="600" cy="440" rx="600" ry="300" fill="url(#radar-sweep)" opacity="0.6" />
        </g>

        {/* Horizontal grid lines (perspective illusion) — more lines, more prominent */}
        {[400, 375, 345, 310, 270, 225, 180].map((y, i) => (
          <line
            key={`hline-${i}`}
            x1="0"
            y1={y}
            x2="1200"
            y2={y}
            stroke="#8f0000"
            strokeWidth={0.5 + i * 0.4}
            opacity={(isDark ? 0.06 : 0.03) + i * (isDark ? 0.05 : 0.025)}
          />
        ))}

        {/* Vertical perspective lines radiating from center */}
        {[-400, -200, -100, 0, 100, 200, 400, 600, 800, 1000, 1100, 1200, 1400, 1600].map((x, i) => (
          <line
            key={`vline-${i}`}
            x1={600}
            y1={140}
            x2={x}
            y2={440}
            stroke="#db5b00"
            strokeWidth={0.5}
            opacity={isDark ? 0.04 : 0.02}
          />
        ))}

        {/* Constructivist angular pattern — triangular peaks (enlarged) */}
        <g transform={`translate(${-200 + offset}, 0)`}>
          {/* Main mountain range — large dramatic peaks */}
          <polygon points="0,440 100,120 200,440" fill="url(#soviet-gradient)" />
          <polygon points="150,440 280,180 410,440" fill="url(#soviet-gradient)" opacity="0.75" />
          <polygon points="340,440 500,60 660,440" fill="url(#soviet-gradient)" />
          <polygon points="580,440 700,140 820,440" fill="url(#soviet-gradient)" opacity="0.85" />
          <polygon points="750,440 900,80 1050,440" fill="url(#soviet-gradient)" />
          <polygon points="980,440 1100,160 1220,440" fill="url(#soviet-gradient)" opacity="0.65" />
          <polygon points="1180,440 1320,100 1460,440" fill="url(#soviet-gradient)" opacity="0.8" />

          {/* Secondary row (foreground, darker) */}
          <polygon points="60,440 160,240 260,440" fill="#8f0000" opacity={isDark ? 0.3 : 0.18} />
          <polygon points="280,440 420,210 560,440" fill="#db5b00" opacity={isDark ? 0.22 : 0.12} />
          <polygon points="500,440 620,250 740,440" fill="#8f0000" opacity={isDark ? 0.28 : 0.15} />
          <polygon points="700,440 850,200 1000,440" fill="#db5b00" opacity={isDark ? 0.22 : 0.12} />
          <polygon points="950,440 1080,230 1210,440" fill="#8f0000" opacity={isDark ? 0.25 : 0.12} />
          <polygon points="1200,440 1310,220 1420,440" fill="#db5b00" opacity={isDark ? 0.2 : 0.1} />

          {/* Repeating pattern for seamless loop */}
          <polygon points="1400,440 1540,120 1680,440" fill="url(#soviet-gradient)" />
        </g>

        {/* Glow line along mountain ridge */}
        <g filter="url(#mountain-glow)" transform={`translate(${-200 + offset}, 0)`}>
          <polyline
            points="0,440 100,120 200,440 280,180 410,440 500,60 660,440 700,140 820,440 900,80 1050,440 1100,160 1220,440 1320,100 1460,440"
            fill="none"
            stroke="#db5b00"
            strokeWidth="1.5"
            opacity={isDark ? 0.5 : 0.25}
          />
        </g>
      </svg>
    </div>
  );
}
