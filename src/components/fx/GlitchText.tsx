'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, type ElementType } from 'react';
import { useLocale } from 'next-intl';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { onPageReveal } from '@/lib/reveal';
import { glitchFrame } from '@/lib/text-fx';

export interface GlitchTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Milliseconds per resolved character; defaults to 1 (繁中) or 10 (EN), never below 4. */
  speed?: number;
  glitchOnHover?: boolean;
  glitchOnMount?: boolean;
  glitchOnView?: boolean;
  /**
   * Load-in: the text starts as glyph noise and resolves once the page is revealed and the element has
   * scrolled into view. Implies `glitchOnView`.
   */
  loadIn?: boolean;
  /** Extra milliseconds before resolving, to stagger neighbouring labels. */
  delay?: number;
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * CRT-style scramble: an aria-hidden overlay cycles Cyrillic / Bauhaus glyphs and resolves left to right,
 * while the real text stays in the base span so layout never shifts. The base is hidden with opacity (not
 * visibility) so assistive technology can still read text that is waiting to resolve.
 */
export default function GlitchText({
  text,
  as: Tag = 'span',
  className,
  speed,
  glitchOnHover = true,
  glitchOnMount = false,
  glitchOnView = false,
  loadIn = false,
  delay = 0,
}: GlitchTextProps) {
  const locale = useLocale();
  const isChinese = locale === 'zh-hk';
  const rootRef = useRef<HTMLElement>(null);
  const baseRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef(text);
  const activeRef = useRef(false);
  const rafRef = useRef(0);
  const viewedRef = useRef(false);

  textRef.current = text;
  const msPerChar = Math.max(4, speed ?? (isChinese ? 1 : 10));
  const onView = glitchOnView || loadIn;

  const finish = useCallback(() => {
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.textContent = '';
      overlay.style.display = 'none';
    }
    if (base) base.style.opacity = '';
    rootRef.current?.classList.remove('fx-rgb-split');
    activeRef.current = false;
  }, []);

  const run = useCallback(() => {
    if (activeRef.current || prefersReducedMotion()) return;
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (!base || !overlay) return;
    activeRef.current = true;
    base.style.opacity = '0';
    overlay.style.display = 'block';
    rootRef.current?.classList.add('fx-rgb-split');
    const start = performance.now();
    const tick = (now: number) => {
      const current = textRef.current;
      const progress = Math.floor((now - start) / msPerChar);
      if (progress >= Array.from(current).length) {
        finish();
        return;
      }
      overlay.textContent = glitchFrame(current, progress, isChinese);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [finish, isChinese, msPerChar]);

  // Load-in: show noise from the first client paint until it is time to resolve.
  useIsomorphicLayoutEffect(() => {
    if (!loadIn || prefersReducedMotion()) return;
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (!base || !overlay) return;
    base.style.opacity = '0';
    overlay.style.display = 'block';
    overlay.textContent = glitchFrame(textRef.current, 0, isChinese);
  }, [loadIn, isChinese]);

  useEffect(() => {
    if (!glitchOnMount) return;
    const t = window.setTimeout(run, 200 + delay);
    return () => clearTimeout(t);
  }, [glitchOnMount, run, delay]);

  useEffect(() => {
    const el = rootRef.current;
    if (!onView || !el) return;
    let timer = 0;
    let io: IntersectionObserver | null = null;
    const off = onPageReveal(() => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !viewedRef.current) {
            viewedRef.current = true;
            timer = window.setTimeout(run, (loadIn ? 60 : 100) + delay);
            io?.disconnect();
          }
        },
        { rootMargin: loadIn ? '0px 0px -6% 0px' : '-30px' },
      );
      io.observe(el);
    });
    return () => {
      off();
      io?.disconnect();
      clearTimeout(timer);
    };
  }, [onView, loadIn, run, delay]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const onEnter = () => {
    if (!glitchOnHover) return;
    run();
    if (rootRef.current && !prefersReducedMotion()) gsap.to(rootRef.current, { scale: 1.01, duration: 0.2 });
  };
  const onLeave = () => {
    if (glitchOnHover && rootRef.current) gsap.to(rootRef.current, { scale: 1, duration: 0.25 });
  };

  return (
    <Tag ref={rootRef} className={`glitch-text ${className ?? ''}`} data-text={text} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <span ref={baseRef} className="glitch-base">
        {text}
      </span>
      <span ref={overlayRef} className="glitch-overlay no-print" aria-hidden="true" style={{ display: 'none' }} />
    </Tag>
  );
}
