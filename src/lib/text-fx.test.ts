import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  BAUHAUS_GLYPHS,
  GLITCH_CHARS,
  createRandom,
  glitchFrame,
  glitchGlyph,
  glyphCount,
  initialDisplacement,
  joinSegments,
  makeDisplacements,
  segmentText,
} from './text-fx';

describe('segmentText', () => {
  it('keeps English words whole and gives spaces their own segment', () => {
    expect(segmentText("NG Yu-Ham's CV")).toEqual([
      { type: 'word', chars: ['N', 'G'] },
      { type: 'space' },
      { type: 'word', chars: Array.from("Yu-Ham's") },
      { type: 'space' },
      { type: 'word', chars: ['C', 'V'] },
    ]);
  });

  it('splits Chinese into individually breakable characters', () => {
    expect(segmentText('吳宇涵')).toEqual([
      { type: 'char', char: '吳' },
      { type: 'char', char: '宇' },
      { type: 'char', char: '涵' },
    ]);
  });

  it('is lossless for any text', () => {
    fc.assert(fc.property(fc.string({ unit: 'grapheme', maxLength: 60 }), (s) => joinSegments(segmentText(s)) === s));
  });

  it('never puts a space or CJK character inside a word segment', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 60 }), (s) =>
        segmentText(s).every((seg) => seg.type !== 'word' || seg.chars.every((c) => c !== ' ' && !/[一-鿿]/.test(c))),
      ),
    );
  });

  it('counts glyphs without spaces', () => {
    expect(glyphCount(segmentText('Pour Rice 倒米'))).toBe(10);
  });
});

describe('createRandom', () => {
  it('is deterministic for a seed and stays within [-1, 1]', () => {
    const a = createRandom(1999);
    const b = createRandom(1999);
    for (let i = 0; i < 200; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe('displacements', () => {
  it('scales with intensity and clamps the first paint to ±2px', () => {
    const ds = makeDisplacements(40, 0.7, 7);
    expect(ds).toHaveLength(40);
    for (const d of ds) {
      expect(Math.abs(d.x)).toBeLessThanOrEqual(0.7 * 18);
      expect(Math.abs(d.rotate)).toBeLessThanOrEqual(0.7 * 18);
      const first = initialDisplacement(d, 0.7);
      expect(Math.abs(first.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(first.y)).toBeLessThanOrEqual(2);
    }
  });
});

describe('glitch', () => {
  it('uses only Bauhaus glyphs in Chinese mode', () => {
    for (let i = 0; i < 100; i++) expect(BAUHAUS_GLYPHS).toContain(glitchGlyph(true));
  });

  it('mixes Bauhaus and Cyrillic pools in English mode', () => {
    const seen = new Set(Array.from({ length: 400 }, () => glitchGlyph(false)));
    const pools = (ch: string) => [BAUHAUS_GLYPHS.includes(ch), GLITCH_CHARS.includes(ch)];
    expect([...seen].some((c) => pools(c)[0])).toBe(true);
    expect([...seen].some((c) => pools(c)[1])).toBe(true);
  });

  it('resolves characters left to right and preserves spaces', () => {
    const frame = glitchFrame('Hong Kong', 3, false);
    expect(frame.slice(0, 3)).toBe('Hon');
    expect(frame[4]).toBe(' ');
    expect(Array.from(frame)).toHaveLength(9);
    expect(glitchFrame('Hong Kong', 99, false)).toBe('Hong Kong');
  });
});
