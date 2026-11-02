'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'A packet is sealed by WireGuard, travels a multi-tier VPN chain of Ubuntu machines that forward IPv4 traffic, then reaches NGINX in a container built from a Dockerfile.',
  '封包經 WireGuard 加密，穿過由 Ubuntu 機器組成、轉發 IPv4 流量的多層 VPN 串接，最後抵達以 Dockerfile 建構的容器內的 NGINX。',
);
const CAPTION = bi(
  'A packet is sealed, hops along the VPN chain, then arrives at NGINX inside a container.',
  '封包先被加密，沿 VPN 串接逐層轉發，最後進入容器內的 NGINX。',
);
const SEAL = bi('sealed', '加密');
const FORWARD = bi('forward', '轉發');

// The loop in four acts. First the frame assembles (machines, tunnel pipes), then the Dockerfile is built into an image
// and a container. Then the packet arrives, a sealed copy runs the tunnels and pulses the middle machine (forwarding),
// and finally the delivered packet drops into the container beside NGINX. Every tween runs from a hidden or displaced
// state to the finished frame, so the last second of the timeline is the readable poster.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  timeline
    .fromTo(q('.wedge'), { scale: 0 }, { scale: 1, svgOrigin: '640 0', duration: 0.6 }, 0)
    .fromTo(q('.slash'), { scale: 0 }, { scale: 1, svgOrigin: '0 360', duration: 0.6 }, 0.1)
    .fromTo(q('.vm'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.25 }, 0.3)
    .fromTo(q('.lab-ubuntu'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.7)
    .fromTo(q('.pipe'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, stagger: 0.1, ease: 'power1.inOut' }, 1.0)
    .fromTo(q('.lab-wg'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5)
    // Act two: Dockerfile to image to container.
    .fromTo(q('.sheet'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 1.2)
    .fromTo(q('.lab-dock'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5)
    .fromTo(q('.arrow1'), { scaleX: 0 }, { scaleX: 1, svgOrigin: '146 265', duration: 0.4 }, 1.8)
    .fromTo(q('.layer'), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.2, ease: 'bounce.out' }, 2.1)
    .fromTo(q('.arrow2'), { scaleX: 0 }, { scaleX: 1, svgOrigin: '312 265', duration: 0.4 }, 2.8)
    .fromTo(q('.box'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, svgOrigin: '491 265', duration: 0.5 }, 3.1)
    .fromTo(q('.lab-nginx'), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.4 }, 3.4)
    // Act three: the packet arrives, is sealed and runs the chain.
    .fromTo(q('.p-in'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 3.9)
    .fromTo(q('.lab-seal'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, svgOrigin: '215 106', duration: 0.4, ease: 'back.out(2)' }, 4.3)
    .fromTo(q('.p-sealed'), { x: -252 }, { x: 0, duration: 1.6, ease: 'none' }, 4.5)
    .fromTo(q('.p-sealed'), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, 4.5)
    .fromTo(q('.chev'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, stagger: 0.12 }, 5.1)
    .from(q('.vm2'), { scale: 1.12, svgOrigin: '320 135', duration: 0.5, immediateRender: false }, 5.1)
    .fromTo(q('.lab-fwd'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 5.2)
    // Act four: out of the chain and into the container.
    .from(q('.vm3'), { scale: 1.12, svgOrigin: '530 135', duration: 0.5, immediateRender: false }, 6.1)
    .fromTo(q('.drop'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, 6.1)
    .fromTo(q('.p-out'), { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.in' }, 6.5)
    // Hold the finished frame before the loop restarts.
    .to({}, { duration: 0.1 }, 8.3);
  return timeline;
}

// The drawing is a 640 by 360 poster. A chain of three Ubuntu machines (illustrative; the project states only a
// multi-tier chain) is joined by red pipe rails for the WireGuard tunnels, with a plain packet entering at the left,
// a red sealed packet in the tunnel and a plain packet delivered into the container. The lower row is the Docker
// build: a Dockerfile sheet, an image of stacked layers and the container running NGINX. No numbers are shown.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon className="wedge" points="640,0 640,70 520,0" fill={PRESS.red} />
      <polygon className="slash" points="0,360 0,335 25,360" fill={PRESS.ink} />
      <text className="lab-ubuntu poster-display" x="60" y="86" fontSize="18" fill={PRESS.ink}>
        Ubuntu
      </text>

      <g className="vm vm1">
        <rect x="60" y="100" width="100" height="70" fill={PRESS.ink} />
        <rect x="74" y="114" width="72" height="30" fill={PRESS.newsprint} />
        <rect x="82" y="122" width="40" height="4" fill={PRESS.ink} />
        <rect x="82" y="131" width="24" height="4" fill={PRESS.ink} />
        <rect x="74" y="152" width="40" height="8" fill={PRESS.red} />
      </g>
      <g className="vm vm2">
        <rect x="270" y="100" width="100" height="70" fill={PRESS.ink} />
        <rect x="284" y="114" width="72" height="30" fill={PRESS.newsprint} />
        <polyline className="chev" points="306,122 318,129 306,136" fill="none" stroke={PRESS.red} strokeWidth="4" />
        <polyline className="chev" points="326,122 338,129 326,136" fill="none" stroke={PRESS.red} strokeWidth="4" />
        <rect x="284" y="152" width="40" height="8" fill={PRESS.red} />
      </g>
      <g className="vm vm3">
        <rect x="480" y="100" width="100" height="70" fill={PRESS.ink} />
        <rect x="494" y="114" width="72" height="30" fill={PRESS.newsprint} />
        <rect x="502" y="122" width="40" height="4" fill={PRESS.ink} />
        <rect x="502" y="131" width="24" height="4" fill={PRESS.ink} />
        <rect x="494" y="152" width="40" height="8" fill={PRESS.red} />
      </g>

      <line className="pipe" x1="160" y1="116" x2="270" y2="116" stroke={PRESS.red} strokeWidth="4" />
      <line className="pipe" x1="160" y1="154" x2="270" y2="154" stroke={PRESS.red} strokeWidth="4" />
      <line className="pipe" x1="370" y1="116" x2="480" y2="116" stroke={PRESS.red} strokeWidth="4" />
      <line className="pipe" x1="370" y1="154" x2="480" y2="154" stroke={PRESS.red} strokeWidth="4" />
      <text className="lab-seal poster-display" x="215" y="106" fontSize="16" textAnchor="middle" fill={PRESS.deep}>
        {pick(SEAL, locale)}
      </text>
      <text className="lab-fwd poster-display" x="320" y="198" fontSize="16" textAnchor="middle" fill={PRESS.deep}>
        {pick(FORWARD, locale)}
      </text>
      <text className="lab-wg poster-type" x="425" y="184" fontSize="16" textAnchor="middle" fill={PRESS.ink}>
        WireGuard
      </text>

      <g className="p-in">
        <rect x="22" y="123" width="26" height="26" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="28" y="134" width="14" height="4" fill={PRESS.ink} />
      </g>
      <g className="p-sealed">
        <rect x="414" y="124" width="22" height="22" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="420" y="133" width="10" height="4" fill={PRESS.paper} />
      </g>

      <g className="sheet">
        <rect x="40" y="225" width="96" height="80" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="4" />
        <rect x="52" y="240" width="60" height="6" fill={PRESS.ink} />
        <rect x="52" y="254" width="44" height="6" fill={PRESS.ink} />
        <rect x="52" y="268" width="64" height="6" fill={PRESS.ink} />
        <rect x="52" y="282" width="34" height="8" fill={PRESS.red} />
      </g>
      <text className="lab-dock poster-type" x="88" y="334" fontSize="16" textAnchor="middle" fill={PRESS.ink}>
        Dockerfile
      </text>
      <g className="arrow1">
        <line x1="146" y1="265" x2="186" y2="265" stroke={PRESS.ink} strokeWidth="5" />
        <polygon points="186,255 202,265 186,275" fill={PRESS.ink} />
      </g>
      <rect className="layer" x="206" y="232" width="96" height="20" fill={PRESS.ink} />
      <rect className="layer" x="206" y="256" width="96" height="20" fill={PRESS.red} />
      <rect className="layer" x="206" y="280" width="96" height="20" fill={PRESS.kraft} />
      <g className="arrow2">
        <line x1="312" y1="265" x2="376" y2="265" stroke={PRESS.ink} strokeWidth="5" />
        <polygon points="376,255 392,265 376,275" fill={PRESS.ink} />
      </g>
      <rect className="box" x="402" y="225" width="178" height="80" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="5" />
      <text className="lab-nginx poster-display" x="416" y="274" fontSize="24" fill={PRESS.ink}>
        NGINX
      </text>

      <line className="drop" x1="530" y1="172" x2="530" y2="222" stroke={PRESS.red} strokeWidth="5" />
      <g className="p-out">
        <rect x="517" y="252" width="26" height="26" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="523" y="263" width="14" height="4" fill={PRESS.ink} />
      </g>
    </AbstractStage>
  );
}
