'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'Motion layers each send small offsets into one mixer, and the sum leaves in a steady 30 Hz tick.',
  '多個動作層各自把細微偏移送入同一個混合器，總和以穩定的 30 Hz 節拍送出。',
);
const CAPTION = bi(
  'Blink, gaze, sway, mood and breath each add a small offset; one mixer sums them and one 30 Hz loop sends the result out.',
  '眨眼、視線、擺動、情緒及呼吸各自加入細微偏移，由一個混合器相加，再由單一 30 Hz 迴圈送出。',
);

// Five of the motion layers, as drawn: a label, the lane's height and the shape of its signal. The shapes are
// illustrative and carry no measured values. The mouth is not among them: it reaches the loop by its own path.
const LAYERS = [
  { name: bi('BLINK', '眨眼'), y: 64, wave: 'M108 64 H150 L158 46 L166 64 H226' },
  { name: bi('GAZE', '視線'), y: 122, wave: 'M108 130 H146 V114 H184 V122 H226' },
  { name: bi('SWAY', '擺動'), y: 180, wave: 'M108 180 C126 162 150 162 167 180 S208 198 226 180' },
  { name: bi('MOOD', '情緒'), y: 238, wave: 'M108 252 C160 252 170 238 226 238' },
  { name: bi('BREATH', '呼吸'), y: 296, wave: 'M108 296 Q137 270 167 296 T226 296' },
] as const;

// Where each signal pulse rests once it has arrived (the socket beside the mixer), and how far behind that rest
// point it starts: every start is the end of its lane's waveform at x = 226.
const SOCKET_Y = [147.5, 163.8, 180, 196.2, 212.5];
const START_DX = -132.5;
const START_DY = [-83.5, -41.8, 0, 41.8, 83.5];
// The moments three rounds of pulses are released, in seconds.
const ROUND_STARTS = [2.6, 3.9, 5.2];
// The six bars of the output tick train, left to right.
const TICK_BARS = [468, 482, 496, 510, 524, 538];

// One loop. The layers' labels and signals draw in, their connecting lines run to the mixer, the mixer and the
// output line appear, then three rounds repeat: a pulse leaves each layer and slides to the mixer, the mixer
// bumps, a ring marks the tick and the train of output bars flashes along the line. It ends on the finished
// frame and holds. Tweens that revisit an element use immediateRender: false so they never overwrite its start.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const core = q('.mix-core');
  const ring = q('.mix-ring');
  const bars = q('.tick-bar');
  timeline.fromTo(q('.wedge-paper'), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8 }, 0);
  timeline.fromTo(q('.wedge-red'), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.8 }, 0.2);
  timeline.fromTo(q('.lane-label'), { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, 0.1);
  timeline.fromTo(q('.wave'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, stagger: 0.14, ease: 'power1.inOut' }, 0.3);
  timeline.fromTo(q('.link'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.1, ease: 'power1.inOut' }, 1.1);
  timeline.fromTo(core, { scale: 0, svgOrigin: '410 180' }, { scale: 1, svgOrigin: '410 180', duration: 0.6, ease: 'back.out(1.8)' }, 1.7);
  timeline.fromTo(q('.out-line'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' }, 2.0);
  timeline.fromTo(q('.out-head'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.4 }, 2.3);
  timeline.fromTo(q('.rate-label'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 2.3);
  ROUND_STARTS.forEach((start, round) => {
    const first = round === 0;
    q('.sig-dot').forEach((dot, index) => {
      const release = start + index * 0.1;
      timeline.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: first }, release);
      timeline.fromTo(
        dot,
        { x: START_DX, y: START_DY[index] },
        { x: 0, y: 0, duration: 0.9, ease: 'power1.in', immediateRender: first },
        release,
      );
    });
    timeline.fromTo(core, { scale: 1.14, svgOrigin: '410 180' }, { scale: 1, svgOrigin: '410 180', duration: 0.4, immediateRender: false }, start + 1.2);
    timeline.fromTo(
      ring,
      { scale: 0.7, opacity: 0, svgOrigin: '410 180' },
      { scale: 1, opacity: 1, svgOrigin: '410 180', duration: 0.45, immediateRender: first },
      start + 1.2,
    );
    timeline.fromTo(
      bars,
      { scaleY: 0, opacity: 0, transformOrigin: '50% 100%' },
      { scaleY: 1, opacity: 1, transformOrigin: '50% 100%', duration: 0.2, stagger: 0.07, immediateRender: first },
      start + 1.3,
    );
  });
  // Hold the finished frame before the loop restarts.
  timeline.to({}, { duration: 1.05 });
  return timeline;
}

// The drawing, in a 640 by 360 box and fully visible as written. Five lanes on the left each carry a label and a
// signal shape, drawn as a spike, step, wave, ease or slow swell. A line runs from each lane to a socket dot
// beside the mixer, the ink disc with a plus. One thick line leaves the mixer for a red wedge, with a train of
// six bars marking the 30 Hz tick, the only figure shown. The shapes are concepts, not data, and no avatar
// is drawn.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon className="wedge-paper" points="400,0 640,0 640,112" fill={PRESS.newsprint} />
      <polygon className="wedge-red" points="400,360 590,322 590,360" fill={PRESS.red} />
      {LAYERS.map((layer, index) => (
        <g key={layer.y}>
          <text className="lane-label poster-display" x="18" y={layer.y + 5} fontSize="15" fill={PRESS.ink}>
            {pick(layer.name, locale)}
          </text>
          <path className="wave" d={layer.wave} fill="none" stroke={PRESS.ink} strokeWidth="3.5" strokeLinejoin="round" />
          <line className="link" x1="226" y1={layer.y} x2="410" y2="180" stroke={PRESS.ink} strokeWidth="2.5" />
          <circle className="sig-dot" cx="358.5" cy={SOCKET_Y[index]} r="5.5" fill={PRESS.red} />
        </g>
      ))}
      <g className="mix-core">
        <circle cx="410" cy="180" r="34" fill={PRESS.ink} />
        <rect x="406" y="165" width="8" height="30" fill={PRESS.paper} />
        <rect x="395" y="176" width="30" height="8" fill={PRESS.paper} />
      </g>
      <circle className="mix-ring" cx="410" cy="180" r="43" fill="none" stroke={PRESS.red} strokeWidth="3" />
      <path className="out-line" d="M453 180 H566" fill="none" stroke={PRESS.ink} strokeWidth="6" />
      {TICK_BARS.map((x) => (
        <rect key={x} className="tick-bar" x={x} y="156" width="6" height="18" fill={PRESS.red} />
      ))}
      <text className="rate-label poster-display" x="466" y="146" fontSize="18" fill={PRESS.ink}>
        30 Hz
      </text>
      <polygon className="out-head" points="566,162 566,198 606,180" fill={PRESS.red} />
    </AbstractStage>
  );
}
