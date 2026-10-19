'use client';

import { useId, useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION, REDUCED_MOTION } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';

/** The wedge in a 1000 × 200 box: the two corners of its base on the right edge, and its tip. */
const WEDGE_PATH = 'M1000 110 L60 40 L1000 190 Z';
/** The middle of its base, which it is driven from. */
const WEDGE_BASE = '1000 150';

/**
 * Lissitzky's wedge from the gazette's nameplate, driven into a case study's hero from the right edge once
 * the page is revealed: screen-printed orange-to-red with a red halftone shadow, behind the hero's copy. It
 * drives a little further in as the hero scrolls away. Decorative, screen only; static under reduced motion.
 */
export default function HeroWedge() {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replace(/[^\w-]/g, '');

  useGSAP(
    () => {
      const svg = ref.current;
      const wedge = svg?.querySelector('[data-wedge]');
      if (!svg || !wedge) return;
      const mm = gsap.matchMedia();
      mm.add({ full: FULL_MOTION, reduced: REDUCED_MOTION }, (ctx, contextSafe) => {
        const { full } = ctx.conditions as { full: boolean };
        if (!full) {
          markReady(svg);
          return;
        }
        gsap.set(wedge, { scale: 0, svgOrigin: WEDGE_BASE });
        markReady(svg);
        gsap.to(wedge, {
          x: -90,
          ease: 'none',
          scrollTrigger: { trigger: svg, start: 'top 35%', end: 'bottom top', scrub: 0.6 },
        });
        return playOnReveal(contextSafe, () => {
          gsap
            .timeline({ delay: 0.45 })
            .to(wedge, { scale: 1, duration: 0.42, ease: 'power4.in' })
            .fromTo(wedge, { scale: 1.06 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} className="hero-wedge no-print" viewBox="0 0 1000 200" aria-hidden="true" focusable="false" data-fx-hide="">
      <defs>
        <pattern id={`${id}-shadow`} className="hero-wedge-shadow" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <circle cx="3.5" cy="3.5" r="2.4" />
        </pattern>
        <pattern id={`${id}-screen`} className="hero-wedge-screen" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="2.5" cy="2.5" r="1.3" />
        </pattern>
        <linearGradient id={`${id}-ink`} gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="1000" y2="150">
          <stop offset="0" className="mast-wedge-tip" />
          <stop offset="1" className="mast-wedge-base" />
        </linearGradient>
      </defs>
      <g data-wedge="">
        <path d={WEDGE_PATH} transform="translate(10 13)" fill={`url(#${id}-shadow)`} opacity="0.5" />
        <path d={WEDGE_PATH} fill={`url(#${id}-ink)`} />
        <path d={WEDGE_PATH} fill={`url(#${id}-screen)`} opacity="0.16" />
      </g>
    </svg>
  );
}
