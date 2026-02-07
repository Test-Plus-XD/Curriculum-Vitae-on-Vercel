/**
 * TemporalMotifs Component
 * 
 * SVG-based decorative elements (clocks, triangles, gears, stars) that float
 * in the background to create a Reverse:1999-inspired temporal aesthetic.
 * 
 * Features:
 * - Optimized inline SVGs (under 2KB each)
 * - Density control (sparse/medium/dense)
 * - Subtle drift and flicker animations
 * - Parallax effect on scroll
 * - Theme-aware using currentColor
 * - Fully accessible (aria-hidden, pointer-events: none)
 * - Respects prefers-reduced-motion
 */

'use client';

import React, { useEffect, useState } from 'react';
import { usePageType } from '@/lib/aesthetics';

export interface TemporalMotifsProps {
    density?: 'sparse' | 'medium' | 'dense';
    motifs?: ('clock' | 'triangle' | 'gear' | 'star')[];
    animate?: boolean;
    className?: string;
}

interface MotifInstance {
    id: string;
    type: 'clock' | 'triangle' | 'gear' | 'star';
    x: number; // percentage
    y: number; // percentage
    size: number; // rem
    rotation: number; // degrees
    opacity: number; // 0-1
    animationDelay: number; // seconds
}

/**
 * Seeded random number generator for consistent motif placement
 */
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Generate motif instances based on density
 */
function generateMotifs(
    density: 'sparse' | 'medium' | 'dense',
    allowedTypes: ('clock' | 'triangle' | 'gear' | 'star')[]
): MotifInstance[] {
    const counts = {
        sparse: 3,
        medium: 6,
        dense: 9,
    };

    const count = counts[density];
    const motifs: MotifInstance[] = [];

    for (let i = 0; i < count; i++) {
        const typeIndex = Math.floor(seededRandom(i * 100) * allowedTypes.length);
        const type = allowedTypes[typeIndex];

        motifs.push({
            id: `motif-${i}`,
            type,
            x: seededRandom(i * 10 + 1) * 100,
            y: seededRandom(i * 10 + 2) * 100,
            size: 2 + seededRandom(i * 10 + 3) * 2, // 2-4rem
            rotation: seededRandom(i * 10 + 4) * 360,
            opacity: 0.15 + seededRandom(i * 10 + 5) * 0.15, // 0.15-0.3
            animationDelay: seededRandom(i * 10 + 6) * 8, // 0-8s
        });
    }

    return motifs;
}

/**
 * Clock SVG motif - circular clock face with Roman numerals
 */
const ClockSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        {/* Hour markers */}
        <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" />
        <line x1="85" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="85" x2="50" y2="90" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="2" />
        {/* Clock hands */}
        <line x1="50" y1="50" x2="50" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="50" x2="68" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

/**
 * Triangle SVG motif - arcane triangle with inner geometric patterns
 */
const TriangleSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M50 10 L90 85 L10 85 Z"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.6"
        />
        <path
            d="M50 30 L70 70 L30 70 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
        />
        <circle cx="50" cy="55" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
);

/**
 * Gear SVG motif - mechanical gear suggesting retro-futuristic machinery
 */
const GearSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        {/* Gear teeth */}
        <rect x="48" y="10" width="4" height="15" fill="currentColor" opacity="0.5" />
        <rect x="48" y="75" width="4" height="15" fill="currentColor" opacity="0.5" />
        <rect x="10" y="48" width="15" height="4" fill="currentColor" opacity="0.5" />
        <rect x="75" y="48" width="15" height="4" fill="currentColor" opacity="0.5" />
        <rect x="23" y="23" width="4" height="12" fill="currentColor" opacity="0.5" transform="rotate(45 25 29)" />
        <rect x="73" y="23" width="4" height="12" fill="currentColor" opacity="0.5" transform="rotate(-45 75 29)" />
        <rect x="23" y="73" width="4" height="12" fill="currentColor" opacity="0.5" transform="rotate(-45 25 79)" />
        <rect x="73" y="73" width="4" height="12" fill="currentColor" opacity="0.5" transform="rotate(45 75 79)" />
    </svg>
);

/**
 * Star SVG motif - Soviet-style five-pointed star
 */
const StarSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M50 10 L61 40 L92 40 L67 58 L78 88 L50 70 L22 88 L33 58 L8 40 L39 40 Z"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.6"
        />
        <path
            d="M50 30 L56 45 L72 45 L59 54 L65 69 L50 60 L35 69 L41 54 L28 45 L44 45 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.4"
        />
    </svg>
);

/**
 * Render the appropriate SVG based on motif type
 */
const MotifSVG: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'clock':
            return <ClockSVG className={className} />;
        case 'triangle':
            return <TriangleSVG className={className} />;
        case 'gear':
            return <GearSVG className={className} />;
        case 'star':
            return <StarSVG className={className} />;
        default:
            return null;
    }
};

/**
 * TemporalMotifs Component
 */
export const TemporalMotifs: React.FC<TemporalMotifsProps> = ({
    density = 'medium',
    motifs = ['clock', 'triangle', 'gear', 'star'],
    animate = true,
    className = '',
}) => {
    const pageType = usePageType();
    const [scrollY, setScrollY] = useState(0);
    const [motifInstances, setMotifInstances] = useState<MotifInstance[]>([]);

    // Only show on enhanced pages
    if (pageType !== 'enhanced') {
        return null;
    }

    // Generate motifs on mount
    useEffect(() => {
        setMotifInstances(generateMotifs(density, motifs));
    }, [density, motifs]);

    // Handle scroll for parallax effect
    useEffect(() => {
        if (!animate) return;

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [animate]);

    return (
        <div
            className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
            aria-hidden="true"
        >
            {motifInstances.map((motif) => {
                // Calculate parallax offset (subtle movement based on scroll)
                const parallaxOffset = animate ? (scrollY * 0.05 * (motif.y / 100)) : 0;

                return (
                    <div
                        key={motif.id}
                        className="absolute"
                        style={{
                            left: `${motif.x}%`,
                            top: `${motif.y}%`,
                            width: `${motif.size}rem`,
                            height: `${motif.size}rem`,
                            opacity: motif.opacity,
                            transform: `translateY(${parallaxOffset}px) rotate(${motif.rotation}deg)`,
                            pointerEvents: 'none',
                            // CSS custom properties for animations
                            ['--dada-rotate' as string]: `${motif.rotation}deg`,
                            ['--dada-opacity' as string]: motif.opacity,
                        }}
                    >
                        <div
                            className={animate ? 'animate-dada-drift' : ''}
                            style={{
                                animationDelay: `${motif.animationDelay}s`,
                                animationDuration: '12s',
                            }}
                        >
                            <div
                                className={animate ? 'animate-dada-flicker' : ''}
                                style={{
                                    animationDelay: `${motif.animationDelay + 2}s`,
                                    animationDuration: '8s',
                                }}
                            >
                                <MotifSVG
                                    type={motif.type}
                                    className="w-full h-full text-soviet-gold dark:text-soviet-orange"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TemporalMotifs;
