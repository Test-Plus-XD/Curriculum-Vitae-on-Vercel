import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withNextIntl = createNextIntlPlugin();
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // The Swift iOS app is now part of the Pour Rice case study; keep old links working.
  async redirects() {
    return ['en', 'zh-hk'].map((locale) => ({
      source: `/${locale}/projects/pourrice-ios`,
      destination: `/${locale}/projects/pourrice`,
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
