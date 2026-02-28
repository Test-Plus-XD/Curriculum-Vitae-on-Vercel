'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

/**
 * LocaleSetter — updates the <html lang> attribute on the client to match
 * the active next-intl locale, since the root layout cannot access the
 * dynamic [locale] route segment on the server.
 */
export default function LocaleSetter() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale === 'zh-hk' ? 'zh-HK' : 'en';
  }, [locale]);
  return null;
}
