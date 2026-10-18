'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, FULL_MOTION, FINE_POINTER } from '@/lib/gsap';

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
}

/**
 * 3D tilt towards the pointer with a warm spotlight that follows it (via --mx / --my), plus constructivist
 * corner brackets that close in on hover (CSS). Fine pointers with full motion only.
 */
export default function TiltCard({ children, as: Tag = 'div', className, max = 6 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, () => {
        gsap.set(el, { transformPerspective: 900 });
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          rx((0.5 - py) * max * 2);
          ry((px - 0.5) * max * 2);
          el.style.setProperty('--mx', `${px * 100}%`);
          el.style.setProperty('--my', `${py * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`tilt-card ${className ?? ''}`}>
      <span className="tilt-spotlight no-print" aria-hidden="true" />
      <span className="bracket bracket-tl no-print" aria-hidden="true" />
      <span className="bracket bracket-tr no-print" aria-hidden="true" />
      <span className="bracket bracket-bl no-print" aria-hidden="true" />
      <span className="bracket bracket-br no-print" aria-hidden="true" />
      {children}
    </Tag>
  );
}
