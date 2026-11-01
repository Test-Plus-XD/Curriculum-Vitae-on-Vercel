'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'Whole video clips are sorted into training, validation and test sets with no clip in two sets, then a detector box scans an image and is tried under four hard conditions: underwater, weather, small objects and camouflage.',
  '整段影片分入訓練、驗證及測試集，沒有片段橫跨兩組；接著偵測框掃描圖像，並在水底、天氣、細小物件及偽裝四種困難情況下接受測試。',
);
const CAPTION = bi(
  'Each video clip goes into exactly one of train, validation and test, so no clip crosses; then the detector is tested underwater, in bad weather, on small objects and against camouflage.',
  '每段影片只會歸入訓練、驗證或測試其中一組，沒有片段橫跨；之後偵測器會在水底、惡劣天氣、細小物件及偽裝情況下接受測試。',
);

// The three splits, top to bottom, each with the lane's top edge and its print colour. Lane length is a drawing choice only.
const LANES = [
  { y: 36, color: PRESS.ink },
  { y: 78, color: PRESS.red },
  { y: 120, color: PRESS.deep },
];
// Every clip sits whole in one lane, stepping down and to the right. Widths are illustrative, not proportional to the split sizes.
const CLIPS = [
  { lane: 0, x: 134, w: 100 },
  { lane: 0, x: 248, w: 72 },
  { lane: 0, x: 334, w: 90 },
  { lane: 1, x: 196, w: 84 },
  { lane: 2, x: 294, w: 70 },
];
// The four hard conditions: the top-left corner of each cell, in the order they are tried.
const CELLS = [
  { key: 'a', x: 324, y: 176 },
  { key: 'b', x: 462, y: 176 },
  { key: 'c', x: 324, y: 256 },
  { key: 'd', x: 462, y: 256 },
];
const REEL_CENTRE = { x: 62, y: 93 };
const DETECTOR_CENTRE = '205 252';

