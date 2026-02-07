'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedCard — Motion Primitives wrapper providing 3D tilt effect,
 * spotlight tracking, and entrance animation for cards.
 * Inspired by Atomic Heart's metallic inventory panels and
 * Arknights' blueprint schematic interactions.
 *
 * Tilt is disabled on touch devices to prevent mobile glitching.
 * Overflow is visible to prevent clipping of tilted card borders.
 */
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  enableTilt?: boolean;
  enableSpotlight?: boolean;
}

export default function AnimatedCard({
  children,
  className = '',
  index = 0,
  enableTilt = true,
  enableSpotlight = true,
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltActive = enableTilt && !isTouchDevice;

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    damping: 20,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    damping: 20,
    stiffness: 200,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tiltActive) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);

    if (enableSpotlight && ref.current) {
      ref.current.style.setProperty('--spotlight-x', `${e.clientX - rect.left - 100}px`);
      ref.current.style.setProperty('--spotlight-y', `${e.clientY - rect.top - 100}px`);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`${className} ${enableSpotlight && !isTouchDevice ? 'soviet-spotlight' : ''}`}
      style={{
        rotateX: tiltActive ? rotateX : 0,
        rotateY: tiltActive ? rotateY : 0,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
        overflow: 'visible',
      }}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
