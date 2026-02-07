'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * RetroFuturisticCard — Specialized card component with enhanced retro-futuristic styling
 * 
 * Features:
 * - Layered box-shadows with Soviet color palette
 * - Animated corner brackets that expand on hover
 * - Shimmer sweep effect on hover
 * - Optional holographic rotating border effect
 * - Deconstructivist offset shadow (4px 6px)
 * - Touch device compatibility
 * 
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4
 */

interface RetroFuturisticCardProps {
    children: React.ReactNode;
    className?: string;
    glowIntensity?: 'low' | 'medium' | 'high';
    cornerBrackets?: boolean;
    holographicBorder?: boolean;
    onClick?: () => void;
}

export default function RetroFuturisticCard({
    children,
    className = '',
    glowIntensity = 'medium',
    cornerBrackets = true,
    holographicBorder = false,
    onClick,
}: RetroFuturisticCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Glow intensity mapping
    const glowClasses = {
        low: 'retro-card-glow-low',
        medium: 'retro-card-glow-medium',
        high: 'retro-card-glow-high',
    };

    const handleInteraction = () => {
        if (isTouchDevice) {
            setIsHovered(!isHovered);
        }
    };

    return (
        <motion.div
            ref={cardRef}
            className={`retro-card ${glowClasses[glowIntensity]} ${holographicBorder ? 'retro-card-holographic' : ''
                } ${className}`}
            onClick={onClick}
            onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
            onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
            onTouchStart={handleInteraction}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
                cursor: onClick ? 'pointer' : 'default',
            }}
        >
            {/* Shimmer sweep effect */}
            <div className={`retro-shimmer ${isHovered ? 'retro-shimmer-active' : ''}`} />

            {/* Corner brackets */}
            {cornerBrackets && (
                <>
                    <div className={`corner-bracket corner-bracket-tl ${isHovered ? 'corner-bracket-active' : ''}`} />
                    <div className={`corner-bracket corner-bracket-tr ${isHovered ? 'corner-bracket-active' : ''}`} />
                    <div className={`corner-bracket corner-bracket-bl ${isHovered ? 'corner-bracket-active' : ''}`} />
                    <div className={`corner-bracket corner-bracket-br ${isHovered ? 'corner-bracket-active' : ''}`} />
                </>
            )}

            {/* Content */}
            <div className="retro-card-content">{children}</div>
        </motion.div>
    );
}
