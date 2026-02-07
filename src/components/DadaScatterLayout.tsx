'use client';

import { Children, isValidElement, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';

/**
 * DadaScatterLayout — Deconstructivist entrance animation wrapper.
 * Children start scattered (random displacement, rotation, opacity) and
 * spring into their correct positions on mount/viewport entry.
 *
 * Inspired by Reverse:1999's menu card transitions — elements appear
 * fragmented like a collage, then reassemble into readable order.
 *
 * Does NOT affect the CV landing page (caller decides when to use it).
 */

interface DadaScatterLayoutProps {
  children: React.ReactNode;
  /** Base stagger delay between children (seconds) */
  stagger?: number;
  /** Initial delay before animation starts */
  delay?: number;
  /** Scatter intensity multiplier (0-1, default 0.6) */
  intensity?: number;
  /** Container className */
  className?: string;
  /** Whether to animate on viewport entry (true) or on mount (false) */
  viewport?: boolean;
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
  intensity = 0.6,
  className = '',
  viewport = true,
}: DadaScatterLayoutProps) {
  const childArray = Children.toArray(children);

  /* Generate deterministic scatter offsets for each child */
  const scatterData = useMemo(() => {
    return childArray.map((_, i) => ({
      x: (seededRandom(i * 3 + 1) - 0.5) * 120 * intensity,
      y: (seededRandom(i * 3 + 2) - 0.5) * 80 * intensity,
      rotate: (seededRandom(i * 3 + 3) - 0.5) * 18 * intensity,
      scale: 0.85 + seededRandom(i * 7) * 0.1,
    }));
  }, [childArray.length, intensity]);

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

        const itemVariants: Variants = {
          hidden: {
            opacity: 0,
            x: scatter.x,
            y: scatter.y,
            rotate: scatter.rotate,
            scale: scatter.scale,
            filter: 'blur(3px)',
          },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              stiffness: 120,
              damping: 14,
              mass: 0.6 + (i % 3) * 0.15,
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
