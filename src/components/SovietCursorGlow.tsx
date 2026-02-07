'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * SovietCursorGlow — Mouse-following radial glow effect inspired by
 * Atomic Heart's holographic polymer glove HUD scanner.
 * Creates a warm red/orange glow that follows the cursor with spring physics.
 * Hidden on the landing CV page and print. Desktop only.
 */
export default function SovietCursorGlow() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div
      ref={glowRef}
      className="print:hidden fixed pointer-events-none z-[997] hidden lg:block"
      aria-hidden="true"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Outer glow — large, diffuse */}
      <div
        className="rounded-full"
        style={{
          width: 300,
          height: 300,
          background: isDark
            ? 'radial-gradient(circle, rgba(219, 91, 0, 0.06) 0%, rgba(143, 0, 0, 0.03) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(143, 0, 0, 0.03) 0%, rgba(219, 91, 0, 0.015) 40%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
      {/* Inner core — focused, brighter */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 60,
          height: 60,
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 165, 0, 0.12) 0%, rgba(219, 91, 0, 0.06) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(143, 0, 0, 0.06) 0%, rgba(219, 91, 0, 0.03) 50%, transparent 100%)',
        }}
      />
    </motion.div>
  );
}
