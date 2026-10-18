'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';

/**
 * The CV sheet feeds out like paper from a printer: it unrolls top to bottom, registration marks pop in,
 * the header settles and the approval stamp lands last with a small jolt. Purely presentational — print and
 * reduced motion see the finished sheet.
 */
export default function SheetIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, (_ctx, contextSafe) => {
        const q = gsap.utils.selector(root);
        const sheet = q('.cv-sheet')[0];
        gsap.set(sheet, { clipPath: 'inset(0% 0% 100% 0%)' });
        gsap.set(q('.sheet-mark'), { scale: 0, opacity: 0 });
        gsap.set(q('.sheet-stamp'), { opacity: 0, scale: 2.4, rotation: -32 });
        gsap.set(q('.cv-head > *'), { opacity: 0, y: 28 });
        gsap.set(q('.sheet-tape'), { opacity: 0, scaleX: 0.2 });
        markReady(root);
        return playOnReveal(contextSafe, () => {
          gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to(sheet, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
            .to(q('.sheet-mark'), { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.5)' }, 0.5)
            .to(q('.cv-head > *'), { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.45)
            .to(q('.sheet-stamp'), { opacity: 0.9, scale: 1, rotation: -12, duration: 0.45, ease: 'power4.in' }, 1.3)
            .to(sheet, { x: 2, y: 1, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' }, 1.75)
            .to(q('.sheet-tape'), { opacity: 1, scaleX: 1, duration: 0.35, stagger: 0.15, ease: 'back.out(2)' }, 1.1)
            .set(sheet, { clearProps: 'clipPath,x,y' });
        });
      });
      markReady(root);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="sheet-intro" data-fx-hide="">
      {children}
    </div>
  );
}
