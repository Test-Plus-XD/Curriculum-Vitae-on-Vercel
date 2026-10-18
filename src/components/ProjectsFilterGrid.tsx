'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP, Flip, ScrollTrigger, FULL_MOTION, prefersReducedMotion } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';
import { CATEGORIES, type Category, type Project } from '@/lib/projects';
import ProjectCard from './ProjectCard';

type Filter = 'all' | Category;

/**
 * Category filter over the project grid. Cards scatter in on first view; changing the filter re-flows the
 * grid with Flip — leaving cards fold away, staying cards glide to their new cells, arriving cards pop in.
 */
export default function ProjectsFilterGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations('projects');
  const [filter, setFilter] = useState<Filter>('all');
  const rootRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const pillState = useRef<Flip.FlipState | null>(null);

  const filters: Filter[] = ['all', ...CATEGORIES];
  const count = (f: Filter) => (f === 'all' ? projects.length : projects.filter((p) => p.categories.includes(f)).length);
  const visible = (p: Project) => filter === 'all' || p.categories.includes(filter);

  // First view: scatter in along the shared diagonal.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root);
      const mm = gsap.matchMedia();
      mm.add({ full: FULL_MOTION, reduced: '(prefers-reduced-motion: reduce)' }, (ctx, contextSafe) => {
        const { full } = ctx.conditions as { full: boolean };
        gsap.set(cards, full ? { opacity: 0, x: 32, y: 32, rotation: () => gsap.utils.random(-2, 2) } : { opacity: 0 });
        markReady(root);
        return playOnReveal(contextSafe, () => {
          ScrollTrigger.batch(cards, {
            start: 'top 94%',
            once: true,
            onEnter: (batch) =>
              gsap.to(
                batch,
                full
                  ? { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.4)' }
                  : { opacity: 1, duration: 0.5, stagger: 0.05 },
              ),
          });
        });
      });
    },
    { scope: rootRef },
  );

  // After the filter changes the DOM, play from the captured state.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (pillState.current) {
        // The pill re-mounts inside the newly active button; match it to the old one by data-flip-id.
        Flip.from(pillState.current, { targets: root.querySelectorAll('[data-pill]'), duration: 0.5, ease: 'expo.inOut' });
        pillState.current = null;
      }
      if (!flipState.current) return;
      const state = flipState.current;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.7,
        ease: 'expo.inOut',
        absolute: true,
        stagger: 0.03,
        nested: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.85, rotation: -3 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.6, delay: 0.2, ease: 'back.out(1.6)' },
          ),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, rotation: 3, duration: 0.35, ease: 'power2.in' }),
        // Refresh outside this context so other components' ScrollTrigger callbacks don't run inside it.
        onComplete: () => void requestAnimationFrame(() => ScrollTrigger.refresh()),
      });
    },
    { scope: rootRef, dependencies: [filter] },
  );

  const choose = (f: Filter) => {
    if (f === filter) return;
    const root = rootRef.current;
    if (root && !prefersReducedMotion()) {
      const cards = root.querySelectorAll('[data-card]');
      // Cards hidden by the first-view scatter are made visible before measuring.
      gsap.set(cards, { opacity: 1, x: 0, y: 0, rotation: 0 });
      flipState.current = Flip.getState(cards);
      pillState.current = Flip.getState(root.querySelector('[data-pill]'));
    }
    setFilter(f);
  };

  return (
    <div ref={rootRef} className="projects-browser" data-fx-hide="">
      <div className="filter-bar" role="group" aria-label={t('filterLabel')}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-button ${filter === f ? 'is-active' : ''}`}
            aria-pressed={filter === f}
            onClick={() => choose(f)}
          >
            {filter === f && <span data-pill data-flip-id="pill" className="filter-pill" aria-hidden="true" />}
            <span className="filter-label">{t(f)}</span>
            <span className="filter-count">{count(f)}</span>
          </button>
        ))}
        <p className="filter-status" aria-live="polite">
          {t('showing', { count: count(filter) })}
        </p>
      </div>
      <ul className="project-grid">
        {projects.map((p) => (
          <li key={p.id} data-card="" data-flip-id={p.id} className={`project-cell ${visible(p) ? '' : 'is-hidden'}`}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