// One loop, about nine seconds. The reel feeds clips into their lanes, red walls close between the lanes, a detector box
// sweeps the scene and locks on, then four cells try the same object under harder conditions. The finished frame holds
// for the last three quarters of a second and through the repeat delay, which keeps one whole cycle to ten seconds.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const reelOrigin = `${REEL_CENTRE.x} ${REEL_CENTRE.y}`;
  // Phase one: the reel and the lanes.
  timeline.fromTo(q('.reel'), { rotation: -160, opacity: 0, svgOrigin: reelOrigin }, { rotation: 0, opacity: 1, svgOrigin: reelOrigin, duration: 0.8 }, 0);
  timeline.fromTo(q('.reel-arrow'), { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 0.3);
  LANES.forEach((lane, index) => {
    timeline.fromTo(q(`.lane-${index}`), { scaleX: 0, svgOrigin: `120 ${lane.y + 15}` }, { scaleX: 1, svgOrigin: `120 ${lane.y + 15}`, duration: 0.5 }, 0.15 + index * 0.1);
  });
  timeline.fromTo(q('.wedge'), { scale: 0, svgOrigin: '626 150' }, { scale: 1, svgOrigin: '626 150', duration: 0.7, ease: 'power3.out' }, 0.2);
  timeline.fromTo(q('.rule'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.7, ease: 'power1.inOut' }, 0.4);
  // Phase two: each clip flies out of the reel and lands whole in its lane.
  CLIPS.forEach((clip, index) => {
    const centreX = clip.x + clip.w / 2;
    const centreY = LANES[clip.lane].y + 15;
    const origin = `${centreX} ${centreY}`;
    timeline.fromTo(
      q(`.clip-${index}`),
      { x: REEL_CENTRE.x - centreX, y: REEL_CENTRE.y - centreY, scale: 0.3, opacity: 0, svgOrigin: origin },
      { x: 0, y: 0, scale: 1, opacity: 1, svgOrigin: origin, duration: 0.8 },
      0.6 + index * 0.28,
    );
  });
  timeline.fromTo(q('.lane-label'), { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, 2.4);
  // Phase three: the walls between the lanes close, so no clip can cross.
  timeline.fromTo(q('.wall'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power1.inOut', stagger: 0.12 }, 2.5);
  // Phase four: the scene appears and the detector box sweeps, then locks onto the object.
  timeline.fromTo(q('.panel'), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 3.2);
  const box = q('.detector');
  const start = { x: -120, y: 20, scale: 1.3, svgOrigin: DETECTOR_CENTRE };
  timeline.fromTo(box, { ...start, opacity: 0 }, { ...start, opacity: 1, duration: 0.25 }, 3.7);
  timeline.to(box, { x: -50, y: -22, scale: 1.15, svgOrigin: DETECTOR_CENTRE, duration: 0.7, ease: 'steps(6)' }, 3.95);
  timeline.to(box, { x: 40, y: 15, scale: 1.2, svgOrigin: DETECTOR_CENTRE, duration: 0.7, ease: 'steps(6)' }, 4.65);
  timeline.to(box, { x: 0, y: 0, scale: 1, svgOrigin: DETECTOR_CENTRE, duration: 0.55, ease: 'back.out(2)' }, 5.35);
  // Phase five: four cells in turn, each with a red probe box snapping onto the same kind of object.
  CELLS.forEach((cell, index) => {
    const start = 5.9 + index * 0.5;
    const origin = `${cell.x + 65} ${cell.y + 27}`;
    timeline.fromTo(q(`.cell-${cell.key}`), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, start);
    timeline.fromTo(q(`.probe-${cell.key}`), { scale: 2.2, opacity: 0, svgOrigin: origin }, { scale: 1, opacity: 1, svgOrigin: origin, duration: 0.4, ease: 'back.out(2)' }, start + 0.25);
  });
  // Hold the finished frame.
  timeline.to({}, { duration: 0.75 }, '+=0');
  return timeline;
}

// Builds the film-perforation path of one clip: small ticks along the top and bottom edges, after the colour cap.
function perforations(x: number, laneY: number, width: number) {
  let path = '';
  for (let tickX = x + 20; tickX < x + width - 6; tickX += 12) path += `M${tickX} ${laneY + 6}v4M${tickX} ${laneY + 20}v4`;
  return path;
}

// The drawing. Left to right and top to bottom: a reel of source clips (the repository names 89), three lanes that each
// hold whole clips, red walls between them, then a scene with a detector box and four cells for the hard conditions.
// Every condition shows the same ink diamond as the object. Underwater has waves, weather has rain, the small case
// shrinks it to a dot among big shapes, and camouflage paints it in the ground's own kraft. The red boxes are where
// the detector is tried, not a claim of success. Train, validation and test lane lengths are not to scale.
export default function Abstract({ locale }: { locale: string }) {
  const laneNames = [bi('TRAIN', '訓練'), bi('VAL', '驗證'), bi('TEST', '測試')];
  const cellNames = [bi('UNDERWATER', '水底'), bi('WEATHER', '天氣'), bi('SMALL', '細小'), bi('CAMOUFLAGE', '偽裝')];
  const holes = [
    [62, 73],
    [81, 87],
    [74, 109],
    [50, 109],
    [43, 87],
  ];
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon className="wedge" points="548,150 626,150 626,40" fill={PRESS.red} />
      <path className="rule" d="M24 162H600" fill="none" stroke={PRESS.ink} strokeWidth="4" />
      <g className="reel">
        <circle cx={REEL_CENTRE.x} cy={REEL_CENTRE.y} r="34" fill={PRESS.ink} />
        {holes.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill={PRESS.paper} />
        ))}
        <circle cx={REEL_CENTRE.x} cy={REEL_CENTRE.y} r="6" fill={PRESS.red} />
      </g>
      <polygon className="reel-arrow" points="100,85 117,93 100,101" fill={PRESS.red} />
      {LANES.map((lane, index) => (
        <rect key={`lane-${index}`} className={`lane-${index}`} x="120" y={lane.y} width="312" height="30" fill={PRESS.newsprint} />
      ))}
      {CLIPS.map((clip, index) => {
        const lane = LANES[clip.lane];
        return (
          <g key={`clip-${index}`} className={`clip-${index}`}>
            <rect x={clip.x} y={lane.y + 3} width={clip.w} height="24" fill={PRESS.paper} stroke={lane.color} strokeWidth="3" />
            <rect x={clip.x} y={lane.y + 3} width="9" height="24" fill={lane.color} />
            <path d={perforations(clip.x, lane.y, clip.w)} fill="none" stroke={lane.color} strokeWidth="2" />
          </g>
        );
      })}
      <path className="wall" d="M120 72H432" fill="none" stroke={PRESS.red} strokeWidth="3" />
      <path className="wall" d="M120 114H432" fill="none" stroke={PRESS.red} strokeWidth="3" />
      {LANES.map((lane, index) => (
        <text key={`label-${index}`} className="lane-label poster-display" x="444" y={lane.y + 22} fontSize="18" fill={lane.color}>
          {pick(laneNames[index], locale)}
        </text>
      ))}
      <g className="panel">
        <rect x="24" y="176" width="276" height="152" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="40" y="194" width="58" height="40" fill={PRESS.kraft} />
        <circle cx="84" cy="300" r="10" fill={PRESS.ink} />
        <rect x="262" y="190" width="26" height="26" fill={PRESS.kraft} />
        <polygon points="205,214 243,252 205,290 167,252" fill={PRESS.ink} />
      </g>
      <g className="detector">
        <rect x="162" y="210" width="86" height="84" fill="none" stroke={PRESS.red} strokeWidth="4" />
        <rect x="162" y="196" width="34" height="14" fill={PRESS.red} />
      </g>
      <g className="cell-a">
        <rect x="324" y="176" width="130" height="72" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="2" />
        <path d="M332 182q6-6 12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0M332 224q6-6 12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0" fill="none" stroke={PRESS.ink} strokeWidth="2" />
        <polygon points="389,190 402,203 389,216 376,203" fill={PRESS.ink} />
        <rect className="probe-a" x="373" y="187" width="32" height="32" fill="none" stroke={PRESS.red} strokeWidth="3" />
        <text className="poster-type" x="389" y="242" textAnchor="middle" fontSize="15" fill={PRESS.ink}>
          {pick(cellNames[0], locale)}
        </text>
      </g>
      <g className="cell-b">
        <rect x="462" y="176" width="130" height="72" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="2" />
        <path d="M476 184l-5 14M490 196l-5 14M504 184l-5 14M552 184l-5 14M566 196l-5 14M580 184l-5 14" fill="none" stroke={PRESS.ink} strokeWidth="2" />
        <polygon points="527,190 540,203 527,216 514,203" fill={PRESS.ink} />
        <rect className="probe-b" x="511" y="187" width="32" height="32" fill="none" stroke={PRESS.red} strokeWidth="3" />
        <text className="poster-type" x="527" y="242" textAnchor="middle" fontSize="15" fill={PRESS.ink}>
          {pick(cellNames[1], locale)}
        </text>
      </g>
      <g className="cell-c">
        <rect x="324" y="256" width="130" height="72" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="2" />
        <rect x="332" y="264" width="34" height="34" fill={PRESS.kraft} />
        <rect x="414" y="268" width="30" height="26" fill={PRESS.kraft} />
        <polygon points="389,279 393,283 389,287 385,283" fill={PRESS.ink} />
        <rect className="probe-c" x="377" y="271" width="24" height="24" fill="none" stroke={PRESS.red} strokeWidth="3" />
        <text className="poster-type" x="389" y="322" textAnchor="middle" fontSize="15" fill={PRESS.ink}>
          {pick(cellNames[2], locale)}
        </text>
      </g>
      <g className="cell-d">
        <rect x="462" y="256" width="130" height="72" fill={PRESS.kraft} stroke={PRESS.ink} strokeWidth="2" />
        <path d="M472 298l14-14M486 298l14-14M472 276l12-12M556 298l14-14M570 298l14-14M556 276l12-12M570 276l12-12" fill="none" stroke={PRESS.ink} strokeWidth="2" opacity="0.45" />
        <polygon points="527,266 544,283 527,300 510,283" fill={PRESS.kraft} stroke={PRESS.ink} strokeWidth="1.5" strokeDasharray="3 3" />
        <rect className="probe-d" x="505" y="261" width="44" height="44" fill="none" stroke={PRESS.red} strokeWidth="3" />
        <text className="poster-type" x="527" y="322" textAnchor="middle" fontSize="15" fill={PRESS.ink}>
          {pick(cellNames[3], locale)}
        </text>
      </g>
    </AbstractStage>
  );
}
