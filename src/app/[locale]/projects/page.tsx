import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PROJECTS } from '@/lib/projects';
import { alternates } from '@/lib/seo';
import DadaTypography from '@/components/fx/DadaTypography';
import Scramble from '@/components/fx/Scramble';
import ProjectsGazette from '@/components/ProjectsGazette';
import ReadymadeFigure from '@/components/readymade/ReadymadeFigure';
import ObjetsFigure from '@/components/objets/ObjetsFigure';

// Regenerate the issue date daily, following the CV page's date-sensitive content.
export const revalidate = 86400;

// Return yesterday in Hong Kong calendar time as an ISO date for the newspaper masthead.
function getYesterdayDate(): string {
  const todayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(todayParts.map(({ type, value }) => [type, value])) as Record<string, string>;
  const yesterday = new Date(Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day) - 1));
  return `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterday.getUTCDate()).padStart(2, '0')}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('projectsTitle'), description: t('projectsDescription'), alternates: alternates(locale, '/projects') };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const issueDate = getYesterdayDate();

  return (
    <div className="page page-projects">
      <section className="page-hero has-readymade">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <Scramble text={t('eyebrow')} />
        </p>
        <DadaTypography as="h1" text={t('title')} className="hero-title font-title" colorShift intensity={1} />
        <p className="hero-lede">{t('intro')}</p>
        <ObjetsFigure />
        <ReadymadeFigure work="duchamp" number={2} />
      </section>

      <ProjectsGazette projects={PROJECTS} issueDate={issueDate} />
    </div>
  );
}
