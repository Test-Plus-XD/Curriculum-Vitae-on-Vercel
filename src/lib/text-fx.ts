/** Pure helpers for the character-level text effects (kept free of DOM and GSAP so they can be unit tested). */

export type Segment =
  | { type: 'word'; chars: string[] }
  | { type: 'space' }
  | { type: 'char'; char: string };

// Latin letters (incl. accented), digits, apostrophes and hyphens stay together so English words never break mid-word.
const WORD_CHAR = /[A-Za-zÀ-ɏ0-9'’\-]/;

export function segmentText(text: string): Segment[] {
  const segments: Segment[] = [];
  let word: string[] = [];
  const flush = () => {
    if (word.length) segments.push({ type: 'word', chars: word });
    word = [];
  };
  for (const ch of Array.from(text)) {
    if (WORD_CHAR.test(ch)) {
      word.push(ch);
    } else if (ch === ' ') {
      flush();
      segments.push({ type: 'space' });
    } else {
      flush();
      segments.push({ type: 'char', char: ch });
    }
  }
  flush();
  return segments;
}

/** Reassemble segments; used by tests to prove segmentation is lossless. */
export function joinSegments(segments: Segment[]): string {
  return segments.map((s) => (s.type === 'word' ? s.chars.join('') : s.type === 'space' ? ' ' : s.char)).join('');
}

/** Number of animated glyphs (spaces excluded). */
export function glyphCount(segments: Segment[]): number {
  return segments.reduce((n, s) => n + (s.type === 'word' ? s.chars.length : s.type === 'char' ? 1 : 0), 0);
}

/** Park–Miller style generator: seed = (seed × 16807 + 11) mod 2147483647, mapped to [-1, 1]. */
export function createRandom(seed: number): () => number {
  let s = Math.abs(Math.floor(seed)) % 2147483647 || 1;
  return () => {
    s = (s * 16807 + 11) % 2147483647;
    return (s / 2147483647) * 2 - 1;
  };
}

export interface Displacement {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  hue: number;
  rotateX: number;
  rotateY: number;
}

export function makeDisplacements(count: number, intensity: number, seed: number): Displacement[] {
  const rand = createRandom(seed);
  return Array.from({ length: count }, () => ({
    x: rand() * intensity * 18,
    y: rand() * intensity * 16,
    rotate: rand() * intensity * 18,
    scale: 1 + rand() * intensity * 0.1,
    hue: rand() * intensity * 15,
    rotateX: rand() * intensity * 8,
    rotateY: rand() * intensity * 8,
  }));
}

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/** First-paint displacement: scaled down so the text stays readable, with x/y clamped to ±2px. */
export function initialDisplacement(d: Displacement, intensity: number): Displacement {
  const f = 0.125 * intensity;
  return {
    x: clamp(d.x * f, 2),
    y: clamp(d.y * f, 2),
    rotate: d.rotate * f,
    scale: 1 + (d.scale - 1) * f,
    hue: d.hue * f,
    rotateX: d.rotateX * f,
    rotateY: d.rotateY * f,
  };
}

export const GLITCH_CHARS =
  'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ' + 'ЁЂЄЅІЇЉЊЋЏ' + '★☭✶✪◆△◇' + '⌬⌖⊕⊗⊙⏣⎕' + 'ΩΣΔΞΨΛЖФЩ' + 'КОСМОССПУТНИКМИР';

export const BAUHAUS_GLYPHS = '■▲●■▲●│─';

/** Pick one replacement glyph. Traditional Chinese uses only geometric forms; English mixes ~⅓ geometric. */
export function glitchGlyph(isChinese: boolean, random: () => number = Math.random): string {
  const pool = isChinese || random() < 0.34 ? BAUHAUS_GLYPHS : GLITCH_CHARS;
  const chars = Array.from(pool);
  return chars[Math.floor(random() * chars.length)];
}

/** One frame of the glitch reveal: characters before `progress` are resolved, spaces are preserved. */
export function glitchFrame(text: string, progress: number, isChinese: boolean, random: () => number = Math.random): string {
  return Array.from(text)
    .map((ch, i) => (ch === ' ' || i < progress ? ch : glitchGlyph(isChinese, random)))
    .join('');
}

/**
 * How long each noise glyph stays on screen before it is swapped for another, in milliseconds. Every glyph
 * gets its own hold of 70–130 % of this, so they never flip in unison. Raise it to slow the flicker further;
 * lower it for a faster, more frantic scramble. (How quickly the real text resolves is a separate setting:
 * the `speed` prop of GlitchText / Scramble, in milliseconds per character.)
 */
export const GLITCH_GLYPH_HOLD_MS = 110;

/**
 * Stateful version of `glitchFrame` for animation loops: each unresolved character keeps its noise glyph
 * until its own hold time has passed, instead of changing on every frame.
 */
export function createGlitchCycler(
  isChinese: boolean,
  holdMs: number = GLITCH_GLYPH_HOLD_MS,
  random: () => number = Math.random,
): (text: string, progress: number, now: number) => string {
  let glyphs: string[] = [];
  let due: number[] = [];
  return (text, progress, now) => {
    const chars = Array.from(text);
    if (glyphs.length !== chars.length) {
      glyphs = new Array(chars.length).fill('');
      due = new Array(chars.length).fill(0);
    }
    return chars
      .map((ch, i) => {
        if (ch === ' ' || i < progress) return ch;
        if (!glyphs[i] || now >= due[i]) {
          glyphs[i] = glitchGlyph(isChinese, random);
          due[i] = now + holdMs * (0.7 + random() * 0.6);
        }
        return glyphs[i];
      })
      .join('');
  };
}
