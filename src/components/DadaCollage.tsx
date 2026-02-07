'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type Variants,
} from 'framer-motion';

/**
 * DadaCollage — Enhanced atmospheric Dada/Deconstructivist decorative layer
 * with Framer Motion animations. Renders floating collage fragments,
 * scattered typography, ink stamps, diagonal slashes, geometric constructions
 * (compass roses, intersecting planes, rotary dials) with staggered entrances,
 * parallax drift, and viewport-triggered reveals.
 *
 * Inspired by Reverse:1999 (Lucidscape, UTTU Magazine, Seine Chronicle),
 * Tristan Tzara, John Heartfield, David Carson, Russian Constructivism.
 * Hidden on the CV landing page and print.
 */

/* ── Dada text fragments — absurdist, typographic, multilingual ──── */
const DADA_FRAGMENTS = [
  { text: 'ДАДА', rotate: -7, size: 'text-xl' },
  { text: '§ 1916 §', rotate: 3, size: 'text-sm' },
  { text: 'MERZ', rotate: -4, size: 'text-base' },
  { text: 'anti', rotate: 12, size: 'text-sm' },
  { text: '反藝術', rotate: -2, size: 'text-base' },
  { text: 'TRISTAN', rotate: 5, size: 'text-xs' },
  { text: '№ 391', rotate: -9, size: 'text-sm' },
  { text: 'CABARET', rotate: 7, size: 'text-sm' },
  { text: 'VOLTAIRE', rotate: -3, size: 'text-xs' },
  { text: '解構', rotate: 8, size: 'text-base' },
  { text: 'OBJET', rotate: -6, size: 'text-sm' },
  { text: 'TROUVÉ', rotate: 4, size: 'text-xs' },
];

/* ── Stamp texts — bureaucratic/absurdist seals ──────────────────── */
const STAMPS = [
  { text: 'ОДОБРЕНО', rotate: -15 },
  { text: '機密', rotate: 8 },
  { text: 'DADA', rotate: -22 },
  { text: '№ 1916', rotate: 12 },
];

/* ── Dada image fragments — archival references ─────────────────── */
const DADA_IMAGE_FRAGMENTS = [
  {
    src: '/dada/collage-1.svg',
    alt: 'Dada collage fragment with emblem',
  },
  {
    src: '/dada/collage-2.svg',
    alt: 'Dada photomontage fragment',
  },
  {
    src: '/dada/collage-3.svg',
    alt: 'Dada magazine cover fragment',
  },
  {
    src: '/dada/collage-4.svg',
    alt: 'UTTU dossier fragment',
  },
  {
    src: '/dada/collage-5.svg',
    alt: 'Lucidscape fragment',
  },
];

/* ── Geometric fragment shapes ───────────────────────────────────── */
interface CollageFragment {
  id: number;
  x: number;
  y: number;
  rotate: number;
  width: number;
  height: number;
  type: 'paper' | 'stripe' | 'redact' | 'diagonal' | 'circle';
  opacity: number;
  drift: number;
}

function generateFragments(count: number, seed: number): CollageFragment[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };

  const types: CollageFragment['type'][] = ['paper', 'stripe', 'redact', 'diagonal', 'circle'];
  const fragments: CollageFragment[] = [];

  for (let i = 0; i < count; i++) {
    fragments.push({
      id: i,
      x: rand() * 90 + 5,
      y: rand() * 85 + 5,
      rotate: (rand() - 0.5) * 30,
      width: rand() * 60 + 20,
      height: rand() * 8 + 2,
      type: types[Math.floor(rand() * types.length)],
      opacity: rand() * 0.2 + 0.08,
      drift: rand() * 10,
    });
  }

  return fragments;
}

/* ── Framer Motion variant factories ─────────────────────────────── */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const fragmentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, filter: 'blur(4px)' },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      delay: delay * 0.12,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20, rotate: 0 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: DADA_FRAGMENTS[i]?.rotate ?? 0,
    transition: {
      duration: 0.6,
      delay: 0.5 + i * 0.07,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 3, rotate: -15 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: STAMPS[i]?.rotate ?? 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: 1.0 + i * 0.25,
    },
  }),
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      delay: 0.6 + i * 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

