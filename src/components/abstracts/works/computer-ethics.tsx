'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'A balance weighs a chip against a person while spoken words travel down a line and become captions in a strip.',
  '天秤把晶片與人放在兩端衡量，口說的字句沿線送下，化為字幕條上的字幕。',
);
const CAPTION = bi('A balance weighs a chip against a person, while speech turns into a line of captions.', '天秤衡量晶片與人，口說的話化為一行字幕。');
const CHIP = bi('CHIP', '晶片');
const PERSON = bi('PERSON', '人');
const SPEECH = bi('SPEECH', '語音');
const CAPTIONS = bi('CAPTIONS', '字幕');

// The beam's pivot, and the distance from it to each beam end, in viewBox units.
const PIVOT = '400 80';
const ARM = 110;
// How far along the dotted route each word-bead comes to rest (progress 0 to 1), matching where it is drawn.
const BEAD_STOPS = [0.3165, 0.6118, 0.9072];

// The vertical drop of a beam end when the beam is turned by `angle` degrees (clockwise lowers the right end).
function lift(angle: number) {
  return ARM * Math.sin((angle * Math.PI) / 180);
}

// One loop: the stand rises, a chip is set on the left pan and tips the beam, a person is set on the right pan and
// swings it across, and the beam settles level. Meanwhile speech arcs draw out of the speaker, three word-beads
// run down the route into the strip, and the strip sets its words one by one. Beam and pans share one ease so the
// pans always hang from the beam ends. The finished frame is held by the timeline's repeat delay.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const route = q('.route')[0] as SVGPathElement;

  // Turn the beam between two angles and carry both pans with its ends.
  const swing = (at: number, from: number, to: number, duration: number, ease: string) => {
    timeline.fromTo(q('.beam'), { rotation: from, svgOrigin: PIVOT }, { rotation: to, svgOrigin: PIVOT, duration, ease, immediateRender: false }, at);
    timeline.fromTo(q('.pan-left'), { y: -lift(from) }, { y: -lift(to), duration, ease, immediateRender: false }, at);
    timeline.fromTo(q('.pan-right'), { y: lift(from) }, { y: lift(to), duration, ease, immediateRender: false }, at);
  };

  // Wedges and stand.
  timeline.fromTo(q('.wedge-a'), { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0);
  timeline.fromTo(q('.wedge-b'), { x: 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0);
  timeline.fromTo(q('.base'), { scaleY: 0, svgOrigin: '400 246' }, { scaleY: 1, svgOrigin: '400 246', duration: 0.5 }, 0.1);
  timeline.fromTo(q('.column'), { scaleY: 0, svgOrigin: '400 214' }, { scaleY: 1, svgOrigin: '400 214', duration: 0.5 }, 0.3);
  timeline.fromTo(q('.beam'), { scaleX: 0, opacity: 0, svgOrigin: PIVOT }, { scaleX: 1, opacity: 1, svgOrigin: PIVOT, duration: 0.4 }, 0.7);
  timeline.fromTo(q('.pan-left, .pan-right'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.9);

  // The speaker settles in at the left.
  timeline.fromTo(q('.speaker'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0.3);
  timeline.fromTo(q('.label-speech'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.6);

  // A chip drops onto the left pan and tips the beam its way.
  timeline.fromTo(q('.chip-object'), { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.in' }, 1.1);
  timeline.fromTo(q('.label-chip'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.2);
  swing(1.65, 0, -10, 0.55, 'power2.out');

  // A person is set on the right pan and the beam swings across.
  timeline.fromTo(q('.person-object'), { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.in' }, 2.3);
  timeline.fromTo(q('.label-person'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.4);
  swing(2.85, -10, 10, 0.8, 'power2.inOut');
  swing(3.8, 10, 0, 1, 'elastic.out(1, 0.5)');

  // Speech: arcs draw out of the speaker, then word-beads run down the route.
  timeline.fromTo(q('.arc'), { drawSVG: '0% 0%', opacity: 0 }, { drawSVG: '0% 100%', opacity: 1, duration: 0.5, stagger: 0.2 }, 3);
  timeline.fromTo(q('.route, .route-head'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 3.3);
  q('.bead').forEach((bead, index) => {
    timeline.fromTo(
      bead,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: 'power1.inOut',
        motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: BEAD_STOPS[index] },
      },
      3.6 + index * 0.4,
    );
  });

  // The caption strip is laid, then sets its words one by one.
  timeline.fromTo(q('.strip'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.5 }, 4.2);
  timeline.fromTo(q('.label-captions'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 4.6);
  timeline.fromTo(q('.word'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.3, stagger: 0.22 }, 4.9);
  return timeline;
}

// A level balance with a chip on one pan and a person on the other, a speaker sending speech down a dotted route,
// and a caption strip of set words. Nothing here is data: the figures are pictograms. The corner under the pause
// button stays empty (the strip ends at y 308, x 596).
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width={640} height={360} fill={PRESS.paper} />
      <polygon className="wedge-a" points="0,0 190,0 0,26" fill={PRESS.ink} />
      <polygon className="wedge-b" points="640,0 640,66 550,0" fill={PRESS.red} />

      <g className="speaker">
        <rect x={28} y={104} width={34} height={44} fill={PRESS.ink} />
        <polygon points="62,104 62,148 108,176 108,76" fill={PRESS.ink} />
      </g>
      <text className="label-speech poster-display" x={28} y={62} fontSize={18} fill={PRESS.ink}>
        {pick(SPEECH, locale)}
      </text>
      <path className="arc" d="M 134.8 105.1 A 34 34 0 0 1 134.8 146.9" fill="none" stroke={PRESS.red} strokeWidth={6} strokeLinecap="round" />
      <path className="arc" d="M 153.7 90.3 A 58 58 0 0 1 153.7 161.7" fill="none" stroke={PRESS.red} strokeWidth={6} strokeLinecap="round" />
      <path className="arc" d="M 172.6 75.5 A 82 82 0 0 1 172.6 176.5" fill="none" stroke={PRESS.red} strokeWidth={6} strokeLinecap="round" />

      <path className="route" d="M 45 156 V 214 H 190 V 248" fill="none" stroke={PRESS.ink} strokeWidth={2} strokeDasharray="6 5" />
      <polygon className="route-head" points="183,246 197,246 190,260" fill={PRESS.ink} />
      <rect className="bead" x={55} y={207} width={14} height={14} fill={PRESS.red} />
      <rect className="bead" x={125} y={207} width={14} height={14} fill={PRESS.red} />
      <rect className="bead" x={183} y={219} width={14} height={14} fill={PRESS.red} />

      <polygon className="base" points="340,246 460,246 400,214" fill={PRESS.red} />
      <rect className="column" x={394} y={90} width={12} height={124} fill={PRESS.ink} />
      <g className="beam">
        <rect x={290} y={76} width={220} height={8} fill={PRESS.ink} />
        <circle cx={400} cy={80} r={10} fill={PRESS.red} />
      </g>

      <g className="pan-left">
        <path d="M 290 80 L 246 170 M 290 80 L 334 170" stroke={PRESS.ink} strokeWidth={2.5} fill="none" />
        <polygon points="246,170 334,170 320,184 260,184" fill={PRESS.ink} />
        <g className="chip-object">
          <rect x={275} y={138} width={30} height={30} fill={PRESS.red} />
          <rect x={284} y={147} width={12} height={12} fill={PRESS.paper} />
          <path d="M 269 145 H 275 M 269 153 H 275 M 269 161 H 275 M 305 145 H 311 M 305 153 H 311 M 305 161 H 311" stroke={PRESS.ink} strokeWidth={3} fill="none" />
        </g>
        <text className="label-chip poster-display" x={290} y={212} fontSize={18} textAnchor="middle" fill={PRESS.ink}>
          {pick(CHIP, locale)}
        </text>
      </g>

      <g className="pan-right">
        <path d="M 510 80 L 466 170 M 510 80 L 554 170" stroke={PRESS.ink} strokeWidth={2.5} fill="none" />
        <polygon points="466,170 554,170 540,184 480,184" fill={PRESS.ink} />
        <g className="person-object">
          <circle cx={510} cy={134} r={11} fill={PRESS.ink} />
          <path d="M 490 168 Q 490 148 510 148 Q 530 148 530 168 Z" fill={PRESS.ink} />
        </g>
        <text className="label-person poster-display" x={510} y={212} fontSize={18} textAnchor="middle" fill={PRESS.ink}>
          {pick(PERSON, locale)}
        </text>
      </g>

      <rect className="strip" x={24} y={262} width={572} height={46} fill={PRESS.ink} />
      <text className="label-captions poster-type" x={36} y={291} fontSize={18} fill={PRESS.paper}>
        {pick(CAPTIONS, locale)}
      </text>
      <rect className="word" x={196} y={277} width={50} height={16} fill={PRESS.paper} />
      <rect className="word" x={254} y={277} width={30} height={16} fill={PRESS.paper} />
      <rect className="word" x={292} y={277} width={64} height={16} fill={PRESS.paper} />
      <rect className="word" x={364} y={277} width={40} height={16} fill={PRESS.red} />
      <rect className="word" x={412} y={277} width={56} height={16} fill={PRESS.paper} />
      <rect className="word" x={476} y={277} width={34} height={16} fill={PRESS.paper} />
      <rect className="word" x={518} y={277} width={48} height={16} fill={PRESS.paper} />
    </AbstractStage>
  );
}
