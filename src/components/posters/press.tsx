import type { ReactNode } from 'react';

/// Shared press furniture for the repository posters. A poster is a hand-drawn Constructivist print that gives
/// a glimpse of a repository with no recorded video. Colours are literal rather than theme tokens because the
/// print stays paper in both themes. No poster may use `id`, `<defs>`, patterns or gradients: the gazette's page
/// turn copies pages with their ids dropped, so any `url(#…)` reference would lose its target mid-turn.

export const WIDTH = 640;
export const HEIGHT = 360;
export const PRESS = {
  paper: '#f6efe2',
  newsprint: '#e7ddc8',
  kraft: '#c39a63',
  red: '#c8231a',
  deep: '#8f0000',
  ink: '#17120f',
} as const;

// The sheet every poster prints on: a 16:9 SVG exposed to assistive tech as one image described by `label`.
export function PosterSheet({ label, ground = PRESS.paper, children }: { label: string; ground?: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="repo-poster" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <rect width={WIDTH} height={HEIGHT} fill={ground} />
      {children}
    </svg>
  );
}

// A 45° halftone field of dots shrinking across its width, drawn as real circles so it needs no pattern.
// `step` is the screen pitch in viewBox units; keep the field small, as every dot is a DOM node.
export function HalftoneField({ x, y, columns, rows, step = 12, fill = PRESS.ink }: { x: number; y: number; columns: number; rows: number; step?: number; fill?: string }) {
  const dots: ReactNode[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const radius = (step / 2.2) * (1 - column / columns);
      if (radius < 0.5) continue;
      dots.push(<circle key={`${row}-${column}`} cx={x + column * step + (row % 2) * (step / 2)} cy={y + row * step} r={radius} fill={fill} />);
    }
  }
  return <g aria-hidden="true">{dots}</g>;
}
