import { bi, pick } from '@/lib/i18n-text';
import { HalftoneField, PosterSheet, PRESS } from './press';

/// Poster for the YOLO26 object-detection repository. Every figure printed here comes from the owner's own
/// 20-epoch underwater baseline on merged PR #2 (YOLO26n, Brackish, validation split, one seed): the overall mAP50 is
/// row 3 of `results/underwater.csv` and the per-class mAP50 values are from that PR's table and results plot. No result
/// from the team's later unmerged runs appears. Class names are those of `datasets/manifest.json`.

// The rise of the shoal's current across the sheet, in degrees; the fish and the printed line all follow it.
const CURRENT_ANGLE = -24.6;
// A cut-paper fish about 100 units long, centred on the origin and facing right.
const FISH_OUTLINE = 'M50 0Q30 -21 8 -24L-8 -38L-11 -20L-30 -7L-50 -25L-43 0L-50 25L-30 7Q12 34 50 0Z';
// The fish of the shoal around the boxed one, as [x, y, scale]: the `fish` and `small_fish` classes share the current.
const SHOAL = [
  [232, 170, 0.62],
  [252, 248, 0.44],
  [158, 200, 0.86],
  [172, 276, 0.5],
  [90, 246, 0.6],
  [62, 212, 0.34],
  [572, 46, 0.66],
  [620, 60, 0.34],
  [592, 92, 0.34],
  [550, 102, 0.32],
] as const;

// A single fish lying along the current; `eye` is the colour of the knocked-out eye, left off for the smallest.
function Fish({ x, y, scale, fill, eye }: { x: number; y: number; scale: number; fill: string; eye?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${CURRENT_ANGLE}) scale(${scale})`}>
      <path d={FISH_OUTLINE} fill={fill} />
      {eye ? <circle cx="26" cy="-5" r="4.5" fill={eye} /> : null}
    </g>
  );
}

// The unfound crab: a hard-edged carapace, two raised claws and three legs a side, drawn in plain ink strokes.
function Crab({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={PRESS.ink} strokeWidth="6" strokeLinejoin="miter">
      <path d="M-30 6L-44 -4L-52 -14M-31 14L-50 8L-58 -2M-26 21L-44 22L-54 16M30 6L44 -4L52 -14M31 14L50 8L58 -2M26 21L44 22L54 16" />
      <path d="M-28 -6L-48 -24M28 -6L48 -24" />
      <path d="M-40 -18L-58 -22L-52 -42L-46 -30L-34 -38Z" fill={PRESS.ink} strokeWidth="2" />
      <path d="M40 -18L58 -22L52 -42L46 -30L34 -38Z" fill={PRESS.ink} strokeWidth="2" />
      <path d="M-36 -2L-20 -14L20 -14L36 -2L24 24L-24 24Z" fill={PRESS.ink} stroke="none" />
    </g>
  );
}

// The hit and the miss of one run. A murky ink current climbs the sheet on a Klutsis diagonal with paper fish riding
// it. YOLO26n's red box, axis-aligned as a real detection is, tears a clear window in the water around the one fish it
// has found, flagged with that class's score. Below the current the crab sits in the dashed box of the label it was
// given: the most-labelled class in the data, still found by nothing. The picture is the repository's result in full:
// fish 0.878 and crab 0.000 from the same run, mAP50 0.584 overall, with the failure printed rather than hidden.
export default function YoloObjectDetectionPoster({ locale }: { locale: string }) {
  const label = bi(
    'Constructivist poster of YOLO26n on the Brackish underwater dataset: a red bounding box marks one fish in a shoal crossing a dark current, class mAP50 0.878, while a crab sits below in a dashed box no detection filled, class mAP50 0.000. The overall mAP50 is 0.584.',
    '構成主義海報，呈現 YOLO26n 於 Brackish 水底資料集的結果：紅色邊界框在穿越暗流的魚群中框住一條魚，該類別 mAP50 為 0.878；下方的蟹留在沒有偵測結果的虛線框內，該類別 mAP50 為 0.000。整體 mAP50 為 0.584。',
  );
  return (
    <PosterSheet label={pick(label, locale)}>
      <polygon points="0,214 470,-1 640,-1 640,96 0,386" fill={PRESS.ink} />
      <HalftoneField x={6} y={284} columns={10} rows={7} step={13} fill={PRESS.paper} />
      {SHOAL.map(([x, y, scale]) => (
        <Fish key={`${x}-${y}`} x={x} y={y} scale={scale} fill={PRESS.paper} eye={scale > 0.5 ? PRESS.ink : undefined} />
      ))}
      <text transform={`translate(18 196) rotate(${CURRENT_ANGLE})`} fill={PRESS.ink}>
        <tspan className="poster-display" fontSize="28">
          YOLO26n
        </tspan>
        <tspan className="poster-type" fontSize="18" dx="10">
          mAP50 0.584
        </tspan>
      </text>
      <rect x="282" y="50" width="240" height="166" fill={PRESS.paper} stroke={PRESS.red} strokeWidth="10" />
      <rect x="277" y="20" width="150" height="32" fill={PRESS.red} />
      <text x="287" y="43" className="poster-type" fontSize="21" fill={PRESS.paper}>
        fish 0.878
      </text>
      <Fish x={416} y={129} scale={1.8} fill={PRESS.ink} />
      <Fish x={410} y={124} scale={1.8} fill={PRESS.red} eye={PRESS.paper} />
      <rect x="474" y="260" width="148" height="86" fill="none" stroke={PRESS.ink} strokeWidth="4" strokeDasharray="14 9" />
      <rect x="472" y="232" width="140" height="30" fill={PRESS.ink} />
      <text x="482" y="254" className="poster-type" fontSize="20" fill={PRESS.paper}>
        crab 0.000
      </text>
      <Crab x={548} y={311} />
    </PosterSheet>
  );
}
