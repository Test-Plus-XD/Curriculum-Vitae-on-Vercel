'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * SovietBackground — Full-page background overlay with brutalist grid,
 * diagonal constructivist lines, film grain, and holographic stripe effects.
 * Enhanced opacity for greater visual impact.
 * Works in both light and dark modes. Hidden on the landing CV page in light mode and print.
 */
export default function SovietBackground() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Hide on the landing CV page (root locale paths like /en or /zh-hk)
  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage && resolvedTheme !== 'dark') return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="print:hidden fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Brutalist architectural grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(143, 0, 0, 0.18) 1px, transparent 1px),
               linear-gradient(90deg, rgba(143, 0, 0, 0.18) 1px, transparent 1px)`
            : `linear-gradient(rgba(143, 0, 0, 0.07) 1px, transparent 1px),
               linear-gradient(90deg, rgba(143, 0, 0, 0.07) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Diagonal constructivist lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(219, 91, 0, 0.08) 80px, rgba(219, 91, 0, 0.08) 81px),
               repeating-linear-gradient(-45deg, transparent, transparent 120px, rgba(143, 0, 0, 0.06) 120px, rgba(143, 0, 0, 0.06) 121px)`
            : `repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(219, 91, 0, 0.045) 80px, rgba(219, 91, 0, 0.045) 81px),
               repeating-linear-gradient(-45deg, transparent, transparent 120px, rgba(143, 0, 0, 0.035) 120px, rgba(143, 0, 0, 0.035) 121px)`,
        }}
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E")`,
          opacity: isDark ? 1 : 0.5,
        }}
      />

      {/* Warm vignette overlay — stronger */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%)'
            : 'radial-gradient(ellipse at center, transparent 45%, rgba(143, 0, 0, 0.08) 100%)',
        }}
      />

      {/* Blueprint-style holographic stripe overlay — dark mode only */}
      {isDark && (
        <div
          className="absolute inset-0 animate-holo-stripe"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(219, 91, 0, 0.015) 38px, rgba(219, 91, 0, 0.015) 40px)',
            backgroundSize: '100% 40px',
          }}
        />
      )}

      {/* Pulsing grid animation overlay — dark mode only */}
      {isDark && (
        <div
          className="absolute inset-0 animate-soviet-pulse"
          style={{
            backgroundImage:
              'linear-gradient(rgba(143, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(143, 0, 0, 0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      )}
    </div>
  );
}
