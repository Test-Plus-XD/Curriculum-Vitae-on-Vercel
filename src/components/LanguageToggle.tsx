'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  const getLocaleUrl = (target: string) => {
    const stripped = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
    return `/${target}${stripped}`;
  };

  const active   = 'font-semibold text-blue-600 dark:text-blue-400';
  const inactive = 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200';

  return (
    <div className="flex items-center gap-1">
      <Link
        href={getLocaleUrl('en')}
        className={`text-sm transition-colors ${locale === 'en' ? active : inactive}`}
      >
        EN
      </Link>
      <span className="text-slate-300 dark:text-slate-600 select-none">|</span>
      <Link
        href={getLocaleUrl('zh-hk')}
        className={`text-sm transition-colors ${locale === 'zh-hk' ? active : inactive}`}
      >
        繁體
      </Link>
    </div>
  );
}
