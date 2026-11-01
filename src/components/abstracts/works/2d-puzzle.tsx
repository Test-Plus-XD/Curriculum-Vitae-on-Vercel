'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'Toppings drop into a cup, a chain of matching ones is linked one by one, and the longer the chain, the higher the score multiplier climbs.',
  '配料落入杯中，玩家逐件連起相同的配料；連線越長，分數倍數越高。',
);
const BONUS = bi('+5 s', '+5 秒');
const CAPTION = bi(
  'Watch a chain of nine matching toppings grow: six links earn ×2, and nine earn ×3 plus five extra seconds.',
  '看九件相同配料連成一線：六連得兩倍分數，九連得三倍分數並加時五秒。',
);

// The chain the viewer watches grow, in link order, as cup coordinates.
const CHAIN = [
  { x: 115, y: 282 },
  { x: 150, y: 264 },
  { x: 186, y: 280 },
  { x: 224, y: 262 },
  { x: 262, y: 276 },
  { x: 288, y: 240 },
  { x: 252, y: 218 },
  { x: 214, y: 200 },
  { x: 176, y: 180 },
];

// Other flavours sharing the cup. None sits on a link's path, so no link in the drawing is blocked.
const OTHERS = [
  { x: 146, y: 297, fill: PRESS.ink },
  { x: 226, y: 296, fill: PRESS.kraft },
  { x: 180, y: 230, fill: PRESS.paper },
  { x: 140, y: 222, fill: PRESS.ink },
  { x: 108, y: 236, fill: PRESS.kraft },
  { x: 300, y: 200, fill: PRESS.paper },
  { x: 270, y: 170, fill: PRESS.ink },
  { x: 140, y: 150, fill: PRESS.kraft },
  { x: 220, y: 150, fill: PRESS.paper },
  { x: 110, y: 180, fill: PRESS.paper },
  { x: 190, y: 120, fill: PRESS.ink },
  { x: 250, y: 120, fill: PRESS.kraft },
];

// Every topping, lowest first, so the drop fills the cup from the bottom like a real pour.
const TOPPINGS = [...CHAIN.map((node) => ({ ...node, fill: PRESS.red })), ...OTHERS].sort((a, b) => b.y - a.y);

// The reward steps: the chain length that earns each bar, its height, and where its text sits.
const TIERS = [
  { x: 410, height: 60, fill: PRESS.kraft, digit: '3+', link: 2 },
  { x: 480, height: 120, fill: PRESS.red, digit: '6', link: 5, mult: '×2' },
  { x: 550, height: 180, fill: PRESS.ink, digit: '9', link: 8, mult: '×3' },
];
const BASE = 296;
const LINK_START = 2.4;
const LINK_GAP = 0.38;

// The loop: toppings pour in with a bounce, then each link of the chain is drawn with a dot, and the reward
// bars rise as the chain reaches three, six and nine links. The nine-link bar also brings the time bonus.
// After a hold on the finished frame the toppings fade and the pour starts again.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  timeline.fromTo(q('.top'), { y: -300 }, { y: 0, duration: 0.9, ease: 'bounce.out', stagger: 0.05 }, 0);
  timeline.fromTo(q('.top'), { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none', stagger: 0.05 }, 0);
  timeline.fromTo(q('.clock'), { scale: 0, opacity: 0, svgOrigin: '440 56' }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, 0.2);
  CHAIN.forEach((node, index) => {
    const at = LINK_START + index * LINK_GAP;
    if (index > 0) timeline.fromTo(q('.seg')[index - 1], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.2, ease: 'none' }, at - 0.2);
    timeline.fromTo(q('.dot')[index], { scale: 0, opacity: 0, svgOrigin: `${node.x} ${node.y}` }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2.5)' }, at);
  });
  TIERS.forEach((tier, index) => {
    const at = LINK_START + tier.link * LINK_GAP;
    timeline.fromTo(q('.bar')[index], { scaleY: 0, svgOrigin: `${tier.x + 30} ${BASE}` }, { scaleY: 1, duration: 0.45, ease: 'back.out(1.4)' }, at + 0.1);
    timeline.fromTo(q('.digit')[index], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.2);
    if (tier.mult) timeline.fromTo(q('.mult')[index - 1], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.3);
  });
  const last = LINK_START + 8 * LINK_GAP;
  timeline.fromTo(q('.tag'), { scale: 0, opacity: 0, svgOrigin: '526 53' }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, last + 0.3);
  timeline.fromTo(q('.clock'), { scale: 1.3, svgOrigin: '440 56' }, { scale: 1, duration: 0.4, immediateRender: false }, last + 0.35);
  timeline.to(q('.stuff'), { opacity: 0, duration: 0.4, ease: 'none' }, 7.4);
  return timeline;
}

// Milk Tea Mayhem as a mechanism: a cup of toppings on the left, with a nine-link red chain of matching
// toppings drawn through it, and on the right the rewards the chain length earns. The facts are the case
// file's: chains of three or more clear on release, ×2 from six links, ×3 and five extra seconds from nine,
// on a 60-second clock. The topping colours are plain flavour stand-ins, not the game's art.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon points="0,0 96,0 0,56" fill={PRESS.red} />
      <line x1="376" y1="20" x2="376" y2="340" stroke={PRESS.ink} strokeWidth="3" />
      <line x1="272" y1="66" x2="312" y2="10" stroke={PRESS.red} strokeWidth="8" />
      <polygon points="56,70 344,70 306,316 94,316" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="6" strokeLinejoin="round" />
      <rect x="400" y={BASE} width="220" height="6" fill={PRESS.ink} />
      <g className="stuff">
        {TOPPINGS.map((topping) => (
          <circle key={`${topping.x}-${topping.y}`} className="top" cx={topping.x} cy={topping.y} r="15" fill={topping.fill} stroke={PRESS.ink} strokeWidth="3" />
        ))}
        {CHAIN.slice(1).map((node, index) => (
          <line key={`seg-${node.x}`} className="seg" x1={CHAIN[index].x} y1={CHAIN[index].y} x2={node.x} y2={node.y} stroke={PRESS.ink} strokeWidth="6" />
        ))}
        {CHAIN.map((node) => (
          <circle key={`dot-${node.x}`} className="dot" cx={node.x} cy={node.y} r="6" fill={PRESS.paper} />
        ))}
        <g className="clock">
          <circle cx="440" cy="56" r="28" fill={PRESS.ink} />
          <text x="440" y="64" textAnchor="middle" fontSize="22" fill={PRESS.paper} className="poster-display">60</text>
        </g>
        <g className="tag">
          <rect x="486" y="34" width="80" height="38" fill={PRESS.red} />
          <text x="526" y="61" textAnchor="middle" fontSize="22" fill={PRESS.paper} className="poster-display">{pick(BONUS, locale)}</text>
        </g>
        {TIERS.map((tier) => (
          <g key={tier.digit}>
            <rect className="bar" x={tier.x} y={BASE - tier.height} width="60" height={tier.height} fill={tier.fill} />
            <text className="digit poster-type" x={tier.x + 30} y="326" textAnchor="middle" fontSize="20" fill={PRESS.ink}>
              {tier.digit}
            </text>
            {tier.mult && (
              <text className="mult poster-display" x={tier.x + 30} y={BASE - tier.height - 10} textAnchor="middle" fontSize="26" fill={PRESS.ink}>
                {tier.mult}
              </text>
            )}
          </g>
        ))}
      </g>
    </AbstractStage>
  );
}
