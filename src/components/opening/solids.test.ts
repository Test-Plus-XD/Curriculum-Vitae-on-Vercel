import { describe, expect, it } from 'vitest';
import { makeSolids, SOLID_MAX, SOLID_MIN, type SolidPaper, type SolidShape } from './solids';

const SHAPES: SolidShape[] = ['icosahedron', 'tetrahedron', 'octahedron', 'box', 'dodecahedron', 'wedge'];
const PAPERS: SolidPaper[] = ['red', 'ink', 'kraft', 'paper'];
// Plenty of seeds, so a lucky seed cannot hide an unbalanced or overlapping draw.
const SEEDS = Array.from({ length: 240 }, (_, i) => (i * 2654435761) >>> 0);

const distance = (a: [number, number, number], b: [number, number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('opening low-poly solids', () => {
  it('throws three to five bodies for a visit', () => {
    for (const seed of SEEDS) {
      const count = makeSolids(seed).length;
      expect(count).toBeGreaterThanOrEqual(SOLID_MIN);
      expect(count).toBeLessThanOrEqual(SOLID_MAX);
    }
  });

  it('is deterministic for a seed, and varies the arrangement between visits', () => {
    expect(makeSolids(42)).toEqual(makeSolids(42));
    const arrangements = new Set(SEEDS.slice(0, 24).map((seed) => JSON.stringify(makeSolids(seed))));
    expect(arrangements.size).toBeGreaterThan(18);
    const counts = new Set(SEEDS.map((seed) => makeSolids(seed).length));
    expect(counts.size).toBeGreaterThan(1);
  });

  it('keeps the centre column clear and frames both sides', () => {
    for (const seed of SEEDS) {
      const solids = makeSolids(seed);
      expect(solids.some((solid) => solid.at[0] < 0)).toBe(true);
      expect(solids.some((solid) => solid.at[0] > 0)).toBe(true);
      for (const solid of solids) expect(Math.abs(solid.at[0])).toBeGreaterThan(2.1);
    }
  });

  it('keeps every body in the working frame, apart from the others and plausibly sized', () => {
    for (const seed of SEEDS) {
      const solids = makeSolids(seed);
      for (const solid of solids) {
        expect(SHAPES).toContain(solid.shape);
        expect(PAPERS).toContain(solid.paper);
        expect(solid.radius).toBeGreaterThan(0.3);
        expect(solid.radius).toBeLessThan(0.8);
        expect(solid.at[1]).toBeGreaterThan(-2.5);
        expect(solid.at[1]).toBeLessThan(2.5);
        expect(solid.at[2]).toBeGreaterThan(-3.2);
        expect(solid.at[2]).toBeLessThan(3.2);
        expect(solid.spin[0]).toBeGreaterThan(0);
        expect(solid.phase).toBeGreaterThanOrEqual(0);
        expect(solid.phase).toBeLessThan(Math.PI * 2);
      }
      for (let i = 0; i < solids.length; i++) {
        for (let j = i + 1; j < solids.length; j++) expect(distance(solids[i]!.at, solids[j]!.at)).toBeGreaterThan(1.6);
      }
    }
  });
});
