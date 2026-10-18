'use client';

import { useCallback, useEffect, useRef, type ElementType } from 'react';
import { useLocale } from 'next-intl';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
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
}

/**
 * CRT-style scramble: an aria-hidden overlay cycles Cyrillic / Bauhaus glyphs and resolves left to right,
 * while the real text stays in the base span (hidden only visually) so layout never shifts.
 */
export default function GlitchText({
  text,
  as: Tag = 'span',
  className,
  speed,
  glitchOnHover = true,
  glitchOnMount = false,
  glitchOnView = false,
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

  const finish = useCallback(() => {
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.textContent = '';
      overlay.style.display = 'none';
    }
    if (base) base.style.visibility = '';
    rootRef.current?.classList.remove('fx-rgb-split');
    activeRef.current = false;
  }, []);

  const run = useCallback(() => {
    if (activeRef.current || prefersReducedMotion()) return;
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (!base || !overlay) return;
    activeRef.current = true;
    base.style.visibility = 'hidden';
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

  useEffect(() => {
    if (!glitchOnMount) return;
    const t = window.setTimeout(run, 200);
    return () => clearTimeout(t);
  }, [glitchOnMount, run]);

  useEffect(() => {
    if (!glitchOnView || !rootRef.current) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewedRef.current) {
          viewedRef.current = true;
          timer = window.setTimeout(run, 100);
          io.disconnect();
        }
      },
      { rootMargin: '-30px' },
    );
    io.observe(rootRef.current);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [glitchOnView, run]);

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
    if (rootRef.current) gsap.to(rootRef.current, { scale: 1, duration: 0.25 });
  };

  return (
    <Tag
      ref={rootRef}
      className={`glitch-text ${className ?? ''}`}
      data-text={text}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <span ref={baseRef} className="glitch-base">
        {text}
      </span>
      <span ref={overlayRef} className="glitch-overlay no-print" aria-hidden="true" style={{ display: 'none' }} />
    </Tag>
  );
}
