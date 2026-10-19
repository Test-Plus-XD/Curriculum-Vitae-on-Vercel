/**
 * Geometry for the opening's ribbon: the torn paper streamer Sputnik trails, which is also a window cut
 * through the opening onto the live page underneath.
 *
 * The streamer follows a centre line sampled from the flight path. At each sample it has a width and a twist;
 * the visible half-width is `width / 2 · cos(twist)`, so the two edges cross where the paper turns over, and
 * the face showing is the vermilion side or the ink side by the sign of the cosine. Each edge carries a small,
 * fixed tear per sample, so the window looks ripped rather than cut.
 *
 * The window is the streamer minus a paper rim along both edges. For the final reveal the whole streamer is
 * scaled about a focus point inside it while that point is carried to the middle of the screen (a camera
 * pushing into the window). Scaling never folds the outline, so an even-odd `clip-path` of "viewport minus
 * window" stays correct all the way until the window covers the screen.
 */

export interface Pt {
  x: number;
  y: number;
}

export interface RibbonOptions {
  /** How much of the path has been drawn, 0–1 (the tail stays at the start, the head follows Sputnik). */
  head: number;
  /** Full width in px at a point `t` (0 tail – 1 head) along the drawn part. */
  width: (t: number) => number;
  /** Twist in radians at a point `t` along the drawn part. */
  twist: (t: number) => number;
  /** Width of the paper rim along each edge, px. */
  rim: number;
  /** Fixed tear offsets per path sample, px (same length as the centre line). */
  tear: readonly number[];
  /** Push-in: scale the streamer by `scale` about `focus`, carrying `focus` to `to` (a camera moving in). */
  focus?: Pt;
  scale?: number;
  to?: Pt;
}

export interface RibbonFrame {
  /** The window: a closed polygon path (px), for an even-odd clip-path. Empty when nothing is drawn. */
  hole: string;
  /** Rim quads on the vermilion side and on the ink side (many closed sub-paths). */
  faceA: string;
  faceB: string;
  /** Polygon points of the window, for tests and hit checks. */
  outline: Pt[];
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Catmull–Rom spline through `points`, sampled into `count` points (count ≥ 2). */
export function sampleCurve(points: readonly Pt[], count: number): Pt[] {
  if (points.length < 2) return points.map((p) => ({ ...p }));
  const out: Pt[] = [];
  const segments = points.length - 1;
  for (let i = 0; i < count; i++) {
    const u = (i / (count - 1)) * segments;
    const s = Math.min(segments - 1, Math.floor(u));
    const t = u - s;
    const p0 = points[Math.max(0, s - 1)];
    const p1 = points[s];
    const p2 = points[s + 1];
    const p3 = points[Math.min(points.length - 1, s + 2)];
    const t2 = t * t;
    const t3 = t2 * t;
    const f = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
  }
  return out;
}

/** Point and direction (radians) at `head` (0–1) along a sampled centre line. */
export function pointAt(centre: readonly Pt[], head: number): { x: number; y: number; angle: number } {
  const last = centre.length - 1;
  const u = Math.min(1, Math.max(0, head)) * last;
  const i = Math.min(last - 1, Math.floor(u));
  const t = u - i;
  const a = centre[i];
  const b = centre[i + 1];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

/** Seeded tear offsets for each sample of a centre line. */
export function tearOffsets(count: number, seed: number, depth: number): number[] {
  let s = seed % 2147483647 || 1;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: count }, (_, i) => (next() * 2 - 1) * depth * (i % 4 === 0 ? 1 : 0.45));
}

export function ribbonGeometry(centre: readonly Pt[], o: RibbonOptions): RibbonFrame {
  const empty: RibbonFrame = { hole: '', faceA: '', faceB: '', outline: [] };
  const last = centre.length - 1;
  const headIndex = Math.min(1, Math.max(0, o.head)) * last;
  const n = Math.floor(headIndex);
  if (last < 1 || headIndex <= 0) return empty;

  // The drawn part: whole samples, plus the interpolated head.
  const pts: Pt[] = centre.slice(0, n + 1).map((p) => ({ ...p }));
  if (headIndex > n && n < last) {
    const tail = pointAt(centre, o.head);
    pts.push({ x: tail.x, y: tail.y });
  }
  const scale = o.scale ?? 1;
  const focus = o.focus ?? { x: 0, y: 0 };
  const to = o.to ?? focus;
  const push = (p: Pt): Pt => ({ x: to.x + (p.x - focus.x) * scale, y: to.y + (p.y - focus.y) * scale });

  const outerL: Pt[] = [];
  const outerR: Pt[] = [];
  const innerL: Pt[] = [];
  const innerR: Pt[] = [];
  const sides: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / len;
    const ny = (b.x - a.x) / len;
    const t = pts.length > 1 ? i / (pts.length - 1) : 0;
    const cos = Math.cos(o.twist(t));
    // The tear moves each edge a little, but never makes the paper inside-out.
    const half = (o.width(t) / 2) * Math.abs(cos);
    const tear = o.tear[Math.min(o.tear.length - 1, i)] ?? 0;
    const flip = cos < 0 ? -1 : 1;
    const c = push(pts[i]);
    // Scale the half-width with the push too, so the window grows like a camera moving into it.
    const h = half * scale;
    // A thin streamer has nothing to tear; the rip deepens as the paper widens.
    const rip = tear * 0.5 * Math.min(1, h / 24);
    const edge = (side: number, inset: number): Pt => {
      const d = Math.max(0, h + side * rip - inset) * side * flip;
      return { x: c.x + nx * d, y: c.y + ny * d };
    };
    const rimInset = Math.min(o.rim, h * 0.45);
    outerL.push(edge(1, 0));
    outerR.push(edge(-1, 0));
    innerL.push(edge(1, rimInset));
    innerR.push(edge(-1, rimInset));
    sides.push(flip);
  }

  const outline = [...innerL, ...innerR.reverse()];
  innerR.reverse();
  const poly = (p: readonly Pt[]) => `M${p.map((q) => `${r1(q.x)} ${r1(q.y)}`).join('L')}Z`;
  let faceA = '';
  let faceB = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const quads = poly([outerL[i], outerL[i + 1], innerL[i + 1], innerL[i]]) + poly([outerR[i], outerR[i + 1], innerR[i + 1], innerR[i]]);
    if (sides[i] > 0) faceA += quads;
    else faceB += quads;
  }
  return { hole: outline.length > 2 ? poly(outline) : '', faceA, faceB, outline };
}

/** Even-odd point-in-polygon test. */
export function inside(point: Pt, polygon: readonly Pt[]): boolean {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) hit = !hit;
  }
  return hit;
}

/** Signed area of a polygon (shoelace), px². */
export function area(polygon: readonly Pt[]): number {
  let sum = 0;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) sum += (polygon[j].x + polygon[i].x) * (polygon[j].y - polygon[i].y);
  return sum / 2;
}

/** The overlay's clip-path: the whole viewport minus the window (even-odd). */
export function clipPathFor(width: number, height: number, hole: string): string {
  return `path(evenodd, "M0 0H${r1(width)}V${r1(height)}H0Z${hole}")`;
}
