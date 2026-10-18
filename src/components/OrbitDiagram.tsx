'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

interface Body {
  label: string;
  sub?: string;
  primary?: boolean;
}

const CX = 300;
const CY = 210;
const OUTER = { rx: 250, ry: 118 };
const INNER = { rx: 118, ry: 54 };

/**
 * Pour Rice's architecture as an orbital system: Firebase at the core, the Vercel API and Railway Socket.IO
 * server on the inner orbit, and the three client apps on the outer orbit. Bodies on the far side of an
 * orbit dim and shrink for depth, and data packets travel along the links. Decorative — the same
 * information is listed in text beside it. Pauses when off screen.
 */
export default function OrbitDiagram({ clients, services, core }: { clients: Body[]; services: Body[]; core: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const q = gsap.utils.selector(svg);
      const outer = Array.from(svg.querySelectorAll<SVGGElement>('[data-outer]'));
      const inner = Array.from(svg.querySelectorAll<SVGGElement>('[data-inner]'));
      const links = Array.from(svg.querySelectorAll<SVGLineElement>('[data-link]'));
      const packets = Array.from(svg.querySelectorAll<SVGCircleElement>('[data-packet]'));
      const state = { a: 0, p: 0 };

      const place = () => {
        const positions: { x: number; y: number }[] = [];
        const put = (els: SVGGElement[], orbit: { rx: number; ry: number }, base: number, dir: number) => {
          els.forEach((el, i) => {
            const angle = base * dir + (i / els.length) * Math.PI * 2;
            const x = CX + Math.cos(angle) * orbit.rx;
            const y = CY + Math.sin(angle) * orbit.ry;
            const depth = (Math.sin(angle) + 1) / 2; // 0 = far side, 1 = near side
            el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.78 + depth * 0.32).toFixed(3)})`);
            el.style.opacity = String(0.5 + depth * 0.5);
            positions.push({ x, y });
          });
        };
        put(outer, OUTER, state.a, 1);
        put(inner, INNER, state.a * 1.7, -1);
        // Links: each client to its nearest service, each service to the core.
        const clientPos = positions.slice(0, outer.length);
        const servicePos = positions.slice(outer.length);
        const ends: { x1: number; y1: number; x2: number; y2: number }[] = [];
        clientPos.forEach((c) => {
          const s = servicePos.reduce((best, cur) => (Math.hypot(cur.x - c.x, cur.y - c.y) < Math.hypot(best.x - c.x, best.y - c.y) ? cur : best));
          ends.push({ x1: c.x, y1: c.y, x2: s.x, y2: s.y });
        });
        servicePos.forEach((s) => ends.push({ x1: s.x, y1: s.y, x2: CX, y2: CY }));
        ends.forEach((e, i) => {
          const line = links[i];
          if (!line) return;
          line.setAttribute('x1', e.x1.toFixed(1));
          line.setAttribute('y1', e.y1.toFixed(1));
          line.setAttribute('x2', e.x2.toFixed(1));
          line.setAttribute('y2', e.y2.toFixed(1));
          const packet = packets[i];
          if (packet) {
            const k = (state.p + i * 0.37) % 1;
            const toward = i % 2 === 0 ? k : 1 - k;
            packet.setAttribute('cx', (e.x1 + (e.x2 - e.x1) * toward).toFixed(1));
            packet.setAttribute('cy', (e.y1 + (e.y2 - e.y1) * toward).toFixed(1));
          }
        });
      };

      state.a = -0.6;
      place();
      if (prefersReducedMotion()) return;

      const spin = gsap.to(state, { a: '+=' + Math.PI * 2, duration: 60, repeat: -1, ease: 'none', onUpdate: place, paused: true });
      const flow = gsap.to(state, { p: 1, duration: 2.4, repeat: -1, ease: 'none', paused: true });
      gsap.from(q('[data-ring]'), { drawSVG: '0%', duration: 1.8, ease: 'expo.inOut', stagger: 0.2, scrollTrigger: { trigger: svg, start: 'top 85%', once: true } });
      gsap.from(q('[data-core]'), { scale: 0, transformOrigin: '50% 50%', duration: 1.2, ease: 'back.out(1.8)', scrollTrigger: { trigger: svg, start: 'top 85%', once: true } });
      ScrollTrigger.create({
        trigger: svg,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          spin.paused(!self.isActive);
          flow.paused(!self.isActive);
        },
      });
    },
    { scope: ref },
  );

  const linkCount = clients.length + services.length;

  return (
    <svg ref={ref} className="orbit-diagram" viewBox="0 0 600 420" aria-hidden="true">
      <ellipse cx={CX} cy={CY} rx={OUTER.rx} ry={OUTER.ry} className="orbit-ring" data-ring="" />
      <ellipse cx={CX} cy={CY} rx={INNER.rx} ry={INNER.ry} className="orbit-ring orbit-ring-inner" />
      {Array.from({ length: linkCount }, (_, i) => (
        <line key={i} data-link="" className="orbit-link" />
      ))}
      {Array.from({ length: linkCount }, (_, i) => (
        <circle key={i} data-packet="" r="3" className="orbit-packet" />
      ))}
      <g data-core="" transform={`translate(${CX} ${CY})`}>
        <circle r="40" className="orbit-core" />
        <circle r="48" className="orbit-core-ring" />
        <text y="5" textAnchor="middle" className="orbit-core-label">
          {core}
        </text>
      </g>
      {services.map((s) => (
        <g key={s.label} data-inner="">
          <rect x="-11" y="-11" width="22" height="22" transform="rotate(45)" className="orbit-service" />
          <text y="32" textAnchor="middle" className="orbit-label">
            {s.label}
          </text>
        </g>
      ))}
      {clients.map((c) => (
        <g key={c.label} data-outer="">
          <circle r={c.primary ? 17 : 13} className={c.primary ? 'orbit-client orbit-client-primary' : 'orbit-client'} />
          <text y={c.primary ? 38 : 34} textAnchor="middle" className="orbit-label">
            {c.label}
          </text>
          {c.sub && (
            <text y={c.primary ? 52 : 48} textAnchor="middle" className="orbit-sub">
              {c.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
