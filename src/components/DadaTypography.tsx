'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

/**
 * DadaTypography — Deconstructivist text treatment inspired by
 * Reverse:1999, Dada movement typography, and David Carson's design.
 *
 * Behaviour:
 * 1. Characters start scattered on page content load.
 * 2. Immediately realign to readable positions with a smooth spring
 *    transition. A failsafe re-fires after 2 rAF frames (~10 ms).
 * 3. On mouse hover they scatter again with random offsets.
 * 4. When the mouse leaves they realign again (same smooth transition).
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
  /** Enable RGB channel separation for chromatic aberration effect (default false) */
  colorShift?: boolean;
}

interface CharDisplacement {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  colorShift: number;
  rotateX: number;
  rotateY: number;
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
    rotateX: rand() * intensity * 8, // Subtle perspective transform
    rotateY: rand() * intensity * 8, // Subtle perspective transform
  }));
}

/**
 * Schedule alignment after 2 rAF frames with a setTimeout failsafe.
 * Returns a cleanup function that cancels both.
 */
function scheduleAlign(callback: () => void): () => void {
  let raf1 = 0;
  let raf2 = 0;
  let timeout = 0;

  // Primary: wait 2 animation frames so the browser has painted the
  // scattered state before we transition to aligned.
  raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => {
      callback();
    });
  });

  // Failsafe: if rAF is delayed (background tab, slow paint) fire
  // after 10 ms anyway so the text never stays scattered.
  timeout = window.setTimeout(() => {
    callback();
  }, 10);

  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
    clearTimeout(timeout);
  };
}

export default function DadaTypography({
  text,
  className = '',
  as: Tag = 'h2',
  intensity = 0.7,
  deconstructOnHover = true,
  scatterOnView = false,
  colorShift = false,
}: DadaTypographyProps) {
  const [isScattered, setIsScattered] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const hasAligned = useRef(false);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const cleanupRef = useRef<(() => void) | null>(null);
  const scatterSeed = useRef(42);

  // Constants for scatter intensity - updated per requirements
  const INITIAL_SCATTER_INTENSITY = 0.1; // Decreased from 0.25 to 0.1
  const HOVER_SCATTER_MULTIPLIER = 2.2; // Increased from 1.8 to 2.2

  // Displacements use a ref-based seed so hover re-scatter gets new random values
  // Initial scatter uses reduced intensity for readability
  const [displacements, setDisplacements] = useState<CharDisplacement[]>(() =>
    generateDisplacements(text.length, intensity * INITIAL_SCATTER_INTENSITY, scatterSeed.current),
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  // Re-generate displacements when text changes
  useEffect(() => {
    setDisplacements(generateDisplacements(text.length, intensity * INITIAL_SCATTER_INTENSITY, scatterSeed.current));
  }, [text, intensity, INITIAL_SCATTER_INTENSITY]);

  // ── Initial alignment logic ──────────────────────────────────────
  // Scatter is the initial state. As soon as we mount, schedule alignment
  // after 2 rAF frames so the browser has painted the scattered position
  // and Framer Motion can animate the transition smoothly.
  useEffect(() => {
    if (prefersReduced) {
      setIsScattered(false);
      return;
    }
    if (!scatterOnView) {
      cleanupRef.current?.();
      cleanupRef.current = scheduleAlign(() => setIsScattered(false));
    }
  }, [prefersReduced, scatterOnView]);

  // ── Align on viewport entry (scatterOnView mode) ────────────────
  useEffect(() => {
    if (prefersReduced) return;
    if (scatterOnView && isInView && !hasAligned.current) {
      hasAligned.current = true;
      cleanupRef.current?.();
      cleanupRef.current = scheduleAlign(() => setIsScattered(false));
    }
  }, [scatterOnView, isInView, prefersReduced]);

  const handleMouseEnter = useCallback(() => {
    if (deconstructOnHover && !prefersReduced) {
      // Cancel any pending alignment so hover scatter isn't immediately undone
      cleanupRef.current?.();
      cleanupRef.current = null;
      // New random seed each hover for unique scatter
      scatterSeed.current = Date.now() % 2147483647;
      setDisplacements(generateDisplacements(text.length, intensity * HOVER_SCATTER_MULTIPLIER, scatterSeed.current));
      setIsScattered(true);
    }
  }, [deconstructOnHover, prefersReduced, text.length, intensity, HOVER_SCATTER_MULTIPLIER]);

  const handleMouseLeave = useCallback(() => {
    if (prefersReduced) {
      setIsScattered(false);
      return;
    }
    cleanupRef.current?.();
    cleanupRef.current = scheduleAlign(() => setIsScattered(false));
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

        const d = displacements[i] ?? { x: 0, y: 0, rotate: 0, scale: 1, colorShift: 0, rotateX: 0, rotateY: 0 };

        // Limit initial scatter to maximum 2px shift
        const maxInitialShift = 2;
        const isInitialScatter = intensity * INITIAL_SCATTER_INTENSITY < 0.15;
        const clampedX = isInitialScatter ? Math.max(-maxInitialShift, Math.min(maxInitialShift, d.x)) : d.x;
        const clampedY = isInitialScatter ? Math.max(-maxInitialShift, Math.min(maxInitialShift, d.y)) : d.y;

        // RGB channel separation for chromatic aberration effect
        const rgbSeparation = colorShift && isScattered
          ? `drop-shadow(-1px 0 0 rgba(255, 0, 0, 0.5)) drop-shadow(1px 0 0 rgba(0, 255, 255, 0.5))`
          : '';

        const scatteredState = {
          x: clampedX,
          y: clampedY,
          rotate: d.rotate,
          rotateX: d.rotateX,
          rotateY: d.rotateY,
          scale: d.scale,
          filter: `hue-rotate(${d.colorShift}deg) ${rgbSeparation}`,
          textShadow: i % 3 === 0
            ? '-1px 0 rgba(143,0,0,0.4), 1px 0 rgba(255,165,0,0.3)'
            : '0 0 4px rgba(219,91,0,0.25)',
        };

        const alignedState = {
          x: 0,
          y: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: 'hue-rotate(0deg)',
          textShadow: '0 0 0px transparent',
        };

        // Staggered reassembly with wave pattern (center-out)
        const centerIndex = Math.floor(text.length / 2);
        const distanceFromCenter = Math.abs(i - centerIndex);
        const waveDelay = isScattered ? i * 0.02 : distanceFromCenter * 0.015;

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
              delay: waveDelay,
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
