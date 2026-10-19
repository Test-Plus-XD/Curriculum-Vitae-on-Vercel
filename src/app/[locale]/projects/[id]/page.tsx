import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Radio } from 'lucide-react';
import { PROJECTS, PROJECT_IDS, buildTimeline, getProject, videosNewestFirst } from '@/lib/projects';
import { getCourse } from '@/lib/education';
import { formatDate, pick } from '@/lib/i18n-text';
import { alternates } from '@/lib/seo';
import DadaTypography from '@/components/fx/DadaTypography';
import HeroWedge from '@/components/fx/HeroWedge';
import ReadingRule from '@/components/fx/ReadingRule';
import RevealHeading from '@/components/fx/RevealHeading';
import Scatter from '@/components/fx/Scatter';
import Counter from '@/components/fx/Counter';
import Magnetic from '@/components/fx/Magnetic';
import Scramble from '@/components/fx/Scramble';
import TransitionLink from '@/components/transition/TransitionLink';
import DevTimeline from '@/components/DevTimeline';
import DetailPhoto from '@/components/DetailPhoto';
import KeepCompounds from '@/components/KeepCompounds';
import OrbitDiagram from '@/components/OrbitDiagram';

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECT_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const project = getProject(id);
  if (!project) return {};
  return {
    title: pick(project.title, locale),
    description: pick(project.summary, locale),
    alternates: alternates(locale, `/projects/${id}`),
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const project = getProject(id);
  if (!project) notFound();

  const t = await getTranslations('project');
  const tc = await getTranslations('controls');
  const tp = await getTranslations('projects');
  const tn = await getTranslations('transition');
  const L = (text: { en: string; zh: string }) => pick(text, locale);
  const title = L(project.title);
  const timeline = buildTimeline(project);
  let section = 0;
  const index = () => `§ ${String(++section).padStart(2, '0')}`;
  // The latest reel's still is pasted into the hero as a press photograph (Pour Rice shows its app icon).
  const lead = id === 'pourrice' ? undefined : videosNewestFirst(project)[0];
  // The neighbouring stories in the gazette's order, wrapping round at either end.
  const at = PROJECT_IDS.indexOf(id);
  const prev = PROJECTS[(at - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(at + 1) % PROJECTS.length];

  return (
    <div className="page page-detail">
      <ReadingRule />
      <TransitionLink href="/projects" label={tn('projects')} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        <Scramble text={tc('back')} />
      </TransitionLink>

      <section className={`detail-hero ${id === 'pourrice' ? 'detail-hero-pour-rice' : ''}`}>
        <HeroWedge />
        <div className={`detail-hero-layout ${lead ? 'has-photo' : ''}`}>
          <div className="detail-hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              <Scramble text={L(project.tagline)} />
            </p>
            <DadaTypography as="h1" text={title} className="hero-title detail-title font-title" colorShift intensity={0.9} />
            {project.categories.length > 0 && (
              <ul className="card-cats">
                {project.categories.map((c) => (
                  <li key={c} className={`badge badge-${c}`}>
                    <Scramble text={tp(c)} delay={150} />
                  </li>
                ))}
              </ul>
            )}
            <p className="hero-lede">{L(project.summary)}</p>
            {(project.live || project.repos.length > 0) && (
              <div className="detail-actions">
                {project.live && (
                  <Magnetic>
                    <a href={project.live.url} target="_blank" rel="noopener noreferrer" className="action-button action-primary">
                      <Radio size={16} aria-hidden="true" />
                      <Scramble text={L(project.live.label)} delay={200} />
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </Magnetic>
                )}
                {project.repos.map((r) => (
                  <Magnetic key={r.url} strength={0.2}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="action-button">
                      <Github size={16} aria-hidden="true" />
                      <Scramble text={L(r.label)} delay={200} />
                    </a>
                  </Magnetic>
                ))}
              </div>
            )}
          </div>
          {id === 'pourrice' && (
            <figure className="project-app-icon">
              <Image
                src="/images/pour-rice-app-light.png"
                alt={locale === 'zh-hk' ? 'Pour Rice 倒米應用程式圖示' : 'Pour Rice app icon'}
                width={480}
                height={480}
                className="project-app-icon-light"
                unoptimized
              />
              <Image
                src="/images/pour-rice-app-dark.png"
                alt=""
                width={480}
                height={480}
                className="project-app-icon-dark"
                aria-hidden="true"
                unoptimized
              />
            </figure>
          )}
          {lead && (
            <Scatter as="div" className="detail-photo-wrap" variant="collage">
              <DetailPhoto
                video={lead}
                caption={L(lead.title)}
                credit={`${tp('gazette.credit', { count: project.videos.length })} · ${formatDate(lead.date, locale)}`}
              />
            </Scatter>
          )}
        </div>
      </section>

      {project.highlights && (
        <Scatter as="ul" className="highlight-strip" variant="collage">
          {project.highlights.map((h) => (
            <li key={h.label.en} className="highlight">
              <Counter value={h.value} suffix={h.suffix} className="highlight-value font-title" />
              <Scramble className="highlight-label" text={L(h.label)} delay={300} />
            </li>
          ))}
        </Scatter>
      )}

      <div className="detail-grid">
        <div className="detail-main">
          <section className="section" aria-labelledby="overview-heading">
            <RevealHeading id="overview-heading" text={t('overview')} index={index()} />
            <p className="detail-description">{L(project.description)}</p>
            {project.details && (
              <Scatter as="ul" className="detail-points" variant="rise">
                {project.details.map((d, i) => (
                  <li key={i}>{L(d)}</li>
                ))}
              </Scatter>
            )}
          </section>

          {project.platforms && (
            <section className="section" aria-labelledby="platforms-heading">
              <RevealHeading id="platforms-heading" text={t('platforms')} index={index()} />
              <div className="platforms-layout">
                <OrbitDiagram
                  core="Firebase"
                  services={[{ label: 'Vercel API' }, { label: 'Socket.IO' }]}
                  clients={[
                    { label: 'PWA', sub: 'Ionic', primary: true },
                    { label: 'Android', sub: 'Flutter' },
                    { label: 'iOS', sub: 'Swift' },
                  ]}
                />
                <Scatter as="ul" className="platform-list" variant="rise">
                  {project.platforms.map((p) => {
                    const course = p.course ? getCourse(p.course) : undefined;
                    return (
                      <li key={p.name.en} className="platform-item">
                        <p className="platform-name">
                          <Scramble text={L(p.name)} />
                          {p.primary && (
                            <span className="badge badge-primary">
                              <Scramble text={t('primary')} delay={150} />
                            </span>
                          )}
                        </p>
                        <p className="platform-stack">
                          <Scramble text={p.stack} delay={120} />
                        </p>
                        {course && (
                          <p className="platform-course">
                            <Scramble text={`${course.code} · ${L(course.name)}`} delay={200} />
                          </p>
                        )}
                      </li>
                    );
                  })}
                </Scatter>
              </div>
            </section>
          )}

          <section className="section" aria-labelledby="timeline-heading">
            <RevealHeading id="timeline-heading" text={t('timeline')} index={index()} />
            {project.videos.length === 0 && <p className="footnote">{t('noVideos')}</p>}
            <DevTimeline entries={timeline} />
          </section>
        </div>

        <aside className="detail-side">
          <div className="side-panel">
            {project.tech.length > 0 && (
              <div className="side-block">
                <h2 className="side-title">
                  <Scramble text={t('tech')} />
                </h2>
                <ul className="card-tech">
                  {project.tech.map((tech) => (
                    <li key={tech} className="tech-chip">
                      <Scramble text={tech} delay={100} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="side-block">
              <h2 className="side-title">
                <Scramble text={t('courses')} />
              </h2>
              <ul className="side-courses">
                {project.courses.map((code) => {
                  const course = getCourse(code);
                  return (
                    <li key={code}>
                      <Scramble className="course-code" text={code} />
                      <Scramble text={course ? L(course.name) : code} delay={120} />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="side-block">
              <h2 className="side-title">
                <Scramble text={t('repos')} />
              </h2>
              {project.repos.length > 0 ? (
                <ul className="side-links">
                  {project.repos.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="soviet-link">
                        <Github size={14} aria-hidden="true" />
                        <Scramble text={L(r.label)} delay={200} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="side-muted">{t('noRepo')}</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <nav className="story-nav-wrap" aria-label={t('moreStories')}>
        <Scatter as="div" className="story-nav" variant="collage">
          <TransitionLink href={`/projects/${prev.id}`} label={L(prev.title)} className="story-nav-link is-prev">
            <span className="story-nav-kicker">
              <ArrowLeft size={14} aria-hidden="true" />
              {t('previousStory')}
            </span>
            <span className="story-nav-title font-title">
              <KeepCompounds text={L(prev.title)} />
            </span>
            <span className="story-nav-deck">{L(prev.tagline)}</span>
          </TransitionLink>
          <TransitionLink href={`/projects/${next.id}`} label={L(next.title)} className="story-nav-link is-next">
            <span className="story-nav-kicker">
              {t('nextStory')}
              <ArrowRight size={14} aria-hidden="true" />
            </span>
            <span className="story-nav-title font-title">
              <KeepCompounds text={L(next.title)} />
            </span>
            <span className="story-nav-deck">{L(next.tagline)}</span>
          </TransitionLink>
        </Scatter>
      </nav>
    </div>
  );
}
