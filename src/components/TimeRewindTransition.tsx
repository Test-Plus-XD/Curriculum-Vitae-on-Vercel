'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { usePageType } from '@/lib/aesthetics';

/**
 * TimeRewindTransition — Page transition wrapper with time-rewind effect.
 * 
 * Creates a "time rewinding" animation when navigating between pages:
 * - Exit: Content scales down, fades out, and blurs
 * - Rewind: Scanline sweep moves upward (reverse direction)
 * - Enter: Content scales up from 0.95 with reverse blur clear
 * 
 * Inspired by Reverse:1999's temporal distortion aesthetic.
 * 
 * Features:
 * - Only activates on Enhanced pages (projects, education)
 * - CV landing page remains unaffected
 * - Respects prefers-reduced-motion preference
 * - Limited to 400ms duration for responsiveness
 * - Uses GPU-accelerated properties (transform, opacity, filter)
 */

interface TimeRewindTransitionProps {
    /** Content to wrap with transition effect */
    children: React.ReactNode;
    /** Transition duration in milliseconds (default: 400ms) */
    duration?: number;
    /** Whether transitions are enabled (default: true, disabled on CV page) */
    enabled?: boolean;
}

/**
 * Scanline sweep effect that moves upward during transition
 * Simulates a CRT screen rewinding
 */
function ScanlineSweep({ isExiting }: { isExiting: boolean }) {
    const prefersReduced = useReducedMotion();

    // Don't render scanline if reduced motion is preferred
    if (prefersReduced) {
        return null;
    }

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-[9999]"
            initial={{ opacity: 0 }}
            animate={{
                opacity: isExiting ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-soviet-orange/40 to-transparent"
                style={{
                    boxShadow: '0 0 20px rgba(219, 91, 0, 0.6), 0 0 40px rgba(255, 165, 0, 0.3)',
                    filter: 'blur(2px)',
                }}
                initial={{ top: '100%' }}
                animate={{
                    top: isExiting ? '-5%' : '100%',
                }}
                transition={{
                    duration: 0.4,
                    ease: 'easeInOut',
                }}
            />
        </motion.div>
    );
}

export default function TimeRewindTransition({
    children,
    duration = 400,
    enabled = true,
}: TimeRewindTransitionProps) {
    const pathname = usePathname();
    const pageType = usePageType();
    const prefersReduced = useReducedMotion();

    // Disable transitions on CV page or if explicitly disabled
    const shouldTransition = enabled && pageType === 'enhanced';

    // If reduced motion is preferred or transitions are disabled, render without animation
    if (prefersReduced || !shouldTransition) {
        return <>{children}</>;
    }

    // Convert duration from milliseconds to seconds for Framer Motion
    const durationInSeconds = duration / 1000;

    // Rewind animation variants
    const rewindVariants: Variants = {
        initial: {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(4px)',
        },
        animate: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: durationInSeconds,
                ease: [0.4, 0, 0.2, 1], // cubic-bezier easing
            },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(4px)',
            transition: {
                duration: durationInSeconds,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={pathname}
                    variants={rewindVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{
                        // Use GPU-accelerated properties
                        willChange: 'transform, opacity, filter',
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* Scanline sweep effect during exit */}
            <AnimatePresence>
                {pathname && <ScanlineSweep key={`scanline-${pathname}`} isExiting={true} />}
            </AnimatePresence>
        </>
    );
}
