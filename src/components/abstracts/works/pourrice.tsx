'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'Three apps, web, Android and iOS, share one back end. One diner searches, books a table, then sends a chat message that reaches the owner live through the socket server while the API also saves it.',
  '網頁、Android 及 iOS 三個應用程式共用同一後端。食客搜尋、預約座位，再發送聊天訊息；訊息經 Socket 伺服器即時送到東主，同時由 API 儲存。',
);
const CAPTION = bi(
  'Follow one diner’s packets from the apps to the API and the real-time server.',
  '跟隨一位食客的封包，由應用程式經 API 到即時伺服器。',
);
const SEARCH = bi('SEARCH', '搜尋');
const BOOK = bi('BOOK', '預約');
const CHAT = bi('CHAT', '聊天');
const LIVE = bi('LIVE', '即時');
const SAVED = bi('SAVED', '已儲存');
const OWNER = bi('OWNER', '東主');
const WEB = bi('WEB', '網頁');

// Sends one packet along a wire: it appears at the start, rides the path with a linear ease, then vanishes.
// `backwards` runs the same wire from its far end to its near end, which is how a reply comes home.
function fly(timeline: gsap.core.Timeline, q: AbstractSelector, packet: string, wire: string, at: number, duration: number, backwards = false) {
  const path = q(wire)[0] as SVGPathElement;
  timeline.set(q(packet), { opacity: 1, immediateRender: false }, at);
  timeline.to(
    q(packet),
    { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: backwards ? 1 : 0, end: backwards ? 0 : 1 }, duration, ease: 'none' },
    at,
  );
  timeline.set(q(packet), { opacity: 0, immediateRender: false }, at + duration);
}

// A short squeeze that shows a node receiving a packet, about a fixed point of the node.
function pulse(timeline: gsap.core.Timeline, q: AbstractSelector, target: string, origin: string, at: number) {
  timeline.to(q(target), { scale: 1.07, svgOrigin: origin, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at);
}

// The loop, about seven seconds plus a short pause. The nodes and wires assemble (0 to 1.5 s). Two other clients ping the
// API, then one diner searches (2.2 s) and books (3.5 s) with a request and a reply each. At 4.8 s a chat message rides the
// long red wire to the socket server, which sends it straight on to the owner and then hands a copy to the API, which
// writes it to the store (finished by 7.0 s). The finished frame then holds for the rest of the cycle.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  timeline.fromTo(q('.client'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, 0);
  timeline.fromTo(q('.node-api'), { scale: 0.6, opacity: 0, svgOrigin: '310 170' }, { scale: 1, opacity: 1, svgOrigin: '310 170', duration: 0.5 }, 0.3);
  timeline.fromTo(q('.node-socket'), { scale: 0.6, opacity: 0, svgOrigin: '512 90' }, { scale: 1, opacity: 1, svgOrigin: '512 90', duration: 0.5 }, 0.4);
  timeline.fromTo(q('.node-owner'), { scale: 0.6, opacity: 0, svgOrigin: '528 223' }, { scale: 1, opacity: 1, svgOrigin: '528 223', duration: 0.5 }, 0.5);
  timeline.fromTo(q('.node-store'), { scale: 0.6, opacity: 0, svgOrigin: '310 290' }, { scale: 1, opacity: 1, svgOrigin: '310 290', duration: 0.5 }, 0.6);
  timeline.fromTo(q('.wire'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.06 }, 0.5);
  timeline.fromTo(q('.tick'), { drawSVG: '0%' }, { drawSVG: '0%', duration: 0.01 }, 0);
  timeline.fromTo(q('.step-one'), { opacity: 0.25 }, { opacity: 0.25, duration: 0.01 }, 0);
  timeline.fromTo(q('.step-two'), { opacity: 0.25 }, { opacity: 0.25, duration: 0.01 }, 0);
  timeline.fromTo(q('.step-three'), { opacity: 0.25 }, { opacity: 0.25, duration: 0.01 }, 0);
  timeline.fromTo(q('.bubble-diner'), { scale: 0, svgOrigin: '56 65' }, { scale: 0, svgOrigin: '56 65', duration: 0.01 }, 0);
  timeline.fromTo(q('.bubble-owner'), { scale: 0, svgOrigin: '528 222' }, { scale: 0, svgOrigin: '528 222', duration: 0.01 }, 0);

  // The other two apps reach the same API.
  fly(timeline, q, '.pk-web', '.wire-web', 1.6, 0.6);
  fly(timeline, q, '.pk-droid', '.wire-droid', 1.6, 0.6);
  pulse(timeline, q, '.node-api', '310 170', 2.2);

  // Step one: the diner searches.
  timeline.fromTo(q('.step-one'), { opacity: 0.25, scale: 1.2, svgOrigin: '150 340' }, { opacity: 1, scale: 1, svgOrigin: '150 340', duration: 0.3, immediateRender: false }, 2.2);
  fly(timeline, q, '.pk-search', '.wire-ios', 2.2, 0.6);
  pulse(timeline, q, '.node-api', '310 170', 2.8);
  fly(timeline, q, '.pk-found', '.wire-ios', 2.8, 0.6, true);
  pulse(timeline, q, '.client-ios', '60 59', 3.4);

  // Step two: the diner books a table.
  timeline.fromTo(q('.step-two'), { opacity: 0.25, scale: 1.2, svgOrigin: '280 340' }, { opacity: 1, scale: 1, svgOrigin: '280 340', duration: 0.3, immediateRender: false }, 3.5);
  fly(timeline, q, '.pk-book', '.wire-ios', 3.5, 0.6);
  pulse(timeline, q, '.node-api', '310 170', 4.1);
  fly(timeline, q, '.pk-booked', '.wire-ios', 4.1, 0.6, true);
  pulse(timeline, q, '.client-ios', '60 59', 4.7);

  // Step three: the chat message goes live and is saved.
  timeline.fromTo(q('.step-three'), { opacity: 0.25, scale: 1.2, svgOrigin: '400 340' }, { opacity: 1, scale: 1, svgOrigin: '400 340', duration: 0.3, immediateRender: false }, 4.8);
  timeline.fromTo(q('.bubble-diner'), { scale: 0, svgOrigin: '56 65' }, { scale: 1, svgOrigin: '56 65', duration: 0.3, ease: 'back.out(2)', immediateRender: false }, 4.8);
  fly(timeline, q, '.pk-chat', '.wire-chat', 4.8, 0.9);
  pulse(timeline, q, '.node-socket', '512 90', 5.7);
  fly(timeline, q, '.pk-live', '.wire-owner', 5.7, 0.5);
  timeline.fromTo(q('.bubble-owner'), { scale: 0, svgOrigin: '528 222' }, { scale: 1, svgOrigin: '528 222', duration: 0.3, ease: 'back.out(2)', immediateRender: false }, 6.2);
  fly(timeline, q, '.pk-save', '.wire-save', 5.85, 0.6);
  pulse(timeline, q, '.node-api', '310 170', 6.45);
  fly(timeline, q, '.pk-store', '.wire-store', 6.45, 0.3);
  timeline.fromTo(q('.tick'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.25, immediateRender: false }, 6.75);
  timeline.to({}, { duration: 0.3 }, 7.0);
  return timeline;
}

