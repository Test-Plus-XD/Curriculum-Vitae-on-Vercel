'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'A hex-grid board where a pawn steps and a shot’s line of fire turns red, then play changes to a mirrored platformer arena where time slows.',
  '六角格棋盤上棋子踏出一步、火線格位轉紅，隨後切換至鏡像平台競技場，時間隨之放慢。',
);
const CAPTION = bi(
  'A pawn steps across the hex board and a shot’s line lights red, then play switches to a mirrored arena where time eases down to 0.3 when the player stops.',
  '棋子在六角棋盤上踏出一步，火線格位轉紅，隨後切換至鏡像競技場，玩家一停手時間便減慢至 0.3。',
);

// One loop, about 8.5 s plus the hold. The board tiles print in, the pawn takes two steps and the opponent's
// aimed line blinks red; a red wedge then switches the mode, the arena is built on the right and mirrored
// to the left, a sight line is drawn and the shot slows as the time gauge eases down to 0.3.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  timeline.fromTo(q('.board-label'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
  timeline.fromTo(q('.hex'), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.025 }, 0.1);
  timeline.fromTo(q('.foe'), { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4 }, 0.9);
  timeline.fromTo(q('.trail'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.45 }, 1.2);
  timeline.fromTo(q('.pawn'), { opacity: 0, x: -39, y: 67.5 }, { opacity: 1, x: 0, y: 45, duration: 0.45 }, 1.2);
  timeline.to(q('.pawn'), { x: 0, y: 0, duration: 0.45 }, 1.65);
  timeline.fromTo(q('.aim'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.15 }, 2.3);
  timeline.to(q('.aim'), { opacity: 0.2, duration: 0.15, yoyo: true, repeat: 3, ease: 'none' }, 3.0);
  timeline.fromTo(q('.wedge'), { opacity: 0, scaleX: 0, svgOrigin: '262 180' }, { opacity: 1, scaleX: 1, svgOrigin: '262 180', duration: 0.45 }, 3.9);
  timeline.fromTo(q('.wedge-bar'), { opacity: 0, scaleX: 0, svgOrigin: '262 218' }, { opacity: 1, scaleX: 1, svgOrigin: '262 218', duration: 0.45 }, 4.0);
  timeline.fromTo(q('.arena, .duel-label'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 4.2);
  timeline.fromTo(q('.built'), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4 }, 4.5);
  timeline.fromTo(q('.axis'), { opacity: 0 }, { opacity: 0.5, duration: 0.3 }, 4.9);
  timeline.fromTo(q('.mirrored'), { opacity: 0, scaleX: -1, svgOrigin: '470 0' }, { opacity: 1, scaleX: 1, svgOrigin: '470 0', duration: 0.6, ease: 'power3.inOut' }, 5.1);
  timeline.fromTo(q('.sight')[0], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, 5.8);
  timeline.fromTo(q('.gauge-track'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 6.1);
  timeline.fromTo(q('.bullet'), { x: 62, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 6.1);
  timeline.fromTo(q('.gauge-marker'), { x: 105, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, 6.2);
  // Hold the finished frame before the loop restarts.
  timeline.to({}, { duration: 1.1 });
  return timeline;
}

// Board geometry: a flat-top axial grid of radius 2 centred at (150, 180), where the pitch is 39 across and
// about 45 down, the same relation the game uses (y grows with r + q/2).
const CENTRE_X = 150;
const CENTRE_Y = 180;
const COLUMN_STEP = 39;
const ROW_STEP = 45.03;
const HALF_HEIGHT = 0.866;

// Pixel centre of an axial tile.
function centre(q: number, r: number): [number, number] {
  return [CENTRE_X + COLUMN_STEP * q, CENTRE_Y + ROW_STEP * (r + q / 2)];
}

// Corner list of a flat-top hexagon of the given radius.
function hexPoints(cx: number, cy: number, radius: number): string {
  const h = radius * HALF_HEIGHT;
  const half = radius / 2;
  return `${cx + radius},${cy} ${cx + half},${cy + h} ${cx - half},${cy + h} ${cx - radius},${cy} ${cx - half},${cy - h} ${cx + half},${cy - h}`;
}

// All 19 tiles of a radius-2 board, as axial pairs.
const TILES: Array<[number, number]> = [];
for (let q = -2; q <= 2; q += 1) {
  for (let r = Math.max(-2, -q - 2); r <= Math.min(2, -q + 2); r += 1) TILES.push([q, r]);
}
// The line of fire from the opponent at (2, -2) along the direction (-1, 1), through the pawn's tile.
const AIMED: Array<[number, number]> = [[1, -1], [0, 0], [-1, 1], [-2, 2]];
// The two tiles the pawn passes through before it settles on (0, 0).
const TRAIL: Array<[number, number]> = [[-1, 2], [0, 1]];

// The drawing: the hex board on the left (tiles named by axial pairs, a pawn that swipes two neighbours, an opponent whose
// aimed line of tiles turns red), a red wedge for the mode change, and the platformer arena on the right, built on the
// right half and mirrored to the left, with a sight line, a bullet and a time gauge easing to 0.3. The gauge marker
// and the bullet slow as they arrive; they are illustration, not recorded data.
export default function Abstract({ locale }: { locale: string }) {
  const gun = centre(2, -2);
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <text className="board-label poster-display" x="46" y="46" fontSize="22" fill={PRESS.ink}>{pick(bi('Board', '棋盤'), locale)}</text>
      {TILES.map(([tileQ, tileR]) => {
        const [cx, cy] = centre(tileQ, tileR);
        return <polygon key={`${tileQ},${tileR}`} className="hex" points={hexPoints(cx, cy, 24)} fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="2" strokeLinejoin="miter" />;
      })}
      {AIMED.map(([tileQ, tileR]) => {
        const [cx, cy] = centre(tileQ, tileR);
        return <polygon key={`aim${tileQ},${tileR}`} className="aim" points={hexPoints(cx, cy, 16)} fill={PRESS.red} stroke={PRESS.deep} strokeWidth="2" strokeLinejoin="miter" />;
      })}
      {TRAIL.map(([tileQ, tileR]) => {
        const [cx, cy] = centre(tileQ, tileR);
        return <circle key={`trail${tileQ},${tileR}`} className="trail" cx={cx} cy={cy} r="4" fill={PRESS.ink} />;
      })}
      <g className="foe">
        <polygon points={`${gun[0]},${gun[1] - 14} ${gun[0] - 12},${gun[1] + 8} ${gun[0] + 12},${gun[1] + 8}`} fill={PRESS.ink} />
        <line x1={gun[0] - 5} y1={gun[1] + 2} x2={gun[0] - 23} y2={gun[1] + 12.4} stroke={PRESS.ink} strokeWidth="5" />
      </g>
      <g className="pawn">
        <circle cx="150" cy="180" r="11" fill={PRESS.ink} />
        <circle cx="150" cy="180" r="4" fill={PRESS.paper} />
      </g>
      <text className="board-label poster-type" x="150" y="322" fontSize="16" textAnchor="middle" fill={PRESS.ink}>(q, r)</text>

      <polygon className="wedge" points="264,152 340,180 264,208" fill={PRESS.red} />
      <rect className="wedge-bar" x="264" y="214" width="76" height="8" fill={PRESS.ink} />

      <text className="duel-label poster-display" x="352" y="46" fontSize="22" fill={PRESS.ink}>{pick(bi('Duel', '對決'), locale)}</text>
      <rect className="arena" x="352" y="62" width="236" height="240" fill={PRESS.newsprint} />
      <rect className="arena" x="352" y="286" width="236" height="16" fill={PRESS.ink} />
      <line className="axis" x1="470" y1="140" x2="470" y2="282" stroke={PRESS.ink} strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
      <g className="built">
        <rect x="446" y="118" width="48" height="12" fill={PRESS.ink} />
        <rect x="508" y="226" width="60" height="12" fill={PRESS.ink} />
        <polygon points="544,196 530,226 558,226" fill={PRESS.deep} />
        <rect x="520" y="210" width="20" height="6" fill={PRESS.ink} />
      </g>
      <g className="mirrored">
        <rect x="372" y="226" width="60" height="12" fill={PRESS.ink} />
        <circle cx="396" cy="214" r="12" fill={PRESS.ink} />
        <circle cx="396" cy="214" r="4" fill={PRESS.paper} />
      </g>
      <path className="sight" d="M518 213 L412 213" fill="none" stroke={PRESS.red} strokeWidth="3" />
      <circle className="bullet" cx="450" cy="213" r="5" fill={PRESS.ink} />

      <g className="gauge-track">
        <text className="poster-type" x="356" y="341" fontSize="16" fill={PRESS.ink}>{pick(bi('Time', '時間'), locale)}</text>
        <line x1="420" y1="336" x2="570" y2="336" stroke={PRESS.ink} strokeWidth="3" />
        <rect x="418" y="329" width="4" height="14" fill={PRESS.ink} />
        <rect x="568" y="329" width="4" height="14" fill={PRESS.ink} />
      </g>
      <g className="gauge-marker">
        <rect x="461" y="327" width="8" height="18" fill={PRESS.red} />
        <text className="poster-type" x="465" y="322" fontSize="15" textAnchor="middle" fill={PRESS.ink}>0.3</text>
      </g>
    </AbstractStage>
  );
}
