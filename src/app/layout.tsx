import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Iansui } from 'next/font/google';
import { LINE_Seed_JP } from 'next/font/google';
import { Noto_Serif_Display } from 'next/font/google';

const iansui = Iansui({
  subsets: ['chinese-traditional'],
  weight: '400',
  variable: '--font-zh',
  display: 'swap',
});

const lineSeedJP = LINE_Seed_JP({
  subsets: ['japanese'],
  weight: ['400'],
  variable: '--font-en',
  display: 'swap',
});

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
      <body className={`${iansui.variable} ${lineSeedJP.variable} ${notoSerifDisplay.variable} bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
