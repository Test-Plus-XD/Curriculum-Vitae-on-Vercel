'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'A sketch of the ten-room map: typed commands walk a player to the Alchemist’s Hearth for the Elderfruit, trade it to the Starving Warden in the vault, take the relic and enter the Triumph Sanctum to win.',
  '十個房間地圖的示意圖：玩家輸入指令前往 Alchemist’s Hearth 取得 Elderfruit，在寶庫交給 Starving Warden，取得聖物後走進 Triumph Sanctum 獲勝。',
);
const CAPTION = bi(
  'A schematic of the ten-room map: typed commands fetch the Elderfruit, trade it to the Warden and carry the relic into the Sanctum.',
  '十個房間地圖的示意圖：玩家輸入指令取得 Elderfruit，交給 Warden 換取聖物，再帶進 Sanctum。',
);
const WIN = bi('WIN', '勝利');
const VAULT = bi('VAULT', '寶庫');

// Room centres of the sketch, ten in all; the named ones are the Hearth, the vault and the Sanctum.
const ROOMS: [number, number][] = [[250, 185], [250, 110], [340, 185], [430, 185], [340, 110], [340, 40], [160, 185], [160, 110], [430, 110], [520, 110]];
// Corridors as pairs of room indices, a branching tree with dead ends.
const CORRIDORS: [number, number][] = [[0, 1], [0, 2], [2, 3], [2, 4], [4, 5], [0, 6], [6, 7], [3, 8], [8, 9]];
// The seven typed commands, in the order the player enters them.
const COMMANDS = ['> go north', '> take elderfruit', '> back', '> go east', '> give elderfruit', '> take relic', '> go east'];

// Moves one target between two offsets from its finished position; later hops never render their start early.
function hop(timeline: gsap.core.Timeline, target: Element[], from: { x: number; y: number }, to: { x: number; y: number }, at: number, duration: number) {
  timeline.fromTo(target, { ...from }, { ...to, duration, ease: 'power2.inOut', immediateRender: false }, at);
}

