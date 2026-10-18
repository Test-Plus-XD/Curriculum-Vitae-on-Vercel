import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

/** Canonical URL and hreflang alternates for a locale-less path such as '' or '/projects'. */
export function alternates(locale: string, path: string): Metadata['alternates'] {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l === 'zh-hk' ? 'zh-HK' : 'en-GB', `/${l}${path}`])),
      'x-default': `/${routing.defaultLocale}${path}`,
    },
  };
}
