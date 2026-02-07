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
  pulseSpeed: number;
}

interface CosmicRing {
  id: number;
  cx: number;
  cy: number;
  r: number;
  rotation: number;
  speed: number;
  color: string;
}

interface ShootingStar {
  id: number;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  width: number;
  dasharray: string;
  delay: number;
  duration: number;
}

/**
 * CosmicStarfield — Interactive parallax star field inspired by
 * Reverse:1999 Cosmic Overture's warped starry grids and Arknights Lone Trail's
 * starry voids. Reduced star count for performance, increased shooting star trails.
 * Hidden on the landing CV page and print.
 */
export default function CosmicStarfield() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);

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

  /* Reduced stars — 50 instead of 120 for better mobile performance */
  const stars = useMemo<Star[]>(() => {
    const count = 50;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.6 + Math.random() * 3.5,
      baseOpacity: 0.1 + Math.random() * 0.7,
      twinkleSpeed: 1.5 + Math.random() * 6,
      layer: i % 3,
    }));
  }, []);

  /* More nebulae — 7 with pulsing */
  const nebulae = useMemo<Nebula[]>(() => {
    const colors = ['#8f0000', '#db5b00', '#ffa500', '#6b0000', '#ff7700'];
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 5 + Math.random() * 90,
      rx: 80 + Math.random() * 140,
      ry: 50 + Math.random() * 80,
      rotation: Math.random() * 360,
      color: colors[i % 5],
      opacity: 0.012 + Math.random() * 0.025,
      pulseSpeed: 6 + Math.random() * 8,
    }));
  }, []);

  /* Cosmic orbital rings — warped elliptical paths */
  const cosmicRings = useMemo<CosmicRing[]>(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      cx: 20 + Math.random() * 60,
      cy: 20 + Math.random() * 60,
      r: 80 + i * 60,
      rotation: Math.random() * 360,
      speed: 40 + i * 20,
      color: i === 0 ? '#8f0000' : i === 1 ? '#db5b00' : '#ffa500',
    }));
  }, []);

  /* Increased shooting star trails — 7 instead of 3 */
  const shootingStars = useMemo<ShootingStar[]>(() => {
    return [
      { id: 0, x1: '0%', y1: '20%', x2: '100%', y2: '35%', width: 0.8, dasharray: '200', delay: 0, duration: 8 },
      { id: 1, x1: '15%', y1: '5%', x2: '85%', y2: '45%', width: 0.5, dasharray: '150', delay: 3, duration: 10 },
      { id: 2, x1: '70%', y1: '10%', x2: '30%', y2: '60%', width: 0.6, dasharray: '180', delay: 7, duration: 14 },
      { id: 3, x1: '90%', y1: '15%', x2: '10%', y2: '50%', width: 0.7, dasharray: '220', delay: 2, duration: 9 },
      { id: 4, x1: '5%', y1: '40%', x2: '80%', y2: '70%', width: 0.4, dasharray: '160', delay: 5, duration: 12 },
      { id: 5, x1: '60%', y1: '5%', x2: '20%', y2: '35%', width: 0.5, dasharray: '140', delay: 8, duration: 11 },
      { id: 6, x1: '40%', y1: '8%', x2: '95%', y2: '55%', width: 0.6, dasharray: '190', delay: 1, duration: 13 },
    ];
  }, []);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';
  // On mobile, only show a subset of stars for performance
  const displayStars = isMobile ? stars.slice(0, 25) : stars;

  return (
    <div className="print:hidden fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="star-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="star-glow-bright">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
          <filter id="nebula-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </filter>
          <filter id="ring-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Nebula clouds — larger, pulsing coloured fog */}
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
            style={{
              animation: `twinkle ${n.pulseSpeed}s ease-in-out infinite`,
              animationDelay: `${n.id * 1.2}s`,
            }}
          />
        ))}

        {/* Cosmic orbital rings — Reverse:1999 style warped orbital paths */}
        {isDark && cosmicRings.map((ring) => (
          <ellipse
            key={`ring-${ring.id}`}
            cx={`${ring.cx}%`}
            cy={`${ring.cy}%`}
            rx={ring.r}
            ry={ring.r * 0.3}
            fill="none"
            stroke={ring.color}
            strokeWidth="0.5"
            opacity="0.12"
            strokeDasharray="6 12"
            filter="url(#ring-glow)"
            style={{
              transformOrigin: `${ring.cx}% ${ring.cy}%`,
              animation: `slow-rotate ${ring.speed}s linear infinite`,
            }}
          />
        ))}

        {displayStars.map((star) => {
          const parallaxFactor = (star.layer + 1) * (isMobile ? 2 : 8);
          const tx = mouse.x * parallaxFactor;
          const ty = mouse.y * parallaxFactor;
          const glowFilter = star.layer === 2 ? 'url(#star-glow-bright)' : 'url(#star-glow)';

          return (
            <g key={star.id}>
              {/* Star glow — larger halo */}
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size * (star.layer === 2 ? 3.5 : 2.5)}
                fill={isDark ? '#ffa500' : '#8f0000'}
                opacity={star.baseOpacity * 0.35}
                filter={glowFilter}
                style={{
                  transform: `translate(${tx}px, ${ty}px)`,
                  transition: 'transform 0.3s ease-out',
                  animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                  animationDelay: `${star.id * 0.08}s`,
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
                  animationDelay: `${star.id * 0.08}s`,
                }}
              />
              {/* Cross sparkle for bright near-layer stars — desktop only */}
              {star.layer === 2 && star.baseOpacity > 0.5 && !isMobile && (
                <>
                  <line
                    x1={`${star.x}%`} y1={`${star.y - 0.3}%`}
                    x2={`${star.x}%`} y2={`${star.y + 0.3}%`}
                    stroke={isDark ? '#ffa500' : '#db5b00'}
                    strokeWidth="0.4"
                    opacity={star.baseOpacity * 0.5}
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: 'transform 0.3s ease-out',
                      animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                      animationDelay: `${star.id * 0.08}s`,
                    }}
                  />
                  <line
                    x1={`${star.x - 0.15}%`} y1={`${star.y}%`}
                    x2={`${star.x + 0.15}%`} y2={`${star.y}%`}
                    stroke={isDark ? '#ffa500' : '#db5b00'}
                    strokeWidth="0.4"
                    opacity={star.baseOpacity * 0.5}
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: 'transform 0.3s ease-out',
                      animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                      animationDelay: `${star.id * 0.08}s`,
                    }}
                  />
                </>
              )}
            </g>
          );
        })}

        {/* Multiple shooting star / satellite trails — 7 trails */}
        {shootingStars.map((ss) => (
          <line
            key={`trail-${ss.id}`}
            x1={ss.x1} y1={ss.y1}
            x2={ss.x2} y2={ss.y2}
            stroke={isDark
              ? (ss.id % 3 === 0 ? '#db5b00' : ss.id % 3 === 1 ? '#ffa500' : '#8f0000')
              : (ss.id % 3 === 0 ? '#8f0000' : ss.id % 3 === 1 ? '#db5b00' : '#a04000')
            }
            strokeWidth={ss.width}
            strokeDasharray={ss.dasharray}
            opacity="0"
            style={{ animation: `shooting-star ${ss.duration}s ease-in-out ${ss.delay}s infinite` }}
          />
        ))}
      </svg>
    </div>
  );
}
