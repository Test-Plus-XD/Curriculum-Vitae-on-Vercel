import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { cutUp, hashSeed, ransomGlyphs, rng, shuffled, tornCirclePath, tornClipPath, tornPolygonPath, tornSlab } from './collage';

describe('rng', () => {
  it('is deterministic and stays in [0, 1)', () => {
    const a = rng(42);
    const b = rng(42);
    for (let i = 0; i < 300; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1.0000001);
    }
  });
});

describe('shuffled', () => {
  it('returns a permutation and leaves the input alone', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { maxLength: 40 }), fc.integer({ min: 1 }), (items, seed) => {
        const copy = [...items];
        const out = shuffled(items, seed);
        expect(items).toEqual(copy);
        expect([...out].sort()).toEqual([...items].sort());
      }),
    );
  });
});

describe('tornClipPath', () => {
  it('is deterministic for a seed', () => {
    expect(tornClipPath(7)).toBe(tornClipPath(7));
    expect(tornClipPath(7)).not.toBe(tornClipPath(8));
  });

  it('only tears the requested sides and never leaves the box', () => {
    const path = tornClipPath(3, { sides: ['bottom'], depth: 8, teeth: 10 });
    expect(path.startsWith('polygon(0% 0px, 100% 0px')).toBe(true);
    const bites = [...path.matchAll(/calc\(100% - ([\d.]+)px\)/g)].map((m) => Number(m[1]));
    expect(bites).toHaveLength(11);
    expect(bites.every((b) => b >= 0 && b <= 8)).toBe(true);
  });

  it('tears all four sides when asked', () => {
    const path = tornClipPath(5, { sides: ['top', 'right', 'bottom', 'left'], teeth: 6 });
    // 7 top + 5 right + 7 bottom + 5 left
    expect(path.split(',').length).toBe(24);
  });
});

describe('ransomGlyphs', () => {
  it('styles every character deterministically and keeps spaces bare', () => {
    const glyphs = ransomGlyphs('NG YU HAM', hashSeed('name'));
    expect(glyphs.map((g) => g.char).join('')).toBe('NG YU HAM');
    expect(glyphs.filter((g) => g.space)).toHaveLength(2);
    expect(ransomGlyphs('NG YU HAM', hashSeed('name'))).toEqual(glyphs);
  });

  it('never repeats a paper on adjacent letters', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 2, maxLength: 30 }), fc.integer({ min: 1 }), (text, seed) => {
        const letters = ransomGlyphs(text, seed).filter((g) => !g.space);
        return letters.every((g, i) => i === 0 || g.paper !== letters[i - 1].paper);
      }),
    );
  });
});

describe('cutUp', () => {
  it('keeps English words whole and loses nothing', () => {
    const text = 'Comfortable moving across languages and frameworks.';
    const slips = cutUp(text, 'en');
    expect(slips.join(' ')).toBe(text);
    expect(slips).toContain('frameworks.');
  });

  it('cuts Chinese into short phrases and loses nothing', () => {
    const text = '能靈活運用多種程式語言及框架，並樂於將此適應力應用於專業開發團隊之中。';
    const slips = cutUp(text, 'zh-hk');
    expect(slips.join('')).toBe(text);
    expect(slips.every((s) => Array.from(s).length <= 5)).toBe(true);
  });
});

describe('tornSlab', () => {
  it('walks down the right edge and back up the left, deterministically', () => {
    const path = tornSlab(9, [12, 0], [100, 88], 10, 4);
    expect(path).toBe(tornSlab(9, [12, 0], [100, 88], 10, 4));
    const points = path.slice('polygon('.length, -1).split(', ');
    expect(points).toHaveLength(10);
    expect(points[0]).toMatch(/^calc\(100% [+-] [\d.]+px\) 0%$/);
    expect(points[4]).toMatch(/^calc\(88% [+-] [\d.]+px\) 100%$/);
    expect(points[9]).toMatch(/^calc\(12% [+-] [\d.]+px\) 0%$/);
  });
});

/** The numbers of an SVG path made only of M/L/Z commands, as [x, y] pairs. */
const pathPoints = (d: string) =>
  d
    .replace(/[MZ]/g, '')
    .split('L')
    .map((p) => p.trim().split(' ').map(Number) as [number, number]);

describe('tornPolygonPath', () => {
  const square: [number, number][] = [[0, 0], [100, 0], [100, 100], [0, 100]];

  it('is a closed, deterministic path', () => {
    const d = tornPolygonPath(square, 11, 4, 20);
    expect(d).toMatch(/^M[-\d.]+ [-\d.]+(L[-\d.]+ [-\d.]+)+Z$/);
    expect(tornPolygonPath(square, 11, 4, 20)).toBe(d);
    expect(tornPolygonPath(square, 12, 4, 20)).not.toBe(d);
  });

  it('keeps the corners and stays within the tear depth of each edge', () => {
    const points = pathPoints(tornPolygonPath(square, 3, 5, 20));
    expect(points).toHaveLength(20);
    for (const corner of square) expect(points).toContainEqual(corner);
    for (const [x, y] of points) {
      expect(x).toBeGreaterThanOrEqual(-5);
      expect(x).toBeLessThanOrEqual(105);
      expect(y).toBeGreaterThanOrEqual(-5);
      expect(y).toBeLessThanOrEqual(105);
    }
  });
});

describe('tornCirclePath', () => {
  it('only tears inwards', () => {
    const points = pathPoints(tornCirclePath(50, 9, 4, 40));
    expect(points).toHaveLength(40);
    for (const [x, y] of points) {
      const r = Math.hypot(x, y);
      expect(r).toBeLessThanOrEqual(50.1);
      expect(r).toBeGreaterThanOrEqual(45.9);
    }
    expect(tornCirclePath(50, 9, 4, 40)).toBe(tornCirclePath(50, 9, 4, 40));
  });
});
