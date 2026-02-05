'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Github, Clock } from 'lucide-react';
import type { Project } from '@/lib/projects';
import VideoEmbed from './VideoEmbed';

/* --------------------------------------------------------- colour maps     */
const catColour: Record<string, string> = {
  mobile  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  web     : 'bg-blue-50   text-blue-700   dark:bg-blue-950   dark:text-blue-300',
  game    : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  backend : 'bg-amber-50  text-amber-700  dark:bg-amber-950  dark:text-amber-300',
};

const catLabel: Record<string, { en: string; zh: string }> = {
  mobile  : { en: 'Mobile',  zh: '手機應用' },
  web     : { en: 'Web',     zh: '網絡' },
  game    : { en: 'Game',    zh: '遊戲' },
  backend : { en: 'Backend', zh: '後端' },
};

const statusLabel: Record<string, { en: string; zh: string }> = {
  complete     : { en: 'Complete',     zh: '已完成' },
  'in-progress': { en: 'In Progress', zh: '進行中' },
  pending      : { en: 'Pending',     zh: '待開始' },
};

/* --------------------------------------------------------------- component */
interface Props { project: Project }

export default function ProjectCard({ project }: Props) {
  const locale = useLocale();
  const lang   = locale === 'zh-hk' ? 'zh' : 'en';
  const t      = useTranslations('projects');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow">

      {/* ---- title + badges ---- */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {project.title[lang]}
          </h3>
          {project.status === 'in-progress' && (
            <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-amber-600 dark:text-amber-400">
              <Clock size={10} />
              {t('inProgress')}
            </span>
          )}
        </div>

        <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
          {project.categories.map((cat) => (
            <span key={cat} className={`text-xs px-2 py-0.5 rounded-full ${catColour[cat]}`}>
              {catLabel[cat][lang]}
            </span>
          ))}
        </div>
      </div>

      {/* ---- description ---- */}
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {project.description[lang]}
      </p>

      {/* ---- platforms (PourRice only) ---- */}
      {project.platforms && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {t('pourRicePlatforms')}
          </p>
          <div className="space-y-1.5">
            {project.platforms.map((plat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{plat.name[lang]}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      plat.status === 'complete'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : plat.status === 'in-progress'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {statusLabel[plat.status][lang]}
                  </span>
                  {plat.repo && (
                    <a href={plat.repo} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Github size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- highlights (PourRice only) ---- */}
      {project.highlights && (
        <ul className="mt-3 space-y-1">
          {project.highlights[lang].map((h, i) => (
            <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* ---- tech stack ---- */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.techStack.map((tech, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
            {tech}
          </span>
        ))}
      </div>

      {/* ---- course codes ---- */}
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        {project.courses.map((c, i) => (
          <span key={i}>
            {c.code}
            {i < project.courses.length - 1 && ' · '}
          </span>
        ))}
      </p>

      {/* ---- actions row ---- */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Github size={13} />
            {t('viewRepo')}
          </a>
        )}
        {!project.repo && !project.platforms && (
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">{t('noRepo')}</span>
        )}

        {project.videos.map((v, i) => (
          <VideoEmbed key={i} embedUrl={v.embedUrl} url={v.url} title={v.title[lang]} />
        ))}
      </div>
    </div>
  );
}
