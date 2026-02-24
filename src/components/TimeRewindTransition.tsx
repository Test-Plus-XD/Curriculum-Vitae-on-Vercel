'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { usePageType } from '@/lib/aesthetics';

/**
 * TimeRewindTransition — Page transition wrapper with time-rewind effect.
 *
 * Uses `mode="popLayout"` so old and new pages can overlap during transition,
 * eliminating the double-click issue caused by `mode="wait"`.
 * No blur on exit to keep navigation feeling snappy.
 *
 * Inspired by Reverse:1999's temporal distortion aesthetic.
 */

interface TimeRewindTransitionProps {
    children: React.ReactNode;
    duration?: number;
    enabled?: boolean;
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

    // Rewind animation variants — no blur on exit for snappy navigation
    const rewindVariants: Variants = {
        initial: {
            opacity: 0,
            scale: 0.97,
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: durationInSeconds,
                ease: [0.4, 0, 0.2, 1],
            },
        },
        exit: {
            opacity: 0,
            scale: 0.97,
            transition: {
                duration: durationInSeconds * 0.6,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <>
            <AnimatePresence mode="sync" initial={false}>
                <motion.div
                    key={pathname}
                    variants={rewindVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{}}

                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    );
}
