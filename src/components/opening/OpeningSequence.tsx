'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import { REVEAL_EVENT } from '@/lib/reveal';
import type { Stage } from '../readymade/stage';
import OpeningStage from './OpeningStage';
import type { PolyPiece } from './poly';
import type { HandPiece } from './scene';
import { buildOpening, LABELS } from './timeline';

/** If the timeline stalls (throttled frames), finish anyway this long after the end label. */
const FAILSAFE_MS = (LABELS.end + 1.9) * 1000;
const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);
/** Counts runs of the opening, so a revert can tell a Strict Mode remount from a real stop. */
let runs = 0;

/**
 * The title sequence on a fresh visit. The markup is server-rendered (so the first paint is already the black
 * sheet) but only shown when the pre-paint gate set `html[data-opening="on"]`; otherwise this renders nothing.
 *
 * While it plays, `data-cover="on"` holds every entrance animation back. When Sputnik's ribbon starts to open
 * its window onto the page, the cover is lifted and `fx:reveal` is dispatched from a fresh task, so the page
 * starts its entrances inside the window. Any key, click, tap, wheel or touch scroll skips to the page.
 *
 * Everything lives in one GSAP context: the master timeline, and the 3D hand's tweens (added to the master once
 * three.js and the model have loaded — or, if they are late, the baked print rises instead).
 */
