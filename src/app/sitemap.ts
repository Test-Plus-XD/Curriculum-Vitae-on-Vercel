import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { PROJECT_IDS } from '@/lib/projects';
import { SITE } from '@/lib/profile';

const PATHS = ['', '/education', '/projects', ...PROJECT_IDS.map((id) => `/projects/${id}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE.url}/${routing.defaultLocale}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l === 'zh-hk' ? 'zh-HK' : 'en-GB', `${SITE.url}/${l}${path}`])),
    },
  }));
}
