'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * DadaTypography — Deconstructivist text treatment inspired by
 * Reverse:1999, Dada movement typography, and David Carson's design.
 *
 * On hover, individual characters displace (shift, rotate, scale) with
 * staggered spring physics, colour shifts, and chromatic text shadow
 * creating a vivid "pulled apart" / fragmented typographic effect.
 * Characters settle back on mouse leave with spring physics.
 *
 * Suitable for section headings on education/projects pages.
 */

interface DadaTypographyProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  /** Intensity of displacement (0-1, default 0.7) */
  intensity?: number;
  /** Whether to apply deconstructed effect on hover (default true) */
  deconstructOnHover?: boolean;
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
}: DadaTypographyProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displacements = useMemo((): CharDisplacement[] => {
    return text.split('').map((_, i) => {
      const seed = ((i + 1) * 7919) % 100;
      return {
        x: ((seed % 11) - 5) * intensity * 2.5,
        y: ((seed % 7) - 3) * intensity * 3,
        rotate: ((seed % 13) - 6) * intensity * 5,
        scale: 1 + ((seed % 5) - 2) * intensity * 0.06,
        colorShift: ((seed % 9) - 4) * intensity * 8,
      };
    });
  }, [text, intensity]);

  const handleMouseEnter = useCallback(() => {
    if (deconstructOnHover && !prefersReduced) setIsHovered(true);
  }, [deconstructOnHover, prefersReduced]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

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

        return (
          <motion.span
            key={i}
            className="inline-block origin-center"
            animate={
              isHovered
                ? {
                    x: d.x,
                    y: d.y,
                    rotate: d.rotate,
                    scale: d.scale,
                    filter: `hue-rotate(${d.colorShift}deg)`,
                    textShadow: i % 3 === 0
                      ? '-1px 0 rgba(143,0,0,0.4), 1px 0 rgba(255,165,0,0.3)'
                      : '0 0 4px rgba(219,91,0,0.25)',
                  }
                : {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    filter: 'hue-rotate(0deg)',
                    textShadow: '0 0 0px transparent',
                  }
            }
            transition={{
              type: 'spring',
              stiffness: isHovered ? 120 : 280,
              damping: isHovered ? 10 : 18,
              mass: 0.3 + (i % 3) * 0.1,
              delay: isHovered ? i * 0.02 : i * 0.01,
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
