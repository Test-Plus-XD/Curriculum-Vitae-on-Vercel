import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Software Developer | CV',
  description: 'Bilingual CV website — Software Developer portfolio and academic CV.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
