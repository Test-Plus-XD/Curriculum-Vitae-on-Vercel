import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Iansui, LINE_Seed_JP, Noto_Serif_Display, Special_Elite, Unbounded } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/profile';
import ThemeProvider from '@/components/ThemeProvider';
import TransitionProvider from '@/components/transition/TransitionProvider';
import BackgroundStage from '@/components/fx/BackgroundStage';
import CollageDefs from '@/components/collage/CollageDefs';
import CursorReticle from '@/components/fx/CursorReticle';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

const title = Noto_Serif_Display({
  subsets: ['latin', 'cyrillic'],
  style: ['italic', 'normal'],
  axes: ['wdth'],
  variable: '--ff-title',
  display: 'swap',
});

// Next has no metric overrides for these two families, so no size-adjusted fallback is generated.
const en = LINE_Seed_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--ff-en',
  display: 'swap',
  adjustFontFallback: false,
});

// Collage accents: a constructivist display face (with Cyrillic) and a typewriter. Decorative, so not preloaded.
const display = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--ff-display',
  display: 'swap',
  preload: false,
});

const type = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--ff-type',
  display: 'swap',
  preload: false,
});

const zh = Iansui({
  subsets: ['latin'],
  weight: '400',
  variable: '--ff-zh',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t('cvTitle'), template: `%s · ${t('siteName')}` },
    description: t('cvDescription'),
    authors: [{ name: 'NG Yu Ham Baldwin' }],
    openGraph: { type: 'website', siteName: t('siteName'), locale: locale === 'zh-hk' ? 'zh_HK' : 'en_GB' },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5efe6' },
    { media: '(prefers-color-scheme: dark)', color: '#161412' },
  ],
};

// `js-fx` lets CSS pre-hide elements that GSAP will animate in, so nothing flashes before hydration. It is
// rendered on <html> directly (no inline script); without JavaScript the <noscript> style shows everything.
const NO_SCRIPT_CSS = '[data-fx-hide]{opacity:1!important;animation:none!important}';

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html
      lang={locale === 'zh-hk' ? 'zh-HK' : 'en-GB'}
      className={`js-fx ${title.variable} ${en.variable} ${zh.variable} ${display.variable} ${type.variable}`}
      data-cover="off"
      suppressHydrationWarning
    >
      <head>
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
      </head>
      {/* Browser extensions often add attributes to <body>; don't treat that as a hydration error. */}
      <body className={locale === 'zh-hk' ? 'locale-zh' : 'locale-en'} suppressHydrationWarning>
        <NextIntlClientProvider>
          <ThemeProvider>
            <TransitionProvider>
              <a href="#main" className="skip-link">
                {t('skip')}
              </a>
              <CollageDefs />
              <BackgroundStage />
              <Header />
              <main id="main" className="site-main">
                {children}
              </main>
              <Footer />
              <CursorReticle />
            </TransitionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
