/**
 * Page Classification System for Reverse:1999 Aesthetic Enhancement
 * 
 * This module provides utilities to detect whether aesthetic enhancements
 * should be applied to a page. The CV landing page remains professional
 * and unmodified, while project and education pages receive full aesthetic
 * treatment.
 */

'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { z } from 'zod';

/**
 * Page type classification
 */
export type PageType = 'cv' | 'enhanced';

/**
 * Determines if aesthetic enhancements should be applied to a given route
 * 
 * @param pathname - The current pathname (e.g., '/en', '/en/projects')
 * @param locale - The current locale (e.g., 'en', 'zh-hk')
 * @returns true if aesthetics should be applied, false otherwise
 * 
 * @example
 * shouldApplyAesthetics('/en', 'en') // false (CV page)
 * shouldApplyAesthetics('/en/projects', 'en') // true (Enhanced page)
 * shouldApplyAesthetics('/en/projects/my-project', 'en') // true (Enhanced page)
 * shouldApplyAesthetics('/en/education', 'en') // true (Enhanced page)
 */
export function shouldApplyAesthetics(pathname: string, locale: string): boolean {
    try {
        // Normalize pathname - remove trailing slashes for consistent comparison
        const normalizedPath = pathname.endsWith('/') && pathname.length > 1
            ? pathname.slice(0, -1)
            : pathname;

        // CV page patterns: exactly /{locale} or /{locale}/
        const cvPagePattern = `/${locale}`;

        // Check if this is the CV landing page
        const isCVPage = normalizedPath === cvPagePattern;

        // Enhanced pages: /[locale]/projects/* or /[locale]/education
        const isEnhancedPage =
            normalizedPath.startsWith(`/${locale}/projects`) ||
            normalizedPath.startsWith(`/${locale}/education`);

        // Apply aesthetics only to enhanced pages, not to CV page
        return !isCVPage && isEnhancedPage;
    } catch (error) {
        // Safe default: do not apply aesthetics on error
        console.error('Error in shouldApplyAesthetics:', error);
        return false;
    }
}

/**
 * React hook to detect the current page type (CV vs Enhanced)
 * 
 * @returns 'cv' for the landing page, 'enhanced' for projects/education pages
 * 
 * @example
 * const pageType = usePageType();
 * if (pageType === 'enhanced') {
 *   // Apply aesthetic enhancements
 * }
 */
export function usePageType(): PageType {
    try {
        const pathname = usePathname();
        const locale = useLocale();

        // Determine if aesthetics should be applied
        const shouldApply = shouldApplyAesthetics(pathname, locale);

        return shouldApply ? 'enhanced' : 'cv';
    } catch (error) {
        // Safe default: treat as CV page on error
        console.error('Error in usePageType:', error);
        return 'cv';
    }
}

/**
 * Configuration for aesthetic features
 */
export interface AestheticConfig {
    enabled: boolean;
    features: {
        dadaScatter: boolean;
        deconstructedTypography: boolean;
        temporalMotifs: boolean;
        timeRewindTransitions: boolean;
        holographicEffects: boolean;
        enhancedBackgrounds: boolean;
    };
    intensity: {
        scatter: number;      // 0-1
        tilt: number;         // 0-1
        glow: number;         // 0-1
        motifDensity: number; // 0-1
    };
}

/**
 * Deep partial type for aesthetic configuration
 * Allows partial updates to nested properties
 */
export type PartialAestheticConfig = {
    enabled?: boolean;
    features?: Partial<AestheticConfig['features']>;
    intensity?: Partial<AestheticConfig['intensity']>;
};

/**
 * Default aesthetic configuration
 */
export const DEFAULT_AESTHETIC_CONFIG: AestheticConfig = {
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
        scatter: 0.8,
        tilt: 0.5,
        glow: 0.7,
        motifDensity: 0.6,
    },
};

/**
 * Zod schema for validating aesthetic configuration
 * Ensures all configuration values are within valid ranges
 */
