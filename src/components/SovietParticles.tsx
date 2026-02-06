'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  type: 'star' | 'dot' | 'diamond';
}

/**
 * SovietParticles — Floating red/orange particles for ambient atmosphere
 * Only visible in dark mode, hidden on print
 */
export default function SovietParticles() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 10,
      type: (['star', 'dot', 'diamond'] as const)[i % 3],
    }));
  }, []);

  if (!mounted || resolvedTheme !== 'dark') return null;

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
                opacity="0.4"
              />
            </svg>
          )}
          {p.type === 'dot' && (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(219,91,0,0.5) 0%, transparent 70%)',
              }}
            />
          )}
          {p.type === 'diamond' && (
            <svg viewBox="0 0 10 10" className="w-full h-full">
              <polygon
                points="5,0 10,5 5,10 0,5"
                fill="#db5b00"
                opacity="0.35"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
