/**
 * The opening's pre-paint gate. It runs as an inline script in <head>, before the first paint, and decides
 * whether this document opens with the title sequence:
 *
 * - never under `prefers-reduced-motion: reduce`;
 * - `?intro=1` forces it and `?intro=0` skips it (for testing and for sharing a link without it);
 * - otherwise only a fresh visit plays it: a reload, or a navigation that arrived from outside the site
 *   (no referrer, or another origin). Language switches, links opened in a new tab from the site and
 *   back/forward loads all have a same-origin referrer or a `back_forward` type, so they skip it.
 *
 * When it plays, `<html>` gets `data-opening="on"` (CSS shows the overlay and locks the scroll) and
 * `data-cover="on"`, so every entrance animation waits for the opening's `fx:reveal`. It also preloads the
 * two images the overlay paints first. Any error leaves the page as it is: no opening.
 *
 * The body is a plain function body (it `return`s early) so tests can run it against stubbed globals.
 */
export const OPENING_GATE_BODY = `
var h = document.documentElement;
var q = /[?&]intro=([01])(?:&|$)/.exec(location.search);
if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var play;
if (q) {
  play = q[1] === '1';
} else {
  var nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  var type = nav && nav.type;
  var same = false;
  try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  play = type === 'reload' || ((type === 'navigate' || !type) && !same);
}
if (!play) return;
h.setAttribute('data-opening', 'on');
h.setAttribute('data-cover', 'on');
['/images/opening/paper-crease.webp', '/images/opening/hand.webp'].forEach(function (href) {
  var link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = href;
  document.head.appendChild(link);
});
`;

export const OPENING_GATE = `(function(){try{${OPENING_GATE_BODY.replace(/\s*\n\s*/g, ' ')}}catch(e){}})();`;
