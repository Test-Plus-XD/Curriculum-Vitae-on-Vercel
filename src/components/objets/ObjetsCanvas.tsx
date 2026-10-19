'use client';

import { useRef } from 'react';
import { useGSAP, gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { onPageReveal } from '@/lib/reveal';
import { createStage, type Stage } from '../readymade/stage';
import { buildObjets, type ObjetsPiece } from './scene';

interface Props {
  onReady: () => void;
  onFail: () => void;
}

interface Anchor {
  x: number;
  y: number;
}

/**
 * The WebGL side of the found-object mobile: creates the readymade stage, hangs the prints, plays the drop-in
 * once the page is revealed and the figure is in view, and drives the mobile every frame while visible. The
 * strings and catalogue tags live in the figure's SVG; every frame their ends are moved to the projected
 * hanging points, so the wire and the prints stay tied together through the entrance and the pointer parallax.
 *
 * All GSAP work lives in the useGSAP context (reverted on unmount); the stage disposes every geometry,
 * material and texture.
 */
export default function ObjetsCanvas({ onReady, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    (context, contextSafe) => {
      const canvas = canvasRef.current;
      const host = canvas?.parentElement;
      const figure = host?.parentElement;
      if (!canvas || !host || !figure) return;
      const rig = figure.querySelector<SVGSVGElement>('.objets-rig');
      const arm = rig?.querySelector<SVGPathElement>('.objets-arm') ?? null;
      const lines = Array.from(rig?.querySelectorAll<SVGLineElement>('[data-sling]') ?? []);
      const tags = Array.from(rig?.querySelectorAll<SVGGElement>('[data-sling-tag]') ?? []);
      const clamps = Array.from(rig?.querySelectorAll<SVGRectElement>('[data-clamp]') ?? []);
      const tapes = Array.from(rig?.querySelectorAll<SVGRectElement>('[data-tape]') ?? []);

      let stage: Stage;
      try {
        stage = createStage(canvas, host, {
          fov: 32,
          // A finer screen and more ink than the big readymades: these prints are smaller, and their
          // mid-tones must not silt up into red mud.
          print: { cell: 3, margin: 5, shadow: [6, 8], shadowStrength: 0.38, black: 0.13, white: 0.8, gamma: 1.3, seed: 2.3 },
        });
      } catch {
        onFail();
        return;
      }

      const reduced = prefersReducedMotion();
      // Phones draw at most 30 frames a second; the halftone does not need more.
      const minFrame = window.matchMedia('(pointer: coarse)').matches ? 1 / 31 : 0;
      const toCss = { x: 0, y: 0 } as Anchor;
      let piece: ObjetsPiece | null = null;
      let disposed = false;
      let visible = false;
      let revealed = false;
      let started = false;
      let time = 0;
      let pending = 0;
      let offReveal = () => {};
      const cleanups: (() => void)[] = [];

      // Move the wire, strings and tags onto the object anchors (CSS px in the stage).
      const syncRig = () => {
        if (!rig || !piece) return;
        const w = Math.max(1, stage.width);
        const h = Math.max(1, stage.height);
        rig.setAttribute('viewBox', `0 0 ${w} ${h}`);
        const wireY = h * 0.06;
        // The tag is drawn in the rig's own CSS pixels, so it can run at full size on phones and zoomed pages.
        const tagScale = w < 480 ? 0.92 : w < 720 ? 0.96 : 1;
        arm?.setAttribute('d', `M -20 ${wireY} C ${w * 0.28} ${wireY - 6}, ${w * 0.66} ${wireY + 7}, ${w + 20} ${wireY - 2}`);
        tapes[0]?.setAttribute('y', String(wireY - 7));
        tapes[1]?.setAttribute('y', String(wireY - 8));
        lines.forEach((line, i) => {
          const tag = tags[i];
          const clamp = clamps[i];
          if (i >= piece!.count) {
            line.style.display = 'none';
            if (tag) tag.style.display = 'none';
            if (clamp) clamp.style.display = 'none';
            return;
          }
          piece!.anchor(i, toCss);
          line.setAttribute('x1', String(toCss.x));
          line.setAttribute('x2', String(toCss.x));
          line.setAttribute('y1', String(wireY));
          line.setAttribute('y2', String(toCss.y));
          clamp?.setAttribute('x', String(toCss.x - 4));
          clamp?.setAttribute('y', String(wireY - 5));
          if (tag) {
            // Tags ride the upper half of the string, alternating heights so neighbours never crowd each other.
            const tagY = wireY + (toCss.y - wireY) * (0.3 + (i % 2) * 0.2);
            tag.setAttribute('transform', `translate(${toCss.x} ${tagY}) rotate(-4) scale(${tagScale})`);
          }
        });
      };

      const draw = () => {
        if (!piece) return;
        piece.update(time, 0);
        syncRig();
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
        syncRig();
        stage.render();
      };

      const start = () => {
        if (started || !piece || !revealed || !visible) return;
        started = true;
        piece.intro.play();
      };

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        start();
      });
      io.observe(host);
      const ro = new ResizeObserver(() => {
        if (!stage.resize()) return;
        // Browser zoom and rotation change the stage box: re-frame the mobile, and re-hang it if the box
        // crossed the phone/wide breakpoint.
        piece?.layout();
        syncRig();
        draw();
      });
      ro.observe(host);

      buildObjets(stage)
        .then((animate) => {
          if (disposed) return;
          const run = () => {
            piece = animate();
            // The stage may have resized while the models were loading.
            piece.layout();

            // Pointer: mouse and pen only, so a finger scrolling past never tilts the mobile.
            const onMove = (event: PointerEvent) => {
              if (event.pointerType === 'touch') return;
              const r = host.getBoundingClientRect();
              piece!.look(((event.clientX - r.left) / r.width) * 2 - 1, -(((event.clientY - r.top) / r.height) * 2 - 1));
            };
            const onLeave = () => piece!.look(0, 0);
            host.addEventListener('pointermove', onMove);
            host.addEventListener('pointerleave', onLeave);
            cleanups.push(() => {
              host.removeEventListener('pointermove', onMove);
              host.removeEventListener('pointerleave', onLeave);
            });

            // A tap or click sets the prints swinging; nothing to set in motion under reduced motion.
            const onTap = () => piece!.gust();
            if (!reduced) {
              host.addEventListener('click', onTap);
              cleanups.push(() => host.removeEventListener('click', onTap));
            }

            ScrollTrigger.create({
              trigger: figure,
              start: 'top bottom',
              end: 'bottom top',
              onUpdate: (self) => piece!.scroll(self.progress),
            });

            if (reduced) {
              // One still frame of the finished mobile.
              piece.intro.progress(1);
              piece.update(0, 0);
              syncRig();
              stage.render();
            } else {
              gsap.ticker.add(frame);
              offReveal = onPageReveal(() => {
                revealed = true;
                start();
              });
            }
            onReady();
          };
          const safe = contextSafe ? contextSafe(run) : run;
          safe();
        })
        .catch(() => {
          if (!disposed) onFail();
        });

      return () => {
        disposed = true;
        offReveal();
        gsap.ticker.remove(frame);
        io.disconnect();
        ro.disconnect();
        cleanups.forEach((fn) => fn());
        stage.dispose();
      };
    },
    { scope: canvasRef },
  );

  return <canvas ref={canvasRef} className="objets-canvas" aria-hidden="true" />;
}