'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, FULL_MOTION, FINE_POINTER } from '@/lib/gsap';

export type FieldVariant = 'cv' | 'education' | 'projects' | 'detail';

interface Pose {
  disc: { x: number; y: number; scale: number };
  orbits: { x: number; y: number; rotation: number; scale: number };
  band: { x: number; y: number; rotation: number };
  rays: { x: number; y: number; rotation: number };
  star: { x: number; y: number; scale: number };
  word: { x: number; y: number };
}

// The composition rearranges itself between pages, so every navigation feels like the same poster being
// re-set by hand. Coordinates are in the 1600 × 1000 viewBox.
const POSES: Record<FieldVariant, Pose> = {
  cv: {
    disc: { x: 1290, y: 170, scale: 1 },
    orbits: { x: 1290, y: 170, rotation: -18, scale: 1 },
    band: { x: 0, y: 0, rotation: 0 },
    rays: { x: 0, y: 1000, rotation: 0 },
    star: { x: 190, y: 800, scale: 1 },
    word: { x: 1500, y: 980 },
  },
  education: {
    disc: { x: 70, y: 860, scale: 0.95 },
    orbits: { x: 70, y: 860, rotation: 14, scale: 1 },
    band: { x: 0, y: 260, rotation: 14 },
    rays: { x: 1600, y: 1000, rotation: -90 },
    star: { x: 1380, y: 240, scale: 0.8 },
    word: { x: 1540, y: 900 },
  },
  projects: {
    disc: { x: 1180, y: 820, scale: 1.25 },
    orbits: { x: 1180, y: 820, rotation: -34, scale: 1.15 },
    band: { x: 0, y: -180, rotation: -10 },
    rays: { x: 0, y: 0, rotation: 90 },
    star: { x: 260, y: 300, scale: 1.2 },
    word: { x: 1520, y: 760 },
  },
  detail: {
    disc: { x: 1420, y: 520, scale: 0.6 },
    orbits: { x: 1420, y: 520, rotation: 28, scale: 0.75 },
    band: { x: 0, y: 120, rotation: -22 },
    rays: { x: 1600, y: 0, rotation: 180 },
    star: { x: 120, y: 520, scale: 0.7 },
    word: { x: 1560, y: 1000 },
  },
};

const ORBITS = [
  { rx: 330, ry: 120 },
  { rx: 470, ry: 172 },
  { rx: 620, ry: 228 },
];

const ellipsePath = (rx: number, ry: number) => `M ${-rx},0 a ${rx},${ry} 0 1,0 ${rx * 2},0 a ${rx},${ry} 0 1,0 ${-rx * 2},0`;

const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? 90 : 36;
  const a = (Math.PI / 5) * i - Math.PI / 2;
  return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
}).join(' ');

/**
 * Constructivist poster geometry behind every page: a red sun, orbit rings with a travelling satellite,
 * a diagonal band, radiating rays, a rotating star and an outlined Cyrillic word. Strokes draw in on load,
 * layers parallax with scroll and pointer, and the whole composition re-poses itself on navigation.
 */
