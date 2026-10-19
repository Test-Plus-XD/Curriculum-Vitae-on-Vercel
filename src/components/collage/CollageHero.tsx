'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap, useGSAP, ScrollTrigger, Draggable, FULL_MOTION, FINE_POINTER, prefersReducedMotion } from '@/lib/gsap';
import { isOpening, markReady, onPageSettled, playOnReveal } from '@/lib/reveal';
import { thumbnailUrl } from '@/lib/youtube';
import type { MerzbauContent } from './MerzbauScene';
import RansomText from './RansomText';
import Stamp from './Stamp';
import { LabelTape, NewsScrap, Seal, Tape, Torn } from './Paper';
import Scramble from '../fx/Scramble';

const loadMerzbau = () => import('./MerzbauScene');
const MerzbauScene = dynamic(loadMerzbau, { ssr: false });

export interface CollageHeroProps {
  label: string;
  kicker: string;
  nameLines: string[];
  zhName: [string, string, string];
  title: string;
  typed: string;
  cue: string;
  dragHint: string;
  thumbs: { id: string; caption: string }[];
  news: { headline: string; lines: string[] };
  stamp: { ring: string; centre: string; sub: string };
  merz: MerzbauContent;
}

// Resting places in the right-hand cluster (percent of the cluster box) and resting angles.
const SPOTS = [
  { left: 0, top: 0, rotate: -7 },
  { left: 58, top: 3, rotate: 5 },
  { left: 52, top: 62, rotate: -3 },
];

/**
 * Landing photomontage, screen only. Over the Three.js Merzbau, the name is pasted up from ransom-note
 * letters beside a vermilion name chop, an ink stamp, newsprint and duotone scraps of real project footage —
 * all draggable. The centre of the cluster is left open for the 3D red wedge. Scrolling down scatters the
 * collage and moves the camera into it.
 */
