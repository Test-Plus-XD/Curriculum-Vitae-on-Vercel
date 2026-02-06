import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import RetroWave from '@/components/RetroWave';
import SovietParticles from '@/components/SovietParticles';

const LOCALES = ['en', 'zh-hk'];

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

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <div className={`min-h-screen flex flex-col scanlines ${locale === 'zh-hk' ? 'locale-zh' : 'locale-en'}`}>
          {/* Sticky nav — hidden on print */}
          <div className="print:hidden">
            <Header />
          </div>

          <main className="flex-1 relative z-10">
            {children}
          </main>

          <Footer />
          <RetroWave />
          <SovietParticles />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
