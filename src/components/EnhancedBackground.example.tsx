/**
 * EnhancedBackground Component Examples
 * 
 * This file demonstrates how to use the EnhancedBackground component
 * in various scenarios within the Reverse:1999 aesthetic enhancement.
 */

import EnhancedBackground from './EnhancedBackground';

/**
 * Example 1: Basic Usage in a Page Layout
 * 
 * The EnhancedBackground component automatically detects if it's on an
 * enhanced page (projects, education) and only renders there.
 */
export function BasicUsageExample() {
    return (
        <div className="relative min-h-screen">
            {/* Background renders behind all content */}
            <EnhancedBackground />

            {/* Your page content */}
            <main className="relative z-10 container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">Projects</h1>
                <p className="text-lg">
                    The enhanced background provides layered textures and parallax effects
                    that create depth and atmosphere without compromising readability.
                </p>
            </main>
        </div>
    );
}

/**
 * Example 2: Integration with Existing Layout
 * 
 * The component works seamlessly with existing layouts and components.
 * It respects the CV page protection and only renders on enhanced pages.
 */
export function LayoutIntegrationExample() {
    return (
        <div className="relative min-h-screen">
            {/* Enhanced background (auto-detects page type) */}
            <EnhancedBackground />

            {/* Existing layout components */}
            <div className="relative z-10">
                <header className="py-6">
                    <nav className="container mx-auto">
                        {/* Navigation content */}
                    </nav>
                </header>

                <main className="container mx-auto px-4 py-12">
                    {/* Main content with proper contrast */}
                    <article className="prose dark:prose-invert max-w-none">
                        <h1>Enhanced Page Content</h1>
                        <p>
                            The background maintains a minimum 4.5:1 contrast ratio,
                            ensuring text remains readable in both light and dark modes.
                        </p>
                    </article>
                </main>

                <footer className="py-8 mt-12">
                    {/* Footer content */}
                </footer>
            </div>
        </div>
    );
}

/**
 * Example 3: Dark Mode Behavior
 * 
 * In dark mode, the background features:
 * - Film grain texture
 * - Scanlines with flicker animation
 * - Diagonal constructivist lines
 * - Subtle pattern overlays
 * - Vignette effect
 * - Temporal distortion grid
 */
export function DarkModeExample() {
    return (
        <div className="dark relative min-h-screen bg-[#141821]">
            <EnhancedBackground />

            <main className="relative z-10 container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-soviet-beige mb-6 glow-heading">
                    Dark Mode Enhanced Background
                </h1>
                <p className="text-soviet-beige/90 text-lg leading-relaxed">
                    The dark mode background creates an atmospheric, retro-futuristic
                    environment with layered textures and subtle animations. All effects
                    use GPU-accelerated properties for smooth 60fps performance.
                </p>
            </main>
        </div>
    );
}

/**
 * Example 4: Light Mode Behavior
 * 
 * In light mode, the background features:
 * - Aged paper texture
 * - Sepia tone overlay
 * - Subtle scanlines
 * - Vintage diagonal lines
 * - Warm vignette
 * - Document aging spots
 * - Paper texture overlay
 */
export function LightModeExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg">
            <EnhancedBackground />

            <main className="relative z-10 container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-soviet-red mb-6">
                    Light Mode Enhanced Background
                </h1>
                <p className="text-gray-800 text-lg leading-relaxed">
                    The light mode background evokes aged documents and vintage paper,
                    with sepia tones and subtle textures that create a warm, nostalgic
                    atmosphere while maintaining excellent readability.
                </p>
            </main>
        </div>
    );
}

/**
 * Example 5: Parallax Effect Demonstration
 * 
 * The background layers move at different speeds when scrolling,
 * creating a sense of depth through parallax.
 */
export function ParallaxExample() {
    return (
        <div className="relative min-h-[300vh]">
            <EnhancedBackground />

            <main className="relative z-10 container mx-auto px-4 py-12">
                <section className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">Scroll Down</h1>
                        <p className="text-xl">
                            Notice how the background layers move at different speeds
                        </p>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-6">Parallax in Action</h2>
                        <p className="text-lg max-w-2xl mx-auto">
                            The slowest layer (film grain/paper texture) moves at 0.15x scroll speed.
                            The medium layer (scanlines/sepia) moves at 0.25x scroll speed.
                            The fastest layer (diagonal lines) moves at 0.35x scroll speed.
                        </p>
                    </div>
                </section>

                <section className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-6">Depth Perception</h2>
                        <p className="text-lg max-w-2xl mx-auto">
                            This creates a subtle 3D effect that adds visual interest
                            without being distracting or affecting readability.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

/**
 * Example 6: Performance Considerations
 * 
 * The component is optimized for performance:
 * - Uses requestAnimationFrame for smooth scrolling
 * - GPU-accelerated transforms (translateY)
 * - Passive scroll listeners
 * - Cleanup on unmount
 * - Only renders on enhanced pages
 */
export function PerformanceExample() {
    return (
        <div className="relative min-h-screen">
            <EnhancedBackground />

            <main className="relative z-10 container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-6">Performance Optimized</h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">GPU Acceleration</h2>
                        <p>
                            All animations use transform and opacity properties,
                            which are GPU-accelerated for smooth 60fps performance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Efficient Scrolling</h2>
                        <p>
                            Scroll events use requestAnimationFrame to batch updates
                            and passive listeners to avoid blocking the main thread.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Conditional Rendering</h2>
                        <p>
                            The component only renders on enhanced pages (projects, education),
                            keeping the CV page clean and professional.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}

/**
 * Example 7: Accessibility Compliance
 * 
 * The component maintains accessibility standards:
 * - Marked with aria-hidden (decorative only)
 * - pointer-events: none (doesn't interfere with interactions)
 * - Maintains 4.5:1 contrast ratio for text
 * - Respects print styles (hidden when printing)
 */
export function AccessibilityExample() {
    return (
        <div className="relative min-h-screen">
            <EnhancedBackground />

            <main className="relative z-10 container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-6">Accessibility First</h1>

                <div className="space-y-4">
                    <p className="text-lg">
                        <strong>Decorative Only:</strong> The background is marked with
                        aria-hidden="true" so screen readers ignore it.
                    </p>

                    <p className="text-lg">
                        <strong>Non-Interactive:</strong> pointer-events: none ensures
                        the background doesn't interfere with clicking or tapping.
                    </p>

                    <p className="text-lg">
                        <strong>High Contrast:</strong> All text maintains a minimum
                        4.5:1 contrast ratio against the background.
                    </p>

                    <p className="text-lg">
                        <strong>Print Friendly:</strong> The background is hidden when
                        printing, ensuring clean, professional output.
                    </p>
                </div>
            </main>
        </div>
    );
}

/**
 * Example 8: CV Page Protection
 * 
 * The component automatically detects the CV page and doesn't render there,
 * maintaining the professional, clean appearance required for resumes.
 */
export function CVPageProtectionExample() {
    // On CV page (e.g., /en or /zh-hk):
    // - EnhancedBackground returns null
    // - No background effects applied
    // - Clean, professional styling maintained

    return (
        <div className="relative min-h-screen bg-white dark:bg-gray-900">
            {/* This will NOT render on CV page */}
            <EnhancedBackground />

            <main className="relative z-10 container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-6">CV Page</h1>
                <p className="text-lg">
                    On the CV landing page, the EnhancedBackground component
                    automatically detects the page type and returns null,
                    ensuring no aesthetic effects are applied.
                </p>
            </main>
        </div>
    );
}
