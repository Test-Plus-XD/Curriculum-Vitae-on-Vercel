import { bi, pick } from '@/lib/i18n-text';
import { HalftoneField, PRESS, PosterSheet } from './press';

/// Plots the motion engine's channels inside Lissitzky's red wedge. Every curve is written in wedge coordinates:
/// `along` runs from the wide end (0) to the tip (1) and `across` from one long edge (-1) to the other (1). Lines
/// of constant `across` meet at the tip, so independent channels drawn this way visibly converge on one point,
/// which is the idea of the poster: separate controllers added together by one mixer.

type WedgePoint = [along: number, across: number];

const WEDGE_UPPER = [-84, 196];
const WEDGE_LOWER = [10, 440];
const WEDGE_TIP = [416, 118];

// Maps a wedge coordinate to viewBox units by sliding along both long edges and interpolating between them.
function wedgePoint([along, across]: WedgePoint): string {
  const share = (across + 1) / 2;
  const coordinate = (axis: 0 | 1) => {
    const upper = WEDGE_UPPER[axis] + (WEDGE_TIP[axis] - WEDGE_UPPER[axis]) * along;
    const lower = WEDGE_LOWER[axis] + (WEDGE_TIP[axis] - WEDGE_LOWER[axis]) * along;
    return (upper + (lower - upper) * share).toFixed(1);
  };
  return `${coordinate(0)} ${coordinate(1)}`;
}

// Joins wedge coordinates into one open SVG path.
function wedgePath(points: WedgePoint[]): string {
  return `M${points.map(wedgePoint).join('L')}`;
}

// Blink: a flat line with sharp closures at uneven intervals, including one double blink.
const BLINK: WedgePoint[] = [[0, -0.52]];
for (const closure of [0.21, 0.35, 0.41, 0.55]) {
  BLINK.push([closure - 0.022, -0.52], [closure, -0.9], [closure + 0.022, -0.52]);
}
BLINK.push([0.9, -0.52]);

// Gaze: long fixations joined by quick saccades, so the line holds and then jumps.
const GAZE: WedgePoint[] = [];
for (const [start, end, level] of [[0, 0.2, 0.24], [0.215, 0.33, -0.22], [0.345, 0.46, 0.25], [0.475, 0.58, -0.2], [0.6, 0.9, 0.02]]) {
  GAZE.push([start, level], [end, level]);
}

// Sway: one slow sine that dies away before the tip, so the channels enter the mixer cleanly.
const SWAY: WedgePoint[] = Array.from({ length: 49 }, (_, index) => {
  const along = (index / 48) * 0.9;
  return [along, 0.6 + 0.24 * Math.sin(along * 21) * Math.min(1, Math.max(0, (0.68 - along) / 0.2))];
});

// The loudness of a spoken line as bars, each drawn from the mouth outwards along the fan.
const LOUDNESS = [30, 62, 40, 88, 54];

const CAPTION = bi('BLINK · GAZE · SWAY', '眨眼 · 視線 · 擺動');
const LABEL = bi(
  'Constructivist poster of the motion engine contributed to the Kaguya AI companion: blink, gaze and sway curves converge inside a red wedge that pierces an abstract head in profile, reaching the avatar thirty times a second, while bars of speech loudness fan out from its mouth.',
  '構成主義海報，描繪為 AI 伴侶「かぐや」貢獻的動作引擎：眨眼、視線及擺動曲線在紅色楔形內匯聚並刺入抽象的側面頭像，每秒三十次傳送至虛擬形象，語音響度則化作長條，自口部呈扇形展開。',
);

/// A Lissitzky wedge pierces an abstract head built only from a disc and wedges, never the real character art. The
/// wedge's three paper lines are the controllers of the motion engine the owner contributed to Kaguya: blink
/// (sharp closures), gaze (fixations and saccades) and sway (a slow sine). They converge because the engine adds
/// its independent controllers in one mixer, and "30 Hz" is the single loop that sends the result to the avatar.
/// The red bars at the mouth are the loudness of speech, the signal gestures are planned from. No code, paths or
/// configuration from the private repository appear here.
export default function GamingAiCompanionPoster({ locale }: { locale: string }) {
  return (
    <PosterSheet label={pick(LABEL, locale)}>
      <circle cx={478} cy={104} r={104} fill={PRESS.kraft} />
      <HalftoneField x={18} y={70} columns={13} rows={7} step={13} fill={PRESS.ink} />
      <path d="M362 212L318 372H452L482 276Z" fill={PRESS.ink} />
      <circle cx={444} cy={140} r={112} fill={PRESS.ink} />
      <path d="M541 84L592 172L540 192L546 208L500 224L538 234L532 268L470 292L396 240Z" fill={PRESS.ink} />
      <path d="M472 130A27 27 0 0 1 526 130Z" fill={PRESS.paper} />
      <path d="M526 130L640 22V80Z" fill={PRESS.red} />
      <path d={`M${wedgePoint([0, -1])}L${wedgePoint([1, 0])}L${wedgePoint([0, 1])}Z`} fill={PRESS.red} />
      <g fill="none" stroke={PRESS.paper} strokeWidth={8} strokeLinejoin="miter">
        <path d={wedgePath(BLINK)} />
        <path d={wedgePath(GAZE)} />
        <path d={wedgePath(SWAY)} />
      </g>
      <g fill={PRESS.red} transform="translate(556 226) rotate(18)">
        {LOUDNESS.map((height, index) => (
          <rect key={height} x={index * 16} y={-height / 2} width={9} height={height} />
        ))}
      </g>
      <text x={22} y={46} className="poster-type" fontSize={22} fill={PRESS.ink}>
        {pick(CAPTION, locale)}
      </text>
      <text x={630} y={346} className="poster-display" fontSize={40} textAnchor="end" fill={PRESS.ink}>
        30 Hz
      </text>
    </PosterSheet>
  );
}
