import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const LOCALES = ['en', 'zh-hk'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !LOCALES.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
