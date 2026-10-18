'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, PlayCircle } from 'lucide-react';
import type { Project } from '@/lib/projects';
import { videosNewestFirst } from '@/lib/projects';
import { pick } from '@/lib/i18n-text';
import { parseYouTube, thumbnailUrl } from '@/lib/youtube';
import TiltCard from './fx/TiltCard';
import TransitionLink from './transition/TransitionLink';
import PosterArt from './PosterArt';

/** Project card: split video thumbnails (or generated poster), categories, summary, stack and a stretched link. */
export default function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale();
  const t = useTranslations('projects');
  const title = pick(project.title, locale);
  const thumbs = videosNewestFirst(project)
    .slice(0, 2)
    .map((v) => parseYouTube(v.url))
    .filter((v): v is NonNullable<typeof v> => v !== null);
  const extraTech = project.tech.length - 4;

  return (
    <TiltCard as="article" className="project-card" max={5}>
      <div className={`card-media ${thumbs.length === 2 ? 'is-split' : ''}`}>
        {thumbs.length > 0 ? (
          thumbs.map((th, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- YouTube CDN thumbnails, already sized
            <img
              key={th.id}
              src={thumbnailUrl(th.id)}
              alt=""
              loading="lazy"
              decoding="async"
              className={`card-thumb card-thumb-${i}`}
            />
          ))
        ) : (
          <PosterArt seed={project.id} label="" />
        )}
        <span className="card-scan no-print" aria-hidden="true" />
        {project.videos.length > 0 && (
          <span className="card-video-count">
            <PlayCircle size={14} aria-hidden="true" />
            {t('videos', { count: project.videos.length })}
          </span>
        )}
      </div>
      <div className="card-body">
        {project.categories.length > 0 && (
          <ul className="card-cats">
            {project.categories.map((c) => (
              <li key={c} className={`badge badge-${c}`}>
                {t(c)}
              </li>
            ))}
          </ul>
        )}
        <h3 className="card-title font-title">
          <TransitionLink href={`/projects/${project.id}`} label={title} className="card-link">
            {title}
          </TransitionLink>
        </h3>
        <p className="card-tagline">{pick(project.tagline, locale)}</p>
        <p className="card-summary">{pick(project.summary, locale)}</p>
        {project.tech.length > 0 && (
          <ul className="card-tech">
            {project.tech.slice(0, 4).map((tech) => (
              <li key={tech} className="tech-chip">
                {tech}
              </li>
            ))}
            {extraTech > 0 && <li className="tech-chip tech-chip-more">+{extraTech}</li>}
          </ul>
        )}
        <div className="card-foot">
          <span className="card-courses">
            {project.courses[0]}
            {project.courses.length > 1 && ` +${project.courses.length - 1}`}
          </span>
          <span className="card-cta" aria-hidden="true">
            {t('view')} <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </TiltCard>
  );
}