/* ── Parallax-aware floating fragment ────────────────────────────── */
function FloatingFragment({
  frag,
  isDark,
  paperColor,
  strokeColor,
  accentColor,
}: {
  frag: CollageFragment;
  isDark: boolean;
  paperColor: string;
  strokeColor: string;
  accentColor: string;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${frag.x}%`,
        top: `${frag.y}%`,
      }}
      custom={frag.drift}
      variants={fragmentVariants}
      animate={{
        x: [0, 3, -2, 1, 0],
        y: [0, -2, 3, -1, 0],
        rotate: [frag.rotate, frag.rotate + 0.5, frag.rotate - 0.3, frag.rotate + 0.2, frag.rotate],
      }}
      transition={{
        x: { duration: 12 + frag.drift, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 14 + frag.drift, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 16 + frag.drift, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {frag.type === 'paper' && (
        <div
          className="dada-torn-edge dada-noise"
          style={{
            width: `${frag.width}px`,
            height: `${frag.height + 14}px`,
            background: `linear-gradient(${frag.rotate + 90}deg, ${paperColor}, transparent)`,
            border: `0.5px solid ${strokeColor}`,
            opacity: frag.opacity,
          }}
        />
      )}

      {frag.type === 'stripe' && (
        <motion.div
          style={{
            width: `${frag.width + 40}px`,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: frag.opacity * 2.5,
            rotate: frag.rotate,
          }}
          animate={{ scaleX: [1, 1.3, 1], opacity: [frag.opacity * 2.5, frag.opacity * 4, frag.opacity * 2.5] }}
          transition={{ duration: 4 + frag.drift * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {frag.type === 'redact' && (
        <motion.div
          style={{
            width: `${frag.width}px`,
            height: '5px',
            background: isDark ? 'rgba(143, 0, 0, 0.25)' : 'rgba(143, 0, 0, 0.1)',
            opacity: frag.opacity * 3,
            rotate: frag.rotate * 0.3,
          }}
          animate={{ scaleX: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {frag.type === 'diagonal' && (
        <motion.svg
          width={frag.width}
          height={frag.width}
          viewBox={`0 0 ${frag.width} ${frag.width}`}
          style={{ opacity: frag.opacity * 2 }}
          animate={{ rotate: [0, 1, -0.5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <line
            x1="0" y1={frag.width} x2={frag.width} y2="0"
            stroke="#8f0000"
            strokeWidth="0.8"
            opacity={isDark ? 0.5 : 0.25}
          />
          <line
            x1={frag.width * 0.2} y1={frag.width} x2={frag.width} y2={frag.width * 0.2}
            stroke={isDark ? '#db5b00' : '#a04000'}
            strokeWidth="0.5"
            opacity={isDark ? 0.4 : 0.18}
          />
        </motion.svg>
      )}

      {frag.type === 'circle' && (
        <motion.svg
          width={frag.height + 18}
          height={frag.height + 18}
          viewBox="0 0 20 20"
          style={{ opacity: frag.opacity * 2.5 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30 + frag.drift * 3, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="10" cy="10" r="8"
            fill="none"
            stroke="#8f0000"
            strokeWidth="0.6"
            strokeDasharray="2 3"
            opacity={isDark ? 0.5 : 0.25}
          />
          <circle
            cx="10" cy="10" r="4"
            fill="none"
            stroke={isDark ? '#db5b00' : '#a04000'}
            strokeWidth="0.4"
            opacity={isDark ? 0.4 : 0.15}
          />
        </motion.svg>
      )}
    </motion.div>
  );
}

/* ── Reverse:1999-style compass rose / navigational dial ─────────── */
function CompassRose({ isDark, size, x, y, speed }: {
  isDark: boolean;
  size: number;
  x: string;
  y: string;
  speed: number;
}) {
  const color1 = isDark ? 'rgba(143, 0, 0, 0.3)' : 'rgba(143, 0, 0, 0.12)';
  const color2 = isDark ? 'rgba(219, 91, 0, 0.25)' : 'rgba(219, 91, 0, 0.1)';

  return (
    <motion.svg
      className="absolute hidden md:block"
      style={{ left: x, top: y }}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
    >
      <motion.g
        style={{ transformOrigin: '40px 40px' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer ring */}
        <circle cx="40" cy="40" r="35" fill="none" stroke={color1} strokeWidth="0.5" strokeDasharray="4 6" />
        {/* Inner ring */}
        <circle cx="40" cy="40" r="22" fill="none" stroke={color2} strokeWidth="0.4" />
        {/* Cross hairs */}
        {[0, 45, 90, 135].map((angle) => (
          <line
            key={angle}
            x1={40 + 15 * Math.cos((angle * Math.PI) / 180)}
            y1={40 + 15 * Math.sin((angle * Math.PI) / 180)}
            x2={40 + 35 * Math.cos((angle * Math.PI) / 180)}
            y2={40 + 35 * Math.sin((angle * Math.PI) / 180)}
            stroke={angle % 90 === 0 ? color1 : color2}
            strokeWidth={angle % 90 === 0 ? '0.8' : '0.4'}
          />
        ))}
        {/* Cardinal diamonds */}
        {[0, 90, 180, 270].map((angle) => {
          const cx = 40 + 28 * Math.cos((angle * Math.PI) / 180);
          const cy = 40 + 28 * Math.sin((angle * Math.PI) / 180);
          return (
            <polygon
              key={`d-${angle}`}
              points={`${cx},${cy - 3} ${cx + 2},${cy} ${cx},${cy + 3} ${cx - 2},${cy}`}
              fill={color1}
            />
          );
        })}
      </motion.g>
      {/* Centre dot — does not rotate */}
      <circle cx="40" cy="40" r="2" fill={color2} />
    </motion.svg>
  );
}

/* ── Reverse:1999-style intersecting angular planes ──────────────── */
function IntersectingPlanes({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const stroke1 = isDark ? 'rgba(143, 0, 0, 0.25)' : 'rgba(143, 0, 0, 0.1)';
  const stroke2 = isDark ? 'rgba(219, 91, 0, 0.2)' : 'rgba(219, 91, 0, 0.08)';
  const fill = isDark ? 'rgba(143, 0, 0, 0.04)' : 'rgba(143, 0, 0, 0.02)';

  return (
    <motion.svg
      className="absolute hidden lg:block"
      style={{ left: x, top: y }}
      width="140"
      height="120"
      viewBox="0 0 140 120"
      initial={{ opacity: 0, x: -20, rotate: -5 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 1.2, delay: 1.0, ease: 'easeOut' }}
    >
      {/* Plane A — tilted rectangle */}
      <motion.polygon
        points="20,20 120,10 115,70 15,80"
        fill={fill}
        stroke={stroke1}
        strokeWidth="0.6"
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Plane B — intersecting triangle */}
      <motion.polygon
        points="50,5 130,60 10,100"
        fill="none"
        stroke={stroke2}
        strokeWidth="0.5"
        strokeDasharray="6 4"
        animate={{ rotate: [0, 0.5, -0.3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '70px 55px' }}
      />
      {/* Intersection emphasis line */}
      <motion.line
        x1="40" y1="25" x2="100" y2="65"
        stroke={isDark ? '#ffa500' : '#db5b00'}
        strokeWidth="0.4"
        opacity={isDark ? 0.3 : 0.12}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.4 }}
      />
    </motion.svg>
  );
}

/* ── Floating Dada clock / rotary dial (Reverse:1999 time motif) ── */
function RotaryDial({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const ringColor = isDark ? 'rgba(219, 91, 0, 0.2)' : 'rgba(219, 91, 0, 0.08)';
  const tickColor = isDark ? 'rgba(143, 0, 0, 0.35)' : 'rgba(143, 0, 0, 0.15)';

  return (
    <motion.svg
      className="absolute hidden md:block"
      style={{ right: x, bottom: y }}
      width="70"
      height="70"
      viewBox="0 0 60 60"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 1.5 }}
    >
      {/* Outer ring */}
      <circle cx="30" cy="30" r="28" fill="none" stroke={ringColor} strokeWidth="0.6" />
      {/* Hour ticks */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={30 + 23 * Math.cos(angle)}
            y1={30 + 23 * Math.sin(angle)}
            x2={30 + 27 * Math.cos(angle)}
            y2={30 + 27 * Math.sin(angle)}
            stroke={tickColor}
            strokeWidth={i % 3 === 0 ? '1' : '0.4'}
          />
        );
      })}
      {/* Clock hand — rotating */}
      <motion.line
        x1="30" y1="30" x2="30" y2="10"
        stroke="#8f0000"
        strokeWidth="0.8"
        opacity={isDark ? 0.35 : 0.15}
        style={{ transformOrigin: '30px 30px' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.line
        x1="30" y1="30" x2="30" y2="14"
        stroke={isDark ? '#db5b00' : '#a04000'}
        strokeWidth="0.5"
        opacity={isDark ? 0.3 : 0.12}
        style={{ transformOrigin: '30px 30px' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 720, repeat: Infinity, ease: 'linear' }}
      />
      {/* Centre */}
      <circle cx="30" cy="30" r="1.5" fill={tickColor} />
    </motion.svg>
  );
}

/* ── Reverse:1999 Hourglass / time motif ───────────────────────── */
function HourglassSymbol({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const stroke = isDark ? 'rgba(219, 91, 0, 0.25)' : 'rgba(219, 91, 0, 0.1)';
  const accent = isDark ? 'rgba(143, 0, 0, 0.3)' : 'rgba(143, 0, 0, 0.12)';

  return (
    <motion.svg
      className="absolute hidden md:block"
      style={{ left: x, top: y }}
      width="50"
      height="70"
      viewBox="0 0 50 70"
      initial={{ opacity: 0, scale: 0.4, rotate: 10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, delay: 1.8, ease: 'easeOut' }}
    >
      {/* Top bulb */}
      <motion.path
        d="M10,5 L40,5 L25,30 Z"
        fill="none"
        stroke={accent}
        strokeWidth="0.8"
        animate={{ rotate: [0, 0.5, -0.5, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '25px 35px' }}
      />
      {/* Bottom bulb */}
      <motion.path
        d="M10,65 L40,65 L25,40 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
      />
      {/* Frame top/bottom */}
      <line x1="8" y1="5" x2="42" y2="5" stroke={accent} strokeWidth="1.2" />
      <line x1="8" y1="65" x2="42" y2="65" stroke={accent} strokeWidth="1.2" />
      {/* Sand falling — animated dot */}
      <motion.circle
        cx="25" cy="30" r="1"
        fill={stroke}
        animate={{ cy: [30, 42, 30] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeIn' }}
      />
    </motion.svg>
  );
}

/* ── Reverse:1999-style film strip frame ──────────────────────── */
function FilmStrip({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const stroke = isDark ? 'rgba(143, 0, 0, 0.22)' : 'rgba(143, 0, 0, 0.09)';
  const perfColor = isDark ? 'rgba(219, 91, 0, 0.18)' : 'rgba(219, 91, 0, 0.07)';

  return (
    <motion.svg
      className="absolute hidden lg:block"
      style={{ left: x, top: y }}
      width="120"
      height="40"
      viewBox="0 0 120 40"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.0, delay: 2.2, ease: 'easeOut' }}
    >
      {/* Film strip body */}
      <rect x="0" y="5" width="120" height="30" fill="none" stroke={stroke} strokeWidth="0.6" rx="1" />
      {/* Perforations — top row */}
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={`t-${i}`} x={6 + i * 12} y="1" width="5" height="4" rx="0.5" fill={perfColor} />
      ))}
      {/* Perforations — bottom row */}
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={`b-${i}`} x={6 + i * 12} y="35" width="5" height="4" rx="0.5" fill={perfColor} />
      ))}
      {/* Frame dividers */}
      {[30, 60, 90].map((xPos) => (
        <line key={xPos} x1={xPos} y1="5" x2={xPos} y2="35" stroke={stroke} strokeWidth="0.4" />
      ))}
      {/* Moving light sweep */}
      <motion.rect
        x="0" y="5" width="20" height="30" rx="1"
        fill={isDark ? 'rgba(255, 165, 0, 0.04)' : 'rgba(219, 91, 0, 0.02)'}
        animate={{ x: [0, 100, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

/* ── Esoteric all-seeing eye (Reverse:1999 / occult motif) ─────── */
function EsotericEye({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const stroke = isDark ? 'rgba(143, 0, 0, 0.28)' : 'rgba(143, 0, 0, 0.1)';
  const accent = isDark ? 'rgba(219, 91, 0, 0.22)' : 'rgba(219, 91, 0, 0.08)';

  return (
    <motion.svg
      className="absolute hidden md:block"
      style={{ right: x, top: y }}
      width="65"
      height="45"
      viewBox="0 0 65 45"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12, delay: 2.5 }}
    >
      {/* Eye outline — almond shape */}
      <motion.path
        d="M5,22 Q32,0 60,22 Q32,44 5,22 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '32px 22px' }}
      />
      {/* Iris */}
      <circle cx="32" cy="22" r="8" fill="none" stroke={accent} strokeWidth="0.6" />
      {/* Pupil */}
      <motion.circle
        cx="32" cy="22" r="3"
        fill={stroke}
        animate={{ r: [3, 4, 3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Radiating lines above */}
      {[-20, -10, 0, 10, 20].map((angle) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={32 + 12 * Math.cos(rad)}
            y1={22 + 12 * Math.sin(rad)}
            x2={32 + 18 * Math.cos(rad)}
            y2={22 + 18 * Math.sin(rad)}
            stroke={accent}
            strokeWidth="0.4"
          />
        );
      })}
    </motion.svg>
  );
}

/* ── Tarot card frame (Reverse:1999 card motif) ────────────────── */
function TarotFrame({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const stroke = isDark ? 'rgba(143, 0, 0, 0.2)' : 'rgba(143, 0, 0, 0.08)';
  const accent = isDark ? 'rgba(219, 91, 0, 0.18)' : 'rgba(219, 91, 0, 0.07)';
  const innerFill = isDark ? 'rgba(227, 213, 193, 0.02)' : 'rgba(143, 0, 0, 0.015)';

  return (
    <motion.svg
      className="absolute hidden lg:block"
      style={{ left: x, bottom: y }}
      width="55"
      height="85"
      viewBox="0 0 55 85"
      initial={{ opacity: 0, y: 30, rotate: 5 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 1.5, delay: 1.6, ease: 'easeOut' }}
    >
      {/* Outer card border */}
      <rect x="2" y="2" width="51" height="81" rx="3" fill={innerFill} stroke={stroke} strokeWidth="0.8" />
      {/* Inner decorative border */}
      <rect x="6" y="6" width="43" height="73" rx="1.5" fill="none" stroke={accent} strokeWidth="0.4" />
      {/* Corner ornaments */}
      <circle cx="10" cy="10" r="2" fill="none" stroke={stroke} strokeWidth="0.4" />
      <circle cx="45" cy="10" r="2" fill="none" stroke={stroke} strokeWidth="0.4" />
      <circle cx="10" cy="75" r="2" fill="none" stroke={stroke} strokeWidth="0.4" />
      <circle cx="45" cy="75" r="2" fill="none" stroke={stroke} strokeWidth="0.4" />
      {/* Central diamond motif */}
      <motion.polygon
        points="27.5,22 38,42.5 27.5,63 17,42.5"
        fill="none"
        stroke={accent}
        strokeWidth="0.5"
        strokeDasharray="3 4"
        animate={{ rotate: [0, 1, -1, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '27.5px 42.5px' }}
      />
      {/* Central star */}
      <motion.circle
        cx="27.5" cy="42.5" r="4"
        fill="none"
        stroke={stroke}
        strokeWidth="0.6"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '27.5px 42.5px' }}
      />
    </motion.svg>
  );
}

/* ── Pendulum / swing (Reverse:1999 time motif) ────────────────── */
function Pendulum({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const stroke = isDark ? 'rgba(143, 0, 0, 0.25)' : 'rgba(143, 0, 0, 0.1)';
  const accent = isDark ? 'rgba(219, 91, 0, 0.22)' : 'rgba(219, 91, 0, 0.08)';

  return (
    <motion.svg
      className="absolute hidden md:block"
      style={{ right: x, bottom: y }}
      width="40"
      height="80"
      viewBox="0 0 40 80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2.0 }}
    >
      {/* Pivot point */}
      <circle cx="20" cy="5" r="2" fill={stroke} />
      {/* Swinging arm + bob */}
      <motion.g
        style={{ transformOrigin: '20px 5px' }}
        animate={{ rotate: [-15, 15, -15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="20" y1="5" x2="20" y2="62" stroke={stroke} strokeWidth="0.6" />
        <circle cx="20" cy="65" r="6" fill="none" stroke={accent} strokeWidth="0.8" />
        <circle cx="20" cy="65" r="2.5" fill={stroke} />
      </motion.g>
    </motion.svg>
  );
}

/* ── Alchemical / esoteric circle with inscriptions ────────────── */
function AlchemyCircle({ isDark, x, y }: { isDark: boolean; x: string; y: string }) {
  const stroke = isDark ? 'rgba(143, 0, 0, 0.18)' : 'rgba(143, 0, 0, 0.07)';
  const accent = isDark ? 'rgba(219, 91, 0, 0.15)' : 'rgba(219, 91, 0, 0.06)';

  return (
    <motion.svg
      className="absolute hidden lg:block"
      style={{ left: x, top: y }}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ duration: 1.8, delay: 2.4, ease: 'easeOut' }}
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" fill="none" stroke={stroke} strokeWidth="0.5" />
      {/* Inner circle */}
      <circle cx="50" cy="50" r="35" fill="none" stroke={accent} strokeWidth="0.4" strokeDasharray="5 3" />
      {/* Inscribed triangle */}
      <motion.polygon
        points="50,10 87,68 13,68"
        fill="none"
        stroke={stroke}
        strokeWidth="0.6"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      />
      {/* Inverted triangle */}
      <motion.polygon
        points="50,90 13,32 87,32"
        fill="none"
        stroke={accent}
        strokeWidth="0.4"
        strokeDasharray="4 3"
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      />
      {/* Centre point */}
      <circle cx="50" cy="50" r="2" fill={stroke} />
      {/* Small orbiting dot */}
      <motion.circle
        cx="50" cy="12" r="1.5"
        fill={accent}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </motion.svg>
  );
}

/* ── Musical note silhouette (Seine Chronicle reference) ──────── */
function MusicalNote({ isDark, x, y, size }: { isDark: boolean; x: string; y: string; size: number }) {
  const fill = isDark ? 'rgba(143, 0, 0, 0.18)' : 'rgba(143, 0, 0, 0.07)';

  return (
    <motion.svg
      className="absolute hidden md:block"
      style={{ left: x, top: y }}
      width={size}
      height={size * 1.4}
      viewBox="0 0 30 42"
      initial={{ opacity: 0, y: 15, rotate: -10 }}
      animate={{ opacity: 1, y: 0, rotate: 5 }}
      transition={{ duration: 1.2, delay: 2.6, ease: 'easeOut' }}
    >
      <motion.g
        animate={{ y: [0, -3, 0], rotate: [5, 3, 5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '15px 21px' }}
      >
        {/* Note head */}
        <ellipse cx="10" cy="34" rx="6" ry="4.5" fill={fill} transform="rotate(-15 10 34)" />
        {/* Stem */}
        <line x1="16" y1="31" x2="16" y2="5" stroke={fill} strokeWidth="1.2" />
        {/* Flag */}
        <path d="M16,5 Q24,10 18,18" fill="none" stroke={fill} strokeWidth="1" />
      </motion.g>
    </motion.svg>
  );
}

/* ── Mouse parallax hook ─────────────────────────────────────────── */
function useMouseParallax(strength: number = 0.02) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(useTransform(mouseX, (v) => v * strength), { damping: 30, stiffness: 100 });
  const springY = useSpring(useTransform(mouseY, (v) => v * strength), { damping: 30, stiffness: 100 });
  const cursorSpringX = useSpring(cursorX, { damping: 25, stiffness: 180 });
  const cursorSpringY = useSpring(cursorY, { damping: 25, stiffness: 180 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY, cursorX, cursorY]);

  return { x: springX, y: springY, cursorX: cursorSpringX, cursorY: cursorSpringY };
}

/* ── Main component ──────────────────────────────────────────────── */
export default function DadaCollage() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { x: parallaxX, y: parallaxY, cursorX, cursorY } = useMouseParallax(0.015);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fragments = useMemo(() => generateFragments(16, 42), []);
  const imageLayouts = useMemo(() => {
    const count = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...DADA_IMAGE_FRAGMENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((image) => {
      const x = 8 + Math.random() * 82;
      const y = 6 + Math.random() * 76;
      const rotate = (Math.random() - 0.5) * 36;
      const scale = 0.85 + Math.random() * 0.35;
      const zIndex = 2 + Math.floor(Math.random() * 2);
      return { ...image, x: `${x}%`, y: `${y}%`, rotate, scale, zIndex };
    });
  }, []);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';

  const paperColor = isDark ? 'rgba(227, 213, 193, 0.06)' : 'rgba(143, 0, 0, 0.04)';
  const strokeColor = isDark ? 'rgba(143, 0, 0, 0.35)' : 'rgba(143, 0, 0, 0.18)';
  const accentColor = isDark ? 'rgba(219, 91, 0, 0.3)' : 'rgba(219, 91, 0, 0.15)';

  const stampPositions = [
    { left: '15%', top: '25%' },
    { right: '12%', top: '45%' },
    { left: '70%', bottom: '35%' },
    { right: '25%', bottom: '22%' },
  ];

  return (
    <motion.div
      className="print:hidden fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Parallax container for mouse-reactive drift ──────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ x: parallaxX, y: parallaxY }}
      >
        {/* ── Cursor inversion halo ──────────────────────────────── */}
        <motion.div
          className="dada-cursor-invert hidden lg:block"
          style={{
            x: cursorX,
            y: cursorY,
          }}
        />

        {/* ── Floating collage fragments ──────────────────────────── */}
        {fragments.map((frag) => (
          <FloatingFragment
            key={frag.id}
            frag={frag}
            isDark={isDark}
            paperColor={paperColor}
            strokeColor={strokeColor}
            accentColor={accentColor}
          />
        ))}

        {/* ── Dada image references — archival collage snippets ───── */}
        {imageLayouts.map((image, i) => (
          <motion.img
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="dada-image-fragment hidden lg:block"
            style={{
              left: image.x,
              top: image.y,
              rotate: `${image.rotate}deg`,
              scale: image.scale,
              zIndex: image.zIndex,
            }}
            custom={i}
            variants={imageVariants}
            animate={{
              y: [0, -10, 0],
              rotate: [image.rotate, image.rotate + (i % 2 === 0 ? 2 : -2), image.rotate],
              scale: [image.scale, image.scale + 0.04, image.scale],
            }}
            transition={{
              duration: 10 + i * 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* ── Scattered typographic fragments ────────────────────── */}
        {DADA_FRAGMENTS.map((frag, i) => (
          <motion.div
            key={`text-${i}`}
            className={`dada-scatter ${frag.size} font-title`}
            style={{
              left: `${8 + (i * 7.2) % 85}%`,
              top: `${12 + ((i * 13.7 + 5) % 75)}%`,
              color: isDark
                ? i % 3 === 0 ? 'rgba(143, 0, 0, 0.28)' : 'rgba(219, 91, 0, 0.22)'
                : i % 3 === 0 ? 'rgba(143, 0, 0, 0.12)' : 'rgba(219, 91, 0, 0.08)',
            }}
            custom={i}
            variants={textVariants}
            animate={{
              opacity: [
                isDark ? 0.28 : 0.12,
                isDark ? 0.12 : 0.04,
                isDark ? 0.28 : 0.12,
              ],
              y: [0, -4, 0],
              x: [0, i % 2 === 0 ? 3 : -3, 0],
            }}
            transition={{
              duration: 6 + (i % 4),
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {frag.text}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Dada ink stamps — bureaucratic absurdist seals ────────── */}
      {STAMPS.map((stamp, i) => (
        <motion.div
          key={`stamp-${i}`}
          className="absolute hidden lg:block"
          style={stampPositions[i]}
          custom={i}
          variants={stampVariants}
          whileHover={{ scale: 1.15, opacity: isDark ? 0.35 : 0.2 }}
        >
          <motion.div
            className="border-2 rounded-full px-4 py-2 font-title italic text-sm font-bold tracking-widest"
            style={{
              borderColor: '#8f0000',
              color: '#8f0000',
              borderStyle: i % 2 === 0 ? 'solid' : 'double',
              boxShadow: isDark
                ? 'inset 0 0 12px rgba(143, 0, 0, 0.15), 0 0 8px rgba(143, 0, 0, 0.08)'
                : 'inset 0 0 6px rgba(143, 0, 0, 0.06)',
              opacity: isDark ? 0.18 : 0.09,
            }}
            animate={{
              rotate: [stamp.rotate, stamp.rotate + 1, stamp.rotate - 0.5, stamp.rotate],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {stamp.text}
          </motion.div>
        </motion.div>
      ))}

      {/* ── Reverse:1999-style compass roses ────────────────────── */}
      <CompassRose isDark={isDark} size={100} x="8%" y="18%" speed={50} />
      <CompassRose isDark={isDark} size={70} x="82%" y="65%" speed={70} />

      {/* ── Reverse:1999-style intersecting planes ──────────────── */}
      <IntersectingPlanes isDark={isDark} x="55%" y="12%" />

      {/* ── Reverse:1999-style rotary dial / clock ──────────────── */}
      <RotaryDial isDark={isDark} x="8%" y="460px" />

      {/* ── Deconstructivist diagonal slash marks ─────────────────── */}
      <motion.svg
        className="absolute top-[15%] right-[8%] w-36 h-36 hidden lg:block"
        viewBox="0 0 120 120"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: isDark ? 0.2 : 0.1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <motion.line
          x1="10" y1="110" x2="110" y2="10"
          stroke="#8f0000" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 1.0, ease: 'easeInOut' }}
        />
        <motion.line
          x1="20" y1="110" x2="110" y2="20"
          stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 1.3, ease: 'easeInOut' }}
        />
        <motion.line
          x1="30" y1="110" x2="110" y2="30"
          stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.5, ease: 'easeInOut' }}
        />
        <motion.line
          x1="10" y1="10" x2="50" y2="50"
          stroke="#8f0000" strokeWidth="0.5" strokeDasharray="4 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 1.7, ease: 'easeInOut' }}
        />
      </motion.svg>

      {/* ── Bottom-left collage corner — overlapping shapes ───────── */}
      <motion.svg
        className="absolute bottom-[460px] left-[5%] w-28 h-24 hidden lg:block"
        viewBox="0 0 90 70"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isDark ? 0.22 : 0.1, x: 0 }}
        transition={{ duration: 1.0, delay: 1.2, ease: 'easeOut' }}
      >
        <motion.rect
          x="5" y="10" width="35" height="25" fill="none"
          stroke="#8f0000" strokeWidth="0.8"
          transform="rotate(-5 22 22)"
          animate={{ rotate: [-5, -4, -5.5, -5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <rect
          x="20" y="20" width="30" height="20" fill={paperColor}
          stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="0.5"
          transform="rotate(3 35 30)"
        />
        <rect
          x="40" y="5" width="25" height="35" fill="none"
          stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.3"
          transform="rotate(-8 52 22)" strokeDasharray="3 4"
        />
        <motion.line
          x1="0" y1="60" x2="85" y2="5"
          stroke="#8f0000" strokeWidth="0.4" opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
        />
      </motion.svg>

      {/* ── Vertical typographic strip (right edge) ───────────────── */}
      <motion.div
        className="absolute right-3 top-[20%] hidden xl:block"
        style={{
          writingMode: 'vertical-rl',
          fontSize: '10px',
          letterSpacing: '0.4em',
          fontFamily: 'var(--font-title)',
          fontStyle: 'italic',
          color: isDark ? 'rgba(143, 0, 0, 0.2)' : 'rgba(143, 0, 0, 0.08)',
          transform: 'rotate(180deg)',
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 1.5, ease: 'easeOut' }}
      >
        DADA·ZÜRICH·1916·CABARET·VOLTAIRE
      </motion.div>

      {/* ── Horizontal collage strip — torn edge divider ──────────── */}
      <motion.div
        className="absolute left-[10%] right-[10%] top-[60%] h-px dada-torn-edge hidden lg:block"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, ${strokeColor}, ${accentColor}, transparent)`,
          transform: 'rotate(-0.8deg)',
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{
          opacity: isDark ? 0.4 : 0.18,
          scaleX: 1,
        }}
        transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
      />

      {/* ── Floating geometric triangles (Reverse:1999 Lucidscape) ─ */}
      <motion.svg
        className="absolute hidden md:block"
        style={{ left: '25%', top: '70%' }}
        width="60"
        height="60"
        viewBox="0 0 60 60"
        initial={{ opacity: 0, rotate: 15 }}
        animate={{ opacity: isDark ? 0.15 : 0.06, rotate: 0 }}
        transition={{ duration: 1.5, delay: 2.0 }}
      >
        <motion.polygon
          points="30,5 55,50 5,50"
          fill="none"
          stroke="#8f0000"
          strokeWidth="0.8"
          animate={{ rotate: [0, 2, -1, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '30px 35px' }}
        />
        <motion.polygon
          points="30,15 45,45 15,45"
          fill="none"
          stroke={isDark ? '#db5b00' : '#a04000'}
          strokeWidth="0.5"
          strokeDasharray="3 4"
          animate={{ rotate: [0, -1.5, 1, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '30px 35px' }}
        />
      </motion.svg>

      {/* ── Reverse:1999-style hourglass ─────────────────────────── */}
      <HourglassSymbol isDark={isDark} x="72%" y="18%" />

      {/* ── Film strip frame ──────────────────────────────────────── */}
      <FilmStrip isDark={isDark} x="12%" y="82%" />

      {/* ── Esoteric all-seeing eye ───────────────────────────────── */}
      <EsotericEye isDark={isDark} x="5%" y="38%" />

      {/* ── Tarot card frame ──────────────────────────────────────── */}
      <TarotFrame isDark={isDark} x="78%" y="120px" />

      {/* ── Pendulum ──────────────────────────────────────────────── */}
      <Pendulum isDark={isDark} x="18%" y="180px" />

      {/* ── Alchemy circle ────────────────────────────────────────── */}
      <AlchemyCircle isDark={isDark} x="38%" y="75%" />

      {/* ── Musical notes (Seine Chronicle) ───────────────────────── */}
      <MusicalNote isDark={isDark} x="88%" y="28%" size={28} />
      <MusicalNote isDark={isDark} x="22%" y="55%" size={22} />

      {/* ── Scattered dot pattern (Seine Chronicle style) ──────────── */}
      <motion.svg
        className="absolute hidden lg:block"
        style={{ right: '15%', top: '30%' }}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.2 : 0.08 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        {Array.from({ length: 16 }, (_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          return (
            <motion.circle
              key={i}
              cx={12 + col * 18}
              cy={12 + row * 18}
              r="1.5"
              fill="#8f0000"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.0 + i * 0.05, duration: 0.3, type: 'spring' }}
            />
          );
        })}
      </motion.svg>
    </motion.div>
  );
}
