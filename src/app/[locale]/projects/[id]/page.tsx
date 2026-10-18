import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, Github, Radio } from 'lucide-react';
import { PROJECT_IDS, buildTimeline, getProject } from '@/lib/projects';
import { getCourse } from '@/lib/education';
import { pick } from '@/lib/i18n-text';
import { alternates } from '@/lib/seo';
import DadaTypography from '@/components/fx/DadaTypography';
import RevealHeading from '@/components/fx/RevealHeading';
import Scatter from '@/components/fx/Scatter';
import Counter from '@/components/fx/Counter';
import Magnetic from '@/components/fx/Magnetic';
import TransitionLink from '@/components/transition/TransitionLink';
import DevTimeline from '@/components/DevTimeline';
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
  const related = project.related ? getProject(project.related) : undefined;
  const parentOf = getProjectChildren(id);
  const timeline = buildTimeline(project);
  let section = 0;
  const index = () => `§ ${String(++section).padStart(2, '0')}`;

  return (
    <div className="page page-detail">
      <TransitionLink href="/projects" label={tn('projects')} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        {tc('back')}
      </TransitionLink>

      <section className="detail-hero">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {L(project.tagline)}
        </p>
        <DadaTypography as="h1" text={title} className="hero-title detail-title font-title" colorShift intensity={0.9} />
        {project.categories.length > 0 && (
          <ul className="card-cats">
            {project.categories.map((c) => (
              <li key={c} className={`badge badge-${c}`}>
                {tp(c)}
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
                  {L(project.live.label)}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </Magnetic>
            )}
            {project.repos.map((r) => (
              <Magnetic key={r.url} strength={0.2}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="action-button">
                  <Github size={16} aria-hidden="true" />
                  {L(r.label)}
                </a>
              </Magnetic>
            ))}
          </div>
        )}
      </section>

      {project.highlights && (
        <Scatter as="ul" className="highlight-strip" variant="collage">
          {project.highlights.map((h) => (
            <li key={h.label.en} className="highlight">
              <Counter value={h.value} suffix={h.suffix} className="highlight-value font-title" />
              <span className="highlight-label">{L(h.label)}</span>
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
                          {L(p.name)}
                          {p.primary && <span className="badge badge-primary">{t('primary')}</span>}
                        </p>
                        <p className="platform-stack">{p.stack}</p>
                        {course && (
                          <p className="platform-course">
                            {course.code} · {L(course.name)}
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
                <h2 className="side-title">{t('tech')}</h2>
                <ul className="card-tech">
                  {project.tech.map((tech) => (
                    <li key={tech} className="tech-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="side-block">
              <h2 className="side-title">{t('courses')}</h2>
              <ul className="side-courses">
                {project.courses.map((code) => {
                  const course = getCourse(code);
                  return (
                    <li key={code}>
                      <span className="course-code">{code}</span>
                      <span>{course ? L(course.name) : code}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="side-block">
              <h2 className="side-title">{t('repos')}</h2>
              {project.repos.length > 0 ? (
                <ul className="side-links">
                  {project.repos.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="soviet-link">
                        <Github size={14} aria-hidden="true" />
                        {L(r.label)}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="side-muted">{t('noRepo')}</p>
              )}
            </div>
            {(related || parentOf.length > 0) && (
              <div className="side-block">
                <h2 className="side-title">{t('related')}</h2>
                <ul className="side-links">
                  {[...(related ? [related] : []), ...parentOf].map((r) => (
                    <li key={r.id}>
                      <TransitionLink href={`/projects/${r.id}`} label={L(r.title)} className="soviet-link">
                        {L(r.title)}
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Projects that name this one as their parent (e.g. Pour Rice → its Swift iOS sub-project). */
function getProjectChildren(id: string) {
  return PROJECT_IDS.map(getProject).filter((p): p is NonNullable<typeof p> => !!p && p.related === id);
}
