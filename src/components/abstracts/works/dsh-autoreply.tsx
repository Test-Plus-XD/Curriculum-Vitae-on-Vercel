'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  "A friend's message goes to DeepSeek, the reply comes back as a draft in the message box and stops at a gate; by default, only the user pressing Enter can send it.",
  '朋友的訊息交給 DeepSeek，回覆以草稿放入訊息輸入框後停在閘口；預設情況下，只有用戶按下 Enter 才能發出。',
);
const CAPTION = bi(
  'By default the plugin stops at a draft: a person reads it, edits it and presses Enter.',
  '預設情況下，外掛只留下草稿：由用戶閱讀、修改，再按下 Enter。',
);

// One pass of the loop, about 8.6 seconds with the rest. The message arrives and runs along its line into the
// DeepSeek block, which pulses while it works; the draft line is then drawn down to the message box and a chip
// carries it in. The draft is typed in as bars, the red gate drops at the end of the box and a second chip is
// thrown against it and bounces back. Last, the Enter key and its line to the gate appear: the only way across
// is a person. Everything rests on the finished frame, which is held for a second before the loop restarts.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const pathIn = q('.path-in')[0] as SVGPathElement;
  const pathDraft = q('.path-draft')[0] as SVGPathElement;
  // The friend's message slides in and its text bars are laid down.
  timeline.from(q('.msg'), { x: -60, opacity: 0, duration: 0.6 }, 0);
  timeline.from(q('.msg-bar'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.35, stagger: 0.12 }, 0.5);
  // The message travels to the DeepSeek block.
  timeline.fromTo(pathIn, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'none' }, 0.9);
  timeline.from(q('.head-in'), { opacity: 0, duration: 0.15 }, 1.35);
  timeline.to(q('.packet-in'), { opacity: 1, duration: 0.05 }, 0.9);
  timeline.to(q('.packet-in'), { motionPath: { path: pathIn, align: pathIn, alignOrigin: [0.5, 0.5] }, duration: 0.65, ease: 'power1.inOut' }, 0.95);
  timeline.to(q('.packet-in'), { opacity: 0, duration: 0.1 }, 1.6);
  // DeepSeek lands, then pulses while it drafts.
  timeline.from(q('.brain'), { scale: 0.5, opacity: 0, svgOrigin: '320 85', duration: 0.5, ease: 'back.out(2)' }, 1.6);
  timeline.to(q('.brain'), { scale: 1.06, svgOrigin: '320 85', duration: 0.2, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 2.1);
  // The draft is drawn down to the message box and carried in.
  timeline.fromTo(pathDraft, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'none' }, 2.9);
  timeline.from(q('.head-draft'), { opacity: 0, duration: 0.15 }, 3.35);
  timeline.to(q('.packet-draft'), { opacity: 1, duration: 0.05 }, 2.9);
  timeline.to(q('.packet-draft'), { motionPath: { path: pathDraft, align: pathDraft, alignOrigin: [0.5, 0.5] }, duration: 0.55, ease: 'power1.inOut' }, 2.95);
  timeline.to(q('.packet-draft'), { opacity: 0, duration: 0.1 }, 3.5);
  // The draft appears in the box and the cursor blinks, waiting.
  timeline.from(q('.draft-bar'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4, stagger: 0.25 }, 3.5);
  timeline.fromTo(q('.caret'), { opacity: 0 }, { opacity: 1, duration: 0.2, repeat: 4, yoyo: true, ease: 'none' }, 4.2);
  // The gate drops, and a second chip is thrown at it and turned back.
  timeline.fromTo(q('.gate'), { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'bounce.out' }, 4.1);
  timeline.from(q('.stop-label'), { y: 14, opacity: 0, duration: 0.35 }, 4.4);
  timeline.to(q('.chip'), { opacity: 1, duration: 0.05 }, 4.7);
  timeline.to(q('.chip'), { x: 33, duration: 0.25, ease: 'power2.in' }, 4.75);
  timeline.to(q('.chip'), { x: 0, duration: 0.35, ease: 'back.out(3)' }, 5.0);
  timeline.to(q('.chip'), { opacity: 0, duration: 0.15 }, 5.3);
  // Only a person can open it: the Enter key arrives, reaches the gate with its line, and is pressed.
  timeline.from(q('.key'), { y: -24, opacity: 0, duration: 0.45 }, 5.3);
  timeline.fromTo(q('.link'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35, ease: 'none' }, 5.75);
  timeline.from(q('.head-link'), { opacity: 0, duration: 0.12 }, 6.05);
  timeline.to(q('.key-top'), { y: 6, duration: 0.12, repeat: 1, yoyo: true, ease: 'power1.inOut' }, 6.15);
  // Hold the finished frame for a second before the loop restarts.
  timeline.to({}, { duration: 1 }, '+=0');
  return timeline;
}