// The loop: the console types a command, the token steps through the map and the item follows it. Every offset
// is measured from the finished frame, which the JSX draws: token and relic in the Sanctum, the fruit with the
// Warden, who has left the vault. Offsets: token S (-171,0) Hearth (-171,-75) vault (-95,0); fruit Hearth
// (-122,-40) carried (-110,-52), (-110,23), (-44,22); relic vault (-91,0); Warden vault (2,44).
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const command = q('.cmd');
  const token = q('.token');
  const fruit = q('.fruit');
  const relic = q('.relic');
  const warden = q('.warden');
  const route = q('.leg-up');
  const run = q('.leg-run');
  // The map and the console assemble first.
  timeline.from(q('.wedge'), { x: -80, opacity: 0, duration: 0.7 }, 0);
  timeline.from(q('.corridor'), { opacity: 0, duration: 0.5 }, 0.2);
  timeline.from(q('.room'), { scale: 0.5, opacity: 0, transformOrigin: '50% 50%', stagger: 0.05, duration: 0.4 }, 0);
  timeline.from(q('.tag'), { opacity: 0, duration: 0.4 }, 0.7);
  timeline.from(q('.console'), { y: 24, opacity: 0, duration: 0.5 }, 0.3);
  timeline.fromTo(token, { x: -171, y: 0, opacity: 0 }, { x: -171, y: 0, opacity: 1, duration: 0.4 }, 0.8);
  timeline.fromTo(fruit, { x: -122, y: -40, opacity: 0 }, { x: -122, y: -40, opacity: 1, duration: 0.4 }, 0.8);
  timeline.fromTo(warden, { x: 2, y: 44, opacity: 0 }, { x: 2, y: 44, opacity: 1, duration: 0.4 }, 0.8);
  // Go north to the Hearth and draw the first leg.
  timeline.from(command[0], { opacity: 0, x: -12, duration: 0.3 }, 0.9);
  hop(timeline, token, { x: -171, y: 0 }, { x: -171, y: -75 }, 1.0, 0.6);
  timeline.fromTo(route, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power2.inOut' }, 1.0);
  // Take the Elderfruit.
  timeline.from(command[1], { opacity: 0, x: -12, duration: 0.3 }, 1.8);
  hop(timeline, fruit, { x: -122, y: -40 }, { x: -110, y: -52 }, 1.9, 0.4);
  // Back to the start, carrying it.
  timeline.from(command[2], { opacity: 0, x: -12, duration: 0.3 }, 2.6);
  hop(timeline, token, { x: -171, y: -75 }, { x: -171, y: 0 }, 2.7, 0.6);
  hop(timeline, fruit, { x: -110, y: -52 }, { x: -110, y: 23 }, 2.7, 0.6);
  // East into the vault, half of the second leg.
  timeline.from(command[3], { opacity: 0, x: -12, duration: 0.3 }, 3.5);
  hop(timeline, token, { x: -171, y: 0 }, { x: -95, y: 0 }, 3.6, 0.7);
  hop(timeline, fruit, { x: -110, y: 23 }, { x: -44, y: 22 }, 3.6, 0.7);
  timeline.fromTo(run, { drawSVG: '0% 0%' }, { drawSVG: '0% 50%', duration: 0.7, ease: 'power2.inOut' }, 3.6);
  // Give the fruit: it passes to the Warden, who leaves the vault.
  timeline.from(command[4], { opacity: 0, x: -12, duration: 0.3 }, 4.5);
  hop(timeline, fruit, { x: -44, y: 22 }, { x: 0, y: 0 }, 4.6, 0.7);
  hop(timeline, warden, { x: 2, y: 44 }, { x: 0, y: 0 }, 4.6, 0.7);
  // The relic appears in the vault, and the player takes it.
  timeline.fromTo(relic, { x: -91, y: 0, opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { x: -91, y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 5.3);
  timeline.from(command[5], { opacity: 0, x: -12, duration: 0.3 }, 5.5);
  // East into the Sanctum with the relic, to finish the second leg.
  timeline.from(command[6], { opacity: 0, x: -12, duration: 0.3 }, 6.1);
  hop(timeline, token, { x: -95, y: 0 }, { x: 0, y: 0 }, 6.2, 0.7);
  hop(timeline, relic, { x: -91, y: 0 }, { x: 0, y: 0 }, 6.2, 0.7);
  timeline.fromTo(run, { drawSVG: '0% 50%' }, { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.inOut', immediateRender: false }, 6.2);
  timeline.from(q('.cursor'), { opacity: 0, duration: 0.2 }, 6.9);
  timeline.fromTo(q('.stamp'), { scale: 2, opacity: 0, svgOrigin: '591 168' }, { scale: 1, opacity: 1, svgOrigin: '591 168', duration: 0.3, ease: 'power4.in' }, 7.0);
  // Hold the finished frame before the loop restarts.
  timeline.to(q('.backdrop'), { opacity: 1, duration: 0.01 }, 8.0);
  return timeline;
}

// A branching tree of ten rooms with the player's route in red below a black console that lists the commands. The
// sketch is schematic: the case file gives ten rooms, a dead end in the Mossbound Garden, a vault that opens
// east into the Triumph Sanctum, and the Elderfruit, Warden and relic quest, but not the exact layout. The
// finished frame has the token and relic in the Sanctum, the fruit handed over and the Warden gone from the vault.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect className="backdrop" width="640" height="360" fill={PRESS.paper} />
      <polygon className="wedge" points="0,0 220,0 0,120" fill={PRESS.red} />
      <polygon points="640,0 640,52 588,0" fill={PRESS.ink} />
      {CORRIDORS.map(([from, to]) => (
        <line key={`${from}-${to}`} className="corridor" x1={ROOMS[from][0]} y1={ROOMS[from][1]} x2={ROOMS[to][0]} y2={ROOMS[to][1]} stroke={PRESS.ink} strokeWidth="3" />
      ))}
      <path className="leg-up" d="M250,185 V110" fill="none" stroke={PRESS.red} strokeWidth="6" />
      <path className="leg-run" d="M250,185 H430" fill="none" stroke={PRESS.red} strokeWidth="6" />
      {ROOMS.map(([x, y], index) => (
        <rect key={index} className="room" x={x - 26} y={y - 19} width="52" height="38" fill={index === 3 ? PRESS.kraft : PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
      ))}
      <text className="tag poster-type" x="250" y="86" textAnchor="middle" fontSize="15" fill={PRESS.ink}>HEARTH</text>
      <text className="tag poster-type" x="340" y="224" textAnchor="middle" fontSize="15" fill={PRESS.ink}>{pick(VAULT, locale)}</text>
      <text className="tag poster-type" x="430" y="224" textAnchor="middle" fontSize="15" fill={PRESS.ink}>SANCTUM</text>
      <circle className="fruit" cx="372" cy="150" r="7" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" />
      <polygon className="warden" points="354,141 362,159 346,159" fill={PRESS.ink} />
      <polygon className="relic" points="445,175 455,185 445,195 435,185" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2.5" />
      <g className="token">
        <circle cx="421" cy="185" r="9" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="3" />
        <circle cx="421" cy="185" r="3" fill={PRESS.paper} />
      </g>
      <g className="console">
        <rect x="24" y="238" width="530" height="104" fill={PRESS.ink} />
        {COMMANDS.map((text, index) => (
          <text key={text + index} className="cmd poster-type" x={index < 4 ? 44 : 300} y={262 + (index % 4) * 22} fontSize="17" fill={PRESS.paper}>
            {text}
          </text>
        ))}
        <rect className="cursor" x="300" y="318" width="9" height="16" fill={PRESS.red} />
      </g>
      <g className="stamp">
        <g transform="rotate(-6 591 168)">
          <rect x="556" y="150" width="70" height="36" fill="none" stroke={PRESS.red} strokeWidth="4" />
          <text className="poster-display" x="591" y="177" textAnchor="middle" fontSize="22" fill={PRESS.red}>{pick(WIN, locale)}</text>
        </g>
      </g>
    </AbstractStage>
  );
}
