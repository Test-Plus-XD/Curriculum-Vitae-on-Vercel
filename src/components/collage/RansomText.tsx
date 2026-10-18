'use client';

import { useMemo, useRef, type ElementType } from 'react';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import { hashSeed, ransomGlyphs, type RansomGlyph } from '@/lib/collage';
import { markReady, playOnReveal } from '@/lib/reveal';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  /** Defaults to a hash of the text, so the same words are always cut from the same papers. */
  seed?: number;
  /** Letters are pasted on one by one when the component enters the page. */
  paste?: boolean;
  lang?: string;
}

/**
 * Ransom-note lettering: each character cut from a different paper and typeface, pasted at its own angle.
 * The real text is kept for assistive technology; the cut-outs are presentation only. Hovering makes the
 * scraps flutter as if someone just breathed on the page.
 */
export default function RansomText({ text, as: Tag = 'span', className, seed, paste = true, lang }: Props) {
  const ref = useRef<HTMLElement>(null);
  const glyphs = useMemo(() => ransomGlyphs(text, seed ?? hashSeed(text)), [text, seed]);
  const words = useMemo(() => {
    const out: RansomGlyph[][] = [[]];
    glyphs.forEach((g) => (g.space ? out.push([]) : out[out.length - 1].push(g)));
    return out.filter((w) => w.length);
  }, [glyphs]);

  const { contextSafe } = useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const letters = gsap.utils.toArray<HTMLElement>('[data-l]', root);
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, (_ctx, safe) => {
        if (!paste) return;
        gsap.set(letters, { opacity: 0, y: -70, rotation: () => gsap.utils.random(-50, 50), scale: 1.5 });
        markReady(root);
        return playOnReveal(safe, () => {
          gsap.to(letters, {
            opacity: 1,
            y: (_i, el: HTMLElement) => Number(el.dataset.y),
            rotation: (_i, el: HTMLElement) => Number(el.dataset.r),
            scale: (_i, el: HTMLElement) => Number(el.dataset.s),
            duration: 0.55,
            ease: 'back.out(2.4)',
            stagger: { each: 0.045, from: 'random' },
          });
        });
      });
      markReady(root);
    },
    { scope: ref, dependencies: [text] },
  );

  const flutter = contextSafe(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.utils.toArray<HTMLElement>('[data-l]', root).forEach((el, i) => {
      gsap
        .timeline({ delay: i * 0.012 })
        .to(el, {
          rotation: Number(el.dataset.r) + gsap.utils.random(-14, 14),
          y: Number(el.dataset.y) - gsap.utils.random(2, 9),
          duration: 0.18,
          ease: 'power2.out',
        })
        .to(el, { rotation: Number(el.dataset.r), y: Number(el.dataset.y), duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    });
  });

  return (
    <Tag
      ref={ref}
      className={`ransom ${className ?? ''}`}
      lang={lang}
      onPointerEnter={flutter}
      data-fx-hide={paste ? '' : undefined}
    >
      <span className="sr-only">{text}</span>
      <span className="ransom-letters" aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi} className="ransom-word">
            {word.map((g, gi) => (
              <span
                key={gi}
                data-l=""
                data-r={g.rotate}
                data-s={g.scale}
                data-y={g.lift}
                className={`ransom-l ransom-${g.paper} ransom-f-${g.font}`}
                style={{ transform: `translateY(${g.lift}px) rotate(${g.rotate}deg) scale(${g.scale})` }}
              >
                {g.char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
