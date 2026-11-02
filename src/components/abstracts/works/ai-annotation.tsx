'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'A three-step cycle of a failing test, the code and a passing test, beside an image that is given a label and a confidence score.',
  '圖片旁有一個三步循環：失敗的測試、程式碼、通過的測試；圖片隨後加上標籤及信心分數。',
);
const CAPTION = bi(
  'The test-first rhythm the rebuild aimed for: a failing test, then the code that puts a label and a confidence score on an image, then a pass and the next test.',
  '重建時追求的測試先行節奏：先寫失敗的測試，再寫為圖片加上標籤及信心分數的程式碼，通過後進入下一個測試。',
);
const TAG = bi('label', '標籤');
const TEST = bi('TEST', '測試');
const CODE = bi('CODE', '程式碼');
const PASS = bi('PASS', '通過');

// One loop of about eight seconds. A red test node appears and judders (failing), an arrow leads to the code node,
// and while it is lit a cursor drags the confidence slider along and the label tag drops onto the image. A second
// arrow reaches the passing node, whose tick is drawn, and the third arrow closes the cycle: a red halo round the test
// node shows the next test beginning. The last 1.9 seconds hold the finished frame.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  // The photograph settles in.
  timeline.fromTo(q('.sheet'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
  // Step one: the red test pops in and shudders.
  timeline.fromTo(q('.node-test'), { scale: 0, svgOrigin: '500 78' }, { scale: 1, svgOrigin: '500 78', duration: 0.5, ease: 'back.out(2)' }, 0.5);
  timeline.fromTo(q('.node-test'), { x: -7 }, { x: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' }, 0.5);
  timeline.fromTo(q('.lbl-test'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);
  // Step two: the arrow runs to the code node.
  timeline.fromTo(q('.arrow-a'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 }, 1.3);
  timeline.fromTo(q('.head-a'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.75);
  timeline.fromTo(q('.node-code'), { scale: 0, svgOrigin: '575 235' }, { scale: 1, svgOrigin: '575 235', duration: 0.5, ease: 'back.out(2)' }, 1.8);
  timeline.fromTo(q('.lbl-code'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.0);
  // The cursor drags the slider's handle along; the score bar grows behind it.
  timeline.fromTo(q('.cursor, .knob'), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 2.2);
  timeline.fromTo(q('.cursor, .knob'), { x: -170 }, { x: 0, duration: 1.5, ease: 'power2.inOut' }, 2.3);
  timeline.fromTo(q('.score'), { scaleX: 0, svgOrigin: '90 276' }, { scaleX: 1, svgOrigin: '90 276', duration: 1.5, ease: 'power2.inOut' }, 2.3);
  timeline.fromTo(q('.tag'), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.4 }, 4.2);
  // Step three: the code is done and the test passes.
  timeline.fromTo(q('.arrow-b'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 }, 4.8);
  timeline.fromTo(q('.head-b'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 5.25);
  timeline.fromTo(q('.node-pass'), { scale: 0, svgOrigin: '425 235' }, { scale: 1, svgOrigin: '425 235', duration: 0.5, ease: 'back.out(2)' }, 5.4);
  timeline.fromTo(q('.lbl-pass'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 5.6);
  timeline.fromTo(q('.check'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, 5.7);
  // The loop closes: the next test begins.
  timeline.fromTo(q('.arrow-c'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 }, 6.2);
  timeline.fromTo(q('.head-c'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 6.65);
  timeline.fromTo(q('.halo'), { scale: 0.7, opacity: 0, svgOrigin: '500 78' }, { scale: 1, opacity: 1, svgOrigin: '500 78', duration: 0.5 }, 6.8);
  // A harmless tween that only stretches the timeline so the finished frame is held.
  timeline.fromTo(q('.wedge-bg'), { opacity: 1 }, { opacity: 1, duration: 0.7 }, 7.3);
  return timeline;
}

// A newsprint photograph on the left holds an ink wedge and a kraft sun, with the label tag above the wedge and a
// confidence slider below it, the cursor on the slider's handle. The tool labels whole images, with one score per
// label set on a slider, so nothing here marks out a region of the picture. On the right three nodes form the cycle: a red node
// with a cross for the failing test, a paper node with angle brackets for the code, an ink node with a tick for the
// passing test. Only facts the case file states are drawn: a test written ahead of the code, then the code, then a
// pass, and the cycle begun again. No numbers, no pass counts.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon className="wedge-bg" points="640,0 640,80 560,0" fill={PRESS.red} />
      <g className="sheet">
        <rect x="30" y="40" width="330" height="270" fill={PRESS.kraft} />
        <rect x="42" y="52" width="306" height="246" fill={PRESS.newsprint} />
        <polygon points="130,250 250,250 190,130" fill={PRESS.ink} />
        <circle cx="300" cy="110" r="22" fill={PRESS.kraft} />
        <rect x="90" y="274" width="220" height="4" fill={PRESS.ink} />
      </g>
      <rect className="score" x="90" y="270" width="170" height="12" fill={PRESS.red} />
      <rect className="knob" x="255" y="264" width="10" height="24" fill={PRESS.ink} />
      <g className="tag">
        <rect x="118" y="82" width="100" height="28" fill={PRESS.red} />
        <text x="168" y="102" textAnchor="middle" fontSize="18" fill={PRESS.paper} className="poster-type">
          {pick(TAG, locale)}
        </text>
      </g>
      <polygon className="cursor" points="260,276 260,304 267,298 273,311 279,308 273,295 282,295" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="2.5" strokeLinejoin="round" />
      <circle className="halo" cx="500" cy="78" r="40" fill="none" stroke={PRESS.red} strokeWidth="3" />
      <line className="arrow-a" x1="515" y1="109" x2="555" y2="193" stroke={PRESS.ink} strokeWidth="5" />
      <polygon className="head-a" points="560,204 548.5,196.2 561.1,190.2" fill={PRESS.ink} />
      <line className="arrow-b" x1="541" y1="235" x2="471" y2="235" stroke={PRESS.ink} strokeWidth="5" />
      <polygon className="head-b" points="459,235 471,227 471,243" fill={PRESS.ink} />
      <line className="arrow-c" x1="440" y1="204" x2="480" y2="120" stroke={PRESS.ink} strokeWidth="5" />
      <polygon className="head-c" points="485,109 486.4,122.5 473.8,116.5" fill={PRESS.ink} />
      <g className="node-test">
        <circle cx="500" cy="78" r="30" fill={PRESS.red} />
        <line x1="488" y1="66" x2="512" y2="90" stroke={PRESS.paper} strokeWidth="6" />
        <line x1="512" y1="66" x2="488" y2="90" stroke={PRESS.paper} strokeWidth="6" />
      </g>
      <g className="node-code">
        <circle cx="575" cy="235" r="30" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="6" />
        <polyline points="565,224 553,235 565,246" fill="none" stroke={PRESS.ink} strokeWidth="5" strokeLinejoin="round" />
        <polyline points="585,224 597,235 585,246" fill="none" stroke={PRESS.ink} strokeWidth="5" strokeLinejoin="round" />
      </g>
      <g className="node-pass">
        <circle cx="425" cy="235" r="30" fill={PRESS.ink} />
        <polyline className="check" points="412,236 421,246 440,224" fill="none" stroke={PRESS.paper} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text className="lbl-test poster-display" x="548" y="84" fontSize="17" fill={PRESS.ink}>
        {pick(TEST, locale)}
      </text>
      <text className="lbl-code poster-display" x="575" y="284" textAnchor="middle" fontSize="17" fill={PRESS.ink}>
        {pick(CODE, locale)}
      </text>
      <text className="lbl-pass poster-display" x="425" y="284" textAnchor="middle" fontSize="17" fill={PRESS.ink}>
        {pick(PASS, locale)}
      </text>
    </AbstractStage>
  );
}
