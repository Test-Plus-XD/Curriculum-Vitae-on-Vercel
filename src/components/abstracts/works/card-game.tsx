'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'A grid of cards is flipped in pairs: a pair that differs turns back after one second, a pair that matches stays face up and scores 10, and the grid then grows from 8 cards to 28 across five levels.',
  '棋盤上的卡牌成對翻開：兩張不同的卡牌一秒後翻回，配對成功的卡牌保持翻開並得 10 分，其後棋盤在五個關卡中由 8 張增至 28 張。',
);
const CAPTION = bi(
  'Two cards flip and differ, so they turn back; a matching pair stays and scores 10; then the grid grows level by level.',
  '兩張卡牌翻開後不同，因此翻回；配對成功的一對留在原處並得 10 分；之後棋盤逐關擴大。',
);

// The demo board is two rows of four cards. Each card is 56 by 72 units on a pitch of 68 by 84.
const CARD_X = 28;
const CARD_Y = 62;
const PITCH_X = 68;
const PITCH_Y = 84;
const CARD_W = 56;
const CARD_H = 72;
// Which shape each of the eight cards carries: 0 circle, 1 triangle, 2 square, 3 wedge. Every shape appears twice.
// The shapes stand in for the game's numbered cards, whose faces are not drawn here.
const SHAPES = [0, 1, 2, 3, 2, 0, 3, 1];
// The five grids of the game as [columns, rows]: 2 x 4, 3 x 4, 3 x 6, 4 x 6 and 4 x 7 cards, from 8 to 28.
const LEVELS: [number, number][] = [
  [4, 2],
  [4, 3],
  [6, 3],
  [6, 4],
  [7, 4],
];
// Where each ladder grid starts, as [x, y]. The first row is bottom-aligned at y 150, the second starts at y 200.
const LEVEL_AT: [number, number][] = [
  [330, 120],
  [414, 103],
  [498, 103],
  [330, 200],
  [448, 200],
];
const CELL = 13;
const CELL_PITCH = 17;

// The horizontal centre of a card on the demo board.
function centreX(index: number) {
  return CARD_X + PITCH_X * (index % 4) + CARD_W / 2;
}

// The vertical centre of a card on the demo board.
function centreY(index: number) {
  return CARD_Y + PITCH_Y * Math.floor(index / 4) + CARD_H / 2;
}

// The loop, in seconds: 0 the cards are dealt face down; 1.1 and 1.6 two different cards flip; 1.8 to 2.8 the board
// is locked for one second while a red bar fills; 2.85 both turn back; 3.4 and 3.8 a matching pair flips and
// stays, with +10; 4.8 to 6 the other pairs flip up; 6.1 to 8.2 the five grids light up one after another, ending on
// 4 x 7; the last half second and the repeat delay hold the finished frame.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const deals = q('.cg-deal');
  const cards = q('.cg-card');
  const backs = q('.cg-back');
  const bar = q('.cg-bar');
  const plus = q('.cg-plus');
  const levels = q('.cg-level');
  // Turn one card: squash it to a sliver, swap its back for its face (or the reverse) at zero width, then widen it.
  const flip = (index: number, time: number, faceUp: boolean) => {
    const origin = `${centreX(index)} ${centreY(index)}`;
    timeline.to(cards[index], { scaleX: 0, svgOrigin: origin, duration: 0.12, ease: 'power2.in' }, time);
    timeline.set(backs[index], { opacity: faceUp ? 0 : 1, immediateRender: false }, time + 0.12);
    timeline.to(cards[index], { scaleX: 1, svgOrigin: origin, duration: 0.14, ease: 'back.out(2)' }, time + 0.12);
  };
  // Every card starts face down.
  timeline.set(backs, { opacity: 1 }, 0);
  timeline.fromTo(deals, { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07 }, 0);
  // A mismatch: two different cards, a one-second lock, then both turn back.
  flip(1, 1.1, true);
  flip(2, 1.6, true);
  timeline.fromTo(bar, { scaleX: 0 }, { scaleX: 1, svgOrigin: '170 44', duration: 1, ease: 'none' }, 1.8);
  timeline.to(bar, { scaleX: 0, svgOrigin: '170 44', duration: 0.15 }, 2.85);
  flip(1, 2.85, false);
  flip(2, 2.85, false);
  // A match: two circles flip and stay, and the score reads +10.
  flip(0, 3.4, true);
  flip(5, 3.8, true);
  timeline.fromTo(plus, { scale: 0, opacity: 0, svgOrigin: '28 52' }, { scale: 1, opacity: 1, svgOrigin: '28 52', duration: 0.4, ease: 'back.out(2.5)' }, 4.1);
  [0, 5].forEach((index) => {
    timeline.to(deals[index], { scale: 1.1, svgOrigin: `${centreX(index)} ${centreY(index)}`, duration: 0.12, yoyo: true, repeat: 1 }, 4.15);
  });
  timeline.to(bar, { scaleX: 1, svgOrigin: '170 44', duration: 0.4 }, 5.9);
  // The remaining pairs flip up one card at a time.
  [1, 7, 2, 4, 3, 6].forEach((index, order) => flip(index, 4.8 + order * 0.2, true));
  // The five grids light up in turn, each larger than the last.
  timeline.fromTo(levels, { opacity: 0.15, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.4 }, 6.1);
  // Pad the end so the finished frame is held.
  timeline.to({}, { duration: 0.01 }, 8.6);
  return timeline;
}

