'use client';

import { useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';

type WallVariant = 'cv' | 'education' | 'projects' | 'detail' | 'notfound';

function variantFor(pathname: string): WallVariant {
  if (pathname.startsWith('/education')) return 'education';
  if (/^\/projects\/[^/]+/.test(pathname)) return 'detail';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/404')) return 'notfound';
  return 'cv';
}

const PRESS = '/images/press';

interface Print {
  /** Transparent halftone print generated from the site's own 3D scene (see public/images/press). */
  src: string;
  /** Position down the document, in per cent of the wall's height. */
  top: number;
  side: 'left' | 'right';
  /** Distance from that edge, in per cent of the viewport width (negative = partly off the sheet). */
  offset: number;
  width: string;
  rotate: number;
  /** How much faster than the page this print drifts. */
  depth: number;
  opacity: number;
}

interface Pattern {
  kind: 'word' | 'strip' | 'disc' | 'arc' | 'reg';
  top: number;
  left?: number;
  right?: number;
  /** Font size / box size, a CSS length. */
  size?: string;
  rotate?: number;
  depth: number;
  text?: string;
  face?: 'title' | 'display';
}

/** The museum prints, ghosted behind the content. Each route shows its own set. */
const PRINTS: Record<WallVariant, Print[]> = {
  cv: [
    { src: PRESS + '/duchamp.webp', top: 26, side: 'right', offset: -4, width: 'clamp(190px, 19vw, 340px)', rotate: -7, depth: 1.3, opacity: 0.3 },
    { src: PRESS + '/hausmann.webp', top: 52, side: 'left', offset: -3, width: 'clamp(170px, 16vw, 290px)', rotate: 6, depth: 1.5, opacity: 0.28 },
    { src: PRESS + '/manray.webp', top: 76, side: 'right', offset: 2, width: 'clamp(150px, 14vw, 250px)', rotate: -5, depth: 1.2, opacity: 0.28 },
    { src: PRESS + '/clock.webp', top: 40, side: 'right', offset: -2, width: 'clamp(110px, 10vw, 185px)', rotate: 8, depth: 1.5, opacity: 0.3 },
    { src: PRESS + '/spoon.webp', top: 90, side: 'left', offset: 1, width: 'clamp(80px, 8vw, 145px)', rotate: -9, depth: 1.4, opacity: 0.28 },
  ],
  education: [
    { src: PRESS + '/hausmann.webp', top: 16, side: 'right', offset: -3, width: 'clamp(190px, 19vw, 350px)', rotate: -6, depth: 1.4, opacity: 0.38 },
    { src: PRESS + '/duchamp.webp', top: 52, side: 'left', offset: -3, width: 'clamp(170px, 16vw, 300px)', rotate: 5, depth: 1.2, opacity: 0.26 },
    { src: PRESS + '/clock.webp', top: 76, side: 'right', offset: 3, width: 'clamp(110px, 10vw, 180px)', rotate: 7, depth: 1.5, opacity: 0.3 },
    { src: PRESS + '/hammer.webp', top: 30, side: 'left', offset: 0, width: 'clamp(85px, 8vw, 150px)', rotate: 9, depth: 1.6, opacity: 0.34 },
    { src: PRESS + '/spoon.webp', top: 64, side: 'right', offset: -1, width: 'clamp(80px, 8vw, 145px)', rotate: -10, depth: 1.3, opacity: 0.3 },
    { src: PRESS + '/stapler.webp', top: 88, side: 'left', offset: 3, width: 'clamp(140px, 13vw, 235px)', rotate: -4, depth: 1.2, opacity: 0.28 },
  ],
  projects: [
    { src: PRESS + '/duchamp.webp', top: 10, side: 'right', offset: -3, width: 'clamp(190px, 19vw, 340px)', rotate: 6, depth: 1.3, opacity: 0.4 },
    { src: PRESS + '/hammer.webp', top: 33, side: 'left', offset: -2, width: 'clamp(90px, 9vw, 165px)', rotate: -9, depth: 1.7, opacity: 0.4 },
    { src: PRESS + '/spoon.webp', top: 55, side: 'right', offset: 1, width: 'clamp(85px, 8vw, 150px)', rotate: 11, depth: 1.5, opacity: 0.36 },
    { src: PRESS + '/clock.webp', top: 78, side: 'left', offset: 1, width: 'clamp(110px, 10vw, 195px)', rotate: -6, depth: 1.4, opacity: 0.38 },
    { src: PRESS + '/stapler.webp', top: 45, side: 'right', offset: 2, width: 'clamp(130px, 12vw, 220px)', rotate: 7, depth: 1.6, opacity: 0.32 },
    { src: PRESS + '/spoon.webp', top: 90, side: 'right', offset: -1, width: 'clamp(85px, 8vw, 150px)', rotate: -12, depth: 1.3, opacity: 0.3 },
  ],
  detail: [
    { src: PRESS + '/duchamp.webp', top: 14, side: 'right', offset: -3, width: 'clamp(190px, 18vw, 320px)', rotate: 7, depth: 1.3, opacity: 0.32 },
    { src: PRESS + '/clock.webp', top: 48, side: 'right', offset: 1, width: 'clamp(110px, 10vw, 190px)', rotate: -8, depth: 1.5, opacity: 0.36 },
    { src: PRESS + '/stapler.webp', top: 68, side: 'left', offset: -2, width: 'clamp(140px, 13vw, 240px)', rotate: -5, depth: 1.2, opacity: 0.3 },
    { src: PRESS + '/spoon.webp', top: 32, side: 'left', offset: 0, width: 'clamp(80px, 8vw, 145px)', rotate: 10, depth: 1.5, opacity: 0.3 },
    { src: PRESS + '/manray.webp', top: 86, side: 'right', offset: 2, width: 'clamp(140px, 13vw, 230px)', rotate: 6, depth: 1.2, opacity: 0.28 },
  ],
  notfound: [
    { src: PRESS + '/manray.webp', top: 22, side: 'right', offset: 1, width: 'clamp(180px, 18vw, 320px)', rotate: -6, depth: 1.3, opacity: 0.45 },
    { src: PRESS + '/duchamp.webp', top: 58, side: 'left', offset: -3, width: 'clamp(170px, 16vw, 290px)', rotate: 5, depth: 1.1, opacity: 0.26 },
  ],
};

/** The printer's furniture: words, serial strips, halftone discs, orbit arcs and registration marks. */
const PATTERNS: Pattern[] = [
  { kind: 'reg', top: 6, right: 10, size: 'clamp(30px, 3.2vw, 54px)', depth: 0.8 },
  { kind: 'disc', top: 19, left: 68, size: 'clamp(190px, 24vw, 430px)', depth: 0.6 },
  { kind: 'word', text: 'Merz', top: 28, left: -3, size: 'clamp(120px, 15vw, 280px)', rotate: -90, depth: 1.2 },
  { kind: 'strip', text: 'HKCT · 2024 — 2026', top: 36, left: 6, rotate: -3, depth: 1.1 },
  { kind: 'arc', top: 44, left: -13, size: 'clamp(260px, 38vw, 660px)', depth: 0.5 },
  { kind: 'word', text: 'DADA', top: 54, right: 1, size: 'clamp(90px, 11vw, 210px)', rotate: 90, depth: 0.9, face: 'display' },
  { kind: 'reg', top: 63, left: 8, size: 'clamp(30px, 3.2vw, 54px)', depth: 0.7 },
  { kind: 'disc', top: 70, right: 7, size: 'clamp(150px, 17vw, 320px)', depth: 0.6 },
  { kind: 'word', text: 'КОСМОС', top: 78, right: -2, size: 'clamp(90px, 10vw, 200px)', rotate: 90, depth: 1.0 },
  { kind: 'strip', text: 'Objets trouvés · Mobile № 4', top: 84, left: 9, rotate: 2, depth: 1.0 },
  { kind: 'arc', top: 92, right: -11, size: 'clamp(220px, 32vw, 560px)', depth: 0.5 },
];

/** Long pages get a second pass of the furniture further down, so the paper never goes blank. */
function patternsFor(variant: WallVariant): Pattern[] {
  if (variant === 'notfound') return PATTERNS;
  const extra: Pattern[] = PATTERNS.filter((_, i) => i % 2 === 0).map((p) => ({
    ...p,
    top: p.top + 51,
    left: p.left !== undefined ? p.left + 6 : p.left,
    right: p.right !== undefined ? p.right + 8 : p.right,
    rotate: p.rotate !== undefined ? -p.rotate : p.rotate,
    depth: p.depth * 0.85,
  }));
  return [...PATTERNS, ...extra];
}

function RegistrationMark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="9.5" />
      <path d="M20 1v11M20 28v11M1 20h11M28 20h11" />
    </svg>
  );
}

