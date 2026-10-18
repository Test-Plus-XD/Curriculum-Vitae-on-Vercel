'use client';

import { useLocale } from 'next-intl';
import GlitchText, { type GlitchTextProps } from './GlitchText';

/** Resolves once when first scrolled into view, and replays on hover. Used for the institution subtitle. */
export default function GlitchRevealText({ speed, ...props }: Omit<GlitchTextProps, 'glitchOnView' | 'glitchOnMount'>) {
  const locale = useLocale();
  const base = speed ?? (locale === 'zh-hk' ? 1 : 10);
  return <GlitchText {...props} speed={Math.max(1, base / 3)} glitchOnView glitchOnHover glitchOnMount={false} />;
}
