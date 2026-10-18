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

/** Mark an element as initialised so the pre-hide CSS (`.js-fx [data-fx-hide]`) stops applying. */
export function markReady(el: Element | null | undefined) {
  el?.classList.add('fx-ready');
}
