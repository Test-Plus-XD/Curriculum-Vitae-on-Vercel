'use client';

import { useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { gsap, useGSAP, FULL_MOTION, FINE_POINTER } from '@/lib/gsap';

/**
 * The two halftone screens laid over the page: a black one and a red plate a hair out of register with it.
 * The pointer nudges the red plate (as if the sheet were shifted under the press), scrolling slides a second
 * copy of the red screen under the first so the dots creep, and every navigation knocks the black screen
 * sideways before it settles back into register. Mouse and pen only for the pointer; under reduced motion
 * nothing moves.
 */
export default function InkMisregistration() {
  const inkRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const slipRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const firstRef = useRef(true);

  useGSAP(
    () => {
      const ink = inkRef.current;
      const plate = plateRef.current;
      const slip = slipRef.current;
      if (!ink || !plate || !slip) return;

      // Registration knock on navigation: the black plate jumps and settles back (never under reduced motion).
      if (firstRef.current) {
        firstRef.current = false;
      } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(ink, { x: -13, y: 8 }, { x: 0, y: 0, duration: 1.05, ease: 'expo.out', overwrite: 'auto' });
      }

      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        gsap.fromTo(
          slip,
          { y: -12 },
          {
            y: 12,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.7, invalidateOnRefresh: true },
          },
        );
      });

      mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, () => {
        const x = gsap.quickTo(plate, 'x', { duration: 1.7, ease: 'power3' });
        const y = gsap.quickTo(plate, 'y', { duration: 1.7, ease: 'power3' });
        const move = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          x((event.clientX / window.innerWidth - 0.5) * -7);
          y((event.clientY / window.innerHeight - 0.5) * -6);
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
      });
    },
    { dependencies: [pathname], scope: plateRef },
  );

  return (
    <>
      <div ref={inkRef} className="bg-screen" aria-hidden="true" />
      <div ref={plateRef} className="bg-screen-red" aria-hidden="true">
        <div ref={slipRef} className="bg-screen-slip" />
      </div>
    </>
  );
}