export default function OpeningSequence() {
  const t = useTranslations('opening');
  const zh = useLocale() === 'zh-hk';
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      const html = document.documentElement;
      if (!root || html.dataset.opening !== 'on') {
        setDone(true);
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, (_ctx, contextSafe) => {
        const run = ++runs;
        // Scripts are running: the CSS failsafe (for a page whose scripts never run) is no longer needed, and
        // must not hide an opening that is still waiting for its background tab to be looked at.
        html.style.animation = 'none';
        root.style.animation = 'none';
        const safe = <A extends unknown[]>(fn: (...args: A) => void) => (contextSafe ? (contextSafe(fn) as (...args: A) => void) : fn);
        const tall = window.matchMedia('(max-aspect-ratio: 1/1)').matches;
        const coarse = window.matchMedia('(pointer: coarse)').matches;
        const params = new URLSearchParams(window.location.search);
        const seek = params.has('at') ? Number(params.get('at')) : NaN;

        let revealed = false;
        let finished = false;
        let skipping = false;
        let disposed = false;
        let failsafe = 0;
        let poll = 0;
        let stage: Stage | null = null;
        let piece: HandPiece | null = null;
        let poly: PolyPiece | null = null;
        const host = root.querySelector<HTMLElement>('[data-op="hand-host"]')!;
        const polyHost = root.querySelector<HTMLElement>('[data-op="poly-host"]')!;

        // Lift the cover from a fresh task, so no entrance animation ever runs inside this context.
        const release = () => {
          if (revealed) return;
          revealed = true;
          window.setTimeout(() => {
            html.dataset.cover = 'off';
            window.dispatchEvent(new Event(REVEAL_EVENT));
          }, 0);
        };

        const teardown = () => {
          disposed = true;
          window.clearTimeout(failsafe);
          window.clearInterval(poll);
          gsap.ticker.remove(frame);
          window.removeEventListener('keydown', onKey);
          window.removeEventListener('wheel', skip);
          window.removeEventListener('touchmove', skip);
          window.removeEventListener('resize', onResize);
          document.removeEventListener('visibilitychange', onVisible);
          root.removeEventListener('pointerdown', skip);
          stage?.dispose();
          stage = null;
          poly?.dispose();
          poly = null;
        };

        const finish = () => {
          if (finished) return;
          finished = true;
          release();
          teardown();
          opening.master.kill();
          delete html.dataset.opening;
          html.style.removeProperty('animation');
          setDone(true);
        };

        const opening = buildOpening({
          root,
          tall,
          zh,
          slug: [t('slugTop'), t('slugBottom')],
          onReveal: release,
          onEnd: finish,
        });

        if (process.env.NODE_ENV !== 'production') {
          (window as Window & { __opening?: unknown }).__opening = { opening, run, piece: () => piece, stage: () => stage, poly: () => poly };
        }

        // One loop for both WebGL layers, at about 30 fps on touch devices: the low-poly layer from the
        // start, the hand once it is due.
        const minFrame = coarse ? 1 / 31 : 0;
        let pending = 0;
        let time = 0;
        function frame(_t: number, deltaMs: number) {
          if (!poly && !piece) return;
          pending += Math.min(deltaMs, 50) / 1000;
          if (pending < minFrame) return;
          const dt = Math.min(pending, 0.05);
          pending = 0;
          time += dt;
          if (poly) {
            poly.update(time, dt);
            poly.render();
          }
          if (piece && stage && opening.master.time() >= LABELS.hand - 0.1) {
            piece.update(time, dt);
            stage.render();
          }
        }
        gsap.ticker.add(frame);

        const canvasIn = (parent: HTMLElement) => {
          const canvas = document.createElement('canvas');
          canvas.setAttribute('aria-hidden', 'true');
          parent.appendChild(canvas);
          return canvas;
        };

        // three.js loads straight away. The low-poly layer needs no assets, so it is usually in time for the
        // solids; the hand (and its model) is due at 3.95 s.
        import('./poly')
          .then(({ buildPoly }) => {
            if (disposed) return;
            const factory = buildPoly(canvasIn(polyHost), polyHost, { tall, coarse });
            safe(() => {
              poly = opening.attachPoly(factory);
            })();
            if (!poly) factory(gsap.timeline({ paused: true }), opening.cam, LABELS).dispose();
          })
          .catch(() => {
            // No WebGL: the poster plays without its solids and the printed Sputnik flies.
          });

        Promise.all([import('../readymade/stage'), import('./scene')])
          .then(async ([{ createStage }, { buildHand }]) => {
            if (disposed) return;
            const created = createStage(canvasIn(host), host, {
              fov: 28,
              maxPixelRatio: coarse ? 1.25 : 1.5,
              print: { cell: 3.2, margin: 6, shadow: [8, 10], shadowStrength: 0.42, black: 0.1, white: 0.86, gamma: 1.22, seed: 4.1 },
            });
            stage = created;
            const factory = await buildHand(created, { narrow: tall });
            if (disposed) return;
            safe(() => {
              piece = opening.attachHand(factory, host);
              if (!piece) {
                created.dispose();
                stage = null;
              }
            })();
          })
          .catch(() => {
            // No WebGL, or the model failed: the baked print rises instead.
            stage?.dispose();
            stage = null;
          });

        const skip = safe(() => {
          if (finished || skipping) return;
          skipping = true;
          if (opening.master.time() >= LABELS.window) {
            opening.master.timeScale(3);
            return;
          }
          opening.master.pause();
          release();
          gsap.to(root, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: finish });
        });
        const onKey = (e: KeyboardEvent) => {
          if (!MODIFIERS.has(e.key)) skip();
        };
        const width = window.innerWidth;
        const onResize = () => {
          if (Math.abs(window.innerWidth - width) > 40) skip();
        };

        const start = safe(() => {
          if (Number.isFinite(seek)) {
            // A testing aid: ?intro=1&at=2.5 holds the opening at that moment (callbacks on the way still run).
            // The hand is attached before the seek, so wait for it (or give up after 4 s).
            const hold = () => opening.master.pause(seek, false);
            if (seek < LABELS.hand) hold();
            else {
              let waited = 0;
              poll = window.setInterval(() => {
                waited += 100;
                if (disposed || (!piece && waited < 4000)) return;
                window.clearInterval(poll);
                hold();
              }, 100);
            }
            return;
          }
          opening.master.play(0);
          failsafe = window.setTimeout(safe(finish), FAILSAFE_MS);
        });
        // A tab opened in the background starts its opening when it is first looked at.
        function onVisible() {
          if (document.visibilityState !== 'visible') return;
          document.removeEventListener('visibilitychange', onVisible);
          start();
        }

        root.addEventListener('pointerdown', skip);
        window.addEventListener('keydown', onKey);
        window.addEventListener('wheel', skip, { passive: true });
        window.addEventListener('touchmove', skip, { passive: true });
        window.addEventListener('resize', onResize);
        if (document.visibilityState === 'visible') start();
        else document.addEventListener('visibilitychange', onVisible);

        return () => {
          if (finished) return;
          finished = true;
          teardown();
          // Reverted: unmounted, or the motion preference changed — give the page back. In development, Strict
          // Mode reverts and re-runs at once; the new run then owns the opening, so leave the page covered.
          window.setTimeout(() => {
            if (runs !== run) return;
            release();
            delete html.dataset.opening;
            html.style.removeProperty('animation');
            root.style.clipPath = '';
            setDone(true);
          }, 0);
        };
      });
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div ref={rootRef} className="opening no-print">
      <div className="op-stage" aria-hidden="true">
        <OpeningStage copy={{ caption: t('caption'), slugTop: t('slugTop'), slugBottom: t('slugBottom'), strip: t('strip') }} zh={zh} />
      </div>
      <button type="button" className="label-tape op-skip">
        {t('skip')}
      </button>
    </div>
  );
}
