'use client';

import GlitchText from './GlitchText';

/**
 * GlitchRevealText — Client wrapper around GlitchText for use in server
 * components. Scrambles text through Cyrillic/symbol characters when the
 * element first enters the viewport, then resolves to the real text.
 * Also re-scrambles on hover.
 */
interface GlitchRevealTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
  speed?: number;
  glitchOnHover?: boolean;
}

export default function GlitchRevealText({
  text,
  className = '',
  as = 'span',
  speed = 8,
  glitchOnHover = true,
}: GlitchRevealTextProps) {
  return (
    <GlitchText
      text={text}
      className={className}
      as={as}
      glitchOnView
      glitchOnHover={glitchOnHover}
      glitchOnMount={false}
      speed={speed}
    />
  );
}
