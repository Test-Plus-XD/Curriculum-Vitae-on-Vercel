'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  layer: number; // 0 = far, 1 = mid, 2 = near (for parallax)
}

interface Nebula {
  id: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
  color: string;
  opacity: number;
}

/**
 * CosmicStarfield — Interactive parallax star field inspired by Soviet space-age imagery.
 * Stars respond to mouse movement with a subtle parallax effect.
 * Enhanced with nebula clouds and more stars for greater visual impact.
 * Hidden on the landing CV page and print.
 */
export default function CosmicStarfield() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMouse({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 3,
      baseOpacity: 0.15 + Math.random() * 0.6,
      twinkleSpeed: 2 + Math.random() * 6,
      layer: i % 3,
    }));
  }, []);

  const nebulae = useMemo<Nebula[]>(() => {
    const colors = ['#8f0000', '#db5b00', '#ffa500'];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 10 + Math.random() * 80,
      rx: 60 + Math.random() * 100,
      ry: 40 + Math.random() * 60,
      rotation: Math.random() * 360,
      color: colors[i % 3],
      opacity: 0.015 + Math.random() * 0.02,
    }));
  }, []);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="print:hidden fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Star glow filter */}
          <filter id="star-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          {/* Nebula blur filter */}
          <filter id="nebula-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
        </defs>

        {/* Nebula clouds — subtle coloured fog patches */}
        {isDark && nebulae.map((n) => (
          <ellipse
            key={`nebula-${n.id}`}
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            rx={n.rx}
            ry={n.ry}
            fill={n.color}
            opacity={n.opacity}
            filter="url(#nebula-blur)"
            transform={`rotate(${n.rotation} ${n.x * 10} ${n.y * 10})`}
          />
        ))}

        {stars.map((star) => {
          const parallaxFactor = (star.layer + 1) * 6;
          const tx = mouse.x * parallaxFactor;
          const ty = mouse.y * parallaxFactor;

          return (
            <g key={star.id}>
              {/* Star glow — larger halo */}
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size * 2.5}
                fill={isDark ? '#ffa500' : '#8f0000'}
                opacity={star.baseOpacity * 0.35}
                filter="url(#star-glow)"
                style={{
                  transform: `translate(${tx}px, ${ty}px)`,
                  transition: 'transform 0.3s ease-out',
                  animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                  animationDelay: `${star.id * 0.1}s`,
                }}
              />
              {/* Star core */}
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size}
                fill={isDark
                  ? (star.layer === 0 ? '#8f0000' : star.layer === 1 ? '#db5b00' : '#ffa500')
                  : (star.layer === 0 ? '#8f0000' : star.layer === 1 ? '#a04000' : '#db5b00')
                }
                opacity={star.baseOpacity}
                style={{
                  transform: `translate(${tx}px, ${ty}px)`,
                  transition: 'transform 0.3s ease-out',
                  animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                  animationDelay: `${star.id * 0.1}s`,
                }}
              />
            </g>
          );
        })}

        {/* Multiple shooting star / satellite trails */}
        <line
          x1="0%" y1="25%"
          x2="100%" y2="40%"
          stroke={isDark ? '#db5b00' : '#8f0000'}
          strokeWidth="0.8"
          opacity="0"
          className="animate-shooting-star"
        />
        <line
          x1="20%" y1="5%"
          x2="80%" y2="55%"
          stroke={isDark ? '#ffa500' : '#db5b00'}
          strokeWidth="0.5"
          opacity="0"
          style={{ animation: 'shooting-star 12s ease-in-out 4s infinite' }}
        />
      </svg>
    </div>
  );
}
