import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

const LOCALES = ['en', 'zh-hk'];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) notFound();
  setRequestLocale(locale);

  return <>{children}</>;
}
