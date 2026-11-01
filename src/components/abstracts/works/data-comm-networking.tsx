'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'Three clients send inputs along red wires to a server, which updates the state it keeps; that state then flows back along ink wires to every client.',
  '三個客戶端沿紅線向伺服器送出輸入，伺服器更新它所保存的狀態，然後狀態沿黑線傳回每個客戶端。',
);
const CAPTION = bi(
  'Clients send inputs, the server updates the state it keeps, and the state flows back to the clients.',
  '客戶端送出輸入，伺服器更新它所保存的狀態，並把狀態傳回客戶端。',
);
const CLIENT = bi('CLIENT', '客戶端');
const SERVER = bi('SERVER', '伺服器');
const INPUT = bi('INPUT', '輸入');
const STATE = bi('STATE', '狀態');
const UPDATE = bi('UPDATE', '更新');

// Centre heights of the three clients; each owns an input wire above its centre and a state wire below it.
const ROWS = [94, 180, 266];

// The loop in four beats. The wires and blocks are drawn in; one input packet per client crosses to the server; the
// server's clock sweeps one turn and its state cells are rewritten; then one state packet per client crosses back and
// each client's mark steps into place on arrival. Every tween ends on the finished frame, which is then held while
// the timeline waits to repeat.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  timeline
    .fromTo(q('.wedge'), { x: (index: number) => (index === 0 ? -140 : 180) }, { x: 0, duration: 0.8 }, 0)
    .fromTo(q('.clients'), { scaleX: 0, svgOrigin: '30 180' }, { scaleX: 1, svgOrigin: '30 180', duration: 0.5 }, 0.1)
    .fromTo(q('.server'), { scaleY: 0, svgOrigin: '350 304' }, { scaleY: 1, svgOrigin: '350 304', duration: 0.6 }, 0.2)
    .fromTo(q('.wire'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.07 }, 0.6)
    .fromTo(q('.head'), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 }, 1.0)
    .fromTo(q('.caption'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.1 }, 0.8)
    .fromTo(q('.input'), { x: -130, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, stagger: 0.25, ease: 'power1.inOut' }, 1.6)
    .fromTo(q('.hand'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.6)
    .fromTo(q('.hand'), { rotation: -360, svgOrigin: '350 130' }, { rotation: 0, svgOrigin: '350 130', duration: 1.6, ease: 'power1.inOut' }, 3.0)
    .fromTo(q('.pulse'), { scale: 0.7, opacity: 0, svgOrigin: '350 130' }, { scale: 1, opacity: 1, svgOrigin: '350 130', duration: 0.5, ease: 'back.out(2)' }, 3.0)
    .fromTo(q('.cell'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, transformOrigin: '50% 100%', duration: 0.4, stagger: 0.15, ease: 'back.out(2)' }, 4.2)
    .fromTo(q('.state'), { x: 140, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, stagger: 0.25, ease: 'power1.inOut' }, 4.8)
    .fromTo(q('.pip'), { x: -16 }, { x: 0, duration: 0.35, stagger: 0.25, ease: 'back.out(2)' }, 5.6);
  return timeline;
}

// A press-sheet diagram of client-server exchange. On the left three ink client blocks, each holding a paper mark;
// in the middle a red server block with a clock dial and a row of three state cells; between them a red wire per client
// carrying inputs towards the server and an ink wire carrying state back. The right edge holds a legend for the two
// kinds of packet. Nothing here is measured: it shows only the exchange itself, with no protocol, rate or count,
// and the dial is a picture of the server at work, not a claim about how the design keeps time.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon className="wedge" points="0,0 120,0 0,44" fill={PRESS.ink} />
      <polygon className="wedge" points="470,0 640,0 640,150" fill={PRESS.deep} />
      <g className="clients">
        {ROWS.map((row) => (
          <rect key={row} x="30" y={row - 30} width="70" height="60" fill={PRESS.ink} />
        ))}
      </g>
      {ROWS.map((row) => (
        <rect key={row} className="pip" x="58" y={row - 7} width="14" height="14" fill={PRESS.paper} />
      ))}
      <g className="server">
        <rect x="270" y="56" width="160" height="248" fill={PRESS.red} />
      </g>
      <circle cx="350" cy="130" r="40" fill={PRESS.paper} />
      <circle className="pulse" cx="350" cy="130" r="48" fill="none" stroke={PRESS.paper} strokeWidth="3" />
      <line className="hand" x1="350" y1="130" x2="378" y2="102" stroke={PRESS.ink} strokeWidth="5" strokeLinecap="square" />
      <text className="caption poster-display" x="350" y="208" textAnchor="middle" fontSize="18" fill={PRESS.paper}>
        {pick(UPDATE, locale)}
      </text>
      {[302, 338, 374].map((x) => (
        <rect key={x} className="cell" x={x} y="232" width="24" height="24" fill={PRESS.paper} />
      ))}
      {ROWS.map((row) => (
        <g key={row}>
          <line className="wire" x1="100" y1={row - 10} x2="270" y2={row - 10} stroke={PRESS.red} strokeWidth="3" />
          <polygon className="head" points={`258,${row - 17} 270,${row - 10} 258,${row - 3}`} fill={PRESS.red} />
          <line className="wire" x1="270" y1={row + 10} x2="100" y2={row + 10} stroke={PRESS.ink} strokeWidth="3" />
          <polygon className="head" points={`112,${row + 3} 100,${row + 10} 112,${row + 17}`} fill={PRESS.ink} />
          <rect className="input" x="230" y={row - 16} width="12" height="12" fill={PRESS.red} />
          <circle className="state" cx="130" cy={row + 10} r="7" fill={PRESS.ink} />
        </g>
      ))}
      <text className="caption poster-display" x="30" y="334" fontSize="18" fill={PRESS.ink}>
        {pick(CLIENT, locale)}
      </text>
      <text className="caption poster-display" x="270" y="334" fontSize="18" fill={PRESS.ink}>
        {pick(SERVER, locale)}
      </text>
      <rect x="456" y="196" width="16" height="16" fill={PRESS.red} />
      <text className="caption poster-type" x="482" y="210" fontSize="16" fill={PRESS.ink}>
        {pick(INPUT, locale)}
      </text>
      <circle cx="464" cy="244" r="8" fill={PRESS.ink} />
      <text className="caption poster-type" x="482" y="250" fontSize="16" fill={PRESS.ink}>
        {pick(STATE, locale)}
      </text>
    </AbstractStage>
  );
}
