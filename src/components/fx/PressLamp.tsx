'use client';

import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION, FINE_POINTER } from '@/lib/gsap';

/**
 * A reading lamp laid over the whole press sheet: one soft pool of warm light that follows the pointer,
 * so the paper, the halftone screen and the constructivist field shift under it as you read. Mouse and pen
 * only; under reduced motion the pool stays at the centre of the sheet.
 */
export default function PressLamp() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, () => {
        const x = gsap.quickTo(el, 'x', { duration: 1.5, ease: 'power2.out' });
        const y = gsap.quickTo(el, 'y', { duration: 1.5, ease: 'power2.out' });
        const move = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          x(event.clientX - window.innerWidth / 2);
          y(event.clientY - window.innerHeight / 2);
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
      });
    },
    { scope: ref },
  );

  return <div ref={ref} className="bg-lamp" aria-hidden="true" />;
}
