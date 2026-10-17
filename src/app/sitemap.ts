import type { MetadataRoute } from 'next';
import { PROJECT_IDS } from '@/lib/projects';

const BASE_URL = 'https://www.test-plus.work';
const locales = ['en', 'zh-hk'];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    `${BASE_URL}/${locale}`,
    `${BASE_URL}/${locale}/education`,
    `${BASE_URL}/${locale}/projects`,
    ...PROJECT_IDS.map((id) => `${BASE_URL}/${locale}/projects/${id}`),
  ]).map((url) => ({ url, lastModified: new Date() }));
}
