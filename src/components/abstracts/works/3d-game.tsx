'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'An isometric lane: a wireframe asset modelled in 3ds Max drops into the Unity scene, a runner sidesteps it, and a shot flies down the lane to a target.',
  '等距跑道：以 3ds Max 製作的線框資產落入 Unity 場景，跑者側身閃避，一發子彈沿跑道射向標靶。',
);
const CAPTION = bi(
  'A 3ds Max asset drops into a Unity lane; the runner build dodges it and the shooter build fires.',
  '3ds Max 資產落入 Unity 跑道；跑酷版本閃避，射擊版本開火。',
);
const RUNNER_TEXT = bi('RUNNER', '跑酷');
const SHOOTER_TEXT = bi('SHOOTER', '射擊');
const ORIGIN_X = 150;
const ORIGIN_Y = 200;
const STEP_X = 30;
const STEP_Y = 17.3;
const CRATE_HEIGHT = 34;
const HEAD_HEIGHT = 18;
// Low enough that the wireframe is drawn on the sheet, beside the 3ds Max arrow, and not above its top edge.
const DROP_HEIGHT = 70;

type Point = [number, number];

// Maps a lane coordinate (cells along the lane, cells across it) to the isometric viewBox. Along runs up and to the
// right, across runs down and to the right, so a larger across value sits nearer the viewer.
function iso(along: number, across: number): Point {
  return [ORIGIN_X + STEP_X * (along + across), ORIGIN_Y - STEP_Y * (along - across)];
}

// Lifts a floor point straight up the screen by a height in viewBox units.
function lift(point: Point, height: number): Point {
  return [point[0], point[1] - height];
}

// Moves a point by an offset, so a figure can be drawn around any floor position without a transform attribute.
function shift(point: Point, dx: number, dy: number): Point {
  return [point[0] + dx, point[1] + dy];
}

