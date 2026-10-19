'use client';

import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import type { Video } from '@/lib/projects';
import InlineVideo from './InlineVideo';

/**
 * A case study's lead photograph: the latest reel's still, taped onto the page as a halftone press print
 * (full colour on hover; a click opens the reel). The still drifts inside its frame as the hero scrolls,
 * so the paper reads as a window onto the footage. Static under reduced motion.
 */
export default function DetailPhoto({ video, caption, credit }: { video: Video; caption: string; credit: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const figure = ref.current;
      const still = figure?.querySelector('.press-thumb');
      if (!figure || !still) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap.fromTo(
          still,
          { yPercent: -5 },
          { yPercent: 5, ease: 'none', scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: 0.4 } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <figure ref={ref} className="detail-photo">
      <div className="detail-photo-plate">
        <InlineVideo video={video} variant="press" />
      </div>
      <figcaption>
        <span>{caption}</span>
        <span className="detail-photo-credit">{credit}</span>
      </figcaption>
    </figure>
  );
}
