'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { gsap, ScrollTrigger, Draggable, prefersReducedMotion } from '@/lib/gsap';
import { onPageReveal } from '@/lib/reveal';
import { createStage, type Stage } from './stage';
import { WORKS, type WorkName } from './works';
import type { Piece } from './works/types';

interface Props {
  work: WorkName;
  /** Receives the piece's action once it is running (null again on unmount). */
  onReady: (act: (() => void) | null) => void;
  onFail: () => void;
}

/**
 * The WebGL side of a readymade: creates the stage, builds the piece, plays its entrance once the page is
 * revealed and the figure is in view, and drives it every frame while visible. All GSAP work lives in one
 * context, reverted on unmount; the stage disposes every geometry, material and texture.
 */
export default function ReadymadeCanvas({ work, onReady, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const locale = useLocale();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const entry = WORKS[work];

    let stage: Stage;
    try {
      stage = createStage(canvas, host, entry.stage);
    } catch {
      onFail();
      return;
    }

    const ctx = gsap.context(() => {});
    const reduced = prefersReducedMotion();
    // Phones draw at most 30 frames a second: the halftone does not need more, and the battery will thank us.
    const minFrame = window.matchMedia('(pointer: coarse)').matches ? 1 / 31 : 0;
    let piece: Piece | null = null;
    let disposed = false;
    let visible = false;
    let revealed = false;
    let started = false;
    let time = 0;
    let pending = 0;
    let offReveal = () => {};
    const cleanups: (() => void)[] = [];

    const draw = () => {
      if (!piece) return;
      piece.update(time, 0);
      stage.render();
    };
    const frame = (_t: number, deltaMs: number) => {
      if (!visible || !piece) return;
      pending += Math.min(deltaMs, 50) / 1000;
      if (pending < minFrame) return;
      const dt = Math.min(pending, 0.05);
      pending = 0;
      time += dt;
      piece.update(time, dt);
      stage.render();
    };
    const start = () => {
      if (started || !piece || !revealed || !visible) return;
      started = true;
      piece.intro.play();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      if (stage.resize()) draw();
    });
    ro.observe(host);

    entry
      .build(stage, { locale })
      .then((animate) => {
        if (disposed) return;
        ctx.add(() => {
          piece = animate();
          const current = piece;

          // Pointer: mouse and pen only, so a finger scrolling past never turns the piece.
          const onMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            const r = host.getBoundingClientRect();
            current.look?.(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
          };
          const onLeave = () => current.look?.(0, 0);
          host.addEventListener('pointermove', onMove);
          host.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            host.removeEventListener('pointermove', onMove);
            host.removeEventListener('pointerleave', onLeave);
          });

          ScrollTrigger.create({
            trigger: host,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => current.scroll?.(self.progress, self.getVelocity()),
          });

          const act = ctx.add('act', () => current.act()) as () => void;
          if (entry.drag) {
            // Horizontal drags spin; vertical touch scrolling is left to the browser; a plain click acts.
            const [draggable] = Draggable.create(document.createElement('div'), {
              trigger: host,
              type: 'x',
              allowNativeTouchScrolling: true,
              onDrag(this: Draggable) {
                current.drag?.(this.deltaX);
              },
              onClick: act,
            });
            cleanups.push(() => draggable.kill());
          } else {
            host.addEventListener('click', act);
            cleanups.push(() => host.removeEventListener('click', act));
          }

          if (reduced) {
            // One still frame of the finished piece.
            piece.intro.progress(1);
            draw();
          } else {
            gsap.ticker.add(frame);
            offReveal = onPageReveal(() => {
              revealed = true;
              start();
            });
          }
          onReady(act);
        });
      })
      .catch(() => {
        if (!disposed) onFail();
      });

    return () => {
      disposed = true;
      onReady(null);
      offReveal();
      gsap.ticker.remove(frame);
      io.disconnect();
      ro.disconnect();
      cleanups.forEach((fn) => fn());
      ctx.revert();
      stage.dispose();
    };
  }, [work, locale, onReady, onFail]);

  return <canvas ref={canvasRef} className="readymade-canvas" aria-hidden="true" />;
}