export default function CollageHero(props: CollageHeroProps) {
  const { label, kicker, nameLines, zhName, title, typed, cue, dragHint, thumbs, news, stamp } = props;
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [showScene, setShowScene] = useState(false);
  const merz = useMemo(() => props.merz, [props.merz]);
  const onFail = useCallback(() => setShowScene(false), []);

  // Mount the WebGL scene once the page is revealed and idle, so it never competes with first paint, and not
  // until the opening sequence has finished: building it (canvas-painted scraps, shaders) during the opening's
  // last frames would stall the hand-over. Its code is fetched and parsed while the opening plays, so the
  // mount itself is quick.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let id = 0;
    let t = 0;
    let warm = 0;
    if (isOpening()) {
      if (w.requestIdleCallback) warm = w.requestIdleCallback(() => void loadMerzbau().catch(() => {}), { timeout: 2500 });
      else void loadMerzbau().catch(() => {});
    }
    const offSettled = onPageSettled(() => {
      if (w.requestIdleCallback) id = w.requestIdleCallback(() => setShowScene(true), { timeout: 1500 });
      else t = window.setTimeout(() => setShowScene(true), 600);
    });
    return () => {
      offSettled();
      if (id) w.cancelIdleCallback?.(id);
      if (warm) w.cancelIdleCallback?.(warm);
      clearTimeout(t);
    };
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Scroll: scatter the collage and drive the 3D camera.
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      mm.add(FULL_MOTION, (_ctx, safe) => {
        const frags = q('[data-scatter]');
        const papers = q('[data-paste]');
        gsap.set(papers, { opacity: 0, scale: 1.4, y: -24, rotation: () => gsap.utils.random(-22, 22) });
        gsap.set(q('[data-rise]'), { opacity: 0, y: 26 });
        markReady(root);

        gsap
          .timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 } })
          .to(
            frags,
            {
              x: () => gsap.utils.random(-260, 260),
              y: () => gsap.utils.random(-320, -80),
              rotation: () => gsap.utils.random(-60, 60),
              opacity: 0.15,
              ease: 'none',
            },
            0,
          )
          .to(q('.hero-left'), { y: -160, opacity: 0.25, ease: 'none' }, 0);

        return playOnReveal(safe, () => {
          gsap.to(papers, {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 0.7,
            ease: 'back.out(1.8)',
            stagger: { each: 0.09, from: 'random' },
            delay: 0.35,
          });
          gsap.to(q('[data-rise]'), { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.5 });
        });
      });

      // Scraps can be picked up and thrown around (fine pointers only, so touch scrolling is untouched).
      mm.add(FINE_POINTER, () => {
        const reduced = prefersReducedMotion();
        const draggables = Draggable.create(q('[data-drag]'), {
          type: 'x,y',
          bounds: root,
          inertia: !reduced,
          zIndexBoost: true,
          onPress(this: Draggable) {
            gsap.to(this.target, { scale: 1.06, duration: 0.2, overwrite: 'auto' });
            this.target.classList.add('is-lifted');
          },
          onRelease(this: Draggable) {
            gsap.to(this.target, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
            this.target.classList.remove('is-lifted');
          },
        });
        return () => draggables.forEach((d) => d.kill());
      });
      markReady(root);
    },
    { scope: rootRef },
  );

  const scrollToSheet = () => {
    document.getElementById('cv-sheet')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section ref={rootRef} className="collage-hero no-print" aria-label={label} data-fx-hide="">
      <div className="hero-merz" aria-hidden="true">
        {showScene && <MerzbauScene content={merz} progressRef={progressRef} onFail={onFail} />}
      </div>

      <div className="hero-board">
        <div className="hero-left">
          <p data-rise="">
            <LabelTape className="hero-kicker">
              <Scramble text={kicker} delay={500} />
            </LabelTape>
          </p>
          <div className="hero-name">
            {nameLines.map((line, i) => (
              <RansomText key={line} as="p" text={line} seed={1916 + i * 7} className="hero-ransom" />
            ))}
          </div>
          <p data-rise="">
            <LabelTape className="hero-title">{title}</LabelTape>
          </p>
          <p className="hero-typed" data-rise="">
            <Scramble text={typed} delay={800} speed={14} />
          </p>
          <button type="button" className="hero-cue" onClick={scrollToSheet} data-rise="">
            <span className="hero-cue-hand" aria-hidden="true">
              ☞
            </span>
            <Scramble text={cue} delay={1100} />
          </button>
        </div>

        <div className="hero-cluster" aria-hidden="true">
          {thumbs.slice(0, 3).map((thumb, i) => {
            const spot = SPOTS[i];
            return (
              <div
                key={thumb.id}
                className="frag frag-photo"
                data-scatter=""
                style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
              >
                <div className="frag-drag" data-drag="" data-cursor="">
                  <div className="frag-paper" data-paste="">
                    <div className="photo-wrap" style={{ transform: `rotate(${spot.rotate}deg)` }}>
                      <Torn
                        seed={`photo-${thumb.id}`}
                        sides={['top', 'right', 'bottom', 'left']}
                        depth={7}
                        className="photo-scrap"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- duotone photomontage of YouTube thumbnails */}
                        <img src={thumbnailUrl(thumb.id)} alt="" draggable={false} />
                        <span className="photo-caption">{thumb.caption}</span>
                      </Torn>
                      <Tape className="tape-tl" />
                      {i !== 1 && <Tape className="tape-br" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="frag frag-seal" data-scatter="" style={{ left: '27%', top: '25%' }}>
            <div className="frag-drag" data-drag="" data-cursor="">
              <div className="frag-paper" data-paste="">
                <Seal chars={zhName} />
              </div>
            </div>
          </div>

          <div className="frag frag-news" data-scatter="" style={{ left: '9%', top: '71%' }}>
            <div className="frag-drag" data-drag="" data-cursor="">
              <div className="frag-paper" data-paste="">
                <NewsScrap seed="hero-news" headline={news.headline} lines={news.lines} />
              </div>
            </div>
          </div>

          <div className="frag frag-stamp" data-scatter="" style={{ left: '76%', top: '41%' }}>
            <div className="frag-drag" data-drag="" data-cursor="">
              <Stamp ring={stamp.ring} centre={stamp.centre} sub={stamp.sub} size={150} rotate={-14} />
            </div>
          </div>

          <p className="hero-drag-hint">
            <Scramble text={dragHint} delay={1400} />
          </p>
        </div>
      </div>
    </section>
  );
}
