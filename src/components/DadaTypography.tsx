'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

/**
 * DadaTypography — Deconstructivist text treatment inspired by
 * Reverse:1999, Dada movement typography, and David Carson's design.
 *
 * Behaviour:
 * 1. Characters start scattered on page load / viewport entry.
 * 2. After one frame (~10 ms) they realign with a smooth spring transition.
 * 3. On mouse hover they scatter again with random offsets.
 * 4. When the mouse leaves they realign again.
 *
 * Suitable for all titles on education/projects pages.
 */

interface DadaTypographyProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  /** Intensity of displacement (0-1, default 0.7) */
  intensity?: number;
  /** Whether to apply deconstructed effect on hover (default true) */
  deconstructOnHover?: boolean;
  /** Start scattered and align when entering viewport (default false) */
  scatterOnView?: boolean;
}

interface CharDisplacement {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  colorShift: number;
}

/** Generate a set of random displacements for each character. */
function generateDisplacements(
  length: number,
  intensity: number,
  seed: number,
): CharDisplacement[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 11) % 2147483647;
    return (s / 2147483647) * 2 - 1; // -1 to 1
  };
  return Array.from({ length }, () => ({
    x: rand() * intensity * 18,
    y: rand() * intensity * 16,
    rotate: rand() * intensity * 18,
    scale: 1 + rand() * intensity * 0.1,
    colorShift: rand() * intensity * 15,
  }));
}

export default function DadaTypography({
  text,
  className = '',
  as: Tag = 'h2',
  intensity = 0.7,
  deconstructOnHover = true,
  scatterOnView = false,
}: DadaTypographyProps) {
  const [isScattered, setIsScattered] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const hasAligned = useRef(false);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const settleTimeout = useRef<NodeJS.Timeout | null>(null);
  const scatterSeed = useRef(42);

  // Displacements use a ref-based seed so hover re-scatter gets new random values
  const [displacements, setDisplacements] = useState<CharDisplacement[]>(() =>
    generateDisplacements(text.length, intensity, scatterSeed.current),
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
    };
  }, []);

  // Re-generate displacements when text changes
  useEffect(() => {
    setDisplacements(generateDisplacements(text.length, intensity, scatterSeed.current));
  }, [text, intensity]);

  // ── Initial alignment logic ──────────────────────────────────────
  useEffect(() => {
    if (prefersReduced) {
      setIsScattered(false);
      return;
    }
    // When NOT scatterOnView, scatter on mount then align after a frame
    if (!scatterOnView) {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTimeout.current = setTimeout(() => setIsScattered(false), 10);
    }
  }, [prefersReduced, scatterOnView]);

  // ── Align on viewport entry (scatterOnView mode) ────────────────
  useEffect(() => {
    if (prefersReduced) return;
    if (scatterOnView && isInView && !hasAligned.current) {
      hasAligned.current = true;
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTimeout.current = setTimeout(() => setIsScattered(false), 10);
    }
  }, [scatterOnView, isInView, prefersReduced]);

  const handleMouseEnter = useCallback(() => {
    if (deconstructOnHover && !prefersReduced) {
      // New random seed each hover for unique scatter
      scatterSeed.current = Date.now() % 2147483647;
      setDisplacements(generateDisplacements(text.length, intensity * 1.8, scatterSeed.current));
      setIsScattered(true);
    }
  }, [deconstructOnHover, prefersReduced, text.length, intensity]);

  const handleMouseLeave = useCallback(() => {
    if (prefersReduced) {
      setIsScattered(false);
      return;
    }
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    settleTimeout.current = setTimeout(() => setIsScattered(false), 10);
  }, [prefersReduced]);

  if (!mounted) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      ref={containerRef}
      className={`${className} inline-flex flex-wrap cursor-default`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '600px' }}
      whileHover={!prefersReduced ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {text.split('').map((char, i) => {
        if (char === ' ') {
          return (
            <span key={i} className="inline-block" style={{ width: '0.25em' }}>
              &nbsp;
            </span>
          );
        }

        const d = displacements[i] ?? { x: 0, y: 0, rotate: 0, scale: 1, colorShift: 0 };

        const scatteredState = {
          x: d.x,
          y: d.y,
          rotate: d.rotate,
          scale: d.scale,
          filter: `hue-rotate(${d.colorShift}deg)`,
          textShadow: i % 3 === 0
            ? '-1px 0 rgba(143,0,0,0.4), 1px 0 rgba(255,165,0,0.3)'
            : '0 0 4px rgba(219,91,0,0.25)',
        };

        const alignedState = {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          filter: 'hue-rotate(0deg)',
          textShadow: '0 0 0px transparent',
        };

        return (
          <motion.span
            key={i}
            className="inline-block origin-center"
            initial={prefersReduced ? alignedState : scatteredState}
            animate={isScattered ? scatteredState : alignedState}
            transition={{
              type: 'spring',
              stiffness: isScattered ? 120 : 280,
              damping: isScattered ? 10 : 18,
              mass: 0.3 + (i % 3) * 0.1,
              delay: isScattered ? i * 0.02 : i * 0.015,
            }}
            style={{
              display: 'inline-block',
              transformStyle: 'preserve-3d',
              willChange: 'transform, filter',
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
