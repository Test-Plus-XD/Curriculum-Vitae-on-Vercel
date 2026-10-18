'use client';

import { useRef, type ElementType } from 'react';
import { gsap, useGSAP, SplitText, FULL_MOTION } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  /** Small index shown above the heading, e.g. "§ 01". */
  index?: string;
  id?: string;
}

/**
 * Section heading: its index slides in, the lines rise out of a mask and a constructivist rule extends
 * beneath, once, on scroll. SplitText re-splits when fonts load or the width changes, and keeps an
 * aria-label with the full text for assistive technology.
 */
export default function RevealHeading({ text, as: Tag = 'h2', className, index, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const heading = root?.querySelector<HTMLElement>('[data-heading]');
      if (!root || !heading) return;
      const rule = root.querySelector<HTMLElement>('[data-rule]');
      const idx = root.querySelector<HTMLElement>('[data-index]');
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, (_ctx, contextSafe) => {
        gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(heading, { opacity: 0 });
        if (idx) gsap.set(idx, { opacity: 0, x: -16 });
        markReady(root);
        return playOnReveal(contextSafe, () => {
          const trigger = () => ({ trigger: root, start: 'top 90%', once: true });
          gsap.set(heading, { opacity: 1 });
          SplitText.create(heading, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: trigger() }),
          });
          gsap.to(rule, { scaleX: 1, duration: 1, ease: 'expo.inOut', delay: 0.1, scrollTrigger: trigger() });
          if (idx) gsap.to(idx, { opacity: 1, x: 0, duration: 0.6, delay: 0.2, scrollTrigger: trigger() });
        });
      });
      markReady(root);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`reveal-heading ${className ?? ''}`} data-fx-hide="">
      {index && (
        <span data-index="" className="section-index" aria-hidden="true">
          {index}
        </span>
      )}
      <Tag id={id} data-heading="" className="font-title section-title">
        {text}
      </Tag>
      <span data-rule="" className="section-rule" aria-hidden="true" />
    </div>
  );
}
