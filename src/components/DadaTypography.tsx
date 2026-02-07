'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * DadaTypography — Deconstructivist text treatment inspired by
 * Reverse:1999, Dada movement typography, and David Carson's design.
 *
 * On hover, individual characters displace slightly (shift, rotate, scale)
 * creating a "pulled apart" / fragmented typographic effect. Characters
 * settle back on mouse leave with spring physics.
 *
 * Suitable for section headings on education/projects pages.
 */

interface DadaTypographyProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  /** Intensity of displacement (0-1, default 0.6) */
  intensity?: number;
  /** Whether to apply deconstructed effect on hover (default true) */
  deconstructOnHover?: boolean;
}

interface CharDisplacement {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export default function DadaTypography({
  text,
  className = '',
  as: Tag = 'h2',
  intensity = 0.6,
  deconstructOnHover = true,
}: DadaTypographyProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate deterministic displacement values for each character
  const displacements = useMemo((): CharDisplacement[] => {
    return text.split('').map((_, i) => {
      // Pseudo-random based on character index
      const seed = ((i + 1) * 7919) % 100;
      return {
        x: ((seed % 11) - 5) * intensity * 1.5,
        y: ((seed % 7) - 3) * intensity * 2,
        rotate: ((seed % 13) - 6) * intensity * 3,
        scale: 1 + ((seed % 5) - 2) * intensity * 0.04,
      };
    });
  }, [text, intensity]);

  const handleMouseEnter = useCallback(() => {
    if (deconstructOnHover) setIsHovered(true);
  }, [deconstructOnHover]);

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
                    opacity: 0.85 + (i % 3) * 0.05,
                  }
                : {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                  }
            }
            transition={{
              type: 'spring',
              stiffness: isHovered ? 150 : 300,
              damping: isHovered ? 12 : 20,
              mass: 0.4,
              delay: isHovered ? i * 0.015 : i * 0.008,
            }}
            style={{
              display: 'inline-block',
              transformStyle: 'preserve-3d',
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
