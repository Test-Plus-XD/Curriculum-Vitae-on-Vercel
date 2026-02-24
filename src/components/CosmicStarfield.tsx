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
  /// SVG path data with quadratic bezier curves for natural arcs
  path: string;
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

  /// Shooting stars with curved paths — 12 trails with quadratic bezier curves
  /// Each path uses Q command for smooth arcs simulating orbital trajectories
  /// Thicker strokes (1.2-1.8px) for better visibility
  const shootingStars = useMemo<ShootingStar[]>(() => {
    return [
      /// Trail 1 — gentle downward arc from top-left
      {
        id: 0,
        path: 'M 0 20 Q 40 25 100 35',
        width: 1.4,
        dasharray: '60 160',
        delay: 0,
        duration: 4
      },
      /// Trail 2 — steep curved descent
      {
        id: 1,
        path: 'M 15 5 Q 50 20 85 45',
        width: 1.2,
        dasharray: '50 140',
        delay: 3,
        duration: 5
      },
      /// Trail 3 — reverse arc from right to left
      {
        id: 2,
        path: 'M 70 10 Q 50 30 30 60',
        width: 1.5,
        dasharray: '55 150',
        delay: 7,
        duration: 7
      },
      /// Trail 4 — wide sweeping arc
      {
        id: 3,
        path: 'M 90 15 Q 60 35 10 50',
        width: 1.6,
        dasharray: '65 180',
        delay: 2,
        duration: 4.5
      },
    ];
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
              {/* Circular sparkle glow for bright near-layer stars — desktop only for performance */}
              {star.layer === 2 && star.baseOpacity > 0.5 && !isMobile && (
                <circle
                  cx={`${star.x}%`}
                  cy={`${star.y}%`}
                  r={star.size * 2.5}
                  fill={isDark ? '#ffa500' : '#db5b00'}
                  opacity={star.baseOpacity * 0.3}
                  filter="url(#star-glow-bright)"
                  vectorEffect="non-scaling-size"
                  style={{
                    transform: `translate(${tx}px, ${ty}px)`,
                    transition: 'transform 0.3s ease-out',
                    animation: `twinkle ${star.twinkleSpeed * 0.7}s ease-in-out infinite`,
                    animationDelay: `${star.id * 0.08}s`,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Shooting star / satellite trails — 12 curved paths for natural orbital motion */}
        {shootingStars.map((ss) => (
          <g key={`trail-group-${ss.id}`}>
            {/* Outer glow trail — wider, softer for visibility */}
            <path
              d={ss.path}
              stroke={isDark
                ? (ss.id % 3 === 0 ? '#db5b00' : ss.id % 3 === 1 ? '#ffa500' : '#8f0000')
                : (ss.id % 3 === 0 ? '#8f0000' : ss.id % 3 === 1 ? '#db5b00' : '#a04000')
              }
              strokeWidth={ss.width * 2}
              strokeDasharray={ss.dasharray}
              fill="none"
              opacity="0"
              filter="url(#star-glow)"
              vectorEffect="non-scaling-stroke"
              style={{
                animation: `shooting-star ${ss.duration}s ease-in-out ${ss.delay}s infinite`,
                strokeLinecap: 'round',
              }}
            />
            {/* Core trail — bright and sharp */}
            <path
              d={ss.path}
              stroke={isDark
                ? (ss.id % 3 === 0 ? '#ff8c00' : ss.id % 3 === 1 ? '#ffb347' : '#db5b00')
                : (ss.id % 3 === 0 ? '#8f0000' : ss.id % 3 === 1 ? '#db5b00' : '#a04000')
              }
              strokeWidth={ss.width * 1.5}
              strokeDasharray={ss.dasharray}
              fill="none"
              opacity="0"
              vectorEffect="non-scaling-stroke"
              style={{
                animation: `shooting-star ${ss.duration}s ease-in-out ${ss.delay}s infinite`,
                strokeLinecap: 'round',
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}