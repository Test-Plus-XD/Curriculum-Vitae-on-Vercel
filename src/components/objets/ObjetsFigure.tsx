'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import Scramble from '../fx/Scramble';
import { Tape } from '../collage/Paper';
import { onPageReveal } from '@/lib/reveal';
import Stamp from '../collage/Stamp';
import { FOUND_OBJECTS } from './objects';

const ObjetsCanvas = dynamic(() => import('./ObjetsCanvas'), { ssr: false });

type State = 'waiting' | 'loading' | 'ready' | 'failed';

interface Props {
  className?: string;
}

/**
 * The found-object mobile: four hung readymades printed as halftone cut-outs, on a wire drawn in the page.
 * The WebGL code (and three.js) is only fetched once the page is idle and the figure is near the viewport;
 * until then a dotted cutting line holds its place. If WebGL is unavailable the figure removes itself.
 * Screen only.
 */
export default function ObjetsFigure({ className = '' }: Props) {
  const t = useTranslations('objets');
  const stageRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>('waiting');

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idle = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const go = () => setState((s) => (s === 'waiting' ? 'loading' : s));
        if (w.requestIdleCallback) idle = w.requestIdleCallback(go, { timeout: 1200 });
        else timer = window.setTimeout(go, 400);
      },
      { rootMargin: '400px 0px' },
    );
    // Not while the opening (or a page transition) covers the page: one WebGL scene at a time.
    const offReveal = onPageReveal(() => io.observe(el));
    return () => {
      offReveal();
      io.disconnect();
      if (idle) w.cancelIdleCallback?.(idle);
      clearTimeout(timer);
    };
  }, []);

  const onReady = useCallback(() => setState((s) => (s === 'loading' ? 'ready' : s)), []);
  const onFail = useCallback(() => setState('failed'), []);

  const catalogue = FOUND_OBJECTS.map((o, i) => `№ ${i + 1} ${t(`names.${o.key}`)}`).join(' · ');

  return (
    <figure className={`objets no-print ${className}`} data-state={state} aria-label={t('label')}>
      <div ref={stageRef} className="objets-stage">
        <svg className="objets-rig" viewBox="0 0 800 430" preserveAspectRatio="none" aria-hidden="true">
          <path className="objets-arm" d="M -20 26 C 220 16, 560 34, 820 20" />
          <rect className="objets-tape" data-tape="" x={-8} y={19} width={30} height={15} transform="rotate(-4 7 27)" />
          <rect className="objets-tape" data-tape="" x={772} y={18} width={30} height={15} transform="rotate(3 787 26)" />
          {FOUND_OBJECTS.map((object, i) => {
            const x = 110 + i * 193;
            const tagY = 138 + (i % 3) * 30;
            return (
              <g key={object.key}>
                <rect className="objets-clamp" data-clamp="" x={x - 4} y={21} width={8} height={11} />
                <line className="objets-string" data-sling="" x1={x} y1={26} x2={x} y2={300} />
                <g className="objets-tag" data-sling-tag="" transform={`translate(${x} ${tagY}) rotate(-4)`}>
                  <rect x={-27} y={-14} width={54} height={27} />
                  <text x={0} y={5} textAnchor="middle">
                    № {i + 1}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
        {(state === 'loading' || state === 'ready') && <ObjetsCanvas onReady={onReady} onFail={onFail} />}
        <span className="objets-cut" aria-hidden="true" />
        <Stamp
          className="objets-stamp"
          ring={t('stampRing')}
          centre={t('stampCentre')}
          sub={t('stampSub')}
          size={124}
          rotate={-13}
        />
      </div>
      <figcaption className="objets-label">
        <Tape className="tape-tl" />
        <span className="objets-kicker">
          <Scramble text={t('series')} delay={220} />
        </span>
        <span className="objets-after">{t('after')}</span>
        <span className="objets-note">{t('note')}</span>
        <span className="objets-catalogue">{catalogue}</span>
        <span className="objets-hint">{t('swingHint')}</span>
      </figcaption>
    </figure>
  );
}