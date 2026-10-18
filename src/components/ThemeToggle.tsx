'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/gsap';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Light/dark switch. Where the View Transitions API exists, the new theme spreads out from the button as an
 * expanding circle; elsewhere (or with reduced motion) it switches instantly.
 */
export default function ThemeToggle() {
  const t = useTranslations('controls');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? 'light' : 'dark';
    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition || prefersReducedMotion()) {
      setTheme(next);
      return;
    }
    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 32;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      // The browser may skip the animation (hidden tab, another transition); the theme has changed anyway.
      .catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="icon-button"
      aria-label={isDark ? t('toLight') : t('toDark')}
      title={isDark ? t('toLight') : t('toDark')}
    >
      {isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  );
}
