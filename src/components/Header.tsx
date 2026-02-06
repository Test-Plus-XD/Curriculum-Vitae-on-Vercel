'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const t      = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 relative bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-soviet-red/40">
      {/* Soviet propaganda banner — dark mode only */}
      <div className="hidden dark:block h-0.5 bg-gradient-to-r from-transparent via-soviet-red to-transparent" />
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium font-title italic text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-soviet-orange transition-colors"
          >
            {t('cv')}
          </Link>
          <Link
            href={`/${locale}/education`}
            className="text-sm font-medium font-title italic text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-soviet-orange transition-colors"
          >
            {t('education')}
          </Link>
          <Link
            href={`/${locale}/projects`}
            className="text-sm font-medium font-title italic text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-soviet-orange transition-colors"
          >
            {t('projects')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Soviet accent line — dark mode only (double-line effect) */}
      <div className="absolute bottom-0 left-0 right-0 h-px soviet-line-animated opacity-0 dark:opacity-60" />
      <div className="hidden dark:block absolute bottom-[-2px] left-0 right-0 h-px soviet-line opacity-30" />
    </header>
  );
}
