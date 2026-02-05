'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const t      = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('cv')}
          </Link>
          <Link
            href={`/${locale}/education`}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('education')}
          </Link>
          <Link
            href={`/${locale}/projects`}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('projects')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
