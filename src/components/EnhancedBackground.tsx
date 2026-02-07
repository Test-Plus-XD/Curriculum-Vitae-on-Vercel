'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { usePageType } from '@/lib/aesthetics';

/**
 * EnhancedBackground — Layered background effects for Enhanced pages
 * 
 * Implements Reverse:1999-inspired aesthetic with:
 * - Dark mode: Film grain, scanlines, and subtle patterns
 * - Light mode: Sepia-toned, aged-paper textures
 * - Parallax effect on scroll
 * - CSS gradients and SVG filters (no external images)
 * - Maintains minimum 4.5:1 contrast ratio for text readability
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default function EnhancedBackground() {
    const { resolvedTheme } = useTheme();
    const pageType = usePageType();
    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Parallax effect on scroll
    useEffect(() => {
        if (!mounted || pageType !== 'enhanced') return;

        const handleScroll = () => {
            // Use requestAnimationFrame for smooth performance
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                setScrollY(window.scrollY);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [mounted, pageType]);

    // Only render on enhanced pages
    if (!mounted || pageType !== 'enhanced') return null;

    const isDark = resolvedTheme === 'dark';

    // Calculate parallax offsets (subtle movement)
    const parallaxSlow = scrollY * 0.15;
    const parallaxMedium = scrollY * 0.25;
    const parallaxFast = scrollY * 0.35;

    return (
        <div
            className="print:hidden fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
            style={{ willChange: 'transform' }}
        >
            {/* ═══════════════════════════════════════════════════════════
          DARK MODE LAYERS
          ═══════════════════════════════════════════════════════════ */}
            {isDark && (
                <>
                    {/* Layer 1: Base film grain texture (slowest parallax) */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            transform: `translateY(${parallaxSlow}px)`,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.15'/%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px',
                        }}
                    />

                    {/* Layer 2: Scanline overlay (medium parallax) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            transform: `translateY(${parallaxMedium}px)`,
                            backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.08) 2px,
                rgba(0, 0, 0, 0.08) 4px
              )`,
                            animation: 'flicker 8s step-end infinite',
                        }}
                    />

                    {/* Layer 3: Diagonal constructivist lines (fast parallax) */}
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            transform: `translateY(${parallaxFast}px)`,
                            backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 100px,
                  rgba(219, 91, 0, 0.04) 100px,
                  rgba(219, 91, 0, 0.04) 101px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 140px,
                  rgba(143, 0, 0, 0.03) 140px,
                  rgba(143, 0, 0, 0.03) 141px
                )
              `,
                        }}
                    />

                    {/* Layer 4: Subtle pattern overlay (static) */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(143, 0, 0, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(219, 91, 0, 0.02) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.015) 0%, transparent 60%)
              `,
                        }}
                    />

                    {/* Layer 5: Vignette overlay (static) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 12, 18, 0.5) 100%)',
                        }}
                    />

                    {/* Layer 6: Temporal distortion effect (animated) */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 60px,
                  rgba(219, 91, 0, 0.02) 60px,
                  rgba(219, 91, 0, 0.02) 61px
                )
              `,
                            animation: 'dada-drift 20s ease-in-out infinite',
                        }}
                    />
                </>
            )}

            {/* ═══════════════════════════════════════════════════════════
          LIGHT MODE LAYERS
          ═══════════════════════════════════════════════════════════ */}
            {!isDark && (
                <>
                    {/* Layer 1: Aged paper base texture (slowest parallax) */}
                    <div
                        className="absolute inset-0 opacity-50"
                        style={{
                            transform: `translateY(${parallaxSlow}px)`,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.08' fill='%23e3d5c1'/%3E%3C/svg%3E")`,
                            backgroundSize: '300px 300px',
                        }}
                    />

                    {/* Layer 2: Sepia tone overlay (medium parallax) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            transform: `translateY(${parallaxMedium}px)`,
                            background: `
                linear-gradient(
                  135deg,
                  rgba(227, 213, 193, 0.15) 0%,
                  rgba(245, 239, 230, 0.1) 50%,
                  rgba(227, 213, 193, 0.12) 100%
                )
              `,
                        }}
                    />

                    {/* Layer 3: Subtle scanlines (fast parallax) */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            transform: `translateY(${parallaxFast}px)`,
                            backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(143, 0, 0, 0.02) 3px,
                rgba(143, 0, 0, 0.02) 6px
              )`,
                            animation: 'flicker 12s step-end infinite',
                        }}
                    />

                    {/* Layer 4: Diagonal vintage lines (static) */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 120px,
                  rgba(143, 0, 0, 0.025) 120px,
                  rgba(143, 0, 0, 0.025) 121px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 160px,
                  rgba(219, 91, 0, 0.02) 160px,
                  rgba(219, 91, 0, 0.02) 161px
                )
              `,
                        }}
                    />

                    {/* Layer 5: Warm vignette (static) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(143, 0, 0, 0.08) 100%)',
                        }}
                    />

                    {/* Layer 6: Aged document spots (static) */}
                    <div
                        className="absolute inset-0 opacity-25"
                        style={{
                            backgroundImage: `
                radial-gradient(circle at 15% 20%, rgba(143, 0, 0, 0.04) 0%, transparent 30%),
                radial-gradient(circle at 85% 80%, rgba(219, 91, 0, 0.03) 0%, transparent 35%),
                radial-gradient(circle at 60% 40%, rgba(143, 0, 0, 0.02) 0%, transparent 25%),
                radial-gradient(circle at 30% 70%, rgba(219, 91, 0, 0.025) 0%, transparent 30%)
              `,
                        }}
                    />

                    {/* Layer 7: Subtle paper texture overlay (animated) */}
                    <div
                        className="absolute inset-0 opacity-15"
                        style={{
                            backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 80px,
                  rgba(143, 0, 0, 0.015) 80px,
                  rgba(143, 0, 0, 0.015) 81px
                )
              `,
                            animation: 'dada-drift 25s ease-in-out infinite',
                        }}
                    />
                </>
            )}

            {/* ═══════════════════════════════════════════════════════════
          SHARED LAYERS (Both modes)
          ═══════════════════════════════════════════════════════════ */}

            {/* Temporal distortion grid (very subtle, animated) */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: isDark ? 0.08 : 0.04,
                    backgroundImage: `
            linear-gradient(rgba(143, 0, 0, ${isDark ? 0.12 : 0.06}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143, 0, 0, ${isDark ? 0.12 : 0.06}) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    animation: 'soviet-pulse 8s ease-in-out infinite',
                }}
            />
        </div>
    );
}
