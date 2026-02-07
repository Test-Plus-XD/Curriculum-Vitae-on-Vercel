'use client';

import { Children, isValidElement, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { usePageType } from '@/lib/aesthetics';

/**
 * DadaScatterLayout — Deconstructivist entrance animation wrapper.
 * Children start scattered (random displacement, rotation, opacity) and
 * spring into their correct positions on mount/viewport entry.
 *
 * Inspired by Reverse:1999's menu card transitions — elements appear
 * fragmented like a collage, then reassemble into readable order.
 *
 * Only activates on Enhanced pages (projects, education).
 * CV landing page remains unaffected.
 */

interface DadaScatterLayoutProps {
  children: React.ReactNode;
  /** Base stagger delay between children (seconds) */
  stagger?: number;
  /** Initial delay before animation starts */
  delay?: number;
  /** Scatter intensity multiplier (0-1, default 0.8) */
  intensity?: number;
  /** Container className */
  className?: string;
  /** Whether to animate on viewport entry (true) or on mount (false) */
  viewport?: boolean;
  /** Scatter mode: 'standard' for normal displacement, 'collage' for wider displacement */
  mode?: 'standard' | 'collage';
}

/* Seeded pseudo-random for deterministic scatter per child index */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function DadaScatterLayout({
  children,
  stagger = 0.06,
  delay = 0.1,
  intensity = 0.8,
  className = '',
  viewport = true,
  mode = 'standard',
}: DadaScatterLayoutProps) {
  const pageType = usePageType();
  const childArray = Children.toArray(children);

  // Only apply scatter effect on Enhanced pages
  const shouldScatter = pageType === 'enhanced';

  // Determine displacement range based on mode
  const displacementMultiplier = mode === 'collage' ? 400 : 320;

  /* Generate deterministic scatter offsets for each child —
     wide displacement for a truly fragmented Dada collage start */
  const scatterData = useMemo(() => {
    return childArray.map((_, i) => {
      const rx = seededRandom(i * 3 + 1);
      const ry = seededRandom(i * 3 + 2);
      const rr = seededRandom(i * 3 + 3);
      const rs = seededRandom(i * 7);
      const rk = seededRandom(i * 5 + 11);
      return {
        x: (rx - 0.5) * displacementMultiplier * intensity,
        y: (ry - 0.5) * 220 * intensity,
        rotate: (rr - 0.5) * 50 * intensity,
        scale: 0.55 + rs * 0.25,
        skewX: (rk - 0.5) * 18 * intensity,
      };
    });
  }, [childArray.length, intensity, displacementMultiplier]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      {...(viewport
        ? { whileInView: 'visible', viewport: { once: true, margin: '-40px' } }
        : { animate: 'visible' }
      )}
    >
      {childArray.map((child, i) => {
        const scatter = scatterData[i];

        const itemVariants: Variants = shouldScatter
          ? {
            hidden: {
              opacity: 0,
              x: scatter.x,
              y: scatter.y,
              rotate: scatter.rotate,
              scale: scatter.scale,
              skewX: scatter.skewX,
              filter: 'blur(8px)',
            },
            visible: {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              skewX: 0,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 80,
                damping: 13,
                mass: 0.5 + (i % 4) * 0.15,
              },
            },
          }
          : {
            // CV page: simple fade-in without scatter
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.3,
              },
            },
          };

        if (isValidElement(child)) {
          return (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          );
        }

        return (
          <motion.div key={i} variants={itemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
