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
  d: string;        // SVG path data — quadratic Bezier curves for orbital arcs
  dasharray: string; // comet-tail dash pattern: long-solid → medium → short → dots
  duration: number;
  delay: number;
  opacity: number;  // --ct-opacity CSS variable value
}

/**
 * CosmicStarfield — Interactive parallax star field inspired by
 * Reverse:1999 Cosmic Overture's warped starry grids and Arknights Lone Trail's
 * starry voids. Reduced star count for performance, curved comet-trail shooting
 * stars with dot-tail effect for natural orbital trajectories.
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
  /// Slightly smaller size range (0.15–0.63) vs prior (0.30–1.10) for a subtler field
  /// Depends on pathname so stars re-scatter on every SPA navigation
  const stars = useMemo<Star[]>(() => {
    const count = isMobile ? 18 : 35;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.15 + Math.random() * 0.48,
      baseOpacity: 0.08 + Math.random() * 0.3,
      twinkleSpeed: 1.5 + Math.random() * 6,
      layer: i % 3,
    }));
  }, [isMobile, pathname]);

  /// Nebulae — pulsing coloured fog for cosmic atmosphere
  /// Re-positioned on each navigation alongside stars
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
  }, [isMobile, pathname]);

  /// Cosmic orbital rings — warped elliptical paths inspired by Reverse:1999
  /// Re-positioned on each navigation
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
  }, [isMobile, pathname]);

  /// Shooting-star comet trails — 7 variants with curved/arc-biased paths.
  /// Visual intent per variant: one connected lead line + only dot clusters at the tail (pattern sum = 1000 to avoid unintended repeats):
  ///   _______._.....
  /// Width is fixed at 0.6 for consistency; speed, arc, start point and head/tail lengths vary.
  /// The paths are designed to remain visible on mobile with `xMidYMid slice` cropping.
  const shootingStars = useMemo<ShootingStar[]>(() => [
    {
      // V0 — fast upper-left sweep, gentle arc
      id: 0,
      d: 'M 8,11 Q 38,2 94,26',
      dasharray: '330 12 1 8 1 8 1 8 1 630',
      duration: 2.2,
      delay: 0,
      opacity: 0.7,
    },
    {
      // V1 — right-to-left descending arc
      id: 1,
      d: 'M 92,9 Q 68,30 18,54',
      dasharray: '305 12 1 8 1 8 1 9 1 654',
      duration: 2.5,
      delay: 1.3,
      opacity: 0.66,
    },
    {
      // V2 — shallow center orbit, very fast
      id: 2,
      d: 'M 14,24 Q 49,14 88,35',
      dasharray: '280 11 1 8 1 8 1 8 1 681',
      duration: 1.9,
      delay: 2.7,
      opacity: 0.62,
    },
    {
      // V3 — deep curvature with long connected head
      id: 3,
      d: 'M 18,5 Q 66,50 90,30',
      dasharray: '360 14 1 9 1 9 1 9 1 595',
      duration: 2.9,
      delay: 0.8,
      opacity: 0.58,
    },
    {
      // V4 — short top-right launch into mid frame
      id: 4,
      d: 'M 60,7 Q 79,24 96,45',
      dasharray: '265 11 1 8 1 8 1 8 1 696',
      duration: 2.1,
      delay: 3.5,
      opacity: 0.65,
    },
    {
      // V5 — low orbit, right-to-left
      id: 5,
      d: 'M 86,18 Q 52,58 13,68',
      dasharray: '320 12 1 8 1 8 1 8 1 640',
      duration: 2.7,
      delay: 4.2,
      opacity: 0.61,
    },
    {
      // V6 — long lower arc across viewport
      id: 6,
      d: 'M 5,48 Q 48,30 94,60',
      dasharray: '390 15 1 9 1 9 1 9 1 564',
      duration: 3.2,
      delay: 5.1,
      opacity: 0.56,
    },
  ], []);

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
          {/* Radial gradients for star fading effect — fade from colour at centre to transparent at edge */}
          <radialGradient id="star-fade-dark" gradientUnits="objectBoundingBox" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffa500" stopOpacity="0.9" />
            <stop offset="40%"  stopColor="#db5b00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8f0000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="star-fade-light" gradientUnits="objectBoundingBox" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#8f0000" stopOpacity="0.7" />
            <stop offset="40%"  stopColor="#a04000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#db5b00" stopOpacity="0" />
          </radialGradient>
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

          return (
            <g key={star.id} style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
              {/* Star glow — wide radial-gradient halo that fades to transparent at edge */}
              <circle
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size * (star.layer === 2 ? 3.5 : 2.5)}
                fill={isDark ? 'url(#star-fade-dark)' : 'url(#star-fade-light)'}
                opacity={star.baseOpacity * 0.3}
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
                    strokeWidth="0.08"
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
                    strokeWidth="0.08"
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
                    r={0.05}
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

        {/* Shooting-star comet trails — curved quadratic Bezier paths with dot-tail dasharray.
            dashoffset travels 300 → -700 (one 1000-unit cycle), so each trail shows a single motif per pass.
            CSS class animate-comet-trail reads --ct-duration / --ct-delay / --ct-opacity. */}
        {shootingStars.map((ss) => (
          <path
            key={`trail-${ss.id}`}
            d={ss.d}
            pathLength="1000"
            fill="none"
            stroke={isDark
              ? (ss.id % 3 === 0 ? '#db5b00' : ss.id % 3 === 1 ? '#ffa500' : '#ff9933')
              : (ss.id % 3 === 0 ? '#8f0000' : ss.id % 3 === 1 ? '#db5b00' : '#a04000')
            }
            strokeWidth="0.6"
            strokeDasharray={ss.dasharray}
            strokeLinecap="round"
            opacity="0"
            vectorEffect="non-scaling-stroke"
            className="animate-comet-trail"
            style={{
              '--ct-duration': `${ss.duration}s`,
              '--ct-delay': `${ss.delay}s`,
              '--ct-opacity': `${ss.opacity}`,
            } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}
