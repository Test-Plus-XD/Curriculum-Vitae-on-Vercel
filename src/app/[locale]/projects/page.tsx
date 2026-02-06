'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/lib/projects';

/* ─────────────────────────────────────────────────────────── types       */
type CategoryFilter = 'all' | 'mobile' | 'web' | 'game' | 'backend';

/* ─────────────────────────────────────────────────────── page component  */
export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const locale = useLocale();
  const t      = useTranslations('projects');

  const filters: { key: CategoryFilter; label: string }[] = [
    { key: 'all',     label: t('filterAll') },
    { key: 'mobile',  label: t('filterMobile') },
    { key: 'web',     label: t('filterWeb') },
    { key: 'game',    label: t('filterGame') },
    { key: 'backend', label: t('filterBackend') },
  ];

  const displayed = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.categories.includes(activeFilter));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* heading */}
      <h1 className="text-2xl text-slate-800 dark:text-white mb-6 font-title font-light italic glow-heading">
        {t('allProjects')}
      </h1>

      {/* filter pills — hidden on print */}
      <div className="print:hidden flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-1.5 text-sm rounded-full transition-all ${
              activeFilter === f.key
                ? 'bg-blue-600 text-white dark:text-soviet-beige soviet-filter-active'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 soviet-filter'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* project count */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        {displayed.length}{' '}
        {locale === 'zh-hk'
          ? '個項目'
          : displayed.length === 1 ? 'project' : 'projects'}
      </p>

      {/* project grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayed.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
