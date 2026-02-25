import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Noto_Serif_Display, Iansui } from 'next/font/google';

/// Noto Serif Display font for elegant titles and headings
/// Weight: 300 Light, Style: Italic
const notoSerifDisplay = Noto_Serif_Display({
  subsets: ['latin'],
  weight: ['300'],
  style: ['italic'],
  variable: '--font-title',
  display: 'swap',
});

/// Iansui font for Traditional Chinese body text
const iansui = Iansui({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-zh',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NG Yu Ham Baldwin | Software Developer Portfolio',
  description:
    'NG Yu Ham Baldwin (吳宇涵) — Software Developer and Computer Science student at HKMU. ' +
    'Bilingual portfolio showcasing iOS, Flutter, web, and game projects with a Soviet retro-futuristic aesthetic. ' +
    'Available in English and Traditional Chinese.',
  keywords: [
    'NG Yu Ham Baldwin', '吳宇涵', 'Software Developer', 'Computer Science',
    'HKMU', 'Hong Kong', 'Portfolio', 'iOS', 'Flutter', 'Next.js',
    'Full Stack', 'Mobile Development', 'CV', 'Resume',
  ],
  openGraph: {
    title: 'NG Yu Ham Baldwin | Software Developer Portfolio',
    description:
      'Bilingual portfolio of NG Yu Ham Baldwin — CS student and Software Developer. ' +
      'Projects span iOS, Flutter, web, and games, presented in a unique Soviet retro-futuristic interface.',
    type: 'website',
    locale: 'en_GB',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Iansui font loaded via Google Fonts CDN for Traditional Chinese content */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Iansui:wght@400&display=swap"
          rel="stylesheet"
        />
        {/* LINE Seed JP font loaded via Google Fonts CDN for English content */}
        <link
          href="https://fonts.googleapis.com/css2?family=LINE+Seed+JP:wght@400&display=swap"
          rel="stylesheet"
        />
        {/* Noto Serif Display font loaded via Google Fonts CDN for titles, names, and highlights */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:ital,wght@1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        suppressHydrationWarning={true}
        className={`${notoSerifDisplay.variable} ${iansui.variable} bg-[#f5efe6] dark:bg-[#1a1a1a] text-slate-800 dark:text-slate-100 transition-colors`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}