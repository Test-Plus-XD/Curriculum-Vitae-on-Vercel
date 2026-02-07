/**
 * DeconstructedGrid Component Examples
 * 
 * Demonstrates various configurations of the DeconstructedGrid component
 * with different intensities, column counts, and content types.
 */

'use client';

import React from 'react';
import { DeconstructedGrid } from './DeconstructedGrid';

/**
 * Example 1: Basic 2-column grid with default settings
 */
export const BasicDeconstructedGrid = () => {
    return (
        <div className="p-8 bg-soviet-warm-bg dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-soviet-red dark:text-soviet-orange">
                Basic Deconstructed Grid
            </h2>
            <DeconstructedGrid>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Item 1</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        This item has a subtle random rotation and vertical offset.
                    </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Item 2</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Each item gets a unique transformation based on its index.
                    </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Item 3</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        The transformations are consistent across renders.
                    </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Item 4</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Creating a deconstructivist aesthetic.
                    </p>
                </div>
            </DeconstructedGrid>
        </div>
    );
};

/**
 * Example 2: 3-column grid with high intensity
 */
export const HighIntensityGrid = () => {
    return (
        <div className="p-8 bg-soviet-warm-bg dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-soviet-red dark:text-soviet-orange">
                High Intensity Grid (3 columns)
            </h2>
            <DeconstructedGrid
                columns={3}
                tiltIntensity={1.0}
                offsetIntensity={0.8}
                gap="1.5rem"
            >
                {Array.from({ length: 6 }, (_, i) => (
                    <div
                        key={i}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                    >
                        <h3 className="text-lg font-semibold mb-2">Card {i + 1}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            More dramatic tilts and offsets for stronger visual impact.
                        </p>
                    </div>
                ))}
            </DeconstructedGrid>
        </div>
    );
};

/**
 * Example 3: Subtle grid for professional content
 */
export const SubtleGrid = () => {
    return (
        <div className="p-8 bg-soviet-warm-bg dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-soviet-red dark:text-soviet-orange">
                Subtle Grid (Low Intensity)
            </h2>
            <DeconstructedGrid
                columns={2}
                tiltIntensity={0.2}
                offsetIntensity={0.1}
                gap="2rem"
            >
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Project Alpha</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Very subtle transformations for a more professional look.
                    </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Project Beta</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Still maintains the deconstructivist aesthetic.
                    </p>
                </div>
            </DeconstructedGrid>
        </div>
    );
};

/**
 * Example 4: Single column mobile-friendly layout
 */
export const MobileGrid = () => {
    return (
        <div className="p-8 bg-soviet-warm-bg dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-soviet-red dark:text-soviet-orange">
                Mobile Layout (1 column)
            </h2>
            <DeconstructedGrid
                columns={1}
                tiltIntensity={0.3}
                offsetIntensity={0.2}
                gap="1rem"
                className="max-w-md mx-auto"
            >
                {Array.from({ length: 4 }, (_, i) => (
                    <div
                        key={i}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                    >
                        <h3 className="text-lg font-semibold mb-2">Item {i + 1}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Single column layout with subtle deconstructivist effects.
                        </p>
                    </div>
                ))}
            </DeconstructedGrid>
        </div>
    );
};

/**
 * Example 5: Project cards with RetroFuturisticCard styling
 */
export const ProjectCardsGrid = () => {
    const projects = [
        { title: 'Temporal Archive', description: 'A collection of artifacts from multiple timelines' },
        { title: 'Chronos Engine', description: 'Time manipulation framework for modern applications' },
        { title: 'Retro Vision', description: 'Vintage-inspired design system with futuristic elements' },
        { title: 'Dada Compiler', description: 'Code transformation tool with artistic principles' },
    ];

    return (
        <div className="p-8 bg-soviet-warm-bg dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-6 text-soviet-red dark:text-soviet-orange">
                Project Cards Grid
            </h2>
            <DeconstructedGrid
                columns={2}
                gap="2rem"
                className="max-w-4xl mx-auto"
            >
                {projects.map((project, i) => (
                    <div
                        key={i}
                        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h3 className="text-xl font-bold mb-3 text-soviet-red dark:text-soviet-orange">
                            {project.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            {project.description}
                        </p>
                    </div>
                ))}
            </DeconstructedGrid>
        </div>
    );
};

/**
 * All examples in one component for testing
 */
export const DeconstructedGridExamples = () => {
    return (
        <div className="space-y-12">
            <BasicDeconstructedGrid />
            <HighIntensityGrid />
            <SubtleGrid />
            <MobileGrid />
            <ProjectCardsGrid />
        </div>
    );
};

export default DeconstructedGridExamples;
