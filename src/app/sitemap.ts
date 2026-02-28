import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.test-plus.work';

const projectIds = [
  'pourrice',
  'steam-platform',
  '3d-game',
  '2d-puzzle',
  '2d-chess',
  'ai-annotation',
  'zuul-game',
  'card-game',
  'linux-server',
];

const locales = ['en', 'zh-hk'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Add root pages for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    });

    // Education page
    routes.push({
      url: `${BASE_URL}/${locale}/education`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });

    // Projects page
    routes.push({
      url: `${BASE_URL}/${locale}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });

    // Individual project pages
    projectIds.forEach((projectId) => {
      routes.push({
        url: `${BASE_URL}/${locale}/projects/${projectId}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  });

  return routes;
}
