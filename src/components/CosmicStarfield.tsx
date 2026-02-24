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
  curve: number;
  width: number;
  dasharray: string;
  delay: number;
  duration: number;
}

/**
 * CosmicStarfield — Interactive parallax star field inspired by
 * Reverse:1999 Cosmic Overture's warped starry grids and Arknights Lone Trail's
 * starry voids. Reduced star count for performance, increased shooting star trails
 * with curved paths for more natural orbital trajectories.
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

  /// Star count reduced to 35 for better GPU performance
  /// Each star has depth layering for parallax scrolling effect
  const stars = useMemo<Star[]>(() => {
    const count = isMobile ? 18 : 35;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.3 + Math.random() * 0.8,
      baseOpacity: 0.08 + Math.random() * 0.3,
      twinkleSpeed: 1.5 + Math.random() * 6,
      layer: i % 3,
    }));
  }, [isMobile]);

  /// Nebulae — pulsing coloured fog for cosmic atmosphere
  const nebulae = useMemo<Nebula[]>(() => {
    const colors = ['#8f0000', '#db5b00', '#ffa500', '#6b0000', '#ff7700'];
    return Array.from({ length: isMobile ? 1 : 2 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 5 + Math.random() * 90,
      rx: 80 + Math.random() * 140,
      ry: 50 + Math.random() * 80,
      rotation: Math.random() * 360,
      color: colors[i % 5],
      opacity: 0.008 + Math.random() * 0.015,
      pulseSpeed: 6 + Math.random() * 8,
    }));
  }, [isMobile]);

  /// Cosmic orbital rings — warped elliptical paths inspired by Reverse:1999
  const cosmicRings = useMemo<CosmicRing[]>(() => {
    return Array.from({ length: isMobile ? 0 : 1 }, (_, i) => ({
      id: i,
      cx: 20 + Math.random() * 60,
      cy: 20 + Math.random() * 60,
      r: 80 + i * 60,
      rotation: Math.random() * 360,
      speed: 40 + i * 20,
      color: i === 0 ? '#8f0000' : '#db5b00',
    }));
  }, [isMobile]);

  /// Shooting-star trails keep 53971b9 base set with subtle curved-arc variation
  const shootingStars = useMemo<ShootingStar[]>(() => {
    const baseTrails: ShootingStar[] = [
      { id: 0, x1: '0%', y1: '20%', x2: '100%', y2: '35%', curve: -5, width: 0.8, dasharray: '200', delay: 0, duration: 8 },
      { id: 1, x1: '15%', y1: '5%', x2: '85%', y2: '45%', curve: -4, width: 0.5, dasharray: '150', delay: 3, duration: 10 },
      { id: 2, x1: '70%', y1: '10%', x2: '30%', y2: '60%', curve: 5, width: 0.6, dasharray: '180', delay: 7, duration: 14 },
      { id: 3, x1: '90%', y1: '15%', x2: '10%', y2: '50%', curve: 6, width: 0.7, dasharray: '220', delay: 2, duration: 9 },
      { id: 4, x1: '5%', y1: '40%', x2: '80%', y2: '70%', curve: -3, width: 0.4, dasharray: '160', delay: 5, duration: 12 },
      { id: 5, x1: '60%', y1: '5%', x2: '20%', y2: '35%', curve: 4, width: 0.5, dasharray: '140', delay: 8, duration: 11 },
      { id: 6, x1: '40%', y1: '8%', x2: '95%', y2: '55%', curve: -6, width: 0.6, dasharray: '190', delay: 1, duration: 13 },
    ];

    const dashPresets = ['22 10 8 12 4 16', '28 12 6 10 4 14', '18 9 10 13 6 12', '24 11 7 9 5 16'];

    return baseTrails.map((trail) => {
      const durationJitter = 0.45 + Math.random() * 0.28;
      const delayJitter = Math.random() * 1.15;
      const curveJitter = -1.3 + Math.random() * 2.6;

      return {
        ...trail,
        dasharray: dashPresets[Math.floor(Math.random() * dashPresets.length)],
        curve: Number((trail.curve + curveJitter).toFixed(2)),
        width: Number((Math.max(0.16, trail.width * 0.45)).toFixed(2)),
        duration: Number((trail.duration * durationJitter).toFixed(2)),
        delay: Number((trail.delay + delayJitter).toFixed(2)),
      };
    });
  }, []);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  /// Hidden on CV landing page to maintain professional print-friendly appearance
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';
  /// On mobile, display only a subset of stars for performance optimisation
  const displayStars = isMobile ? stars.slice(0, 25) : stars;

  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden print:hidden" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="star-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.0" />
          </filter>
          <filter id="star-glow-bright">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="nebula-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </filter>
          <filter id="ring-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Nebula clouds — larger, pulsing coloured fog for cosmic atmosphere */}
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
            vectorEffect="non-scaling-size"
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
            vectorEffect="non-scaling-stroke"
            style={{
              transformOrigin: `${ring.cx}% ${ring.cy}%`,
              animation: `slow-rotate ${ring.speed}s linear infinite`,
            }}
          />
        ))}

        {/* Stars with parallax motion based on mouse position */}
        {displayStars.map((star) => {
          /// Parallax intensity varies by depth layer (far, mid, near)
          const parallaxFactor = (star.layer + 1) * (isMobile ? 2 : 8);
          const tx = mouse.x * parallaxFactor;
          const ty = mouse.y * parallaxFactor;
          const glowFilter = star.layer === 2 ? 'url(#star-glow-bright)' : 'url(#star-glow)';

          return (
            <g key={star.id} style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
              {/* Star glow — larger halo for atmospheric effect */}
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size * (star.layer === 2 ? 1.5 : 1.2)}
                fill={isDark ? '#ffa500' : '#8f0000'}
                opacity={star.baseOpacity * 0.15}
                filter={glowFilter}
                vectorEffect="non-scaling-size"
                style={{
                  transform: `translate(${tx}px, ${ty}px)`,
                  transition: 'transform 0.3s ease-out',
                  animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                  animationDelay: `${star.id * 0.08}s`,
                }}
              />
              {/* Star core — solid centre point */}
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size}
                fill={isDark
                  ? (star.layer === 0 ? '#8f0000' : star.layer === 1 ? '#db5b00' : '#ffa500')
                  : (star.layer === 0 ? '#8f0000' : star.layer === 1 ? '#a04000' : '#db5b00')
                }
                opacity={star.baseOpacity}
                vectorEffect="non-scaling-size"
                style={{
                  transform: `translate(${tx}px, ${ty}px)`,
                  transition: 'transform 0.3s ease-out',
                  animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
                  animationDelay: `${star.id * 0.08}s`,
                }}
              />
              {/* Cross glint with tiny sparkle core — avoids rectangular appearance */}
              {star.layer === 2 && star.baseOpacity > 0.5 && !isMobile && (
                <>
                  <line
                    x1={`${star.x}%`} y1={`${star.y - 0.22}%`}
                    x2={`${star.x}%`} y2={`${star.y + 0.22}%`}
                    stroke={isDark ? '#ffca62' : '#db5b00'}
                    strokeWidth="0.12"
                    strokeLinecap="round"
                    opacity={star.baseOpacity * 0.65}
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: 'transform 0.3s ease-out',
                      animation: `twinkle ${star.twinkleSpeed * 0.9}s ease-in-out infinite`,
                      animationDelay: `${star.id * 0.08}s`,
                    }}
                  />
                  <line
                    x1={`${star.x - 0.22}%`} y1={`${star.y}%`}
                    x2={`${star.x + 0.22}%`} y2={`${star.y}%`}
                    stroke={isDark ? '#ffca62' : '#db5b00'}
                    strokeWidth="0.12"
                    strokeLinecap="round"
                    opacity={star.baseOpacity * 0.65}
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: 'transform 0.3s ease-out',
                      animation: `twinkle ${star.twinkleSpeed * 0.9}s ease-in-out infinite`,
                      animationDelay: `${star.id * 0.08}s`,
                    }}
                  />
                  <circle
                    cx={`${star.x}%`}
                    cy={`${star.y}%`}
                    r={0.08}
                    fill={isDark ? '#ffd277' : '#db5b00'}
                    opacity={star.baseOpacity * 0.65}
                    style={{
                      transform: `translate(${tx}px, ${ty}px)`,
                      transition: 'transform 0.3s ease-out',
                      animation: `twinkle ${star.twinkleSpeed * 0.9}s ease-in-out infinite`,
                      animationDelay: `${star.id * 0.08}s`,
                    }}
                  />
                </>
              )}
            </g>
          );
        })}

        {/* Shooting-star trails — curved segmented arc style */}
        {shootingStars.map((ss) => {
          const x1 = parseFloat(ss.x1);
          const y1 = parseFloat(ss.y1);
          const x2 = parseFloat(ss.x2);
          const y2 = parseFloat(ss.y2);
          const cx = (x1 + x2) / 2;
          const cy = (y1 + y2) / 2 + ss.curve;
          const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

          return (
            <path
              key={`trail-${ss.id}`}
              d={path}
              fill="none"
              stroke={isDark
                ? (ss.id % 3 === 0 ? '#db5b00' : ss.id % 3 === 1 ? '#ffa500' : '#8f0000')
                : (ss.id % 3 === 0 ? '#8f0000' : ss.id % 3 === 1 ? '#db5b00' : '#a04000')
              }
              strokeWidth={ss.width}
              strokeDasharray={ss.dasharray}
              opacity="0"
              vectorEffect="non-scaling-stroke"
              style={{ animation: `shooting-star ${ss.duration}s ease-in-out ${ss.delay}s infinite`, strokeLinecap: 'round' }}
            />
          );
        })}
      </svg>
    </div>
  );
}