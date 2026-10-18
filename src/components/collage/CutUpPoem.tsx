'use client';

import { useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { gsap, useGSAP, Flip, prefersReducedMotion } from '@/lib/gsap';
import { cutUp, hashSeed, rng, shuffled } from '@/lib/collage';
import RansomText from './RansomText';

interface Props {
  text: string;
  title: string;
  hint: string;
  shake: string;
  restore: string;
  credit: string;
  resultLabel: string;
}

/**
 * Cut-up poetry after Tristan Tzara: the profile is scissored into slips; "shake the bag" spills them into a
 * new order (animated with Flip), "restore" sorts them back. The current arrangement is announced politely
 * for screen readers. Screen only.
 */
export default function CutUpPoem({ text, title, hint, shake, restore, credit, resultLabel }: Props) {
  const locale = useLocale();
  const slips = useMemo(() => cutUp(text, locale), [text, locale]);
  const identity = useMemo(() => slips.map((_, i) => i), [slips]);
  const [order, setOrder] = useState<number[]>(identity);
  const [tilts, setTilts] = useState<number[]>(() => slips.map((s, i) => tilt(hashSeed(s) + i)));
  const rootRef = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const joiner = locale === 'zh-hk' ? '' : ' ';
  const shaken = order.some((v, i) => v !== i);

  const { contextSafe } = useGSAP({ scope: rootRef });

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.9,
        ease: 'back.out(1.15)',
        stagger: { each: 0.012, from: 'random' },
        absolute: false,
      });
    },
    { scope: rootRef, dependencies: [order] },
  );

  const rearrange = contextSafe((next: number[], nextTilts: number[]) => {
    const root = rootRef.current;
    if (root && !prefersReducedMotion()) {
      flipState.current = Flip.getState(root.querySelectorAll('[data-slip]'));
      // A toss as they fall: the paper inside each slip jumps while Flip moves the slip itself.
      gsap.to(root.querySelectorAll('[data-slip-paper]'), {
        y: () => gsap.utils.random(-30, -10),
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        stagger: { each: 0.01, from: 'random' },
      });
    }
    setOrder(next);
    setTilts(nextTilts);
  });

  const onShake = () => {
    const seed = Date.now();
    const rand = rng(seed);
    rearrange(
      shuffled(identity, seed),
      slips.map(() => (rand() * 2 - 1) * 7),
    );
  };

  const onRestore = () =>
    rearrange(
      identity,
      slips.map((s, i) => tilt(hashSeed(s) + i)),
    );

  return (
    <section ref={rootRef} className="cutup no-print" aria-label={title}>
      <div className="cutup-head">
        <RansomText as="h2" text={title} className="cutup-title" seed={1920} paste={false} />
        <p className="cutup-hint">{hint}</p>
      </div>
      <ol className="cutup-slips" aria-hidden="true">
        {order.map((index) => (
          <li
            key={index}
            data-slip=""
            data-flip-id={`slip-${index}`}
            className={`slip ${index % 5 === 0 ? 'slip-red' : index % 7 === 3 ? 'slip-ink' : ''}`}
          >
            <span data-slip-paper="" style={{ rotate: `${tilts[index] ?? 0}deg` }}>
              {slips[index]}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {resultLabel}: {order.map((i) => slips[i]).join(joiner)}
      </p>
      <div className="cutup-actions">
        <button type="button" className="action-button action-primary" onClick={onShake}>
          {shake}
        </button>
        <button type="button" className="action-button" onClick={onRestore} disabled={!shaken}>
          {restore}
        </button>
        <span className="cutup-credit">{credit}</span>
      </div>
    </section>
  );
}

function tilt(seed: number) {
  return (rng(seed)() * 2 - 1) * 3;
}
