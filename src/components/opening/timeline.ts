import { gsap } from '@/lib/gsap';
import { createGlitchCycler } from '@/lib/text-fx';
import { N, POSTER, TALL_VIEWBOX } from './art';
import type { Camera2D, PolyPiece } from './poly';
import { clipPathFor, pointAt, ribbonGeometry, sampleCurve, tearOffsets, type Pt } from './ribbon';
import type { HandPiece } from './scene';
import { LABELS } from './labels';

export { LABELS };

/** The index fingertip in public/images/opening/hand.webp (fractions of the image), where Sputnik sat. */
const PRINT_TIP = { x: 0.454, y: 0.364 };

/** How long each shape of the morph holds before the next cut. */
const HOLD = 0.1;

export interface OpeningEnv {
  root: HTMLElement;
  tall: boolean;
  zh: boolean;
  slug: [string, string];
  /** Called once when the window starts to open: the page beneath may start its entrances. */
  onReveal: () => void;
  /** Called when the window has covered the screen. */
  onEnd: () => void;
}

export interface Opening {
  master: gsap.core.Timeline;
  /** The virtual camera: pan (px), roll (deg), zoom. Read by the low-poly layer every frame. */
  cam: Camera2D;
  /** Attach the 3D hand if it loaded before `hand`; returns null if it is too late. */
  attachHand(factory: (master: gsap.core.Timeline) => HandPiece, host: HTMLElement): HandPiece | null;
  /** Attach the low-poly layer; its solids join if it is in time for them, Sputnik if it is before `launch`. */
  attachPoly(factory: (master: gsap.core.Timeline, cam: Camera2D, labels: typeof LABELS) => PolyPiece): PolyPiece | null;
  /** The 2D anchor for Sputnik when there is no 3D hand: a point in the fallback print's box. */
  fallbackAnchor(out: Pt): void;
}

/**
 * The opening's master timeline: one paused, six-second timeline with labels, built against the
 * server-rendered stage. The beats follow the reference (lights up → shape morph → the poster snaps together
 * → it turns in depth → whip pan → the hand rises → Sputnik's ribbon opens a window onto the site), stretched to
 * six seconds so each beat can breathe. A virtual camera (`cam`) drifts, dollies and rolls through scene A the
 * whole time; the poster and the low-poly layer both follow it, so the flat print gains depth.
 */
