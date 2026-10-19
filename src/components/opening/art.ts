import { tornCirclePath, tornPolygonPath, tornSlab } from '@/lib/collage';

/**
 * Coordinates for the opening's two printed compositions. Scene A (the constructivist poster) is drawn in a
 * 1600 × 900 view box around the nucleus `N`; scene B (the collage the hand rises into) in its own 1600 × 900
 * box. Every scrap is torn by a fixed seed, so server and client draw the same paper.
 */

export const VIEW_W = 1600;
export const VIEW_H = 900;
export const WIDE_VIEWBOX = `0 0 ${VIEW_W} ${VIEW_H}`;
/** Portrait screens see a narrower, taller window onto scene A, so the whole poster fits the width. */
export const TALL_VIEWBOX = '370 -430 860 1720';

/** The nucleus: every scene-A shape is placed relative to this point. */
export const N = { x: 800, y: 430 };

type P = [number, number];
const poly = (points: P[], seed: number, depth = 3.5, step = 18) => tornPolygonPath(points, seed, depth, step);

/** Rotate a list of points about the origin by `deg`. */
function turn(points: P[], deg: number): P[] {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return points.map(([x, y]) => [x * c - y * s, x * s + y * c]);
}

function shift(points: P[], dx: number, dy: number): P[] {
  return points.map(([x, y]) => [x + dx, y + dy]);
}

/** An annular arc (a thick C) of mid-radius r and thickness w, from a0 to a1 degrees. */
function arcBand(r: number, w: number, a0: number, a1: number, steps = 40): P[] {
  const outer: P[] = [];
  const inner: P[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    outer.push([Math.cos(a) * (r + w / 2), Math.sin(a) * (r + w / 2)]);
    inner.push([Math.cos(a) * (r - w / 2), Math.sin(a) * (r - w / 2)]);
  }
  return [...outer, ...inner.reverse()];
}

/** A full ellipse as an SVG path (one stroke, so DrawSVG can draw it in). */
export function ellipse(rx: number, ry: number) {
  return `M ${-rx},0 a ${rx},${ry} 0 1,0 ${rx * 2},0 a ${rx},${ry} 0 1,0 ${-rx * 2},0`;
}

// ------------------------------------------------------------------ scene A: the morph (hard cuts)
export const MORPH = {
  /** The two discs that part as the lamp comes up. */
  inkDisc: tornCirclePath(30, 101, 2.5),
  redDot: tornCirclePath(13, 102, 1.5),
  /** A red lightning bolt (zig-zag) beside the disc. */
  bolt: poly(shift([[-18, -70], [26, -10], [4, -6], [30, 64], [-22, -2], [0, -6]], 40, 4), 103, 2.5, 12),
  sliver: poly([[-6, -60], [12, -4], [-2, 0], [10, 58], [-12, 2], [0, -2]], 104, 2, 12),
  triangle: poly([[-70, 0], [46, -64], [46, 64]], 105, 3.5),
  goldSliver: poly([[34, -26], [96, -42], [52, 4]], 106, 2.5, 12),
  square: poly(turn([[-64, -64], [64, -64], [64, 64], [-64, 64]], -15), 107, 3.5),
  goldTriangle: poly([[56, -18], [128, -10], [84, 22]], 108, 2.5, 12),
  spike: poly([[-118, -132], [-70, -96], [-104, -150]], 109, 1.5, 10),
};

// ------------------------------------------------------------------ scene A: the poster
export const POSTER = {
  nucleusR: 62,
  nucleus: tornCirclePath(62, 201, 3),
  /** The thick ink C-ring around the nucleus, open on the right. */
  ring: poly(arcBand(176, 40, 24, 334), 202, 2.5, 22),
  orbits: [
    { rx: 120, ry: 206, rotate: -28, draw: '0% 82%' },
    { rx: 214, ry: 74, rotate: 18, draw: '0% 100%' },
    { rx: 196, ry: 86, rotate: -52, draw: '0% 100%' },
  ],
  /** Lissitzky's wedge: from far off the top-left corner to a point at the nucleus. */
  wedge: poly([[-10, -12], [-520, -520], [-370, -610]], 203, 4, 26),
  /** The kraft strip inside the wedge, printed with dots. */
  wedgeStrip: poly([[-28, -34], [-200, -196], [-150, -250]], 204, 2.5, 18),
  stripes: [0, 1, 2].map((i) => ({ x1: -470 + i * 16, y1: -470 + i * 12, x2: -270 + i * 16, y2: -330 + i * 12 })),
  triangle: poly([[-420, -250], [-300, -196], [-386, -168]], 205, 2.5, 14),
  goldDisc: tornCirclePath(30, 206, 2),
  goldDiscAt: { x: 392, y: -118 },
  goldSquare: poly(turn([[-26, -26], [26, -26], [26, 26], [-26, 26]], 22), 207, 2, 12),
  /** The long ink bar with its stepped block, and the short vermilion bar that crosses it. */
  bar: poly(turn([[-440, 84], [580, 84], [580, 104], [-440, 104]], -1.6), 208, 1.8, 30),
  barStep: poly(turn([[-170, 68], [-100, 68], [-100, 86], [-170, 86]], -1.6), 209, 1.5, 12),
  redBar: poly(turn([[330, 104], [520, 104], [520, 124], [330, 124]], -12), 210, 1.8, 16),
  redSquare: poly(turn([[-22, -22], [22, -22], [22, 22], [-22, 22]], 12), 211, 1.6, 10),
  redSquareAt: { x: 448, y: 150 },
  /** 3 × 3 dial grid, top right; one dial missing, three with hands. */
  dials: Array.from({ length: 9 }, (_, i) => ({ col: i % 3, row: Math.floor(i / 3) }))
    .filter((d) => !(d.col === 0 && d.row === 2))
    .map((d, i) => ({ x: 470 + d.col * 62, y: -320 + d.row * 62, hand: [2, 5, 7].includes(i) ? (i * 47) % 360 : null })),
  slugAt: { x: 540, y: 62 },
  /** Where the caption starts (left, baseline), in view-box units, and its size. */
  captionAt: { x: -410, y: 172 },
  captionSize: 40,
  /** The rising ink wedge with its label strip, from below. */
  riser: poly([[6, 12], [-250, 560], [-110, 600]], 212, 3.5, 24),
  riserStrip: poly([[-178, 470], [-148, 474], [-196, 560], [-226, 556]], 213, 1.5, 12),
  /** Slabs that fan in round the nucleus as the poster tilts (red, ink, kraft). */
  slabs: [
    { d: poly([[0, -20], [1300, -360], [1300, -80]], 214, 5, 40), cls: 'op-red' },
    { d: poly([[0, 10], [1300, 40], [1300, 360]], 215, 5, 40), cls: 'op-ink' },
    { d: poly([[0, -6], [1300, -90], [1300, 30]], 216, 4, 40), cls: 'op-gold' },
  ],
};

