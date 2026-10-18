import { createRandom } from '@/lib/text-fx';

function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Math.abs(h);
}

/** Deterministic constructivist poster (sun, wedge, bands) used where a project has no video thumbnail. */
export default function PosterArt({ seed, label }: { seed: string; label: string }) {
  const r = createRandom(hash(seed));
  const cx = 120 + r() * 60;
  const cy = 80 + r() * 30;
  const angle = -30 + r() * 20;
  return (
    <svg viewBox="0 0 320 180" className="poster-art" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="180" className="poster-bg" />
      <circle cx={cx + 60} cy={cy} r={58 + r() * 12} className="poster-sun" />
      <g transform={`rotate(${angle} 160 90)`}>
        <rect x="-40" y="104" width="420" height="22" className="poster-band" />
        <rect x="-40" y="132" width="420" height="5" className="poster-band-thin" />
      </g>
      <polygon points={`0,180 ${90 + r() * 40},0 ${130 + r() * 40},0 40,180`} className="poster-wedge" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={20 + i * 9} y1="22" x2={20 + i * 9} y2={34 + (i % 2) * 8} className="poster-tick" />
      ))}
      <text x="300" y="166" textAnchor="end" className="poster-text">
        {seed.toUpperCase().slice(0, 12)}
      </text>
    </svg>
  );
}
