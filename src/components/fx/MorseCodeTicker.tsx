'use client';

import { useMemo, useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';

const MORSE: Record<string, string> = {
  A: '·−', B: '−···', C: '−·−·', D: '−··', E: '·', F: '··−·', G: '−−·', H: '····', I: '··', J: '·−−−',
  K: '−·−', L: '·−··', M: '−−', N: '−·', O: '−−−', P: '·−−·', Q: '−−·−', R: '·−·', S: '···', T: '−',
  U: '··−', V: '···−', W: '·−−', X: '−··−', Y: '−·−−', Z: '−−··',
};

const toMorse = (s: string) =>
  s
    .toUpperCase()
    .split(' ')
    .map((w) => Array.from(w).map((c) => MORSE[c] ?? '').join(' '))
    .join('   /   ');

/** A transmission strip: plain-text call signs interleaved with their Morse code, looping endlessly. */
export default function MorseCodeTicker({ messages, reverse = false }: { messages: string[]; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const line = useMemo(() => messages.map((m) => `${m}  ·  ${toMorse(m)}`).join('   ★   '), [messages]);

  useGSAP(
    () => {
      const track = ref.current?.querySelector<HTMLElement>('[data-track]');
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: 90, ease: 'none', repeat: -1 },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="morse-ticker no-print" aria-hidden="true">
      <div data-track className="morse-track">
        <span>{line}   ★   </span>
        <span>{line}   ★   </span>
      </div>
    </div>
  );
}
