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
 * DadaCollage — Atmospheric Dada/Deconstructivist decorative layer
 * with Framer Motion animations. Renders floating collage fragments,
 * scattered typography, ink stamps, and diagonal slashes with staggered
 * entrances, parallax drift, and viewport-triggered reveals.
 *
 * Inspired by Reverse:1999, Tristan Tzara, John Heartfield, David Carson.
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
            stroke={isDark ? '#8f0000' : '#8f0000'}
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
            stroke={isDark ? '#8f0000' : '#8f0000'}
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

/* ── Mouse parallax hook ─────────────────────────────────────────── */
function useMouseParallax(strength: number = 0.02) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(useTransform(mouseX, (v) => v * strength), { damping: 30, stiffness: 100 });
  const springY = useSpring(useTransform(mouseY, (v) => v * strength), { damping: 30, stiffness: 100 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY]);

  return { x: springX, y: springY };
}

/* ── Main component ──────────────────────────────────────────────── */
export default function DadaCollage() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { x: parallaxX, y: parallaxY } = useMouseParallax(0.015);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fragments = useMemo(() => generateFragments(16, 42), []);

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
              borderColor: isDark ? '#8f0000' : '#8f0000',
              color: isDark ? '#8f0000' : '#8f0000',
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
          stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="1.5"
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
          stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="0.5" strokeDasharray="4 6"
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
          stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="0.8"
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
          stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="0.4" opacity="0.5"
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
    </motion.div>
  );
}
