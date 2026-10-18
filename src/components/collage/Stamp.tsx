'use client';

import { useId, useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION, ScrollTrigger } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';

interface Props {
  /** Text around the ring (circle) or on the top line (rect). */
  ring: string;
  /** Large centre mark: a figure, a word or a star. */
  centre: string;
  /** Small line under the centre mark. */
  sub?: string;
  shape?: 'circle' | 'rect';
  tone?: 'red' | 'ink';
  rotate?: number;
  size?: number;
  className?: string;
  /** Slam onto the page when scrolled into view. */
  slam?: boolean;
}

/**
 * A rubber stamp drawn in SVG and roughened with the shared `fx-ink` filter: ring text on a circular path
 * (or a framed label), a big centre mark and a small sub-line. Decorative.
 */
export default function Stamp({
  ring,
  centre,
  sub,
  shape = 'circle',
  tone = 'red',
  rotate = -12,
  size = 132,
  className,
  slam = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const id = `stamp-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !slam) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, (_ctx, safe) => {
        gsap.set(el, { opacity: 0, scale: 2.4, rotation: rotate - 24 });
        markReady(el);
        return playOnReveal(safe, () => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () => {
              gsap
                .timeline()
                .to(el, { opacity: 0.92, scale: 1, rotation: rotate, duration: 0.32, ease: 'power4.in' })
                .to(el, { x: '+=2', y: '+=1', duration: 0.04, yoyo: true, repeat: 3, ease: 'none' });
            },
          });
        });
      });
      markReady(el);
    },
    { scope: ref },
  );

  const fontFamily = 'var(--font-display)';
  return (
    <span
      ref={ref}
      className={`stamp stamp-${tone} ${className ?? ''}`}
      style={{ width: size, height: shape === 'circle' ? size : size * 0.62, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
      data-fx-hide={slam ? '' : undefined}
    >
      {shape === 'circle' ? (
        <svg viewBox="0 0 200 200">
          <g filter="url(#fx-ink)">
            <circle cx="100" cy="100" r="93" fill="none" stroke="currentColor" strokeWidth="7" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
            <path id={id} d="M 100,100 m -65,0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0" fill="none" />
            <text fill="currentColor" style={{ fontFamily, fontSize: 17, fontWeight: 700, letterSpacing: 3.2 }}>
              <textPath href={`#${id}`} startOffset="0">
                {ring}
              </textPath>
            </text>
            <text
              x="100"
              y={sub ? 108 : 116}
              textAnchor="middle"
              fill="currentColor"
              style={{ fontFamily, fontSize: 34, fontWeight: 900 }}
            >
              {centre}
            </text>
            {sub && (
              <text
                x="100"
                y="132"
                textAnchor="middle"
                fill="currentColor"
                style={{ fontFamily, fontSize: 11, fontWeight: 700, letterSpacing: 2 }}
              >
                {sub}
              </text>
            )}
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 320 200">
          <g filter="url(#fx-ink)">
            <rect x="8" y="8" width="304" height="184" fill="none" stroke="currentColor" strokeWidth="8" />
            <rect x="22" y="22" width="276" height="156" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <text
              x="160"
              y="62"
              textAnchor="middle"
              fill="currentColor"
              style={{ fontFamily, fontSize: 22, fontWeight: 700, letterSpacing: 4 }}
            >
              {ring}
            </text>
            <text x="160" y="128" textAnchor="middle" fill="currentColor" style={{ fontFamily, fontSize: 56, fontWeight: 900 }}>
              {centre}
            </text>
            {sub && (
              <text
                x="160"
                y="162"
                textAnchor="middle"
                fill="currentColor"
                style={{ fontFamily, fontSize: 16, fontWeight: 700, letterSpacing: 3 }}
              >
                {sub}
              </text>
            )}
          </g>
        </svg>
      )}
    </span>
  );
}