// Joins points into an SVG points string with one decimal place.
function pts(list: Point[]): string {
  return list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

// Joins points into an SVG path of straight segments, optionally closed.
function route(list: Point[], closed = false): string {
  return list.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + (closed ? ' Z' : '');
}

// Offset of a lane position from the runner's finished position, which is how the timeline moves the runner.
function fromFinish(along: number, across: number) {
  const target = iso(along, across);
  const finish = iso(4.4, 3);
  return { x: target[0] - finish[0], y: target[1] - finish[1] };
}

// The loop: the lane and tags print in, the wireframe crate is drawn in the air above its cell and falls in, then
// its faces fill. The runner enters the left lane, hops across to the right lane to pass the crate, and stops.
// A bolt then leaves the runner, trailing a line, and the target's core jumps on arrival. The finished frame is
// held, then everything fades so the restart is a clean blank sheet.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const cell = iso(4, 1);
  const goal = iso(8.5, 3);
  const start = fromFinish(0.6, 1);
  const lane = fromFinish(2, 1);
  const side = fromFinish(2.8, 3);
  const muzzle = lift(iso(4.9, 3), HEAD_HEIGHT);
  const bolt = lift(iso(6.5, 3), HEAD_HEIGHT);
  const boltStart = { x: muzzle[0] + 11 - bolt[0], y: muzzle[1] - 6.4 - bolt[1] };
  timeline.fromTo(q('.wedge'), { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0);
  timeline.fromTo(q('.lane'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.1);
  timeline.fromTo(q('.tag-unity'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 0.3);
  timeline.fromTo(q('.target'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.5);
  timeline.fromTo(q('.tag-max'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 0.6);
  timeline.fromTo(q('.arrow-unity'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.8);
  timeline.fromTo(q('.arrow-max'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.9);
  timeline.fromTo(q('.crate-hidden'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1);
  timeline.fromTo(q('.crate-edge'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, stagger: 0.15, ease: 'power1.inOut' }, 0.9);
  timeline.fromTo(q('.cell'), { opacity: 0, scale: 1.3, svgOrigin: `${cell[0]} ${cell[1]}` }, { opacity: 1, scale: 1, svgOrigin: `${cell[0]} ${cell[1]}`, duration: 0.5 }, 1.5);
  timeline.fromTo(q('.crate'), { y: -DROP_HEIGHT }, { y: 0, duration: 0.7, ease: 'bounce.out' }, 1.9);
  timeline.fromTo(q('.crate-face'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.15);
  timeline.fromTo(q('.tag-runner'), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }, 2.7);
  timeline.fromTo(q('.runner'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 2.7);
  timeline.fromTo(q('.runner'), { x: start.x, y: start.y }, { x: lane.x, y: lane.y, duration: 0.8, ease: 'none' }, 2.7);
  timeline.fromTo(q('.runner'), { x: lane.x, y: lane.y }, { x: side.x, y: side.y, duration: 0.45, immediateRender: false }, 3.5);
  timeline.fromTo(q('.hop'), { y: 0 }, { y: -20, duration: 0.22, yoyo: true, repeat: 1 }, 3.5);
  timeline.fromTo(q('.runner'), { x: side.x, y: side.y }, { x: 0, y: 0, duration: 0.9, ease: 'none', immediateRender: false }, 3.95);
  timeline.fromTo(q('.tag-shooter'), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }, 4.95);
  timeline.fromTo(q('.bolt'), { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, 5);
  timeline.fromTo(q('.bolt'), { x: boltStart.x, y: boltStart.y }, { x: 0, y: 0, duration: 0.5, ease: 'power2.in' }, 5);
  timeline.fromTo(q('.trail'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.in' }, 5);
  timeline.fromTo(q('.target-core'), { scale: 1, svgOrigin: `${goal[0]} ${goal[1]}` }, { scale: 1.9, svgOrigin: `${goal[0]} ${goal[1]}`, duration: 0.15 }, 5.5);
  timeline.fromTo(q('.target-core'), { scale: 1.9, svgOrigin: `${goal[0]} ${goal[1]}` }, { scale: 1, svgOrigin: `${goal[0]} ${goal[1]}`, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, 5.65);
  timeline.fromTo(q('.all'), { opacity: 1 }, { opacity: 0, duration: 0.4, ease: 'power1.in' }, 7.4);
  return timeline;
}

// The drawing: a 30 degree isometric lane of two sublanes (nine cells long, four wide) with a crate in the left
// sublane, a runner who has sidestepped into the right sublane, a bolt in flight and a diamond target at the far
// end. The only facts it states are the project's: Unity, assets made in 3ds Max, and runner and shooter builds.
// The crate is a stand-in for any asset, so it carries no claim about what the real assets look like.
export default function Abstract({ locale }: { locale: string }) {
  const laneNear = [iso(0, 0), iso(9, 0), iso(9, 2), iso(0, 2)];
  const laneFar = [iso(0, 2), iso(9, 2), iso(9, 4), iso(0, 4)];
  const cellBox = [iso(3.2, 0.2), iso(4.8, 0.2), iso(4.8, 1.8), iso(3.2, 1.8)];
  const a = iso(3.4, 0.4);
  const b = iso(4.6, 0.4);
  const c = iso(4.6, 1.6);
  const d = iso(3.4, 1.6);
  const aTop = lift(a, CRATE_HEIGHT);
  const bTop = lift(b, CRATE_HEIGHT);
  const cTop = lift(c, CRATE_HEIGHT);
  const dTop = lift(d, CRATE_HEIGHT);
  const feet = iso(4.4, 3);
  const body = (dx: number, dy: number): Point => shift(feet, dx, dy);
  const muzzle = lift(iso(4.9, 3), HEAD_HEIGHT);
  const bolt = lift(iso(6.5, 3), HEAD_HEIGHT);
  const tail = shift(bolt, -11, 6.4);
  const wedge = [shift(bolt, 20, -11.5), shift(bolt, -6.3, 15), shift(bolt, -16, -2.1)];
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <g className="all">
        <polygon className="wedge" points="470,0 640,0 640,90" fill={PRESS.red} />
        <g className="lane" strokeLinejoin="miter">
          <polygon points={pts(laneNear)} fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
          <polygon points={pts(laneFar)} fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
        </g>
        <g className="target">
          <polygon points={pts([iso(8.1, 2.6), iso(8.9, 2.6), iso(8.9, 3.4), iso(8.1, 3.4)])} fill="none" stroke={PRESS.red} strokeWidth="4" />
          <polygon className="target-core" points={pts([iso(8.35, 2.85), iso(8.65, 2.85), iso(8.65, 3.15), iso(8.35, 3.15)])} fill={PRESS.red} />
        </g>
        <polygon className="cell" points={pts(cellBox)} fill="none" stroke={PRESS.red} strokeWidth="3" />
        <g className="crate" strokeLinejoin="miter">
          <g className="crate-hidden" stroke={PRESS.ink} strokeWidth="1.5" strokeDasharray="5 4" fill="none">
            <path d={route([bTop, b])} />
            <path d={route([a, b, c])} />
          </g>
          <polygon className="crate-face" points={pts([aTop, bTop, cTop, dTop])} fill={PRESS.paper} />
          <polygon className="crate-face" points={pts([aTop, dTop, d, a])} fill={PRESS.red} />
          <polygon className="crate-face" points={pts([dTop, cTop, c, d])} fill={PRESS.deep} />
          <path className="crate-edge" d={route([aTop, bTop, cTop, dTop], true)} fill="none" stroke={PRESS.ink} strokeWidth="3" />
          <path className="crate-edge" d={route([aTop, a, d, c, cTop])} fill="none" stroke={PRESS.ink} strokeWidth="3" />
          <path className="crate-edge" d={route([dTop, d])} fill="none" stroke={PRESS.ink} strokeWidth="3" />
        </g>
        <g className="runner" strokeLinejoin="miter">
          <g className="hop">
            <polygon points={pts([body(-10, -30), body(0, -24), body(0, 6), body(-10, 0)])} fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" />
            <polygon points={pts([body(0, -24), body(10, -30), body(10, 0), body(0, 6)])} fill={PRESS.deep} stroke={PRESS.ink} strokeWidth="2" />
            <polygon points={pts([body(0, -36), body(10, -30), body(0, -24), body(-10, -30)])} fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="2" />
            <circle cx={body(0, -45)[0]} cy={body(0, -45)[1]} r="8" fill={PRESS.ink} />
          </g>
        </g>
        <path className="trail" d={route([muzzle, tail])} fill="none" stroke={PRESS.ink} strokeWidth="4" />
        <polygon className="bolt" points={pts(wedge)} fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" strokeLinejoin="miter" />
        <g className="tag-max">
          <rect x="24" y="36" width="170" height="40" fill={PRESS.ink} />
          <text className="poster-display" x="109" y="64" textAnchor="middle" fontSize="22" fill={PRESS.paper}>
            3DS MAX
          </text>
        </g>
        <g className="arrow-max">
          <path d="M200 56 L246 83" stroke={PRESS.red} strokeWidth="4" fill="none" />
          <polygon points="258,90 242.4,89 249.6,77" fill={PRESS.red} />
        </g>
        <g className="tag-unity">
          <rect x="24" y="300" width="150" height="40" fill={PRESS.red} />
          <text className="poster-display" x="99" y="328" textAnchor="middle" fontSize="22" fill={PRESS.paper}>
            UNITY
          </text>
        </g>
        <g className="arrow-unity">
          <path d="M110 296 L178.8 244.5" stroke={PRESS.ink} strokeWidth="4" fill="none" />
          <polygon points="190,236 183,250.1 174.6,238.9" fill={PRESS.ink} />
        </g>
        <g className="tag-runner">
          <rect x="370" y="224" width="150" height="40" fill={PRESS.ink} />
          <text className="poster-display" x="445" y="252" textAnchor="middle" fontSize="22" fill={PRESS.paper}>
            {pick(RUNNER_TEXT, locale)}
          </text>
        </g>
        <g className="tag-shooter">
          <rect x="370" y="274" width="170" height="40" fill={PRESS.red} />
          <text className="poster-display" x="455" y="302" textAnchor="middle" fontSize="22" fill={PRESS.paper}>
            {pick(SHOOTER_TEXT, locale)}
          </text>
        </g>
      </g>
    </AbstractStage>
  );
}
