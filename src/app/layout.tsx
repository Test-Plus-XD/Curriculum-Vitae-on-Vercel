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
  title: 'NG Yu Ham Baldwin | Software Developer Portfolio & CV',
  description:
    'Professional portfolio and CV of NG Yu Ham Baldwin (吳宇涵), a full-stack software developer and Computer Science student at HKCT. ' +
    'Bilingual (EN/繁體中文) showcase of iOS, Flutter, web applications, game development, and backend projects. ' +
    'Features real-time collaboration tools, AI-powered solutions, and cross-platform mobile applications with a distinctive Soviet retro-futuristic design aesthetic.',
  keywords: [
    'NG Yu Ham Baldwin', '吳宇涵', 'Software Developer', 'Full Stack Developer',
    'Computer Science', 'HKCT', 'Hong Kong Developer', 'Portfolio',
    'iOS Development', 'Swift', 'Flutter Development', 'Dart',
    'Web Development', 'Next.js', 'React', 'TypeScript',
    'Mobile Development', 'Game Development', 'Backend Development', 'Node.js', 'Express',
    'Firebase', 'Cloud Development', 'CV', 'Resume', 'Résumé',
    'Computer Science Portfolio', 'Tech Portfolio', 'Developer CV',
  ],
  authors: [{ name: 'NG Yu Ham Baldwin', url: 'https://www.test-plus.work' }],
  creator: 'NG Yu Ham Baldwin',
  openGraph: {
    title: 'NG Yu Ham Baldwin | Software Developer Portfolio & CV',
    description:
      'Full-stack software developer portfolio. Bilingual (English/繁體中文) showcase of iOS, Flutter, web, and game projects. ' +
      'Final Year Project: Pour Rice — cross-platform restaurant discovery platform with AI assistance. ' +
      'Academic focus with practical development experience across multiple platforms and technologies.',
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['zh_HK'],
    url: 'https://www.test-plus.work',
    siteName: 'NG Yu Ham Baldwin Portfolio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.test-plus.work',
    languages: {
      'en': 'https://www.test-plus.work/en',
      'zh-HK': 'https://www.test-plus.work/zh-HK',
    },
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