/**
 * Example usage of TemporalMotifs component
 * This file demonstrates the various features and configurations
 */

import TemporalMotifs from './TemporalMotifs';

export function BasicExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs />
            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-4">Basic Temporal Motifs</h1>
                <p>Default medium density with all motif types (clock, triangle, gear, star).</p>
            </div>
        </div>
    );
}

export function SparseExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs density="sparse" />
            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-4">Sparse Density</h1>
                <p>Fewer motifs for a cleaner, less busy background.</p>
            </div>
        </div>
    );
}

export function DenseExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs density="dense" />
            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-4">Dense Density</h1>
                <p>More motifs for a richer, more immersive background.</p>
            </div>
        </div>
    );
}

export function ClockOnlyExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs motifs={['clock']} />
            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-4">Clock Motifs Only</h1>
                <p>Only clock motifs for a time-focused aesthetic.</p>
            </div>
        </div>
    );
}

export function GeometricExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs motifs={['triangle', 'star']} />
            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-4">Geometric Motifs</h1>
                <p>Triangles and stars for an arcane, mystical feel.</p>
            </div>
        </div>
    );
}

export function MechanicalExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs motifs={['gear', 'clock']} density="dense" />
            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-4">Mechanical Motifs</h1>
                <p>Gears and clocks for a retro-futuristic machinery aesthetic.</p>
            </div>
        </div>
    );
}

export function StaticExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs animate={false} />
            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-4">Static Motifs</h1>
                <p>Motifs without animation for reduced motion or performance considerations.</p>
            </div>
        </div>
    );
}

export function ScrollParallaxExample() {
    return (
        <div className="relative bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs density="medium" />
            <div className="relative z-10 p-8 space-y-96">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Scroll Parallax Effect</h1>
                    <p>Scroll down to see the parallax effect on the motifs.</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Section 2</h2>
                    <p>Notice how the motifs move at different speeds as you scroll.</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Section 3</h2>
                    <p>The parallax effect creates depth and immersion.</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Section 4</h2>
                    <p>This is the Reverse:1999 aesthetic in action!</p>
                </div>
            </div>
        </div>
    );
}

export function ProjectPageExample() {
    return (
        <div className="relative min-h-screen bg-soviet-warm-bg dark:bg-slate-900">
            <TemporalMotifs density="medium" motifs={['clock', 'triangle', 'gear']} />
            <div className="relative z-10 p-8 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">My Projects</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-2">Project {i}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                A sample project card with temporal motifs in the background.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

