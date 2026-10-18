import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PROGRAMME, SEMESTERS, ALL_COURSES } from '@/lib/education';
import { pick } from '@/lib/i18n-text';
import { alternates } from '@/lib/seo';
import DadaTypography from '@/components/fx/DadaTypography';
import GlitchRevealText from '@/components/fx/GlitchRevealText';
import RevealHeading from '@/components/fx/RevealHeading';
import Scatter from '@/components/fx/Scatter';
import TiltCard from '@/components/fx/TiltCard';
import Counter from '@/components/fx/Counter';
import SemesterTrack from '@/components/SemesterTrack';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('educationTitle'), description: t('educationDescription'), alternates: alternates(locale, '/education') };
}

export default async function EducationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('education');
  const L = (text: { en: string; zh: string }) => pick(text, locale);

  const stats = [
    { value: PROGRAMME.cgpa, decimals: 1, label: t('statCgpa'), accent: true },
    { value: PROGRAMME.finalTermGpa, decimals: 1, label: t('statTermGpa') },
    { value: ALL_COURSES.length, decimals: 0, label: t('statCourses') },
    { value: SEMESTERS.length, decimals: 0, label: t('statSemesters') },
  ];

  return (
    <div className="page page-education">
      <section className="page-hero">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {t('eyebrow')}
        </p>
        <DadaTypography as="h1" text={t('title')} className="hero-title font-title" colorShift intensity={1} />
        <GlitchRevealText as="p" text={L(PROGRAMME.institution)} className="hero-subtitle" />
        <p className="hero-lede">{L(PROGRAMME.title)}</p>
        <dl className="hero-meta">
          <div>
            <dt>{t('code')}</dt>
            <dd>{PROGRAMME.code}</dd>
          </div>
          <div>
            <dt>{t('qf')}</dt>
            <dd>{t('qfLevel', { level: PROGRAMME.qfLevel })}</dd>
          </div>
          <div>
            <dt>{t('mode')}</dt>
            <dd>{L(PROGRAMME.mode)}</dd>
          </div>
          <div>
            <dt>{t('period')}</dt>
            <dd>{L(PROGRAMME.period)}</dd>
          </div>
        </dl>
        <p className="graduation-badge">
          <span className="graduation-star" aria-hidden="true">
            ★
          </span>
          {L(PROGRAMME.graduated)}
        </p>
      </section>

      <Scatter className="stat-grid" variant="collage">
        {stats.map((s) => (
          <TiltCard key={s.label} className={`stat-card ${s.accent ? 'stat-card-accent' : ''}`}>
            <Counter value={s.value} decimals={s.decimals} className="stat-value font-title" />
            <span className="stat-label">{s.label}</span>
          </TiltCard>
        ))}
      </Scatter>

      <section className="section" aria-labelledby="timeline-heading">
        <RevealHeading id="timeline-heading" text={t('timeline')} index="§ 01" />
        <SemesterTrack semesters={SEMESTERS} />
        <p className="footnote">{t('gradesNote')}</p>
      </section>
    </div>
  );
}
