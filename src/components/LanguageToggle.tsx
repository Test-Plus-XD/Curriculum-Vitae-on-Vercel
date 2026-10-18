'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import TransitionLink from './transition/TransitionLink';

const OPTIONS = [
  { locale: 'en', label: 'EN', cover: 'English' },
  { locale: 'zh-hk', label: '繁', cover: '繁體中文' },
] as const;

/** EN / 繁 segmented switch that keeps the current page and plays the page transition. */
export default function LanguageToggle() {
  const t = useTranslations('controls');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="lang-toggle" role="group" aria-label={t('language')}>
      {OPTIONS.map((o) =>
        o.locale === locale ? (
          <span key={o.locale} className="lang-option is-active" aria-current="true" lang={o.locale}>
            {o.label}
          </span>
        ) : (
          <TransitionLink
            key={o.locale}
            href={pathname}
            locale={o.locale}
            label={o.cover}
            className="lang-option"
            lang={o.locale}
            hrefLang={o.locale}
          >
            {o.label}
          </TransitionLink>
        ),
      )}
    </div>
  );
}