/** The steel pen nib at the wedge's point (drawn pointing along +x, then turned to the wedge). */
export const NIB = {
  body: 'M0 0 L-46 -15 C-60 -16 -72 -9 -76 0 C-72 9 -60 16 -46 15 Z',
  slit: 'M0 0 L-38 0',
  hole: { cx: -40, cy: 0, r: 3.2 },
  angle: 225 + 1.5,
};

// ------------------------------------------------------------------ scene B: the collage
/** Shukhov's hyperboloid radio tower as straight lattice lines (Moscow, 1922). */
export function shukhovLines(cx: number, top: number, bottom: number, rTop: number, rBottom: number, count = 18) {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2;
    for (const dir of [1, -1]) {
      lines.push({
        x1: cx + Math.cos(a) * rBottom,
        y1: bottom,
        x2: cx + Math.cos(a + dir * 1.15) * rTop,
        y2: top,
      });
    }
  }
  // Horizontal rings, seen edge-on.
  for (let k = 1; k < 6; k++) {
    const y = bottom + ((top - bottom) * k) / 6;
    const r = rBottom + ((rTop - rBottom) * k) / 6 - Math.sin((k / 6) * Math.PI) * 6;
    lines.push({ x1: cx - r, y1: y, x2: cx + r, y2: y });
  }
  return lines.map((l) => ({ x1: Math.round(l.x1 * 10) / 10, y1: l.y1, x2: Math.round(l.x2 * 10) / 10, y2: l.y2 }));
}

/** A cog wheel outline with `teeth` teeth. */
export function cogPath(r: number, teeth: number, depth: number) {
  const pts: string[] = [];
  const steps = teeth * 4;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r - depth;
    pts.push(`${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

export const COLLAGE = {
  labelStrip: poly([[300, -80], [352, -80], [352, 980], [300, 980]], 301, 2, 30),
  thinStrip: poly([[376, -80], [390, -80], [390, 980], [376, 980]], 302, 1.2, 40),
  kraftTop: poly([[470, 28], [700, 28], [700, 96], [470, 96]], 303, 2.5, 20),
  printPanel: poly([[460, 90], [744, 90], [744, 352], [460, 352]], 304, 3, 20),
  kraftFrame: poly([[706, 78], [1028, 78], [1028, 470], [706, 470]], 305, 3, 22),
  redPanel: poly([[748, 34], [1200, 34], [1200, 468], [748, 468]], 306, 3.5, 22),
  sun: tornCirclePath(26, 307, 2),
  sunAt: { x: 1030, y: 70 },
  bigType: { x: 1150, y: 40 },
  inkEdgeL: poly([[1188, -80], [1214, -80], [1214, 980], [1188, 980]], 308, 1, 40),
  towerStrip: poly([[1214, -80], [1336, -80], [1336, 980], [1214, 980]], 309, 2, 30),
  inkEdgeR: poly([[1336, -80], [1362, -80], [1362, 980], [1336, 980]], 310, 1, 40),
  cogPanel: poly([[1360, -80], [1680, -80], [1680, 352], [1360, 352]], 311, 3, 24),
  band: poly([[-80, 700], [1680, 330], [1680, 430], [-80, 812]], 312, 4, 34),
  cloud:
    'M478 622 C470 576 520 560 548 578 C556 532 618 524 640 562 C664 530 724 540 726 590 C760 588 774 630 746 652 L746 700 L478 700 Z',
  swoosh: 'M548 412 C590 380 640 384 668 418 C640 404 600 404 548 412 Z',
  /** Hong Kong skyline in the cloud: Bank of China Tower facets, IFC, and the rest. */
  skyline: [
    'M492 700 V660 H508 V700 Z',
    'M512 700 V640 H526 V700 Z',
    'M530 700 V600 L548 572 L566 600 V700 Z', // Bank of China Tower
    'M548 572 L566 600 L530 600 Z',
    'M572 700 V628 H590 V700 Z',
    'M596 700 V556 Q606 540 616 556 V700 Z', // IFC
    'M622 700 V650 H640 V700 Z',
    'M646 700 V618 H662 V700 Z',
    'M668 700 V664 H690 V700 Z',
    'M696 700 V642 H712 V700 Z',
  ],
  tower: { cx: 760, top: 470, bottom: 920, rTop: 16, rBottom: 34 },
  moon: { x: 1408, y: 720, r: 60 },
  cog: { x: 236, y: 640, r: 190 },
};

/** A wedge of paper in the whip band, torn along its long edges. */
export const WHIP_SLAB = tornSlab(1922, [0, 8], [96, 100], 10);
