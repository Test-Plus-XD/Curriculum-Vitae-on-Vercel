/**
 * Example usage of RetroFuturisticCard component
 * This file demonstrates the various features and configurations
 */

import RetroFuturisticCard from './RetroFuturisticCard';

export function BasicExample() {
    return (
        <RetroFuturisticCard>
            <h3>Basic Retro Card</h3>
            <p>This card has default settings with medium glow and corner brackets.</p>
        </RetroFuturisticCard>
    );
}

export function LowGlowExample() {
    return (
        <RetroFuturisticCard glowIntensity="low">
            <h3>Low Glow Card</h3>
            <p>This card has reduced glow intensity for a more subtle effect.</p>
        </RetroFuturisticCard>
    );
}

export function HighGlowExample() {
    return (
        <RetroFuturisticCard glowIntensity="high">
            <h3>High Glow Card</h3>
            <p>This card has intense glow for maximum retro-futuristic impact.</p>
        </RetroFuturisticCard>
    );
}

export function NoBracketsExample() {
    return (
        <RetroFuturisticCard cornerBrackets={false}>
            <h3>No Corner Brackets</h3>
            <p>This card has corner brackets disabled for a cleaner look.</p>
        </RetroFuturisticCard>
    );
}

export function HolographicExample() {
    return (
        <RetroFuturisticCard holographicBorder>
            <h3>Holographic Border</h3>
            <p>This card features a rotating holographic border effect on hover.</p>
        </RetroFuturisticCard>
    );
}

export function ClickableExample() {
    return (
        <RetroFuturisticCard onClick={() => alert('Card clicked!')}>
            <h3>Clickable Card</h3>
            <p>This card is interactive and responds to clicks.</p>
        </RetroFuturisticCard>
    );
}

export function FullFeaturedExample() {
    return (
        <RetroFuturisticCard
            glowIntensity="high"
            cornerBrackets={true}
            holographicBorder={true}
            onClick={() => console.log('Full featured card clicked')}
            className="p-6"
        >
            <h3 className="text-xl font-bold mb-2">Full Featured Card</h3>
            <p className="text-sm mb-4">
                This card showcases all available features:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
                <li>High glow intensity</li>
                <li>Animated corner brackets</li>
                <li>Holographic border effect</li>
                <li>Shimmer sweep on hover</li>
                <li>Deconstructivist offset shadow</li>
                <li>Click interaction</li>
            </ul>
        </RetroFuturisticCard>
    );
}

export function ProjectCardExample() {
    return (
        <RetroFuturisticCard glowIntensity="medium" className="p-5">
            <div className="space-y-3">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">Project Title</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
                        Web
                    </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    A brief description of the project showcasing the retro-futuristic aesthetic.
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        React
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        TypeScript
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                        Tailwind
                    </span>
                </div>
            </div>
        </RetroFuturisticCard>
    );
}
