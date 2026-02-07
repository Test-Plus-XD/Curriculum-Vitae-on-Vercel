import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh-hk'],
  defaultLocale: 'en',
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|dada/).*)',
  ],
};
