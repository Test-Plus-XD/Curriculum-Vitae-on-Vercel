'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, FULL_MOTION, REDUCED_MOTION } from '@/lib/gsap';

/**
 * A reading rule along the top edge of the window: a red rule printed across the page as the story is read, with its ink
 * plate trailing a hair behind and out of register, and a typewritten "§" riding its leading edge.
 * Decorative and screen only; under reduced motion the rule simply tracks the scroll without easing.
 */
export default function ReadingRule() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const red = root.querySelector('.reading-rule-red');
      const ink = root.querySelector('.reading-rule-ink');
      const mark = root.querySelector('.reading-rule-mark');
      const mm = gsap.matchMedia();
      mm.add({ full: FULL_MOTION, reduced: REDUCED_MOTION }, (ctx) => {
        const { full } = ctx.conditions as { full: boolean };
        const scroll = { trigger: document.documentElement, start: 'top top', end: 'bottom bottom' };
        gsap.fromTo(red, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...scroll, scrub: full ? 0.25 : true } });
        if (full) {
          gsap.fromTo(ink, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...scroll, scrub: 0.9 } });
          gsap.fromTo(
            mark,
            { x: 0 },
            { x: () => root.clientWidth, ease: 'none', scrollTrigger: { ...scroll, scrub: 0.25, invalidateOnRefresh: true } },
          );
        }
        // Images and the timeline settle after load: measure the page again once they have.
        const settle = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
        return () => window.clearTimeout(settle);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="reading-rule no-print" aria-hidden="true">
      <span className="reading-rule-ink" />
      <span className="reading-rule-red" />
      <span className="reading-rule-mark">§</span>
    </div>
  );
}