// The diagram, as its finished frame in a 640 by 360 box. A friend's message card (left) feeds a DeepSeek block,
// whose draft line runs to a message box; at the box's right-hand end stands a red gate, and above it the Enter
// key with a line down to the gate. The packets and the thrown chip are invisible here and only exist while the
// timeline runs. Only the facts in the case file are shown: the default delivery is a draft, and sending belongs
// to the user. No product marks and no persona text.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon points="0,0 120,0 0,26" fill={PRESS.red} />
      <polygon points="0,360 0,306 64,360" fill={PRESS.newsprint} />

      <g className="msg">
        <rect x="30" y="50" width="120" height="70" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="4" />
        <rect className="msg-bar" x="44" y="66" width="92" height="8" fill={PRESS.ink} />
        <rect className="msg-bar" x="44" y="83" width="72" height="8" fill={PRESS.ink} />
        <rect className="msg-bar" x="44" y="100" width="52" height="8" fill={PRESS.ink} />
      </g>
      <text x="30" y="148" className="poster-display" fontSize="16" fill={PRESS.ink}>
        {pick(bi("Friend's message", '朋友的訊息'), locale)}
      </text>

      <path className="path-in" d="M154 85 L244 85" fill="none" stroke={PRESS.ink} strokeWidth="6" />
      <polygon className="head-in" points="258,85 242,75 242,95" fill={PRESS.ink} />

      <g className="brain">
        <rect x="268" y="60" width="120" height="66" fill={PRESS.red} />
        <rect x="260" y="52" width="120" height="66" fill={PRESS.ink} />
        <text x="320" y="93" textAnchor="middle" className="poster-type" fontSize="22" fill={PRESS.paper}>
          DeepSeek
        </text>
      </g>

      <path className="path-draft" d="M352 132 L403.2 210.9" fill="none" stroke={PRESS.red} strokeWidth="6" />
      <polygon className="head-draft" points="413,226 410.7,206 395.6,215.8" fill={PRESS.red} />

      <text x="150" y="218" className="poster-display" fontSize="16" fill={PRESS.ink}>
        {pick(bi('Message box', '訊息輸入框'), locale)}
      </text>
      <rect x="150" y="228" width="350" height="64" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="4" />
      <rect className="draft-bar" x="170" y="243" width="240" height="8" fill={PRESS.ink} />
      <rect className="draft-bar" x="170" y="261" width="150" height="8" fill={PRESS.ink} />
      <rect className="caret" x="328" y="257" width="3" height="16" fill={PRESS.red} />

      <rect className="gate" x="514" y="200" width="20" height="120" fill={PRESS.red} />
      <text className="stop-label poster-display" x="500" y="338" textAnchor="end" fontSize="20" fill={PRESS.deep}>
        {pick(bi('Stops here', '到此為止'), locale)}
      </text>

      <g className="key">
        <text x="530" y="36" textAnchor="middle" className="poster-display" fontSize="16" fill={PRESS.ink}>
          {pick(bi('You decide', '由你決定'), locale)}
        </text>
        <rect x="470" y="58" width="120" height="60" fill={PRESS.ink} />
        <g className="key-top">
          <rect x="470" y="52" width="120" height="60" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="4" />
          <text x="530" y="92" textAnchor="middle" className="poster-type" fontSize="24" fill={PRESS.ink}>
            Enter
          </text>
        </g>
      </g>
      <path className="link" d="M524 120 L524 182" fill="none" stroke={PRESS.ink} strokeWidth="4" />
      <polygon className="head-link" points="524,198 516,182 532,182" fill={PRESS.ink} />

      <rect className="packet-in" x="-8" y="-6" width="16" height="12" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" opacity="0" />
      <rect className="packet-draft" x="-9" y="-6" width="18" height="12" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" opacity="0" />
      <rect className="chip" x="463" y="254" width="14" height="12" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" opacity="0" />
    </AbstractStage>
  );
}
