'use client';

import { useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Pause, Play } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, FULL_MOTION } from '@/lib/gsap';
import { playOnReveal } from '@/lib/reveal';
import { Tape } from '../collage/Paper';

/// The stage every animated abstract plays on. A work supplies its drawing and a `build` function; the stage owns
/// everything shared, so no work has to get it right alone: the page-reveal wait, playing only while on screen,
/// the pause control and the GSAP context. The markup a work renders must be its finished, readable frame, because
/// that is what no-JavaScript and reduced-motion visitors get: under reduced motion `build` never runs at all.
/// The stage also closes each loop on itself: see `closeLoop`.

export const VIEW_WIDTH = 640;
export const VIEW_HEIGHT = 360;
// How long, in seconds, the veil takes to cover the drawing at the end of a loop and to clear at the start of the next.
const DISSOLVE = 0.4;

// Selects inside this work's SVG only, so two works can never touch each other's elements.
export type AbstractSelector = (selector: string) => Element[];

interface StageProps {
  label: string;
  caption: string;
  build: (q: AbstractSelector) => gsap.core.Timeline;
  children: ReactNode;
}

// Hides the restart of a loop. A work's last frame and its first have little in common, so a plain repeat would cut
// between them. A veil of the sheet's own paper rises over the last of the repeat delay and clears as the next pass
// begins, which also dissolves the parts of the drawing that never animate. The delay moves inside the timeline to
// carry the veil, so a cycle keeps its length; a work needs no code of its own for this.
function closeLoop(loop: gsap.core.Timeline, svg: SVGSVGElement) {
  const veil = svg.querySelector('.abstract-veil');
  veil?.setAttribute('fill', svg.firstElementChild?.getAttribute('fill') ?? 'none');
  const held = loop.duration() + loop.repeatDelay() - DISSOLVE;
  loop.repeatDelay(0);
  loop.fromTo(veil, { opacity: 1 }, { opacity: 0, duration: DISSOLVE, ease: 'none' }, 0);
  loop.to(veil, { opacity: 1, duration: DISSOLVE, ease: 'none' }, held);
}

// A taped print holding one looping SVG. The loop runs only while the figure is on screen, and a visitor's pause
// (required for any motion over five seconds) outlives scrolling away and back. `build` runs inside the handler's
// context, so its tweens are reverted with everything else when the page changes.
export default function AbstractStage({ label, caption, build, children }: StageProps) {
  const t = useTranslations('project');
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const userPaused = useRef(false);
  const inView = useRef(false);
  const [paused, setPaused] = useState(false);
  const [animated, setAnimated] = useState(false);

  // Play only if the figure is on screen and the visitor has not paused it.
  const sync = () => {
    const loop = timeline.current;
    if (!loop) return;
    if (inView.current && !userPaused.current) loop.play();
    else loop.pause();
  };

  useGSAP(
    () => {
      const figure = root.current;
      const svg = figure?.querySelector('svg');
      if (!figure || !svg) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, (_context, contextSafe) => {
        const loop = build(gsap.utils.selector(svg) as AbstractSelector);
        closeLoop(loop, svg);
        loop.pause();
        timeline.current = loop;
        setAnimated(true);
        const off = playOnReveal(contextSafe, () => {
          ScrollTrigger.create({
            trigger: figure,
            start: 'top 88%',
            end: 'bottom 12%',
            onToggle: (self) => {
              inView.current = self.isActive;
              sync();
            },
          });
        });
        return () => {
          off();
          timeline.current = null;
          inView.current = false;
          setAnimated(false);
        };
      });
    },
    { scope: root },
  );

  // Flip the visitor's choice and apply it to the running loop.
  const toggle = () => {
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    sync();
  };

  return (
    <figure ref={root} className="abstract-figure no-print">
      <Tape className="tape-top" />
      <div className="abstract-plate">
        <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="abstract-svg" role="img" aria-label={label}>
          {children}
          <rect className="abstract-veil" width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="none" opacity="0" />
        </svg>
        {animated && (
          <button type="button" className="abstract-toggle" onClick={toggle} aria-label={paused ? t('abstractPlay') : t('abstractPause')}>
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </button>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}