export default function ConstructivistField({ variant }: { variant: FieldVariant }) {
  const ref = useRef<SVGSVGElement>(null);
  const firstRef = useRef(true);

  // One-off setup: draw-in, perpetual motion, scroll + pointer parallax.
  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const pose = POSES[variant];
      applyPose(svg, pose, 0);

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const q = gsap.utils.selector(svg);
        gsap
          .timeline({ delay: 0.15 })
          .from(q('[data-draw]'), { drawSVG: '0%', duration: 2.2, ease: 'expo.inOut', stagger: 0.04 })
          .from(q('[data-layer="disc"] [data-spin]'), { scale: 0, transformOrigin: '50% 50%', duration: 1.6, ease: 'expo.out' }, 0)
          .from(q('[data-layer="band"] [data-band]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.6, ease: 'expo.inOut' }, 0.2)
          .from(q('[data-word]'), { opacity: 0, y: 60, duration: 1.4, ease: 'expo.out' }, 0.6);

        gsap.to(q('[data-layer="star"] [data-spin]'), { rotation: 360, svgOrigin: '0 0', duration: 80, repeat: -1, ease: 'none' });
        gsap.to(q('[data-layer="disc"] [data-ring-dash]'), { rotation: -360, svgOrigin: '0 0', duration: 140, repeat: -1, ease: 'none' });
        const orbitPath = svg.querySelector<SVGPathElement>('[data-orbit-path]')!;
        const orbitPath2 = svg.querySelector<SVGPathElement>('[data-orbit-path-2]')!;
        gsap.to(q('[data-satellite]'), {
          motionPath: { path: orbitPath, align: orbitPath, alignOrigin: [0.5, 0.5] },
          duration: 36,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(q('[data-satellite-2]'), {
          motionPath: { path: orbitPath2, align: orbitPath2, alignOrigin: [0.5, 0.5], start: 0.5, end: 1.5 },
          duration: 58,
          repeat: -1,
          ease: 'none',
        });

        // Scroll parallax: each depth moves at its own rate across the whole document.
        const depths: [string, number][] = [
          ['disc', -120],
          ['orbits', -200],
          ['band', -320],
          ['rays', -80],
          ['star', -260],
          ['word', -420],
        ];
        depths.forEach(([layer, distance]) => {
          gsap.to(q(`[data-layer="${layer}"] > [data-parallax]`), {
            y: distance,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.8, invalidateOnRefresh: true },
          });
        });
      });

      mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, () => {
        const px = gsap.quickTo(svg, 'x', { duration: 1.2, ease: 'power3.out' });
        const py = gsap.quickTo(svg, 'y', { duration: 1.2, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          px((e.clientX / window.innerWidth - 0.5) * -18);
          py((e.clientY / window.innerHeight - 0.5) * -12);
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
      });
    },
    { scope: ref },
  );

  // Re-pose on navigation.
  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      if (firstRef.current) {
        firstRef.current = false;
        return;
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      applyPose(svg, POSES[variant], reduced ? 0 : 1.6);
      // The new page changes the document height. Refresh from a fresh frame, outside this context, so
      // other components' ScrollTrigger callbacks never run inside it.
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(raf);
    },
    { dependencies: [variant], scope: ref },
  );

  return (
    <svg ref={ref} className="constructivist-field" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="cf-sun" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="var(--sun-core)" />
          <stop offset="100%" stopColor="var(--sun-edge)" />
        </radialGradient>
        <pattern id="cf-stripes" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="14" fill="var(--band-stripe)" />
        </pattern>
        <pattern id="cf-dots" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle className="cf-screen-dot" cx="3" cy="3" r="1.15" />
        </pattern>
      </defs>

      <g data-layer="rays">
        <g data-parallax="">
          <g data-pose="rays">
            {Array.from({ length: 13 }, (_, i) => {
              const a = (-90 + i * 7.5) * (Math.PI / 180);
              return (
                <line
                  key={i}
                  data-draw=""
                  x1={0}
                  y1={0}
                  x2={Math.cos(a) * 1900}
                  y2={Math.sin(a) * 1900}
                  className={i % 4 === 0 ? 'cf-ray cf-ray-strong' : 'cf-ray'}
                />
              );
            })}
          </g>
        </g>
      </g>

      <g data-layer="band">
        <g data-parallax="">
          <g data-pose="band">
            <g transform="translate(-200 640) rotate(-28)">
              <rect data-band="" x="0" y="0" width="2400" height="86" className="cf-band" />
              <rect data-band="" x="0" y="0" width="2400" height="86" fill="url(#cf-stripes)" className="cf-band-stripes" />
              <rect data-band="" x="0" y="104" width="2400" height="10" className="cf-band-thin" />
            </g>
          </g>
        </g>
      </g>

      <g data-layer="disc">
        <g data-parallax="">
          <g data-pose="disc">
            <g data-spin="">
              <circle r="230" fill="url(#cf-sun)" className="cf-sun" />
              <circle r="230" fill="url(#cf-dots)" className="cf-screen-dots" />
              <circle r="262" className="cf-ring" data-draw="" />
              <g data-ring-dash="">
                <circle r="292" className="cf-ring-dash" />
              </g>
            </g>
          </g>
        </g>
      </g>

      <g data-layer="orbits">
        <g data-parallax="">
          <g data-pose="orbits">
            {ORBITS.map((o, i) => (
              <path
                key={i}
                d={ellipsePath(o.rx, o.ry)}
                className={i === 1 ? 'cf-orbit cf-orbit-main' : 'cf-orbit'}
                {...(i === 1 ? { 'data-draw': '' } : {})}
                {...(i === 2 ? { 'data-orbit-path': '' } : {})}
                {...(i === 0 ? { 'data-orbit-path-2': '' } : {})}
              />
            ))}
            <g data-satellite="">
              <circle r="9" className="cf-satellite" />
              <line x1="-22" y1="0" x2="22" y2="0" className="cf-satellite-wing" />
              <line x1="0" y1="-14" x2="0" y2="14" className="cf-satellite-wing" />
            </g>
            <g data-satellite-2="">
              <circle r="5" className="cf-satellite cf-satellite-small" />
            </g>
          </g>
        </g>
      </g>

      <g data-layer="star">
        <g data-parallax="">
          <g data-pose="star">
            <g data-spin="">
              <polygon points={STAR_POINTS} className="cf-star" data-draw="" />
              <circle r="128" className="cf-star-ring" />
            </g>
          </g>
        </g>
      </g>

      <g data-layer="word">
        <g data-parallax="">
          <g data-pose="word">
            <text data-word="" className="cf-word" transform="rotate(-90)" textAnchor="start">
              КОСМОС · 1961
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

function applyPose(svg: SVGSVGElement, pose: Pose, duration: number) {
  const q = gsap.utils.selector(svg);
  const vars = (v: gsap.TweenVars) => (duration ? { ...v, duration, ease: 'expo.inOut', overwrite: 'auto' as const } : v);
  const set = duration ? gsap.to : gsap.set;
  set(q('[data-pose="disc"]'), vars({ x: pose.disc.x, y: pose.disc.y, scale: pose.disc.scale, svgOrigin: '0 0' }));
  set(q('[data-pose="orbits"]'), vars({ x: pose.orbits.x, y: pose.orbits.y, rotation: pose.orbits.rotation, scale: pose.orbits.scale, svgOrigin: '0 0' }));
  set(q('[data-pose="band"]'), vars({ x: pose.band.x, y: pose.band.y, rotation: pose.band.rotation, svgOrigin: '800 640' }));
  set(q('[data-pose="rays"]'), vars({ x: pose.rays.x, y: pose.rays.y, rotation: pose.rays.rotation, svgOrigin: '0 0' }));
  set(q('[data-pose="star"]'), vars({ x: pose.star.x, y: pose.star.y, scale: pose.star.scale, svgOrigin: '0 0' }));
  set(q('[data-pose="word"]'), vars({ x: pose.word.x, y: pose.word.y, svgOrigin: '0 0' }));
}
