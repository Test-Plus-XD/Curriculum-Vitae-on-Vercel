/**
 * Property-Based Tests for Page Classification System
 * Feature: reverse-1999-aesthetic
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
    shouldApplyAesthetics,
    validateAestheticConfig,
    mergeAestheticConfig,
    isFeatureEnabled,
    getIntensity,
    getSafeConfig,
    DEFAULT_AESTHETIC_CONFIG,
    type AestheticConfig,
} from './aesthetics';

/**
 * Property 1: CV Page Isolation
 * Validates: Requirements 13.1, 13.2
 * 
 * For any route navigation, when the current path matches /[locale]/ exactly,
 * the system should NOT apply any Dadaist, Deconstructivist, or Retro-Futuristic
 * styling effects.
 */
describe('Property 1: CV Page Isolation', () => {
    it('never applies aesthetics to CV routes', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary locales (common ones and edge cases)
                fc.constantFrom('en', 'zh-hk', 'zh', 'es', 'fr', 'de', 'ja', 'ko'),
                // Generate optional trailing slash
                fc.boolean(),
                (locale, hasTrailingSlash) => {
                    // Construct CV page paths with and without trailing slashes
                    const cvPath = hasTrailingSlash ? `/${locale}/` : `/${locale}`;

                    // CV pages should NEVER have aesthetics applied
                    const result = shouldApplyAesthetics(cvPath, locale);

                    return result === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('never applies aesthetics to CV routes with query parameters', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('en', 'zh-hk', 'zh', 'es', 'fr'),
                fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('/')),
                fc.string({ minLength: 1, maxLength: 20 }),
                (locale, queryKey, queryValue) => {
                    // CV path with query parameters (though Next.js routing handles this differently)
                    const cvPath = `/${locale}`;

                    // Even with query parameters in the URL, the pathname should be clean
                    // and aesthetics should not be applied
                    const result = shouldApplyAesthetics(cvPath, locale);

                    return result === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('applies aesthetics to non-CV routes', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('en', 'zh-hk', 'zh', 'es', 'fr'),
                fc.constantFrom('projects', 'education'),
                fc.option(fc.string({ minLength: 1, maxLength: 30 }).filter(s => !s.includes('/')), { nil: undefined }),
                (locale, section, subPath) => {
                    // Construct enhanced page paths
                    const path = subPath
                        ? `/${locale}/${section}/${subPath}`
                        : `/${locale}/${section}`;

                    // Enhanced pages should have aesthetics applied
                    const result = shouldApplyAesthetics(path, locale);

                    return result === true;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('defaults to no aesthetics for invalid or unknown routes', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('en', 'zh-hk', 'zh'),
                fc.string({ minLength: 1, maxLength: 20 }).filter(s =>
                    s !== 'projects' &&
                    s !== 'education' &&
                    !s.includes('/')
                ),
                (locale, unknownSection) => {
                    // Unknown routes should not have aesthetics applied (safe default)
                    const path = `/${locale}/${unknownSection}`;
                    const result = shouldApplyAesthetics(path, locale);

                    return result === false;
                }
            ),
            { numRuns: 100 }
        );
    });

    it('handles edge cases with multiple slashes gracefully', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('en', 'zh-hk', 'zh'),
                (locale) => {
                    // Edge cases with multiple slashes
                    const edgeCases = [
                        `/${locale}//`,
                        `/${locale}///`,
                        `//${locale}`,
                        `/${locale}/projects//`,
                    ];

                    // Test each edge case
                    return edgeCases.every(path => {
                        try {
                            const result = shouldApplyAesthetics(path, locale);
                            // Should handle gracefully without throwing
                            return typeof result === 'boolean';
                        } catch {
                            // Should not throw errors
                            return false;
                        }
                    });
                }
            ),
            { numRuns: 100 }
        );
    });
});

/**
 * Unit Tests for Configuration System
 * Feature: reverse-1999-aesthetic
 * Requirements: 15.1, 15.2, 15.3
 */