// A card's shape, drawn around its centre: a red circle, an ink triangle, a deep-red square or an ink wedge.
function Shape({ kind, x, y }: { kind: number; x: number; y: number }) {
  if (kind === 0) return <circle cx={x} cy={y} r={15} fill={PRESS.red} />;
  if (kind === 1) return <polygon points={`${x},${y - 17} ${x + 17},${y + 13} ${x - 17},${y + 13}`} fill={PRESS.ink} />;
  if (kind === 2) return <rect x={x - 14} y={y - 14} width={28} height={28} fill={PRESS.deep} />;
  return <polygon points={`${x - 18},${y + 16} ${x + 18},${y - 2} ${x - 18},${y - 8}`} fill={PRESS.ink} />;
}

// The drawing is the finished frame: a 2 x 4 board with every pair turned up, the score, the one-second lock bar
// and the five grids from 8 to 28 cards, the last in red. The +10 score, the one-second reveal delay
// and the grid sizes 2 x 4, 3 x 4, 3 x 6, 4 x 6 and 4 x 7 come from the project's case file. The backs are hidden in
// this frame and only appear while the timeline turns a card face down.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width={640} height={360} fill={PRESS.newsprint} />
      <polygon points="28,340 288,250 288,340" fill={PRESS.red} />
      <rect x={308} y={40} width={4} height={270} fill={PRESS.ink} />
      <text className="cg-plus poster-display" x={28} y={52} fontSize={40} fill={PRESS.red}>
        +10
      </text>
      <text className="poster-type" x={170} y={34} fontSize={16} fill={PRESS.ink}>
        {pick(bi('1 s', '1 秒'), locale)}
      </text>
      <rect className="cg-bar" x={170} y={40} width={118} height={8} fill={PRESS.red} />
      <line x1={170} y1={54} x2={288} y2={54} stroke={PRESS.ink} strokeWidth={2} />
      {SHAPES.map((kind, index) => {
        const x = CARD_X + PITCH_X * (index % 4);
        const y = CARD_Y + PITCH_Y * Math.floor(index / 4);
        return (
          <g key={index} className="cg-deal">
            <g className="cg-card">
              <rect x={x} y={y} width={CARD_W} height={CARD_H} fill={PRESS.paper} stroke={PRESS.ink} strokeWidth={3} />
              <Shape kind={kind} x={x + CARD_W / 2} y={y + CARD_H / 2} />
              <rect className="cg-back" x={x} y={y} width={CARD_W} height={CARD_H} fill={PRESS.ink} opacity={0} />
            </g>
          </g>
        );
      })}
      <text className="poster-display" x={330} y={60} fontSize={26} fill={PRESS.ink}>
        {pick(bi('5 levels', '五個關卡'), locale)}
      </text>
      <rect x={330} y={68} width={120} height={6} fill={PRESS.red} />
      {LEVELS.map(([columns, rows], level) => {
        const [startX, startY] = LEVEL_AT[level];
        const cells = [];
        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            cells.push(<rect key={`${row}-${column}`} x={startX + column * CELL_PITCH} y={startY + row * CELL_PITCH} width={CELL} height={CELL} fill={level === 4 ? PRESS.red : PRESS.ink} />);
          }
        }
        return (
          <g key={level} className="cg-level">
            {cells}
            {level === 0 && (
              <text className="poster-display" x={startX} y={176} fontSize={20} fill={PRESS.ink}>
                8
              </text>
            )}
            {level === 4 && (
              <text className="poster-display" x={startX} y={294} fontSize={24} fill={PRESS.red}>
                28
              </text>
            )}
          </g>
        );
      })}
    </AbstractStage>
  );
}
