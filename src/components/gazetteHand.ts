/**
 * The hand that turns the gazette's pages: the opening's halftone print of the WebXR hand (a cut-out with a
 * paper margin and a red shadow plate, public/images/opening/hand.webp) pasted over the paper. It is posed by
 * hand, frame by frame, from the turning page, and placed by the view: the broadsheet is taller than the window
 * and its far corner swings out of sight in perspective, so the hand holds the page's free edge at a fixed
 * height on screen (where the dog-ear was clicked, or a little below the middle for the pager) and rides the
 * edge across, growing as the page lifts towards the reader. Dragging the corner, the hand is under the pointer.
 *
 * Dada, not Disney: the cut-out "boils" like stop-motion collage (pasted down again, slightly askew, on every
 * step), and a second red halftone plate of its silhouette slips behind it, out of register, as it moves.
 */

/** The page turn's perspective (px), shared with the leaf's transform. */
export const TURN_PERSPECTIVE = 2600;

/** The print's fingertip (the middle finger's tip) as a fraction of the image: the point that holds the page. */
const GRIP = { x: 0.37, y: 0.41 };
/** The print's aspect ratio (907 × 1350). */
const ASPECT = 1350 / 907;
/** From the fingertip down the arm to the wrist, in the unrotated print (a unit vector). */
const ARM = { x: 0.22, y: 0.976 };
/** Stop-motion: how long each pasting of the cut-out holds (ms). */
const STEP_MS = 90;
/** How far the red plate sits off the black print (px, before perspective). */
const PLATE_OFFSET = { x: 7, y: 6 };
/** A forward turn lifts the leaf by up to 10 px and skews it by up to 1.6° (see poseLeaf and the turn timeline). */
const LEAF_LIFT = 10;
const LEAF_SKEW = (1.6 * Math.PI) / 180;

/** How the hand holds the page. */
export interface Hold {
  /** The hand's angle (deg): about -4 reaching up from below, about -62 reaching in from the side. */
  angle: number;
  /** The height on screen (viewport px) at which the hand holds the page's free edge as it turns. */
  screenY: number;
}

export interface HandRig extends Hold {
  hand: HTMLElement;
  plate: HTMLElement;
  /** The box the page turns in (the gazette's stage); the hand is positioned inside it. */
  stage: HTMLElement;
  /** The turning page's size (px), read once per turn. */
  width: number;
  height: number;
  /** The print's width on screen (px). */
  size: number;
  /** 1: a right hand turning forward; -1: a left hand turning back (the print mirrored). */
  side: 1 | -1;
  /** While the corner is dragged: the pointer (viewport px), which the hand follows instead of the edge. */
  pointer: { x: number; y: number } | null;
  /** 0: holding the page; 1: withdrawn back up its arm, out of the way. */
  reach: number;
  /** 0–1. */
  alpha: number;
  /** The red plate's lagging pose; null until the hand is first drawn. */
  lag: { x: number; y: number; r: number; s: number } | null;
}

/** A fixed pseudo-random number in [0, 1) for each stop-motion step. */
function rand(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Ready the hand to hold `page` (the element that turns, inside `stage`) from `side`. A hand already on the
 * paper (peeking at the corner) keeps its place, so a click or a drag carries on from the peek.
 */
export function takeHand(
  hand: HTMLElement,
  plate: HTMLElement,
  stage: HTMLElement,
  page: HTMLElement,
  side: 1 | -1,
  hold: Hold,
  previous: HandRig | null,
): HandRig {
  const width = page.offsetWidth;
  const size = Math.round(Math.min(290, Math.max(150, width * 0.22)));
  hand.style.width = plate.style.width = `${size}px`;
  const keep = previous !== null && previous.alpha > 0.01 && previous.side === side;
  return {
    hand,
    plate,
    stage,
    width,
    height: page.offsetHeight,
    size,
    side,
    angle: hold.angle,
    screenY: hold.screenY,
    pointer: null,
    reach: keep ? previous.reach : 1,
    alpha: keep ? previous.alpha : 0,
    lag: keep ? previous.lag : null,
  };
}

function place(el: HTMLElement, rig: HandRig, x: number, y: number, rotation: number, scale: number) {
  const w = rig.size;
  const h = w * ASPECT;
  el.style.transform = `translate(${x - GRIP.x * w}px, ${y - GRIP.y * h}px) rotate(${rotation}deg) scale(${scale * rig.side}, ${scale})`;
}

/** Draw the hand holding a page turned `theta` radians over the spine (0 lying flat, π turned over). */
export function poseHand(rig: HandRig, theta: number, now = performance.now()) {
  const { width: W, height: H, side, size } = rig;
  const box = rig.stage.getBoundingClientRect();
  const lift = Math.sin(theta);
  // Perspective from in front of the middle of the spine: the free edge comes towards the reader as it lifts.
  const k = TURN_PERSPECTIVE / (TURN_PERSPECTIVE - W * lift);

  let heldX: number;
  let heldY: number;
  if (rig.pointer) {
    heldX = rig.pointer.x - box.left;
    heldY = rig.pointer.y - box.top;
  } else {
    heldX = W * Math.cos(theta) * k;
    // The free edge on screen (the leaf rises and skews a little as it lifts), held at the hand's height.
    const shift = -LEAF_LIFT * lift - Math.tan(LEAF_SKEW * lift) * W;
    const top = H / 2 + k * (-H / 2 + shift) + 30 * k;
    const bottom = H / 2 + k * (H / 2 + shift) - 30 * k;
    heldY = Math.min(bottom, Math.max(top, rig.screenY - box.top));
  }

  // The hand turns its wrist as it lifts the page; withdrawn, it slides back up its own arm.
  const rotation = side * (rig.angle - 16 * lift);
  const rad = (rotation * Math.PI) / 180;
  const armX = ARM.x * side * Math.cos(rad) - ARM.y * Math.sin(rad);
  const armY = ARM.x * side * Math.sin(rad) + ARM.y * Math.cos(rad);
  const x = heldX + rig.reach * size * 1.3 * armX;
  const y = heldY + rig.reach * size * 1.3 * armY;

  // Stop-motion boil: each step the cut-out is pasted down again, a little askew.
  const step = Math.floor(now / STEP_MS);
  const jitter = (n: number, amount: number) => (rand(step + n) - 0.5) * amount;
  place(rig.hand, rig, x + jitter(13, 3), y + jitter(29, 3), rotation + jitter(0, 3.2), k * (1 + jitter(7, 0.04)));
  rig.hand.style.opacity = String(rig.alpha);

  // The red plate follows a beat behind and out of register, and boils on steps of its own.
  const target = { x: x + PLATE_OFFSET.x * k, y: y + PLATE_OFFSET.y * k, r: rotation, s: k };
  const lag = rig.lag ?? { ...target };
  lag.x += (target.x - lag.x) * 0.3;
  lag.y += (target.y - lag.y) * 0.3;
  lag.r += (target.r - lag.r) * 0.3;
  lag.s += (target.s - lag.s) * 0.3;
  rig.lag = lag;
  place(rig.plate, rig, lag.x + jitter(41, 2.4), lag.y + jitter(53, 2.4), lag.r + jitter(61, 2.4), lag.s);
  rig.plate.style.opacity = String(rig.alpha * 0.9);
}

/** Take the hand off the paper at once. */
export function dropHand(rig: HandRig | null) {
  if (!rig) return;
  rig.alpha = 0;
  rig.reach = 1;
  rig.lag = null;
  rig.pointer = null;
  rig.hand.style.opacity = rig.plate.style.opacity = '0';
}
