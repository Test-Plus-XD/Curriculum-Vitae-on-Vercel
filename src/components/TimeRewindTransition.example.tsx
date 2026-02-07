/**
 * TimeRewindTransition Component Examples
 * 
 * Demonstrates various usage patterns for the TimeRewindTransition component.
 */

import TimeRewindTransition from './TimeRewindTransition';

/**
 * Example 1: Basic Usage
 * Wrap page content with default settings (400ms duration, auto-detect page type)
 */
export function BasicExample() {
    return (
        <TimeRewindTransition>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">Project Page</h1>
                <p>This content will have a time-rewind transition when navigating.</p>
            </div>
        </TimeRewindTransition>
    );
}

/**
 * Example 2: Custom Duration
 * Use a faster transition (300ms) for snappier navigation
 */
export function CustomDurationExample() {
    return (
        <TimeRewindTransition duration={300}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">Fast Transition</h1>
                <p>This page uses a 300ms transition for quicker navigation.</p>
            </div>
        </TimeRewindTransition>
    );
}

/**
 * Example 3: Explicitly Disabled
 * Disable transitions for specific pages or conditions
 */
export function DisabledExample() {
    const shouldDisable = true; // Could be based on user preference

    return (
        <TimeRewindTransition enabled={!shouldDisable}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">No Transition</h1>
                <p>This page has transitions disabled.</p>
            </div>
        </TimeRewindTransition>
    );
}

/**
 * Example 4: Layout Integration
 * Typical usage in a Next.js layout file
 */
export function LayoutExample({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-soviet-warm-bg dark:bg-gray-900">
            <header className="border-b border-soviet-red/20">
                <nav className="container mx-auto px-4 py-4">
                    {/* Navigation content */}
                </nav>
            </header>

            <main>
                <TimeRewindTransition>
                    {children}
                </TimeRewindTransition>
            </main>

            <footer className="border-t border-soviet-red/20 mt-12">
                <div className="container mx-auto px-4 py-6">
                    {/* Footer content */}
                </div>
            </footer>
        </div>
    );
}

/**
 * Example 5: With Other Aesthetic Components
 * Combine with other Reverse:1999 aesthetic components
 */
export function CombinedAestheticsExample() {
    return (
        <TimeRewindTransition>
            <div className="container mx-auto px-4 py-8">
                {/* TimeRewindTransition handles page transitions */}
                {/* Other components handle their own animations */}
                <h1 className="text-4xl font-bold mb-6 glow-heading">
                    Temporal Aesthetics
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glow-card p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Card 1</h2>
                        <p>Content with retro-futuristic styling</p>
                    </div>

                    <div className="glow-card p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Card 2</h2>
                        <p>More temporal content</p>
                    </div>
                </div>
            </div>
        </TimeRewindTransition>
    );
}

/**
 * Example 6: Conditional Rendering Based on Page Type
 * Show different content based on whether transitions are active
 */
export function ConditionalExample() {
    return (
        <TimeRewindTransition>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">
                    Enhanced Page
                </h1>
                <p className="text-lg mb-4">
                    This page has time-rewind transitions enabled.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Note: Transitions are automatically disabled on the CV landing page
                    and when users have prefers-reduced-motion enabled.
                </p>
            </div>
        </TimeRewindTransition>
    );
}

/**
 * Example 7: Performance Considerations
 * The component uses GPU-accelerated properties for optimal performance
 */
export function PerformanceExample() {
    return (
        <TimeRewindTransition duration={400}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">Performance Optimized</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>
                        TimeRewindTransition uses only GPU-accelerated properties:
                    </p>
                    <ul>
                        <li><code>transform</code> - for scale animations</li>
                        <li><code>opacity</code> - for fade effects</li>
                        <li><code>filter</code> - for blur effects</li>
                    </ul>
                    <p>
                        This ensures smooth 60fps transitions on modern devices without
                        triggering expensive layout recalculations.
                    </p>
                </div>
            </div>
        </TimeRewindTransition>
    );
}

/**
 * Example 8: Accessibility Features
 * Demonstrates built-in accessibility support
 */
export function AccessibilityExample() {
    return (
        <TimeRewindTransition>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">Accessibility Built-In</h1>
                <div className="space-y-4">
                    <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <h2 className="font-semibold mb-2">✓ Reduced Motion Support</h2>
                        <p>
                            Automatically respects <code>prefers-reduced-motion</code> media query.
                            Users who prefer reduced motion will see instant page changes.
                        </p>
                    </div>

                    <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <h2 className="font-semibold mb-2">✓ CV Page Protection</h2>
                        <p>
                            Transitions are automatically disabled on the CV landing page
                            to maintain professional appearance.
                        </p>
                    </div>

                    <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <h2 className="font-semibold mb-2">✓ Non-Obstructive</h2>
                        <p>
                            Scanline effects use <code>pointer-events: none</code> to ensure
                            they never interfere with user interactions.
                        </p>
                    </div>
                </div>
            </div>
        </TimeRewindTransition>
    );
}
