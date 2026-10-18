'use client';

import GlitchText, { type GlitchTextProps } from './GlitchText';

/**
 * Load-in text: starts as Cyrillic / Bauhaus glyph noise (geometric glyphs only in 繁中) and resolves into
 * the real text once the page is revealed and the element scrolls into view — the same randomise effect as
 * the navigation links, used on labels, codes and dates across the site.
 */
export default function Scramble({ glitchOnHover = false, ...props }: Omit<GlitchTextProps, 'loadIn'>) {
  return <GlitchText {...props} glitchOnHover={glitchOnHover} loadIn />;
}
