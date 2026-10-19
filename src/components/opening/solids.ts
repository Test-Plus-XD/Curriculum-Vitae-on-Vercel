/**
 * The opening's low-poly solids: a handful of flat-shaded bodies cut from the poster's papers and scattered in
 * depth around the printed poster. The count and arrangement are thrown fresh for each visit — three to five
 * bodies instead of the old fixed seven — so the title sequence reads as a collage being assembled in front of
 * you rather than the same diagram every time.
 *
 * Pure and seeded, like the collage generators, so the arrangement can be tested; poly.ts builds the three.js
 * geometry from these specs.
 */
import { rng, shuffled } from '@/lib/collage';

export type SolidShape = 'icosahedron' | 'tetrahedron' | 'octahedron' | 'box' | 'dodecahedron' | 'wedge';
export type SolidPaper = 'red' | 'ink' | 'kraft' | 'paper';

export interface SolidSpec {
  shape: SolidShape;
  /** Key in the poster paper palette (poly.ts maps it to the printed colours). */
  paper: SolidPaper;
  /** Centre in world units, before poly.ts applies the tall/narrow spread. */
  at: [number, number, number];
  /** Body radius (half the longest side for the wedge and the box), in world units. */
  radius: number;
  /** Tumble rates, radians per second. */
  spin: [number, number, number];
  /** Phase offset for the idle bob, radians. */
  phase: number;
}

/** Fewer bodies than the original seven: enough to frame the poster, few enough to read as one gesture. */
export const SOLID_MIN = 3;
export const SOLID_MAX = 5;

/** Where a body may sit: around the edges of the poster, never over the centre column where the name lands. */
const SLOTS: readonly [number, number, number][] = [
  [-3.4, 1.7, 1.6],
  [3.5, -1.6, 2.3],
  [2.7, 2.1, -1.2],
  [-2.9, -1.9, 0.6],
  [4.6, 0.4, -2.7],
  [-4.5, -0.2, -1.7],
];

const SHAPES: readonly SolidShape[] = ['icosahedron', 'tetrahedron', 'octahedron', 'box', 'dodecahedron', 'wedge'];
const PAPERS: readonly SolidPaper[] = ['red', 'ink', 'kraft', 'paper'];

const MIN_RADIUS = 0.36;
const MAX_RADIUS = 0.78;

/**
 * Pick three to five bodies for one visit. Which slots are used, the jitter on each slot, the bodies' shape,
 * paper, size and tumble are all thrown from the seed; the slots keep the composition balanced and clear of
 * the poster's centre.
 */
export function makeSolids(seed: number): SolidSpec[] {
  const rand = rng(seed);
  const count = SOLID_MIN + Math.floor(rand() * (SOLID_MAX - SOLID_MIN + 1));
  const chosen = shuffled(SLOTS, seed + 1).slice(0, count) as [number, number, number][];

  // Balance: whichever side the shuffle happened to favour, make sure the poster is framed on both sides.
  const left = chosen.filter((slot) => slot[0] < 0).length;
  if (left === 0 || left === count) {
    const opposite = shuffled(SLOTS, seed + 1).find((slot) => (left === 0 ? slot[0] < 0 : slot[0] > 0) && !chosen.includes(slot));
    if (opposite) chosen[chosen.length - 1] = opposite;
  }

  return chosen.map((slot) => {
    const radius = MIN_RADIUS + rand() * (MAX_RADIUS - MIN_RADIUS);
    return {
      shape: SHAPES[Math.floor(rand() * SHAPES.length)]!,
      paper: PAPERS[Math.floor(rand() * PAPERS.length)]!,
      at: [slot[0] + (rand() - 0.5) * 0.7, slot[1] + (rand() - 0.5) * 0.6, slot[2] + (rand() - 0.5) * 0.8],
      radius,
      spin: [0.24 + rand() * 0.36, (rand() - 0.5) * 1.6, 0.08 + rand() * 0.28],
      phase: rand() * Math.PI * 2,
    };
  });
}
