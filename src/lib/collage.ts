/**
 * Seeded generators for the Dada collage. Everything here is deterministic for a given seed, so the server
 * and the client render identical markup (no hydration mismatches) and the collage looks the same on every
 * visit — like a pasted-up poster rather than random noise.
 */
import { createRandom } from './text-fx';

/** Uniform generator in [0, 1). */
export function rng(seed: number): () => number {
  const r = createRandom(seed);
  return () => (r() + 1) / 2;
}

/** FNV-1a string hash, for turning ids and text into seeds. */
export function hashSeed(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Math.abs(h) || 1;
}

/** Fisher–Yates shuffle with a seeded generator; returns a new array. */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const rand = rng(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type Side = 'top' | 'right' | 'bottom' | 'left';

interface TornOptions {
  sides?: Side[];
  /** Maximum tear depth in px (the edge is eaten inwards, never outwards). */
  depth?: number;
  /** Points per torn side. */
  teeth?: number;
}

const round = (n: number) => Math.round(n * 10) / 10;

/**
 * A CSS `clip-path: polygon(...)` whose chosen sides look hand-torn. Points along a torn side alternate
 * between shallow fibres and deeper bites, measured in px inwards so the scrap never overflows its box.
 */
export function tornClipPath(seed: number, { sides = ['top', 'bottom'], depth = 6, teeth = 22 }: TornOptions = {}): string {
  const rand = rng(seed);
  const torn = new Set(sides);
  const bite = (i: number) => round((i % 3 === 0 ? 0.55 + rand() * 0.45 : rand() * 0.45) * depth);
  const pts: string[] = [];
  const along = (n: number) => Array.from({ length: n + 1 }, (_, i) => round((i / n) * 100));

  // top: left → right
  for (const [i, x] of along(torn.has('top') ? teeth : 1).entries()) pts.push(`${x}% ${torn.has('top') ? bite(i) : 0}px`);
  // right: top → bottom
  if (torn.has('right')) for (const [i, y] of along(teeth).entries()) if (i > 0 && i < teeth) pts.push(`calc(100% - ${bite(i)}px) ${y}%`);
  // bottom: right → left
  for (const [i, x] of along(torn.has('bottom') ? teeth : 1).reverse().entries())
    pts.push(`${x}% ${torn.has('bottom') ? `calc(100% - ${bite(i)}px)` : '100%'}`);
  // left: bottom → top
  if (torn.has('left')) for (const [i, y] of along(teeth).reverse().entries()) if (i > 0 && i < teeth) pts.push(`${bite(i)}px ${y}%`);

  return `polygon(${pts.join(', ')})`;
}

export type RansomPaper = 'paper' | 'red' | 'ink' | 'news' | 'kraft' | 'bare';
export type RansomFont = 'title' | 'display' | 'type' | 'body';

export interface RansomGlyph {
  char: string;
  space: boolean;
  paper: RansomPaper;
  font: RansomFont;
  rotate: number;
  scale: number;
  lift: number;
}

const PAPERS: RansomPaper[] = ['paper', 'red', 'ink', 'paper', 'news', 'red', 'kraft', 'ink', 'news', 'bare'];
// The typewriter face is too distressed at display sizes, so cut-out letters use the other three.
const FONTS: RansomFont[] = ['display', 'title', 'display', 'body', 'title'];

/**
 * Ransom-note styling for each character: every letter looks cut from a different printed source (paper,
 * typeface, size, angle). Adjacent letters never share a paper, so the word always reads as a collage.
 */
export function ransomGlyphs(text: string, seed: number): RansomGlyph[] {
  const rand = rng(seed);
  let previous: RansomPaper | null = null;
  return Array.from(text).map((char) => {
    if (char === ' ') return { char, space: true, paper: 'bare', font: 'body', rotate: 0, scale: 1, lift: 0 };
    // Duplicates in PAPERS act as weights; drop the previous paper so neighbours always differ.
    const options = PAPERS.filter((p) => p !== previous);
    const paper = options[Math.floor(rand() * options.length)];
    previous = paper;
    return {
      char,
      space: false,
      paper,
      font: FONTS[Math.floor(rand() * FONTS.length)],
      rotate: round((rand() * 2 - 1) * 9),
      scale: round(0.86 + rand() * 0.3),
      lift: round((rand() * 2 - 1) * 6),
    };
  });
}

/**
 * Cut text into slips for Tzara-style cut-up poetry. English keeps words with their punctuation; Chinese is
 * cut into short phrases of two to four characters, the way a newspaper column would be scissored.
 */
export function cutUp(text: string, locale: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (locale !== 'zh-hk') return clean.split(' ').filter(Boolean);
  const slips: string[] = [];
  let buffer = '';
  const rand = rng(hashSeed(clean));
  let target = 2 + Math.floor(rand() * 3);
  for (const ch of Array.from(clean)) {
    buffer += ch;
    const punctuation = /[，。、；：！？（）「」『』,.;:!?()]/.test(ch);
    if (punctuation || Array.from(buffer.trim()).length >= target) {
      if (buffer.trim()) slips.push(buffer.trim());
      buffer = '';
      target = 2 + Math.floor(rand() * 3);
    }
  }
  if (buffer.trim()) slips.push(buffer.trim());
  return slips;
}

/**
 * A slanted slab with hand-torn long edges, for the page-transition cover. The left edge runs from
 * `left[0]`% at the top to `left[1]`% at the bottom (likewise the right edge); every point is nudged up to
 * `depth` px sideways so the edge looks ripped rather than cut.
 */
export function tornSlab(seed: number, left: [number, number], right: [number, number], depth = 14, teeth = 28): string {
  const rand = rng(seed);
  const pts: string[] = [];
  const edge = ([top, bottom]: [number, number], down: boolean) => {
    for (let k = 0; k <= teeth; k++) {
      const t = down ? k / teeth : 1 - k / teeth;
      const x = round(top + (bottom - top) * t);
      const nudge = round((rand() * 2 - 1) * depth * (k % 4 === 0 ? 1 : 0.45));
      pts.push(`calc(${x}% ${nudge < 0 ? '-' : '+'} ${Math.abs(nudge)}px) ${round(t * 100)}%`);
    }
  };
  edge(right, true);
  edge(left, false);
  return `polygon(${pts.join(', ')})`;
}
