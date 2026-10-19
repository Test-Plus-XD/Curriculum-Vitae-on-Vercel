'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import Scramble from '../fx/Scramble';
import { Tape } from '../collage/Paper';
import { onPageReveal } from '@/lib/reveal';
import type { WorkName } from './works';

const ReadymadeCanvas = dynamic(() => import('./ReadymadeCanvas'), { ssr: false });

type State = 'waiting' | 'loading' | 'ready' | 'failed';

interface Props {
  work: WorkName;
  /** Catalogue number on the label. */
  number: number;
  className?: string;
}

/**
 * A "readymade": a 3D object printed as a halftone photomontage cut-out, with a museum label. The WebGL code
 * (and three.js) is only fetched once the page is idle and the figure is near the viewport; until then a
 * dotted cutting line holds its place. If WebGL is unavailable the figure removes itself. Screen only.
 */
export default function ReadymadeFigure({ work, number, className = '' }: Props) {
  const t = useTranslations('readymade');
  const stageRef = useRef<HTMLDivElement>(null);
  const actRef = useRef<(() => void) | null>(null);
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

  const onReady = useCallback((act: (() => void) | null) => {
    actRef.current = act;
    if (act) setState('ready');
  }, []);
  const onFail = useCallback(() => setState('failed'), []);

  return (
    <figure className={`readymade readymade-${work} no-print ${className}`} data-state={state}>
      <div ref={stageRef} className="readymade-stage" data-cursor="">
        {(state === 'loading' || state === 'ready') && <ReadymadeCanvas work={work} onReady={onReady} onFail={onFail} />}
        <span className="readymade-cut" aria-hidden="true" />
      </div>
      <figcaption className="readymade-label">
        <Tape className="tape-tl" />
        <span className="readymade-kicker">
          <Scramble text={t('series', { number })} delay={200} />
        </span>
        <span className="readymade-artist">{t(`${work}.artist`)}</span>
        <span className="readymade-title font-title">{t(`${work}.title`)}</span>
        <span className="readymade-note">{t(`${work}.note`)}</span>
        <button type="button" className="readymade-action" onClick={() => actRef.current?.()} disabled={state !== 'ready'}>
          <span aria-hidden="true">↻</span> {t(`${work}.action`)}
        </button>
      </figcaption>
    </figure>
  );
}
