import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import RetroWave from '@/components/RetroWave';
import SovietParticles from '@/components/SovietParticles';
import SovietBackground from '@/components/SovietBackground';
import CosmicStarfield from '@/components/CosmicStarfield';
import MorseCodeTicker from '@/components/MorseCodeTicker';
import SovietTelemetry from '@/components/SovietTelemetry';
import SovietPropagandaPoster from '@/components/SovietPropagandaPoster';
import SovietCursorGlow from '@/components/SovietCursorGlow';
import DadaCollage from '@/components/DadaCollage';
import EnhancedBackground from '@/components/EnhancedBackground';
import TemporalMotifs from '@/components/TemporalMotifs';
import TimeRewindTransition from '@/components/TimeRewindTransition';

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
        <div suppressHydrationWarning className={`min-h-screen flex flex-col scanlines ${locale === 'zh-hk' ? 'locale-zh' : 'locale-en'}`}>
          {/* Sticky nav — hidden on print */}
          <div className="print:hidden">
            <Header />
          </div>

          <main className="relative z-10 flex-1">
            <TimeRewindTransition>
              {children}
            </TimeRewindTransition>
          </main>

          <Footer />

          {/* Soviet retro-futuristic atmosphere layers */}
          <SovietBackground />
          <EnhancedBackground />
          <CosmicStarfield />
          <MorseCodeTicker />
          <SovietTelemetry />
          <SovietPropagandaPoster />
          <DadaCollage />
          <TemporalMotifs density="medium" />
          <RetroWave />
          <SovietParticles />
          <SovietCursorGlow />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}