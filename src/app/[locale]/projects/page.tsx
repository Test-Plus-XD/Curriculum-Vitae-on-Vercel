import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, Lock } from 'lucide-react';
import { PROJECTS, COLLABORATIONS } from '@/lib/projects';
import { pick } from '@/lib/i18n-text';
import { alternates } from '@/lib/seo';
import DadaTypography from '@/components/fx/DadaTypography';
import RevealHeading from '@/components/fx/RevealHeading';
import Scatter from '@/components/fx/Scatter';
import TiltCard from '@/components/fx/TiltCard';
import Scramble from '@/components/fx/Scramble';
import { Tape } from '@/components/collage/Paper';
import ProjectsFilterGrid from '@/components/ProjectsFilterGrid';
import ReadymadeFigure from '@/components/readymade/ReadymadeFigure';
import ObjetsFigure from '@/components/objets/ObjetsFigure';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('projectsTitle'), description: t('projectsDescription'), alternates: alternates(locale, '/projects') };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const L = (text: { en: string; zh: string }) => pick(text, locale);

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

      <ProjectsFilterGrid projects={PROJECTS} />

      <section className="section" aria-labelledby="collab-heading">
        <RevealHeading id="collab-heading" text={t('collaborations')} index="§ 02" />
        <p className="section-intro">{t('collaborationsIntro')}</p>
        <Scatter className="collab-grid" variant="collage">
          {COLLABORATIONS.map((c) => (
            <TiltCard key={c.id} as="article" className="collab-card" max={3}>
              <Tape className="tape-tl" />
              <Tape className="tape-br" />
              <div className="collab-head">
                <span className={`badge ${c.visibility === 'public' ? 'badge-public' : 'badge-private'}`}>
                  {c.visibility === 'private' && <Lock size={12} aria-hidden="true" />}
                  <Scramble text={c.visibility === 'public' ? t('publicRepo') : t('privateRepo')} />
                </span>
                <Scramble className="collab-owner" text={t('owner', { owner: c.owner })} />
              </div>
              <h3 className="collab-title">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="soviet-link">
                    {L(c.title)} <ArrowUpRight size={18} aria-hidden="true" className="inline" />
                  </a>
                ) : (
                  L(c.title)
                )}
              </h3>
              <p className="collab-summary">{L(c.summary)}</p>
              <h4 className="collab-sub">
                <Scramble text={t('contributions')} />
              </h4>
              <ul className="collab-points">
                {c.contributions.map((p, i) => (
                  <li key={i}>{L(p)}</li>
                ))}
              </ul>
              <ul className="card-tech">
                {c.tech.map((tech) => (
                  <li key={tech} className="tech-chip">
                    <Scramble text={tech} delay={150} />
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </Scatter>
      </section>
    </div>
  );
}