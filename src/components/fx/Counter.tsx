'use client';

import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import { playOnReveal } from '@/lib/reveal';

interface Props {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  /** Group thousands with commas (21,031). */
  grouped?: boolean;
}

function format(v: number, decimals: number, grouped: boolean) {
  const fixed = v.toFixed(decimals);
  if (!grouped) return fixed;
  const [int, frac] = fixed.split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (frac ? `.${frac}` : '');
}

/** Counts up from zero when scrolled into view. The final value is server-rendered and restored before printing. */
export default function Counter({ value, decimals = 0, suffix = '', className, grouped = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = format(value, decimals, grouped) + suffix;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const restore = () => {
        el.textContent = final;
      };
      window.addEventListener('beforeprint', restore);
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, (_ctx, contextSafe) => {
        const state = { v: 0 };
        el.textContent = format(0, decimals, grouped) + suffix;
        const off = playOnReveal(contextSafe, () => {
          gsap.to(state, {
            v: value,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
            onUpdate: () => {
              el.textContent = format(state.v, decimals, grouped) + suffix;
            },
            onComplete: restore,
          });
        });
        return () => {
          off();
          restore();
        };
      });
      return () => window.removeEventListener('beforeprint', restore);
    },
    { scope: ref, dependencies: [value, decimals, suffix], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={className}>
      {final}
    </span>
  );
}