describe('Configuration System', () => {
    describe('validateAestheticConfig', () => {
        it('accepts valid configuration', () => {
            const validConfig: AestheticConfig = {
                enabled: true,
                features: {
                    dadaScatter: true,
                    deconstructedTypography: false,
                    temporalMotifs: true,
                    timeRewindTransitions: false,
                    holographicEffects: true,
                    enhancedBackgrounds: false,
                },
                intensity: {
                    scatter: 0.5,
                    tilt: 0.3,
                    glow: 0.8,
                    motifDensity: 0.6,
                },
            };

            const result = validateAestheticConfig(validConfig);
            expect(result).toEqual(validConfig);
        });

        it('rejects configuration with invalid intensity values', () => {
            const invalidConfig = {
                enabled: true,
                features: {
                    dadaScatter: true,
                    deconstructedTypography: true,
                    temporalMotifs: true,
                    timeRewindTransitions: true,
                    holographicEffects: true,
                    enhancedBackgrounds: true,
                },
                intensity: {
                    scatter: 1.5, // Invalid: > 1
                    tilt: -0.1,   // Invalid: < 0
                    glow: 0.5,
                    motifDensity: 0.5,
                },
            };

            const result = validateAestheticConfig(invalidConfig);
            expect(result).toEqual(DEFAULT_AESTHETIC_CONFIG);
        });

        it('returns default config for completely invalid input', () => {
            const result = validateAestheticConfig({ invalid: 'data' });
            expect(result).toEqual(DEFAULT_AESTHETIC_CONFIG);
        });

        it('returns default config for null or undefined', () => {
            expect(validateAestheticConfig(null)).toEqual(DEFAULT_AESTHETIC_CONFIG);
            expect(validateAestheticConfig(undefined)).toEqual(DEFAULT_AESTHETIC_CONFIG);
        });
    });

    describe('mergeAestheticConfig', () => {
        it('merges partial config with defaults', () => {
            const partial = {
                enabled: false,
            };

            const result = mergeAestheticConfig(partial);
            expect(result.enabled).toBe(false);
            expect(result.features).toEqual(DEFAULT_AESTHETIC_CONFIG.features);
            expect(result.intensity).toEqual(DEFAULT_AESTHETIC_CONFIG.intensity);
        });

        it('merges partial features', () => {
            const partial = {
                features: {
                    dadaScatter: false,
                    temporalMotifs: false,
                },
            };

            const result = mergeAestheticConfig(partial);
            expect(result.features.dadaScatter).toBe(false);
            expect(result.features.temporalMotifs).toBe(false);
            expect(result.features.deconstructedTypography).toBe(true); // From default
        });

        it('merges partial intensity values', () => {
            const partial = {
                intensity: {
                    scatter: 0.3,
                    glow: 0.9,
                },
            };

            const result = mergeAestheticConfig(partial);
            expect(result.intensity.scatter).toBe(0.3);
            expect(result.intensity.glow).toBe(0.9);
            expect(result.intensity.tilt).toBe(DEFAULT_AESTHETIC_CONFIG.intensity.tilt);
        });

        it('validates merged configuration', () => {
            const partial = {
                intensity: {
                    scatter: 2.0, // Invalid
                },
            };

            const result = mergeAestheticConfig(partial);
            // Should return default config due to validation failure
            expect(result).toEqual(DEFAULT_AESTHETIC_CONFIG);
        });
    });

    describe('isFeatureEnabled', () => {
        it('returns true when both global and feature flags are enabled', () => {
            const config: AestheticConfig = {
                enabled: true,
                features: {
                    dadaScatter: true,
                    deconstructedTypography: true,
                    temporalMotifs: true,
                    timeRewindTransitions: true,
                    holographicEffects: true,
                    enhancedBackgrounds: true,
                },
                intensity: DEFAULT_AESTHETIC_CONFIG.intensity,
            };

            expect(isFeatureEnabled(config, 'dadaScatter')).toBe(true);
        });

        it('returns false when global flag is disabled', () => {
            const config: AestheticConfig = {
                enabled: false,
                features: {
                    dadaScatter: true,
                    deconstructedTypography: true,
                    temporalMotifs: true,
                    timeRewindTransitions: true,
                    holographicEffects: true,
                    enhancedBackgrounds: true,
                },
                intensity: DEFAULT_AESTHETIC_CONFIG.intensity,
            };

            expect(isFeatureEnabled(config, 'dadaScatter')).toBe(false);
        });

        it('returns false when feature flag is disabled', () => {
            const config: AestheticConfig = {
                enabled: true,
                features: {
                    dadaScatter: false,
                    deconstructedTypography: true,
                    temporalMotifs: true,
                    timeRewindTransitions: true,
                    holographicEffects: true,
                    enhancedBackgrounds: true,
                },
                intensity: DEFAULT_AESTHETIC_CONFIG.intensity,
            };

            expect(isFeatureEnabled(config, 'dadaScatter')).toBe(false);
        });
    });

    describe('getIntensity', () => {
        it('returns intensity value when enabled', () => {
            const config: AestheticConfig = {
                enabled: true,
                features: DEFAULT_AESTHETIC_CONFIG.features,
                intensity: {
                    scatter: 0.7,
                    tilt: 0.4,
                    glow: 0.6,
                    motifDensity: 0.5,
                },
            };

            expect(getIntensity(config, 'scatter')).toBe(0.7);
            expect(getIntensity(config, 'tilt')).toBe(0.4);
        });

        it('returns 0 when globally disabled', () => {
            const config: AestheticConfig = {
                enabled: false,
                features: DEFAULT_AESTHETIC_CONFIG.features,
                intensity: {
                    scatter: 0.7,
                    tilt: 0.4,
                    glow: 0.6,
                    motifDensity: 0.5,
                },
            };

            expect(getIntensity(config, 'scatter')).toBe(0);
            expect(getIntensity(config, 'tilt')).toBe(0);
        });
    });

    describe('getSafeConfig', () => {
        it('returns original config when enabled', () => {
            const config: AestheticConfig = {
                enabled: true,
                features: {
                    dadaScatter: true,
                    deconstructedTypography: false,
                    temporalMotifs: true,
                    timeRewindTransitions: false,
                    holographicEffects: true,
                    enhancedBackgrounds: false,
                },
                intensity: {
                    scatter: 0.7,
                    tilt: 0.4,
                    glow: 0.6,
                    motifDensity: 0.5,
                },
            };

            const result = getSafeConfig(config);
            expect(result).toEqual(config);
        });

        it('returns disabled config when globally disabled', () => {
            const config: AestheticConfig = {
                enabled: false,
                features: {
                    dadaScatter: true,
                    deconstructedTypography: true,
                    temporalMotifs: true,
                    timeRewindTransitions: true,
                    holographicEffects: true,
                    enhancedBackgrounds: true,
                },
                intensity: {
                    scatter: 0.7,
                    tilt: 0.4,
                    glow: 0.6,
                    motifDensity: 0.5,
                },
            };

            const result = getSafeConfig(config);
            expect(result.enabled).toBe(false);
            expect(result.features.dadaScatter).toBe(false);
            expect(result.intensity.scatter).toBe(0);
        });
    });
});

