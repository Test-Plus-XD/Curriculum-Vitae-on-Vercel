'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, ScrollTrigger, REDUCED_MOTION, FULL_MOTION } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * scatter — displaced along a shared +32px diagonal (Dada collage) and springs into place.
   * collage — the same with a wider +48px displacement.
   * rise    — a calmer upward reveal, for document-like sections.
   */
  variant?: 'scatter' | 'collage' | 'rise';
  stagger?: number;
  id?: string;
}

/**
 * Animates its direct children into place, staggered, as they scroll into view. Visitors who prefer
 * reduced motion get a plain fade.
 */
export default function Scatter({ children, as: Tag = 'div', className, variant = 'scatter', stagger = 0.07, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = Array.from(root.children) as HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add({ full: FULL_MOTION, reduced: REDUCED_MOTION }, (ctx, contextSafe) => {
        const { full } = ctx.conditions as { full: boolean };
        const offset = variant === 'collage' ? 48 : 32;
        const from: gsap.TweenVars = !full
          ? { opacity: 0 }
          : variant === 'rise'
            ? { opacity: 0, y: 36 }
            : { opacity: 0, x: offset, y: offset, rotation: () => gsap.utils.random(-2.5, 2.5) };
        const to: gsap.TweenVars = !full
          ? { opacity: 1, duration: 0.5, stagger: stagger / 2 }
          : variant === 'rise'
            ? { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger }
            : { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.9, ease: 'back.out(1.4)', stagger };

        gsap.set(items, from);
        markReady(root);
        return playOnReveal(contextSafe, () => {
          ScrollTrigger.batch(items, { start: 'top 94%', once: true, onEnter: (batch) => gsap.to(batch, to) });
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-fx-hide="">
      {children}
    </Tag>
  );
}
