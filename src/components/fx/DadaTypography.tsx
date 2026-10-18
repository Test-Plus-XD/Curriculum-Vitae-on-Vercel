'use client';

import { useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { glyphCount, initialDisplacement, makeDisplacements, segmentText, type Displacement } from '@/lib/text-fx';

const INITIAL_SEED = 1999;
const HOVER_MULTIPLIER = 1.8;

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  intensity?: number;
  deconstructOnHover?: boolean;
  scatterOnView?: boolean;
  colorShift?: boolean;
  lang?: string;
}

/**
 * Deconstructed (Dada) typography: every glyph is its own transform target. Text starts slightly scattered,
 * snaps into alignment, and re-scatters on hover. Only transforms, filters and text-shadow change — the text
 * itself stays real, and renders as plain text until mounted so SSR and hydration are stable.
 */
export default function DadaTypography({
  text,
  as: Tag = 'span',
  className,
  intensity = 0.7,
  deconstructOnHover = true,
  scatterOnView = false,
  colorShift = false,
  lang,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const segments = useMemo(() => segmentText(text), [text]);
  const count = useMemo(() => glyphCount(segments), [segments]);
  const displacementsRef = useRef<Displacement[]>([]);
  const cleanupRef = useRef<() => void>(() => {});
  const hasAlignedRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const { contextSafe } = useGSAP(
    () => {
      if (!mounted || !rootRef.current) return;
      const chars = gsap.utils.toArray<HTMLElement>('[data-dada-char]', rootRef.current);
      displacementsRef.current = makeDisplacements(count, intensity, INITIAL_SEED);
      hasAlignedRef.current = false;

      if (prefersReducedMotion()) {
        gsap.set(chars, { clearProps: 'all' });
        return;
      }

      chars.forEach((el, i) => {
        const d = initialDisplacement(displacementsRef.current[i], intensity);
        gsap.set(el, scatteredVars(d, i, colorShift));
      });

      const scheduleAlign = () => {
        if (hasAlignedRef.current) return;
        hasAlignedRef.current = true;
        scheduleAlignment();
      };

      if (scatterOnView) {
        ScrollTrigger.create({ trigger: rootRef.current, start: 'top bottom-=40', once: true, onEnter: scheduleAlign });
      } else {
        scheduleAlign();
      }
    },
    { scope: rootRef, dependencies: [mounted, text, intensity, colorShift, scatterOnView], revertOnUpdate: true },
  );

  // Two animation frames let the scattered state paint before the alignment starts; the 10 ms timeout is a
  // failsafe for throttled background tabs. Whichever fires first wins.
  const scheduleAlignment = contextSafe(() => {
    cleanupRef.current();
    let raf1 = 0;
    let raf2 = 0;
    let done = false;
    const run = contextSafe(() => {
      if (done) return;
      done = true;
      align();
    });
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(run);
    });
    const timeout = window.setTimeout(run, 10);
    cleanupRef.current = () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
  });

  const align = contextSafe(() => {
    if (!rootRef.current) return;
    const chars = gsap.utils.toArray<HTMLElement>('[data-dada-char]', rootRef.current);
    gsap.killTweensOf(chars);
    chars.forEach((el, i) => {
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        textShadow: '0 0 0 rgba(0,0,0,0)',
        filter: colorShift ? 'hue-rotate(0deg) drop-shadow(0 0 0 rgba(0,0,0,0))' : 'none',
        duration: 0.45 + (i % 3) * 0.08,
        delay: i * 0.015,
        ease: 'back.out(1.3)',
        overwrite: 'auto',
      });
    });
  });

  const onEnter = contextSafe(() => {
    if (!deconstructOnHover || !rootRef.current || prefersReducedMotion()) return;
    cleanupRef.current();
    const chars = gsap.utils.toArray<HTMLElement>('[data-dada-char]', rootRef.current);
    displacementsRef.current = makeDisplacements(count, intensity * HOVER_MULTIPLIER, Date.now());
    gsap.killTweensOf(chars);
    chars.forEach((el, i) => {
      gsap.to(el, {
        ...scatteredVars(displacementsRef.current[i], i, colorShift),
        duration: 0.6 + (i % 3) * 0.1,
        delay: i * 0.02,
        ease: 'back.out(2.2)',
        overwrite: 'auto',
      });
    });
    gsap.to(rootRef.current, { scale: 1.02, duration: 0.35, ease: 'back.out(2)' });
  });

  const onLeave = contextSafe(() => {
    if (!rootRef.current) return;
    gsap.to(rootRef.current, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
    if (deconstructOnHover && !prefersReducedMotion()) scheduleAlignment();
  });

  useEffect(() => () => cleanupRef.current(), []);

  let index = 0;
  const glyph = (ch: string, key: string) => (
    <span key={key} data-dada-char data-i={index++} className="dada-char">
      {ch}
    </span>
  );

  return (
    <Tag
      ref={rootRef}
      lang={lang}
      className={`dada-text ${className ?? ''}`}
      aria-label={mounted ? text : undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {mounted ? (
        <span aria-hidden="true">
          {segments.map((s, si) =>
            s.type === 'space' ? (
              <span key={si} className="dada-space" />
            ) : s.type === 'word' ? (
              <span key={si} className="dada-word">
                {s.chars.map((c, ci) => glyph(c, `${si}-${ci}`))}
              </span>
            ) : (
              glyph(s.char, `${si}`)
            ),
          )}
        </span>
      ) : (
        text
      )}
    </Tag>
  );
}

function scatteredVars(d: Displacement, i: number, colorShift: boolean): gsap.TweenVars {
  const vars: gsap.TweenVars = {
    x: d.x,
    y: d.y,
    rotation: d.rotate,
    rotationX: d.rotateX,
    rotationY: d.rotateY,
    scale: d.scale,
    textShadow: i % 2 === 0 ? '2px 1px 0 rgba(143,0,0,0.35)' : '0 0 8px rgba(255,165,0,0.35)',
  };
  if (colorShift) {
    vars.filter = `hue-rotate(${d.hue}deg) drop-shadow(1.5px 0 0 rgba(143,0,0,0.55))`;
  }
  return vars;
}