export const AestheticConfigSchema = z.object({
    enabled: z.boolean(),
    features: z.object({
        dadaScatter: z.boolean(),
        deconstructedTypography: z.boolean(),
        temporalMotifs: z.boolean(),
        timeRewindTransitions: z.boolean(),
        holographicEffects: z.boolean(),
        enhancedBackgrounds: z.boolean(),
    }),
    intensity: z.object({
        scatter: z.number().min(0).max(1),
        tilt: z.number().min(0).max(1),
        glow: z.number().min(0).max(1),
        motifDensity: z.number().min(0).max(1),
    }),
});

/**
 * Validates an aesthetic configuration object
 * 
 * @param config - The configuration object to validate
 * @returns The validated configuration, or the default configuration if validation fails
 * 
 * @example
 * const config = validateAestheticConfig(userConfig);
 * // Returns validated config or DEFAULT_AESTHETIC_CONFIG on error
 */
export function validateAestheticConfig(config: unknown): AestheticConfig {
    try {
        return AestheticConfigSchema.parse(config);
    } catch (error) {
        console.error('Invalid aesthetic configuration, using defaults:', error);
        return DEFAULT_AESTHETIC_CONFIG;
    }
}

/**
 * Merges a partial configuration with the default configuration
 * Allows users to override only specific settings while keeping defaults for others
 * 
 * @param partialConfig - Partial configuration to merge with defaults
 * @returns Complete configuration with user overrides applied
 * 
 * @example
 * const config = mergeAestheticConfig({ enabled: false });
 * // Returns config with enabled: false, all other values from defaults
 */
export function mergeAestheticConfig(partialConfig: PartialAestheticConfig): AestheticConfig {
    try {
        const merged = {
            enabled: partialConfig.enabled ?? DEFAULT_AESTHETIC_CONFIG.enabled,
            features: {
                ...DEFAULT_AESTHETIC_CONFIG.features,
                ...partialConfig.features,
            },
            intensity: {
                ...DEFAULT_AESTHETIC_CONFIG.intensity,
                ...partialConfig.intensity,
            },
        };

        // Validate the merged configuration
        return validateAestheticConfig(merged);
    } catch (error) {
        console.error('Error merging aesthetic configuration:', error);
        return DEFAULT_AESTHETIC_CONFIG;
    }
}

/**
 * Checks if a specific aesthetic feature is enabled
 * Provides graceful degradation by checking both global enabled flag and feature flag
 * 
 * @param config - The aesthetic configuration
 * @param feature - The feature to check
 * @returns true if the feature should be active, false otherwise
 * 
 * @example
 * if (isFeatureEnabled(config, 'dadaScatter')) {
 *   // Apply dada scatter effect
 * }
 */
export function isFeatureEnabled(
    config: AestheticConfig,
    feature: keyof AestheticConfig['features']
): boolean {
    return config.enabled && config.features[feature];
}

/**
 * Gets the intensity value for a specific effect with graceful degradation
 * Returns 0 if aesthetics are globally disabled
 * 
 * @param config - The aesthetic configuration
 * @param intensityKey - The intensity setting to retrieve
 * @returns The intensity value (0-1), or 0 if aesthetics are disabled
 * 
 * @example
 * const scatterIntensity = getIntensity(config, 'scatter');
 * // Returns 0.8 if enabled, 0 if disabled
 */
export function getIntensity(
    config: AestheticConfig,
    intensityKey: keyof AestheticConfig['intensity']
): number {
    if (!config.enabled) {
        return 0;
    }
    return config.intensity[intensityKey];
}

/**
 * Creates a safe configuration object that gracefully handles disabled features
 * When a feature is disabled, returns a configuration that renders without effects
 * 
 * @param config - The aesthetic configuration
 * @returns A safe configuration object suitable for component props
 * 
 * @example
 * const safeConfig = getSafeConfig(config);
 * <DadaScatterLayout intensity={safeConfig.intensity.scatter} />
 */
export function getSafeConfig(config: AestheticConfig): AestheticConfig {
    if (!config.enabled) {
        // Return a configuration with all effects disabled
        return {
            enabled: false,
            features: {
                dadaScatter: false,
                deconstructedTypography: false,
                temporalMotifs: false,
                timeRewindTransitions: false,
                holographicEffects: false,
                enhancedBackgrounds: false,
            },
            intensity: {
                scatter: 0,
                tilt: 0,
                glow: 0,
                motifDensity: 0,
            },
        };
    }

    return config;
}
