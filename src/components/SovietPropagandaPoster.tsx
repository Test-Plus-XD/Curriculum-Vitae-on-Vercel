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
      {/* Top-left constructivist corner bracket */}
      <svg
        className="absolute top-16 left-4 w-16 h-16 opacity-20"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="30" y2="0" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="30" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2" />
        <line x1="5" y1="5" x2="20" y2="5" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1" />
        <line x1="5" y1="5" x2="5" y2="20" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1" />
      </svg>

      {/* Top-right constructivist corner bracket */}
      <svg
        className="absolute top-16 right-4 w-16 h-16 opacity-20"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="30" y1="0" x2="60" y2="0" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2" />
        <line x1="60" y1="0" x2="60" y2="30" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="2" />
        <line x1="40" y1="5" x2="55" y2="5" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1" />
        <line x1="55" y1="5" x2="55" y2="20" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="1" />
      </svg>

      {/* Rotating Soviet star — top center */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 animate-slow-rotate">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polygon
            points="12,0 14.5,8.5 24,9.5 17,15 19,24 12,19 5,24 7,15 0,9.5 9.5,8.5"
            fill={isDark ? '#8f0000' : '#8f0000'}
            opacity={isDark ? 0.25 : 0.12}
          />
        </svg>
      </div>

      {/* Left side vertical decorative line with dashes */}
      <div className="absolute left-8 top-1/4 bottom-1/4 hidden lg:flex flex-col items-center">
        <div
          className="w-px flex-1"
          style={{
            backgroundImage: isDark
              ? 'repeating-linear-gradient(180deg, rgba(143,0,0,0.3) 0px, rgba(143,0,0,0.3) 8px, transparent 8px, transparent 16px)'
              : 'repeating-linear-gradient(180deg, rgba(143,0,0,0.12) 0px, rgba(143,0,0,0.12) 8px, transparent 8px, transparent 16px)',
          }}
        />
        {/* Small decorative diamond */}
        <svg width="8" height="8" viewBox="0 0 8 8" className="my-2">
          <polygon points="4,0 8,4 4,8 0,4" fill={isDark ? '#db5b00' : '#8f0000'} opacity={isDark ? 0.3 : 0.15} />
        </svg>
        <div
          className="w-px flex-1"
          style={{
            backgroundImage: isDark
              ? 'repeating-linear-gradient(180deg, rgba(219,91,0,0.25) 0px, rgba(219,91,0,0.25) 8px, transparent 8px, transparent 16px)'
              : 'repeating-linear-gradient(180deg, rgba(219,91,0,0.1) 0px, rgba(219,91,0,0.1) 8px, transparent 8px, transparent 16px)',
          }}
        />
      </div>

      {/* Bottom-left angular geometric accent */}
      <svg
        className="absolute bottom-[320px] left-12 w-20 h-12 opacity-15 hidden lg:block"
        viewBox="0 0 80 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="0,48 20,0 40,48" fill={isDark ? '#8f0000' : '#8f0000'} />
        <polygon points="25,48 40,12 55,48" fill={isDark ? '#db5b00' : '#a04000'} opacity="0.7" />
        <polygon points="45,48 60,8 75,48" fill={isDark ? '#ffa500' : '#db5b00'} opacity="0.5" />
      </svg>

      {/* Right side decorative circles — geodesic node pattern */}
      <div className="absolute right-8 top-1/3 hidden lg:block">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="mb-6"
            style={{
              animation: `soviet-pulse ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle
                cx="6" cy="6" r="5"
                fill="none"
                stroke={isDark ? (i % 2 === 0 ? '#8f0000' : '#db5b00') : '#8f0000'}
                strokeWidth="1"
                opacity={isDark ? 0.3 : 0.15}
              />
              <circle
                cx="6" cy="6" r="1.5"
                fill={isDark ? (i % 2 === 0 ? '#db5b00' : '#ffa500') : '#8f0000'}
                opacity={isDark ? 0.4 : 0.2}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Aurora-like gradient band — top of viewport */}
      <div
        className="absolute top-0 left-0 right-0 h-32 animate-aurora"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(143,0,0,0.08) 0%, rgba(219,91,0,0.04) 40%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(143,0,0,0.03) 0%, rgba(219,91,0,0.02) 40%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
