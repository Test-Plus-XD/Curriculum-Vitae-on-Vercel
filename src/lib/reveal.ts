'use client';

/**
 * Coordination between the page-transition cover and entrance animations. While the cover is on screen
 * (`<html data-cover="on">`), entrance animations wait for the `fx:reveal` event so they play in view
 * instead of behind the cover.
 */
export const REVEAL_EVENT = 'fx:reveal';

export function isCovered(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.cover === 'on';
}

export function onPageReveal(callback: () => void): () => void {
  if (!isCovered()) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(REVEAL_EVENT, handler, { once: true });
  return () => window.removeEventListener(REVEAL_EVENT, handler);
}

/**
 * Run `play` once the page is revealed, wrapped in the given GSAP context so its animations are reverted
 * with that context. Inside a `gsap.matchMedia()` handler, pass the handler's own `contextSafe` (its second
 * argument) — never useGSAP's, which would make the two contexts reference each other and recurse on revert.
 * Returns a cleanup function, so it can be returned straight from the handler.
 */
export function playOnReveal(contextSafe: ((fn: () => void) => unknown) | undefined, play: () => void): () => void {
  const safe = contextSafe ? (contextSafe(play) as () => void) : play;
  return onPageReveal(safe);
}

/** Dispatched once the opening sequence has finished and been taken down (or skipped). */
export const OPENING_END_EVENT = 'fx:opening-end';

export function isOpening(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.opening === 'on';
}

/**
 * Run `callback` once the page is revealed and no opening sequence is playing. For heavy work — mounting a
 * WebGL scene, painting canvas textures — that would otherwise compete with the opening's last frames, when
 * its window onto the page is already showing the entrances. Returns a cleanup function.
 */
export function onPageSettled(callback: () => void): () => void {
  let offEnd = () => {};
  const offReveal = onPageReveal(() => {
    if (!isOpening()) {
      callback();
      return;
    }
    const handler = () => callback();
    window.addEventListener(OPENING_END_EVENT, handler, { once: true });
    offEnd = () => window.removeEventListener(OPENING_END_EVENT, handler);
  });
  return () => {
    offReveal();
    offEnd();
  };
}

/** Mark an element as initialised so the pre-hide CSS (`.js-fx [data-fx-hide]`) stops applying. */
export function markReady(el: Element | null | undefined) {
  el?.classList.add('fx-ready');
}
