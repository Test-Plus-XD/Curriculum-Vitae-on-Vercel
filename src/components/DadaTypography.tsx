'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

/**
 * DadaTypography — Deconstructivist text treatment inspired by
 * Reverse:1999, Dada movement typography, and David Carson's design.
 *
 * Characters can start scattered and align on viewport entry (`scatterOnView`),
 * then re-scatter on hover with spring physics.
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

export default function DadaTypography({
  text,
  className = '',
  as: Tag = 'h2',
  intensity = 0.7,
  deconstructOnHover = true,
  scatterOnView = false,
}: DadaTypographyProps) {
  const [isScattered, setIsScattered] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const hasAligned = useRef(false);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const settleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setIsScattered(false);
      return;
    }
    if (!scatterOnView) {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTimeout.current = setTimeout(() => setIsScattered(false), 10);
    }
  }, [prefersReduced, scatterOnView]);

  /* Align characters on viewport entry when scatterOnView is enabled */
  useEffect(() => {
    if (prefersReduced) return;
    if (scatterOnView && isInView && !hasAligned.current) {
      hasAligned.current = true;
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTimeout.current = setTimeout(() => setIsScattered(false), 10);
    }
  }, [scatterOnView, isInView, prefersReduced]);

  const displacements = useMemo((): CharDisplacement[] => {
    const intensityBoost = isHovering ? 1.8 : 1;
    const effectiveIntensity = intensity * intensityBoost;
    return text.split('').map((_, i) => {
      const seed = ((i + 1) * 7919) % 100;
      return {
        x: ((seed % 11) - 5) * effectiveIntensity * 3,
        y: ((seed % 7) - 3) * effectiveIntensity * 3.5,
        rotate: ((seed % 13) - 6) * effectiveIntensity * 6,
        scale: 1 + ((seed % 5) - 2) * effectiveIntensity * 0.08,
        colorShift: ((seed % 9) - 4) * effectiveIntensity * 10,
      };
    });
  }, [text, intensity, isHovering]);

  const handleMouseEnter = useCallback(() => {
    if (deconstructOnHover && !prefersReduced) {
      setIsHovering(true);
      setIsScattered(true);
    }
  }, [deconstructOnHover, prefersReduced]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
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

        const d = displacements[i];

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
