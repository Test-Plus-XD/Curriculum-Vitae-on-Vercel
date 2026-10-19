import { describe, expect, it } from 'vitest';
import { area, clipPathFor, inside, pointAt, ribbonGeometry, sampleCurve, tearOffsets, type Pt } from './ribbon';

// A gentle hook across a 1440 × 900 viewport, like the flight path.
const CONTROL: Pt[] = [
  { x: 980, y: 420 },
  { x: 720, y: 160 },
  { x: 380, y: 260 },
  { x: 420, y: 640 },
  { x: 900, y: 760 },
];
const centre = sampleCurve(CONTROL, 96);
const tear = tearOffsets(centre.length, 1916, 6);
const base = { width: () => 60, twist: (t: number) => t * 5, rim: 10, tear };
const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe('sampleCurve / pointAt', () => {
  it('passes through the end points and samples evenly by parameter', () => {
    expect(centre).toHaveLength(96);
    expect(centre[0]).toEqual(CONTROL[0]);
    expect(centre.at(-1)!.x).toBeCloseTo(900);
    expect(centre.at(-1)!.y).toBeCloseTo(760);
    const mid = pointAt(centre, 0.5);
    expect(Number.isFinite(mid.angle)).toBe(true);
  });
});

describe('ribbonGeometry', () => {
  it('draws nothing before the flight starts', () => {
    expect(ribbonGeometry(centre, { ...base, head: 0 })).toEqual({ hole: '', faceA: '', faceB: '', outline: [] });
  });

  it('is finite, closed and deterministic', () => {
    const a = ribbonGeometry(centre, { ...base, head: 0.63 });
    expect(a.hole).toMatch(/^M.*Z$/);
    expect(numbers(a.hole + a.faceA + a.faceB).every(Number.isFinite)).toBe(true);
    expect(ribbonGeometry(centre, { ...base, head: 0.63 })).toEqual(a);
  });

  it('has no window while the streamer is a thin line', () => {
    const thin = ribbonGeometry(centre, { ...base, width: () => 0, head: 1 });
    expect(Math.abs(area(thin.outline))).toBeLessThan(1);
  });

  it('shows both faces of the paper as it twists', () => {
    const twisted = ribbonGeometry(centre, { ...base, head: 1 });
    expect(twisted.faceA.length).toBeGreaterThan(0);
    expect(twisted.faceB.length).toBeGreaterThan(0);
  });

  it('covers the whole viewport once pushed in far enough', () => {
    const focus = pointAt(centre, 0.55);
    const to = { x: 720, y: 450 };
    const open = ribbonGeometry(centre, { ...base, width: () => 160, twist: () => 0, head: 1, focus, to, scale: 16 });
    for (const p of [{ x: 0, y: 0 }, { x: 1440, y: 0 }, { x: 0, y: 900 }, { x: 1440, y: 900 }, { x: 720, y: 450 }]) {
      expect(inside(p, open.outline), `${p.x},${p.y}`).toBe(true);
    }
  });
});

describe('clipPathFor', () => {
  it('cuts the window out of the viewport with the even-odd rule', () => {
    expect(clipPathFor(1440, 900, 'M1 1L2 2L1 2Z')).toBe('path(evenodd, "M0 0H1440V900H0ZM1 1L2 2L1 2Z")');
  });
});
