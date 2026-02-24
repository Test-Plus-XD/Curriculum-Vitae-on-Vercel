'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef, useCallback } from 'react';
import { usePageType } from '@/lib/aesthetics';

/**
 * EnhancedBackground — Parallax background effects unique to Enhanced pages.
 *
 * Only renders layers that do NOT duplicate SovietBackground
 * (grid, diagonals, grain, vignette, scanlines are already handled there).
 * Provides parallax-moving textures and aged-paper effects.
 *
 * Uses CSS custom properties for parallax instead of React state to avoid
 * re-renders on every scroll frame. Only updates the DOM via CSS variables.
 */
export default function EnhancedBackground() {
    const { resolvedTheme } = useTheme();
    const pageType = usePageType();
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Parallax via CSS custom properties — no React re-renders
    const updateParallax = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const y = window.scrollY;
        el.style.setProperty('--parallax-slow', `${y * 0.15}px`);
        el.style.setProperty('--parallax-med', `${y * 0.25}px`);
    }, []);

    useEffect(() => {
        if (!mounted || pageType !== 'enhanced') return;

        const handleScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateParallax);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateParallax(); // set initial values
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [mounted, pageType, updateParallax]);

    if (!mounted || pageType !== 'enhanced') return null;

    const isDark = resolvedTheme === 'dark';

    return (
        <div
            ref={containerRef}
            className="print:hidden fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        >
            {/* ═══════════════════════════════════════════════════════════
          DARK MODE — unique parallax layers only
          ═══════════════════════════════════════════════════════════ */}
            {isDark && (
                <>
                    {/* Parallax film grain texture (slow) */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            transform: 'translateY(var(--parallax-slow, 0px))',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.15'/%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px',
                        }}
                    />

                    {/* Subtle colour pools (static, no duplicate) */}
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

                    {/* Temporal distortion lines (animated, unique to enhanced) */}
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
          LIGHT MODE — unique parallax layers only
          ═══════════════════════════════════════════════════════════ */}
            {!isDark && (
                <>
                    {/* Parallax aged paper texture (slow) */}
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{
                            transform: 'translateY(var(--parallax-slow, 0px))',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.08' fill='%23e3d5c1'/%3E%3C/svg%3E")`,
                            backgroundSize: '300px 300px',
                        }}
                    />

                    {/* Sepia tone overlay (medium parallax) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            transform: 'translateY(var(--parallax-med, 0px))',
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

                    {/* Aged document spots (static) */}
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
                </>
            )}
        </div>
    );
}
