'use client';

import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION, FINE_POINTER } from '@/lib/gsap';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, [data-cursor]';

/**
 * A targeting reticle that trails the pointer and locks onto interactive elements (rotating 45° and
 * widening). While it is actually on screen it becomes the pointer: html.cursor-fx hides the system cursor
 * (see the cursor block in globals.css). It never hides the system cursor where that would cost
 * accessibility — a coarse pointer, reduced motion, forced colours, or a page whose scripts never ran all
 * keep the system cursor — and the class comes back off the moment the reticle stops. Fine pointers, full
 * motion only.
 *
 * The dot is the hotspot, so it is written straight from the pointer event (no tween, no wait for the next
 * tick); only the ring trails. A left press also prints the page in negative around the pointer: a disc that
 * fades from full strength at the centre to nothing at its rim, opens with a ripple, holds while the button is
 * down and ripples away on release (`.cursor-invert`, backdrop filters just beneath the reticle, so the
 * reticle itself is never inverted).
 */
export default function CursorReticle() {
  const ref = useRef<HTMLDivElement>(null);
  const invertRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    const layer = invertRef.current;
    if (!el || !layer) return;
    const mm = gsap.matchMedia();
    mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, () => {
      const ring = el.querySelector<HTMLElement>('[data-ring]');
      const dot = el.querySelector<HTMLElement>('[data-dot]');
      gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100, force3D: true });
      const rx = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power3.out' });
      const ry = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power3.out' });
      const dx = gsap.quickSetter(dot, 'x', 'px');
      const dy = gsap.quickSetter(dot, 'y', 'px');
      let locked = false;
      let shown = false;
      // Only decoration until a mouse moves; from then the reticle is the pointer, so the system cursor goes.
      const markCursor = () => document.documentElement.classList.add('cursor-fx');
      const unmarkCursor = () => document.documentElement.classList.remove('cursor-fx');

      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        if (!shown) {
          shown = true;
          markCursor();
          // Appear at once: the system cursor is already hidden, so it must not fade in from nothing.
          gsap.set(el, { autoAlpha: 1 });
        }
        rx(e.clientX);
        ry(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
        const target = (e.target as Element | null)?.closest?.(INTERACTIVE);
        if (!!target !== locked) {
          locked = !!target;
          gsap.to(ring, {
            scale: locked ? 1.7 : 1,
            rotation: locked ? 45 : 0,
            borderRadius: locked ? '2px' : '50%',
            duration: 0.35,
            ease: 'back.out(2)',
          });
          gsap.to(dot, { scale: locked ? 0 : 1, duration: 0.2 });
        }
      };
      const out = () => {
        shown = false;
        unmarkCursor();
        gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      };
      // Pen and finger are not this reticle's pointer: give the system cursor back instead of hiding it behind
      // a reticle that will not follow. A hybrid device moves between the mouse and the pen freely.
      const otherPointer = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' && shown) out();
      };
      // A negative print of the page under the click: a disc that opens with a ripple, holds (breathing) for as
      // long as the button is down, and on release swells and fades behind a second ripple.
      let held: { disc: HTMLElement; breathe: gsap.core.Tween; x: number; y: number } | null = null;
      const spot = (className: string, x: number, y: number) => {
        const node = document.createElement('span');
        node.className = className;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        layer.appendChild(node);
        return node;
      };
      const ripple = (x: number, y: number) => {
        const ring = spot('cursor-invert-ring', x, y);
        gsap.fromTo(
          ring,
          { scale: 0.2, autoAlpha: 1 },
          { scale: 1, autoAlpha: 0, duration: 0.95, ease: 'power2.out', onComplete: () => ring.remove() },
        );
      };
      const release = () => {
        if (!held) return;
        const { disc, breathe, x, y } = held;
        held = null;
        breathe.kill();
        ripple(x, y);
        gsap.to(disc, {
          scale: 1.3,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: true,
          onComplete: () => disc.remove(),
        });
      };
      const press = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        release();
        const { clientX: x, clientY: y } = e;
        const disc = spot('cursor-invert-disc', x, y);
        gsap.fromTo(disc, { scale: 0.08 }, { scale: 1, duration: 0.6, ease: 'expo.out' });
        const breathe = gsap.to(disc, { scale: 1.06, duration: 1.2, delay: 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        ripple(x, y);
        held = { disc, breathe, x, y };
      };
      const down = (e: PointerEvent) => {
        gsap.to(ring, { scale: '-=0.25', duration: 0.12, yoyo: true, repeat: 1 });
        press(e);
      };

      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointermove', otherPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', out);
      window.addEventListener('pointerdown', down);
      // Every way a press can end lets the negative go: release, a cancelled pointer (native drag, touch
      // takeover), the window losing focus, or the pointer leaving the page.
      window.addEventListener('pointerup', release);
      window.addEventListener('pointercancel', release);
      window.addEventListener('blur', release);
      document.documentElement.addEventListener('pointerleave', release);
      return () => {
        unmarkCursor();
        layer.replaceChildren();
        window.removeEventListener('pointerup', release);
        window.removeEventListener('pointercancel', release);
        window.removeEventListener('blur', release);
        document.documentElement.removeEventListener('pointerleave', release);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointermove', otherPointer);
        document.documentElement.removeEventListener('pointerleave', out);
        window.removeEventListener('pointerdown', down);
      };
    });
  });

  return (
    <>
      <div ref={invertRef} className="cursor-invert no-print" aria-hidden="true" />
      <div ref={ref} className="cursor-reticle no-print" aria-hidden="true">
        <span data-ring className="cursor-ring" />
        <span data-dot className="cursor-dot" />
      </div>
    </>
  );
}