/**
 * The scroll wall: ghosted halftone prints of the site's own readymades plus printer's furniture (outlined
 * words, serial strips, halftone discs, orbit arcs and registration marks) laid down the page behind the
 * content, at low opacity. They drift at different rates as the page scrolls, so the background keeps
 * changing instead of turning into blank paper. Decorative: hidden from print and assistive technology,
 * no pointer events, and still under reduced motion (no parallax, no movement).
 */
export default function ScrollWall() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const variant = variantFor(pathname);
  const patterns = patternsFor(variant);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap.utils.toArray<HTMLElement>('[data-wall]', root).forEach((el) => {
          const depth = Number(el.dataset.depth ?? 1);
          gsap.fromTo(
            el,
            { y: 90 * depth },
            {
              y: -90 * depth,
              ease: 'none',
              scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
            },
          );
        });
      });
    },
    { dependencies: [pathname], scope: ref },
  );

  return (
    <div ref={ref} className="scroll-wall no-print" aria-hidden="true">
      {patterns.map((item, i) => (
        <div
          key={'p' + i}
          className={`wall-item wall-${item.kind}${item.face === 'display' ? ' wall-word-display' : ''}`}
          data-wall=""
          data-depth={item.depth}
          style={{
            top: `${item.top}%`,
            left: item.left !== undefined ? `${item.left}%` : undefined,
            right: item.right !== undefined ? `${item.right}%` : undefined,
            width: item.kind === 'disc' || item.kind === 'arc' || item.kind === 'reg' ? item.size : undefined,
            fontSize: item.kind === 'word' ? item.size : undefined,
            rotate: item.rotate !== undefined ? `${item.rotate}deg` : undefined,
          }}
        >
          {item.kind === 'reg' ? (
            <RegistrationMark />
          ) : item.kind === 'word' || item.kind === 'strip' ? (
            item.text
          ) : null}
        </div>
      ))}
      {PRINTS[variant].map((item, i) => (
        <div
          key={'g' + i}
          className="wall-item wall-print"
          data-wall=""
          data-depth={item.depth}
          style={{
            top: `${item.top}%`,
            [item.side]: `${item.offset}%`,
            width: item.width,
            rotate: `${item.rotate}deg`,
            ['--wall-opacity' as string]: item.opacity,
          }}
        >
          <img src={item.src} alt="" loading="lazy" decoding="async" />
        </div>
      ))}
    </div>
  );
}