export function buildOpening(env: OpeningEnv): Opening {
  const { root, tall, zh } = env;
  const L = LABELS;
  const q = <T extends Element = Element>(name: string) => Array.from(root.querySelectorAll<T>(`[data-op="${name}"]`));
  const one = <T extends Element = Element>(name: string) => root.querySelector<T>(`[data-op="${name}"]`)!;

  // Portrait: a taller window onto scene A, so the whole poster fits the width.
  const layers = Array.from(root.querySelectorAll<SVGSVGElement>('.op-a .op-layer'));
  if (tall) layers.forEach((svg) => {
    svg.setAttribute('viewBox', TALL_VIEWBOX);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  });

  // Load the collage's prints only now that the opening is really playing.
  root.querySelectorAll<SVGImageElement>('image[data-href]').forEach((img) => img.setAttribute('href', img.dataset.href!));
  root.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => (img.src = img.dataset.src!));

  // Map scene-A view-box points to px in the overlay (all layers share one mapping).
  const box = root.getBoundingClientRect();
  const ctm = layers[0].getScreenCTM();
  const toPx = (x: number, y: number): Pt => {
    if (!ctm) return { x: box.width / 2, y: box.height / 2 };
    return { x: ctm.a * x + ctm.c * y + ctm.e - box.left, y: ctm.b * x + ctm.d * y + ctm.f - box.top };
  };
  const unit = ctm ? Math.hypot(ctm.a, ctm.b) : 1;
  const nucleus = toPx(N.x, N.y);
  const origin = `${nucleus.x}px ${nucleus.y}px`;

  // The caption is HTML (each letter must move on its own), laid over the poster at its view-box spot.
  const caption = one<HTMLElement>('caption');
  const captionAt = toPx(N.x + POSTER.captionAt.x, N.y + POSTER.captionAt.y);
  // Portrait screens get a smaller caption, so the tracked name keeps a gutter on both sides.
  const captionSize = POSTER.captionSize * unit * (zh ? 1.6 : 1) * (tall ? 0.82 : 1);
  gsap.set(caption, { left: captionAt.x, top: captionAt.y - captionSize * 0.86, fontSize: captionSize });
  const letters = q<HTMLElement>('letter');

  const camEl = one<HTMLElement>('cam');
  const sceneA = one<HTMLElement>('a');
  const sceneB = one<HTMLElement>('b');
  const band = one<HTMLElement>('band');
  const plate = one<HTMLElement>('plate');
  const ringLayer = one<SVGSVGElement>('a-ring');
  const orbitLayer = one<SVGSVGElement>('a-orbits');
  const orbits = q<SVGPathElement>('orbit');

  // Initial states (before the first frame plays).
  gsap.set([camEl, sceneA], { transformOrigin: origin });
  gsap.set([ringLayer, orbitLayer], { transformOrigin: origin, transformPerspective: 900 });
  gsap.set(orbits, { drawSVG: '0% 0%' });
  gsap.set(letters, { opacity: 0, y: captionSize * 0.6 });
  gsap.set(caption, { rotation: -4, transformOrigin: '0% 100%' });
  gsap.set(one('m-ink'), { x: -14, y: 4 });
  gsap.set(one('m-red'), { x: 16, y: -4 });

  const master = gsap.timeline({ paused: true, defaults: { ease: 'soviet', duration: 0.3 } });
  Object.entries(L).forEach(([name, at]) => master.addLabel(name, at));
  const show = (targets: gsap.TweenTarget, at: number | string) => master.set(targets, { autoAlpha: 1 }, at);
  const hide = (targets: gsap.TweenTarget, at: number | string) => master.set(targets, { autoAlpha: 0 }, at);

  // ---------------------------------------------------------------- the camera
  // One continuous move through scene A, so the cuts and snaps happen inside a moving shot: a slow dolly in
  // from a wide, rolled frame while the lamp comes up, a jolt as the poster snaps together, then a long drift
  // and roll until the whip pan takes over. Pan in px, roll in degrees, zoom as a scale.
  const cam: Camera2D = { x: 70 * unit, y: -40 * unit, r: 4, z: 0.86 };
  const span = Math.max(1, Math.min(box.width, box.height));
  master
    .to(cam, { x: -18 * unit, y: 14 * unit, r: -1.2, z: 1.02, duration: L.build - L.lamp, ease: 'sine.inOut' }, 'lamp')
    .to(cam, { z: 1.07, duration: 0.07, ease: 'power2.out' }, 'build')
    .to(cam, { z: 1.03, duration: 0.35, ease: 'power3.out' }, L.build + 0.07)
    .to(cam, { x: 34 * unit, y: -12 * unit, r: 2.2, duration: L.tilt - L.build - 0.1, ease: 'sine.inOut' }, L.build + 0.1)
    .to(cam, { z: 1.12, duration: L.tilt - L.build, ease: 'power1.in' }, L.build + 0.42)
    .to(cam, { x: -span * 0.05, r: -3, duration: L.whip - L.tilt + 0.1, ease: 'power2.in' }, 'tilt');
  const applyCam = () => gsap.set(camEl, { x: cam.x, y: cam.y, rotation: cam.r, scale: cam.z });
  applyCam();

  // ---------------------------------------------------------------- lights up, the discs part
  master
    .to([plate, sceneA], { opacity: 1, duration: 0.7, ease: 'power2.in' }, 'lamp')
    .fromTo(one('lamp'), { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 'lamp');
  show([one('m-ink'), one('m-red')], 0.05);
  master
    .to(one('m-ink'), { x: -92, y: 72, duration: L.morph - L.lamp, ease: 'sine.inOut' }, 'lamp')
    .to(one('m-red'), { x: 112, y: -62, scale: 2.3, transformOrigin: '50% 50%', duration: L.morph - L.lamp, ease: 'sine.inOut' }, 'lamp');

  // ---------------------------------------------------------------- the morph: cut to cut, each shape moving
  const cut = (at: number, off: string[], on: { name: string; x: number; y: number; r0: number; r1: number; hold?: number }[]) => {
    off.forEach((name) => hide(one(name), at));
    on.forEach((s) => {
      const hold = s.hold ?? HOLD;
      master.set(one(s.name), { autoAlpha: 1, x: s.x, y: s.y }, at);
      master.fromTo(
        one(s.name),
        { rotation: s.r0, scale: 0.86 },
        { rotation: s.r1, scale: 1, svgOrigin: `${s.x} ${s.y}`, duration: hold + 0.04, ease: 'power2.out' },
        at,
      );
    });
  };
  const m = L.morph;
  master.to(one('m-ink'), { x: -46, y: 48, scale: 0.6, duration: HOLD, ease: 'power2.out' }, m);
  cut(m, [], [{ name: 'm-bolt', x: 64, y: -16, r0: -14, r1: 6 }]);
  cut(m + HOLD, ['m-ink', 'm-red', 'm-bolt'], [{ name: 'm-sliver', x: 40, y: 8, r0: 2, r1: 22, hold: 0.07 }]);
  cut(m + HOLD + 0.07, ['m-sliver'], [
    { name: 'm-triangle', x: 0, y: 0, r0: -16, r1: 6 },
    { name: 'm-gold-sliver', x: 0, y: 0, r0: -8, r1: 10 },
  ]);
  const sq = m + 2 * HOLD + 0.07;
  cut(sq, ['m-triangle', 'm-gold-sliver'], [
    { name: 'm-square', x: 54, y: 8, r0: -12, r1: 4, hold: L.build - sq },
    { name: 'm-gold-triangle', x: 0, y: 0, r0: 0, r1: 12 },
    { name: 'm-spike', x: 0, y: 0, r0: 0, r1: 0 },
  ]);
  hide([one('m-gold-triangle'), one('m-spike')], sq + HOLD);
  // Lissitzky's wedge drives through the square.
  show(one('wedge'), sq + HOLD);
  master.from(one('wedge'), { x: -260, y: -260, duration: 0.14, ease: 'expo.out' }, sq + HOLD);

  // ---------------------------------------------------------------- build: the poster snaps together
  const b = L.build;
  hide(one('m-square'), b);
  show(one('nucleus'), b);
  master.from(one('nucleus'), { scale: 1.7, transformOrigin: '50% 50%', duration: 0.2, ease: 'back.out(3)' }, b);
  show(one('ring'), b);
  master.from(one('ring'), { scale: 0.62, rotation: -40, svgOrigin: '0 0', duration: 0.26 }, b);
  show(orbits[0], b);
  master.to(orbits[0], { drawSVG: orbits[0].dataset.draw ?? '0% 100%', duration: 0.34, ease: 'power2.out' }, b);
  show([one('bars'), one('triangle'), one('gold-disc'), one('stripes'), one('dials'), one('slug')], b);
  master
    .from(one('bars'), { x: -320, duration: 0.22, ease: 'expo.out' }, b)
    .from([one('triangle'), one('gold-disc')], { scale: 0.3, transformOrigin: '50% 50%', duration: 0.2, ease: 'back.out(2.5)' }, b)
    .from(q('dial'), { scale: 0, transformOrigin: '50% 50%', duration: 0.22, ease: 'back.out(2)', stagger: { amount: 0.14, from: 'random' } }, b)
    .from(one('stripes'), { x: -60, y: -40, duration: 0.24, ease: 'expo.out' }, b)
    .from(one('slug'), { opacity: 0, x: 30, duration: 0.24 }, b + 0.05);
  show(one('red-bar'), b + 0.1);
  master.from(one('red-bar'), { x: 220, rotation: 18, transformOrigin: '50% 50%', duration: 0.22, ease: 'expo.out' }, b + 0.1);
  // The caption tracks in, tilted, then straightens.
  master
    .to(letters, { opacity: 1, y: 0, duration: 0.28, ease: 'expo.out', stagger: gsap.utils.distribute({ amount: 0.16, from: 'start' }) }, b)
    .to(caption, { rotation: 0, duration: 0.4, ease: 'power3.out' }, b + 0.12);

  // ---------------------------------------------------------------- breathe: the poster keeps moving
  const br = L.breathe;
  const breath = L.tilt - br;
  master
    .to(one('wedge'), { rotation: -112, svgOrigin: '0 0', duration: L.scatter - br + 0.3, ease: 'sine.inOut' }, br)
    .to(one('ring'), { rotation: 46, svgOrigin: '0 0', duration: breath, ease: 'none' }, br)
    .to(orbits, { rotation: 30, svgOrigin: '0 0', duration: breath, ease: 'none' }, br)
    .to(one('stripes'), { x: -26, y: -18, duration: breath, ease: 'none' }, br);
  show(orbits[1], br + 0.3);
  master.to(orbits[1], { drawSVG: '0% 100%', duration: 0.45, ease: 'power2.inOut' }, br + 0.3);
  show(orbits[2], br + 0.5);
  master.to(orbits[2], { drawSVG: '0% 100%', duration: 0.45, ease: 'power2.inOut' }, br + 0.5);
  // The gold disc and the red bar turn square (hard cuts).
  hide(one('gold-disc'), br + 0.7);
  show(one('gold-square'), br + 0.7);
  master.fromTo(one('gold-square'), { rotation: 0 }, { rotation: 80, svgOrigin: '0 0', duration: breath, ease: 'none' }, br + 0.7);
  hide(one('red-bar'), br + 0.76);
  show(one('red-square'), br + 0.76);
  master.fromTo(one('red-square'), { rotation: 0 }, { rotation: -60, svgOrigin: '0 0', duration: breath, ease: 'none' }, br + 0.76);

  // ---------------------------------------------------------------- scatter: the name tears loose
  const s = L.scatter;
  master.call(() => caption.classList.add('is-torn'), undefined, s + 0.02);
  const arc = gsap.utils.mapRange(0, Math.max(1, letters.length - 1), 214, 62);
  const radius = 236 * unit;
  master.to(
    letters,
    {
      x: (i: number, el: HTMLElement) => nucleus.x + Math.cos((arc(i) * Math.PI) / 180) * radius - (captionAt.x + el.offsetLeft),
      y: (i: number, el: HTMLElement) => nucleus.y + Math.sin((arc(i) * Math.PI) / 180) * radius - (captionAt.y - captionSize * 0.86 + el.offsetTop),
      rotation: (i: number, el: HTMLElement) => arc(i) - 90 + Number(el.dataset.r ?? 0) * 3 + gsap.utils.random(-25, 25),
      duration: 0.6,
      ease: 'power3.out',
      stagger: { each: 0.03, from: 'start' },
    },
    s,
  );
  // The typewritten slug scrambles into the site's glitch glyphs.
  const slugLines = [one<SVGTSpanElement>('slug-top'), one<SVGTSpanElement>('slug-bottom')];
  const cyclers = slugLines.map(() => createGlitchCycler(zh));
  const scramble = { p: 1 };
  master.to(
    scramble,
    {
      p: 0,
      duration: 0.55,
      ease: 'none',
      onUpdate: () => {
        const now = performance.now();
        slugLines.forEach((line, i) => {
          const text = env.slug[i];
          line.textContent = cyclers[i](text, Math.round(Array.from(text).length * scramble.p), now);
        });
      },
    },
    s,
  );
  show(one('riser'), s + 0.12);
  master.from(one('riser'), { x: -260, y: 520, duration: 0.55, ease: 'expo.out' }, s + 0.12);

  // ---------------------------------------------------------------- tilt: the poster turns in depth
  const t = L.tilt;
  master
    .to(ringLayer, { rotationX: 74, duration: 0.4, ease: 'power2.inOut' }, t)
    .to(orbitLayer, { rotationY: 52, rotationX: 22, duration: 0.4, ease: 'power2.inOut' }, t)
    .to(sceneA, { scale: 1.3, rotation: -9, duration: L.whip - t, ease: 'power2.in' }, t);
  show(q('slab'), t + 0.06);
  master.from(q('slab'), { rotation: 72, svgOrigin: '0 0', duration: 0.3, ease: 'expo.out', stagger: gsap.utils.distribute({ each: 0.04 }) }, t + 0.06);
  show(one('sidebar'), t + 0.12);
  master.from(one('sidebar'), { xPercent: -140, duration: 0.22, ease: 'expo.out' }, t + 0.12);
  show(one('sphere-shade'), t + 0.16);
  master.from(one('sphere-shade'), { opacity: 0, duration: 0.15, ease: 'none' }, t + 0.16);

  // ---------------------------------------------------------------- whip pan to the collage
  const w = L.whip;
  master.to(sceneA, { xPercent: -130, duration: 0.28, ease: 'power3.in' }, w);
  show(band, w - 0.02);
  master.fromTo(band, { xPercent: 115, skewX: -10 }, { xPercent: -125, skewX: -4, duration: 0.36, ease: 'none' }, w - 0.02);
  show(sceneB, w + 0.08);
  master.fromTo(sceneB, { xPercent: 118, rotation: -9 }, { xPercent: 0, rotation: -4, duration: 0.32, ease: 'whip' }, w + 0.08);
  hide([sceneA, band], L.collage + 0.1);
  master
    .fromTo(sceneB, { scale: 1 }, { scale: 1.07, duration: L.end - L.collage, ease: 'none', immediateRender: false }, 'collage')
    .from(root.querySelectorAll('.op-tower'), { drawSVG: '50% 50%', duration: 0.5, ease: 'power2.out', stagger: { amount: 0.25 } }, 'collage');

  // ---------------------------------------------------------------- hand: 3D if it is ready, else the print
  const handHost = one<HTMLElement>('hand-host');
  const handPrint = one<HTMLImageElement>('hand-print');
  const marker = document.createElement('i');
  marker.className = 'op-anchor';
  handHost.appendChild(marker);
  let attached: HandPiece | null = null;
  let poly: PolyPiece | null = null;
  master.call(() => {
    if (attached) gsap.set(handHost, { autoAlpha: 1 });
    else {
      gsap.set(handHost, { autoAlpha: 0 });
      gsap.set(handPrint, { autoAlpha: 1 });
      gsap.fromTo(handPrint, { yPercent: 70 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
    }
  }, undefined, 'hand');

  // ---------------------------------------------------------------- launch: Sputnik flies the ribbon
  const sputnik = one<HTMLElement>('sputnik');
  const rimA = one<SVGPathElement>('rim-a');
  const rimB = one<SVGPathElement>('rim-b');
  const rim = one<SVGSVGElement>('rim');
  const ribbon = { head: 0, open: 0, phase: 0 };
  let centre: Pt[] = [];
  let tear: number[] = [];
  let focus: Pt = { x: 0, y: 0 };
  const launchAt: Pt = { x: 0, y: 0 };
  const W = root.clientWidth;
  const H = root.clientHeight;
  const flightWidth = Math.max(26, Math.min(W, H) * 0.045);
  let toCentre = (_p: number): Pt => focus;

  const drawRibbon = () => {
    if (!centre.length) return;
    const open = ribbon.open;
    const frame = ribbonGeometry(centre, {
      head: ribbon.head,
      width: (u) => (flightWidth + open * open * flightWidth * 3) * Math.pow(Math.sin(Math.PI * Math.min(1, 0.06 + u * 0.94)), 0.7),
      // The paper untwists as the camera moves in, so the window has no edge-on knots left to hide behind.
      twist: (u) => Math.max(0, 1 - open * 3) * (u * 2.6 + ribbon.phase) * Math.PI,
      rim: 9,
      tear,
      focus,
      to: toCentre(Math.min(1, open * 1.6)),
      scale: 1 + Math.pow(open, 1.2) * 15,
    });
    root.style.clipPath = frame.hole ? clipPathFor(W, H, frame.hole) : '';
    rimA.setAttribute('d', frame.faceA);
    rimB.setAttribute('d', frame.faceB);
    const head = pointAt(centre, ribbon.head);
    if (poly) poly.fly(head.x, head.y, head.angle);
    else gsap.set(sputnik, { x: head.x - 60, y: head.y - 30, rotation: (head.angle * 180) / Math.PI });
  };

  master.call(() => {
    rim.setAttribute('viewBox', `0 0 ${W} ${H}`);
    if (attached) {
      // Read the point back through a marker, so scene B's tilt and scale are taken into account.
      attached.anchor(launchAt);
      marker.style.left = `${launchAt.x}px`;
      marker.style.top = `${launchAt.y}px`;
      const r = marker.getBoundingClientRect();
      launchAt.x = r.left - box.left;
      launchAt.y = r.top - box.top;
    } else opening.fallbackAnchor(launchAt);
    // Up and away to the left, round in a wide hook, and out along the bottom past the hand.
    const control: Pt[] = [
      launchAt,
      { x: launchAt.x - W * 0.12, y: Math.max(H * 0.06, launchAt.y - H * 0.2) },
      { x: W * (tall ? 0.24 : 0.3), y: H * 0.12 },
      { x: W * (tall ? 0.08 : 0.14), y: H * 0.46 },
      { x: W * 0.34, y: H * 0.82 },
      { x: W * 0.74, y: H * 0.93 },
      { x: W * 1.12, y: H * 0.78 },
    ];
    centre = sampleCurve(control, 120);
    tear = tearOffsets(centre.length, 1957, 7);
    focus = pointAt(centre, 0.42);
    toCentre = gsap.utils.interpolate({ x: focus.x, y: focus.y }, { x: W / 2, y: H / 2 });
    // The printed 2D Sputnik only flies if the low-poly one is not there.
    if (!poly) gsap.set(sputnik, { autoAlpha: 1 });
  }, undefined, 'launch');
  gsap.set(sputnik, { transformOrigin: '60px 30px' });
  master
    .to(ribbon, { head: 0.6, duration: L.window - L.launch, ease: 'power1.in' }, 'launch')
    .to(ribbon, { phase: 2.4, duration: L.end - L.launch, ease: 'none' }, 'launch')
    .call(env.onReveal, undefined, 'window')
    .to(ribbon, { head: 1, duration: L.end - L.window, ease: 'power1.inOut' }, 'window')
    .to(ribbon, { open: 1, duration: L.end - L.window, ease: 'power1.in' }, 'window')
    // A last fade, in case a corner of the screen is still papered over.
    .to(root, { opacity: 0, duration: 0.14, ease: 'none' }, L.end - 0.14)
    .call(env.onEnd, undefined, 'end');

  // Once per frame, after every child has rendered (children render in start order, not insertion order):
  // move the camera and draw the ribbon.
  master.eventCallback('onUpdate', () => {
    const now = master.time();
    if (now <= L.collage + 0.1) applyCam();
    if (now >= L.launch && now <= L.end) drawRibbon();
  });

  const opening: Opening = {
    master,
    cam,
    attachHand(factory, host) {
      if (master.time() >= L.hand - 0.05 && master.isActive()) return null;
      attached = factory(master);
      gsap.set(host, { autoAlpha: 0 });
      return attached;
    },
    attachPoly(factory) {
      if (master.time() >= L.launch - 0.05 && master.isActive()) return null;
      poly = factory(master, cam, L);
      return poly;
    },
    fallbackAnchor(out) {
      // Where the index fingertip is in the baked print (fractions of the image), placed as object-fit:
      // contain, bottom-aligned.
      const r = handPrint.getBoundingClientRect();
      const nw = handPrint.naturalWidth || 605;
      const nh = handPrint.naturalHeight || 900;
      const k = Math.min(r.width / nw, r.height / nh);
      out.x = r.left - box.left + (r.width - nw * k) / 2 + nw * k * PRINT_TIP.x;
      out.y = r.top - box.top + (r.height - nh * k) + nh * k * PRINT_TIP.y;
    },
  };
  return opening;
}
