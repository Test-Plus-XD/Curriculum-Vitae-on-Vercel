'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  type: 'star' | 'dot' | 'diamond' | 'sickle' | 'gear';
}

/**
 * SovietParticles — Floating red/orange particles for ambient atmosphere.
 * Now includes additional Soviet-themed shapes (sickle, gear).
 * Works in both light and dark modes on non-CV pages.
 * In dark mode, also visible on the CV page.
 * Hidden on print.
 */
export default function SovietParticles() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 10,
      type: (['star', 'dot', 'diamond', 'sickle', 'gear'] as const)[i % 5],
    }));
  }, []);

  if (!mounted) return null;

  // Check if on CV landing page
  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage && resolvedTheme !== 'dark') return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="print:hidden fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-0"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.type === 'star' && (
            <svg viewBox="0 0 10 10" className="w-full h-full">
              <polygon
                points="5,0 6,3.5 10,4 7,6.5 8,10 5,8 2,10 3,6.5 0,4 4,3.5"
                fill="#8f0000"
                opacity={isDark ? 0.5 : 0.25}
              />
            </svg>
          )}
          {p.type === 'dot' && (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, rgba(219,91,0,0.6) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(219,91,0,0.3) 0%, transparent 70%)',
              }}
            />
          )}
          {p.type === 'diamond' && (
            <svg viewBox="0 0 10 10" className="w-full h-full">
              <polygon
                points="5,0 10,5 5,10 0,5"
                fill="#db5b00"
                opacity={isDark ? 0.45 : 0.22}
              />
            </svg>
          )}
          {p.type === 'sickle' && (
            <svg viewBox="0 0 10 10" className="w-full h-full">
              <path
                d="M5,1 A4,4 0 1,1 1,5 A2.5,2.5 0 0,0 5,1"
                fill="#8f0000"
                opacity={isDark ? 0.45 : 0.2}
              />
            </svg>
          )}
          {p.type === 'gear' && (
            <svg viewBox="0 0 10 10" className="w-full h-full" style={{ animation: `slow-rotate ${p.duration * 2}s linear infinite` }}>
              <circle cx="5" cy="5" r="2" fill="none" stroke="#db5b00" strokeWidth="1" opacity={isDark ? 0.45 : 0.22} />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <line
                  key={angle}
                  x1="5"
                  y1="5"
                  x2={5 + 4 * Math.cos((angle * Math.PI) / 180)}
                  y2={5 + 4 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#db5b00"
                  strokeWidth="0.5"
                  opacity={isDark ? 0.4 : 0.2}
                />
              ))}
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
