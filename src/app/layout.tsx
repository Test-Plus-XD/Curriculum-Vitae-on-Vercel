import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Noto_Serif_Display } from 'next/font/google';

/// Noto Serif Display font for elegant titles and headings
/// Weight: 300 Light, Style: Italic
const notoSerifDisplay = Noto_Serif_Display({
  subsets: ['latin'],
  weight: ['300'],
  style: ['italic'],
  variable: '--font-title',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NG Yu Ham Baldwin | Software Developer',
  description: 'Bilingual CV — NG Yu Ham Baldwin 吳宇涵. Software Developer portfolio and academic CV.',
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
      <body className={`${notoSerifDisplay.variable} bg-[#f5efe6] dark:bg-[#1a1a1a] text-slate-800 dark:text-slate-100 transition-colors`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}