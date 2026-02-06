'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * SovietPropagandaPoster — Decorative constructivist geometric elements
 * placed in corners and edges, inspired by Soviet propaganda poster compositions.
 * Features rotating stars, angular brackets, and geometric accents.
 * Hidden on the landing CV page and print.
 */
export default function SovietPropagandaPoster() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="print:hidden fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {/* Top-left constructivist corner bracket — larger, more prominent */}
      <svg
        className="absolute top-16 left-4 w-20 h-20 opacity-30"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="35" y2="0" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2.5" />
        <line x1="0" y1="0" x2="0" y2="35" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2.5" />
        <line x1="5" y1="5" x2="22" y2="5" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1.5" />
        <line x1="5" y1="5" x2="5" y2="22" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1.5" />
        <line x1="10" y1="10" x2="16" y2="10" stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.5" opacity="0.5" />
        <line x1="10" y1="10" x2="10" y2="16" stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.5" opacity="0.5" />
      </svg>

      {/* Top-right constructivist corner bracket — larger, more prominent */}
      <svg
        className="absolute top-16 right-4 w-20 h-20 opacity-30"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="25" y1="0" x2="60" y2="0" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2.5" />
        <line x1="60" y1="0" x2="60" y2="35" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2.5" />
        <line x1="38" y1="5" x2="55" y2="5" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1.5" />
        <line x1="55" y1="5" x2="55" y2="22" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1.5" />
        <line x1="44" y1="10" x2="50" y2="10" stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.5" opacity="0.5" />
        <line x1="50" y1="10" x2="50" y2="16" stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.5" opacity="0.5" />
      </svg>

      {/* Rotating Soviet star — top center, larger with glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 animate-slow-rotate">
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="star-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            </filter>
          </defs>
          <polygon
            points="12,0 14.5,8.5 24,9.5 17,15 19,24 12,19 5,24 7,15 0,9.5 9.5,8.5"
            fill={isDark ? '#8f0000' : '#8f0000'}
            opacity={isDark ? 0.35 : 0.18}
            filter="url(#star-filter)"
          />
        </svg>
      </div>

      {/* Left side vertical decorative line with dashes — more prominent */}
      <div className="absolute left-8 top-1/4 bottom-1/4 hidden lg:flex flex-col items-center">
        <div
          className="w-px flex-1"
          style={{
            backgroundImage: isDark
              ? 'repeating-linear-gradient(180deg, rgba(143,0,0,0.4) 0px, rgba(143,0,0,0.4) 8px, transparent 8px, transparent 16px)'
              : 'repeating-linear-gradient(180deg, rgba(143,0,0,0.15) 0px, rgba(143,0,0,0.15) 8px, transparent 8px, transparent 16px)',
          }}
        />
        {/* Decorative diamond — larger */}
        <svg width="12" height="12" viewBox="0 0 12 12" className="my-2">
          <polygon points="6,0 12,6 6,12 0,6" fill={isDark ? '#db5b00' : '#8f0000'} opacity={isDark ? 0.4 : 0.2} />
          <polygon points="6,2 10,6 6,10 2,6" fill="none" stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.5" opacity={isDark ? 0.3 : 0.15} />
        </svg>
        <div
          className="w-px flex-1"
          style={{
            backgroundImage: isDark
              ? 'repeating-linear-gradient(180deg, rgba(219,91,0,0.3) 0px, rgba(219,91,0,0.3) 8px, transparent 8px, transparent 16px)'
              : 'repeating-linear-gradient(180deg, rgba(219,91,0,0.12) 0px, rgba(219,91,0,0.12) 8px, transparent 8px, transparent 16px)',
          }}
        />
      </div>

      {/* Bottom-left angular geometric accent — larger */}
      <svg
        className="absolute bottom-[440px] left-12 w-24 h-16 opacity-20 hidden lg:block"
        viewBox="0 0 80 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="0,48 20,0 40,48" fill={isDark ? '#8f0000' : '#8f0000'} />
        <polygon points="25,48 40,12 55,48" fill={isDark ? '#db5b00' : '#a04000'} opacity="0.7" />
        <polygon points="45,48 60,8 75,48" fill={isDark ? '#ffa500' : '#db5b00'} opacity="0.5" />
      </svg>

      {/* Right side decorative circles — geodesic node pattern with radar ping */}
      <div className="absolute right-8 top-1/3 hidden lg:block">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="mb-5 relative"
            style={{
              animation: `soviet-pulse ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle
                cx="8" cy="8" r="6"
                fill="none"
                stroke={isDark ? (i % 2 === 0 ? '#8f0000' : '#db5b00') : '#8f0000'}
                strokeWidth="1"
                opacity={isDark ? 0.4 : 0.2}
              />
              <circle
                cx="8" cy="8" r="2"
                fill={isDark ? (i % 2 === 0 ? '#db5b00' : '#ffa500') : '#8f0000'}
                opacity={isDark ? 0.5 : 0.25}
              />
              {/* Connecting line to next node */}
              {i < 4 && (
                <line
                  x1="8" y1="14" x2="8" y2="28"
                  stroke={isDark ? '#8f0000' : '#8f0000'}
                  strokeWidth="0.5"
                  opacity={isDark ? 0.2 : 0.1}
                  strokeDasharray="2 2"
                />
              )}
            </svg>
          </div>
        ))}
      </div>

      {/* Aurora-like gradient band — top of viewport, stronger */}
      <div
        className="absolute top-0 left-0 right-0 h-40 animate-aurora"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(143,0,0,0.12) 0%, rgba(219,91,0,0.06) 40%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(143,0,0,0.05) 0%, rgba(219,91,0,0.03) 40%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
