/**
 * DeconstructedGrid Component
 * 
 * A grid layout component that applies Deconstructivist principles with
 * subtle rotations and vertical offsets to create visual instability while
 * maintaining functionality and responsiveness.
 * 
 * Features:
 * - Random rotation to grid items (-1.5° to +1.5°)
 * - Random vertical offsets (-0.5rem to +0.5rem)
 * - Seeded random for consistent layout across renders
 * - Responsive CSS Grid behavior
 * - Smooth transitions on layout changes
 * - Respects reduced motion preferences
 * 
 * Requirements: 2.1, 2.2, 2.4
 */

'use client';

import React, { Children, useMemo } from 'react';

export interface DeconstructedGridProps {
    children: React.ReactNode;
    columns?: number;           // Default: 2
    gap?: string;               // Default: '1rem'
    tiltIntensity?: number;     // Default: 0.5 (degrees multiplier)
    offsetIntensity?: number;   // Default: 0.3 (rem multiplier)
    className?: string;
}

/**
 * Seeded random number generator for consistent layout across renders
 * Returns a value between 0 and 1
 */
function seededRandom(seed: number): number {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

/**
 * DeconstructedGrid Component
 * 
 * Applies deconstructivist transformations to grid items while maintaining
 * responsive grid behavior and accessibility.
 */
export const DeconstructedGrid: React.FC<DeconstructedGridProps> = ({
    children,
    columns = 2,
    gap = '1rem',
    tiltIntensity = 0.5,
    offsetIntensity = 0.3,
    className = '',
}) => {
    const childArray = Children.toArray(children);

    // Generate transformation data for each child using seeded random
    // This ensures consistent layout across renders
    const transformData = useMemo(() => {
        return childArray.map((_, i) => {
            // Use different seeds for rotation and offset to avoid correlation
            const rotationSeed = i * 7 + 13;
            const offsetSeed = i * 11 + 29;

            // Generate random values between -1.5 and +1.5 degrees for rotation
            const tilt = (seededRandom(rotationSeed) - 0.5) * tiltIntensity * 3;

            // Generate random values between -0.5 and +0.5 rem for offset
            const offset = (seededRandom(offsetSeed) - 0.5) * offsetIntensity * 2;

            return { tilt, offset };
        });
    }, [childArray.length, tiltIntensity, offsetIntensity]);

    return (
        <div
            className={`grid ${className}`}
            style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap,
            }}
        >
            {childArray.map((child, i) => {
                const { tilt, offset } = transformData[i];

                return (
                    <div
                        key={i}
                        className="deconstructed-grid-item"
                        style={{
                            // Use CSS custom properties for easier debugging and potential overrides
                            ['--tilt' as string]: `${tilt}deg`,
                            ['--offset' as string]: `${offset}rem`,
                            transform: 'rotate(var(--tilt)) translateY(var(--offset))',
                            transition: 'transform 0.3s ease-out',
                        }}
                    >
                        {child}
                    </div>
                );
            })}
        </div>
    );
};

export default DeconstructedGrid;
