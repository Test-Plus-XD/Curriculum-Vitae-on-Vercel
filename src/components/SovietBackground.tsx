'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * SovietBackground — Full-page background overlay with brutalist grid,
 * diagonal constructivist lines, and film grain texture.
 * Works in both light and dark modes. Hidden on the landing CV page and print.
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
            ? `linear-gradient(rgba(143, 0, 0, 0.14) 1px, transparent 1px),
               linear-gradient(90deg, rgba(143, 0, 0, 0.14) 1px, transparent 1px)`
            : `linear-gradient(rgba(143, 0, 0, 0.06) 1px, transparent 1px),
               linear-gradient(90deg, rgba(143, 0, 0, 0.06) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Diagonal constructivist lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(219, 91, 0, 0.06) 80px, rgba(219, 91, 0, 0.06) 81px),
               repeating-linear-gradient(-45deg, transparent, transparent 120px, rgba(143, 0, 0, 0.04) 120px, rgba(143, 0, 0, 0.04) 121px)`
            : `repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(219, 91, 0, 0.04) 80px, rgba(219, 91, 0, 0.04) 81px),
               repeating-linear-gradient(-45deg, transparent, transparent 120px, rgba(143, 0, 0, 0.03) 120px, rgba(143, 0, 0, 0.03) 121px)`,
        }}
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: isDark ? 1 : 0.4,
        }}
      />

      {/* Warm vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(143, 0, 0, 0.06) 100%)',
        }}
      />

      {/* Pulsing grid animation overlay — dark mode only */}
      {isDark && (
        <div
          className="absolute inset-0 animate-soviet-pulse"
          style={{
            backgroundImage:
              'linear-gradient(rgba(143, 0, 0, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(143, 0, 0, 0.08) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      )}
    </div>
  );
}