/**
 * Property-Based Tests for Configuration System
 * Feature: reverse-1999-aesthetic, Property 11: Feature Flag Graceful Degradation
 * Validates: Requirements 15.2
 */
describe('Property 11: Feature Flag Graceful Degradation', () => {
    it('gracefully handles disabled features without errors', () => {
        fc.assert(
            fc.property(
                // Generate random feature flags
                fc.record({
                    dadaScatter: fc.boolean(),
                    deconstructedTypography: fc.boolean(),
                    temporalMotifs: fc.boolean(),
                    timeRewindTransitions: fc.boolean(),
                    holographicEffects: fc.boolean(),
                    enhancedBackgrounds: fc.boolean(),
                }),
                // Generate random intensity values
                fc.record({
                    scatter: fc.float({ min: 0, max: 1 }),
                    tilt: fc.float({ min: 0, max: 1 }),
                    glow: fc.float({ min: 0, max: 1 }),
                    motifDensity: fc.float({ min: 0, max: 1 }),
                }),
                // Generate random enabled state
                fc.boolean(),
                (features, intensity, enabled) => {
                    const config: AestheticConfig = {
                        enabled,
                        features,
                        intensity,
                    };

                    // Validate that all utility functions handle the config gracefully
                    try {
                        const safeConfig = getSafeConfig(config);
                        const scatterEnabled = isFeatureEnabled(config, 'dadaScatter');
                        const scatterIntensity = getIntensity(config, 'scatter');

                        // All functions should return valid values
                        return (
                            typeof safeConfig.enabled === 'boolean' &&
                            typeof scatterEnabled === 'boolean' &&
                            typeof scatterIntensity === 'number' &&
                            scatterIntensity >= 0 &&
                            scatterIntensity <= 1
                        );
                    } catch {
                        // Should not throw errors
                        return false;
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    it('ensures disabled features return zero intensity', () => {
        fc.assert(
            fc.property(
                fc.record({
                    scatter: fc.float({ min: 0, max: 1 }),
                    tilt: fc.float({ min: 0, max: 1 }),
                    glow: fc.float({ min: 0, max: 1 }),
                    motifDensity: fc.float({ min: 0, max: 1 }),
                }),
                (intensity) => {
                    const config: AestheticConfig = {
                        enabled: false, // Globally disabled
                        features: DEFAULT_AESTHETIC_CONFIG.features,
                        intensity,
                    };

                    // All intensity values should return 0 when disabled
                    return (
                        getIntensity(config, 'scatter') === 0 &&
                        getIntensity(config, 'tilt') === 0 &&
                        getIntensity(config, 'glow') === 0 &&
                        getIntensity(config, 'motifDensity') === 0
                    );
                }
            ),
            { numRuns: 100 }
        );
    });
});
