'use client';

import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION, FINE_POINTER } from '@/lib/gsap';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, [data-cursor]';

/**
 * A targeting reticle that trails the pointer and locks onto interactive elements (rotating 45° and
 * widening). The native cursor is kept; this is decoration only. Fine pointers with full motion only.
 */
export default function CursorReticle() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, () => {
      const ring = el.querySelector<HTMLElement>('[data-ring]');
      const dot = el.querySelector<HTMLElement>('[data-dot]');
      gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
      const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
      const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
      const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
      const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
      let locked = false;
      let shown = false;

      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        if (!shown) {
          shown = true;
          gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        }
        rx(e.clientX);
        ry(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
        const target = (e.target as Element | null)?.closest?.(INTERACTIVE);
        if (!!target !== locked) {
          locked = !!target;
          gsap.to(ring, {
            scale: locked ? 1.7 : 1,
            rotation: locked ? 45 : 0,
            borderRadius: locked ? '2px' : '50%',
            duration: 0.35,
            ease: 'back.out(2)',
          });
          gsap.to(dot, { scale: locked ? 0 : 1, duration: 0.2 });
        }
      };
      const out = () => {
        shown = false;
        gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      };
      const down = () => gsap.to(ring, { scale: '-=0.25', duration: 0.12, yoyo: true, repeat: 1 });

      window.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', out);
      window.addEventListener('pointerdown', down);
      return () => {
        window.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', out);
        window.removeEventListener('pointerdown', down);
      };
    });
  });

  return (
    <div ref={ref} className="cursor-reticle no-print" aria-hidden="true">
      <span data-ring className="cursor-ring" />
      <span data-dot className="cursor-dot" />
    </div>
  );
}