// Three apps on the left (iOS in red, the diner's own), the API in ink at the centre, the Socket.IO server in red above
// the owner's phone on the right, and a store of three slabs below the API. Ink wires carry REST calls between the apps and
// the API; red wires carry the live chat. The facts: three clients, a REST API on Vercel, a Socket.IO server on Railway that
// broadcasts a chat message at once and saves it through the API, and a booking and search that go through the API.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon points="0,330 0,290 640,150 640,190" fill={PRESS.newsprint} />

      <path className="wire wire-ios" d="M90 59 L250 135" fill="none" stroke={PRESS.ink} strokeWidth="3" />
      <path className="wire wire-droid" d="M90 169 L250 170" fill="none" stroke={PRESS.ink} strokeWidth="3" />
      <path className="wire wire-web" d="M90 279 L250 205" fill="none" stroke={PRESS.ink} strokeWidth="3" />
      <path className="wire wire-chat" d="M90 44 L180 18 L420 18 L452 66" fill="none" stroke={PRESS.red} strokeWidth="4" />
      <path className="wire wire-save" d="M452 110 L370 160" fill="none" stroke={PRESS.ink} strokeWidth="3" />
      <path className="wire wire-owner" d="M512 130 L528 188" fill="none" stroke={PRESS.red} strokeWidth="4" />
      <path className="wire wire-store" d="M310 230 L310 268" fill="none" stroke={PRESS.ink} strokeWidth="3" />

      <g className="client client-ios">
        <rect x="30" y="30" width="60" height="58" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="50" y="36" width="20" height="5" fill={PRESS.ink} />
        <rect className="bubble-diner" x="38" y="58" width="36" height="14" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="2" />
        <text x="60" y="112" textAnchor="middle" fontSize="16" className="poster-display" fill={PRESS.ink}>iOS</text>
      </g>
      <g className="client">
        <rect x="30" y="140" width="60" height="58" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="40" y="152" width="40" height="5" fill={PRESS.ink} />
        <rect x="40" y="164" width="28" height="5" fill={PRESS.ink} />
        <rect x="45" y="186" width="30" height="5" fill={PRESS.ink} />
        <text x="60" y="222" textAnchor="middle" fontSize="16" className="poster-display" fill={PRESS.ink}>ANDROID</text>
      </g>
      <g className="client">
        <rect x="30" y="250" width="60" height="58" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="30" y="250" width="60" height="12" fill={PRESS.ink} />
        <circle cx="38" cy="256" r="2.5" fill={PRESS.paper} />
        <circle cx="46" cy="256" r="2.5" fill={PRESS.paper} />
        <circle cx="54" cy="256" r="2.5" fill={PRESS.paper} />
        <rect x="40" y="274" width="40" height="5" fill={PRESS.ink} />
        <rect x="40" y="286" width="26" height="5" fill={PRESS.ink} />
        <text x="60" y="332" textAnchor="middle" fontSize="16" className="poster-display" fill={PRESS.ink}>{pick(WEB, locale)}</text>
      </g>

      <g className="node-api">
        <rect x="250" y="110" width="120" height="120" fill={PRESS.ink} />
        <polygon points="370,110 336,110 370,144" fill={PRESS.red} />
        <text x="305" y="182" textAnchor="middle" fontSize="36" className="poster-display" fill={PRESS.paper}>API</text>
      </g>

      <g className="node-socket">
        <rect x="452" y="50" width="120" height="80" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="3" />
        <polygon points="572,50 542,50 572,80" fill={PRESS.ink} />
        <text x="512" y="98" textAnchor="middle" fontSize="18" className="poster-display" fill={PRESS.paper}>SOCKET</text>
      </g>

      <g className="node-owner">
        <rect x="500" y="188" width="56" height="70" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="518" y="194" width="20" height="5" fill={PRESS.ink} />
        <rect className="bubble-owner" x="508" y="214" width="40" height="16" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" />
        <text x="528" y="282" textAnchor="middle" fontSize="16" className="poster-display" fill={PRESS.ink}>{pick(OWNER, locale)}</text>
      </g>
      <text x="506" y="176" textAnchor="end" fontSize="16" className="poster-display" fill={PRESS.red}>{pick(LIVE, locale)}</text>

      <g className="node-store">
        <rect x="270" y="268" width="80" height="12" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="2.5" />
        <rect x="270" y="284" width="80" height="12" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="2.5" />
        <rect x="270" y="300" width="80" height="12" fill={PRESS.kraft} stroke={PRESS.ink} strokeWidth="2.5" />
        <text x="398" y="300" fontSize="16" className="poster-display" fill={PRESS.ink}>{pick(SAVED, locale)}</text>
      </g>
      <path className="tick" d="M362 288 L370 297 L386 276" fill="none" stroke={PRESS.red} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      <g className="step-one">
        <circle cx="150" cy="340" r="11" fill={PRESS.ink} />
        <text x="150" y="345" textAnchor="middle" fontSize="15" className="poster-display" fill={PRESS.paper}>1</text>
        <text x="168" y="346" fontSize="17" className="poster-display" fill={PRESS.ink}>{pick(SEARCH, locale)}</text>
      </g>
      <g className="step-two">
        <circle cx="280" cy="340" r="11" fill={PRESS.ink} />
        <text x="280" y="345" textAnchor="middle" fontSize="15" className="poster-display" fill={PRESS.paper}>2</text>
        <text x="298" y="346" fontSize="17" className="poster-display" fill={PRESS.ink}>{pick(BOOK, locale)}</text>
      </g>
      <g className="step-three">
        <circle cx="400" cy="340" r="11" fill={PRESS.red} />
        <text x="400" y="345" textAnchor="middle" fontSize="15" className="poster-display" fill={PRESS.paper}>3</text>
        <text x="418" y="346" fontSize="17" className="poster-display" fill={PRESS.red}>{pick(CHAT, locale)}</text>
      </g>

      <rect className="pk-web" x="-6" y="-6" width="12" height="12" fill={PRESS.ink} opacity="0" />
      <rect className="pk-droid" x="-6" y="-6" width="12" height="12" fill={PRESS.ink} opacity="0" />
      <rect className="pk-search" x="-6" y="-6" width="12" height="12" fill={PRESS.ink} stroke={PRESS.paper} strokeWidth="2" opacity="0" />
      <circle className="pk-found" r="7" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" opacity="0" />
      <rect className="pk-book" x="-6" y="-6" width="12" height="12" fill={PRESS.ink} stroke={PRESS.paper} strokeWidth="2" opacity="0" />
      <circle className="pk-booked" r="7" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="2" opacity="0" />
      <circle className="pk-chat" r="8" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="3" opacity="0" />
      <circle className="pk-live" r="8" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="3" opacity="0" />
      <circle className="pk-save" r="8" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="3" opacity="0" />
      <circle className="pk-store" r="8" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="3" opacity="0" />
    </AbstractStage>
  );
}
