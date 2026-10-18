'use client';

import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Flag } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, FULL_MOTION } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';
import { formatDate, formatMonth, pick } from '@/lib/i18n-text';
import type { TimelineEntry } from '@/lib/projects';
import InlineVideo from './InlineVideo';

/**
 * Development record, newest first. The spine fills as you scroll back through it, each entry slides in
 * from alternating sides, and its node ignites when reached.
 */
export default function DevTimeline({ entries }: { entries: TimelineEntry[] }) {
  const locale = useLocale();
  const t = useTranslations('project');
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-entry]', root);
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, (_ctx, contextSafe) => {
        gsap.fromTo(
          root.querySelector('[data-spine]'),
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 } },
        );
        gsap.set(items, { opacity: 0, x: (i) => (i % 2 === 0 ? -48 : 48) });
        markReady(root);
        return playOnReveal(contextSafe, () => {
          items.forEach((item) => {
            ScrollTrigger.create({
              trigger: item,
              start: 'top 82%',
              once: true,
              onEnter: () => {
                gsap.to(item, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' });
                item.classList.add('is-reached');
              },
            });
          });
        });
      });
      markReady(root);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="dev-timeline" data-fx-hide="">
      <span className="timeline-spine no-print" aria-hidden="true">
        <span data-spine className="timeline-spine-fill" />
      </span>
      <ol className="timeline-list">
        {entries.map((e, i) => (
          <li key={`${e.type}-${e.date}-${i}`} data-entry="" className={`timeline-entry timeline-${e.type}`}>
            <span className="timeline-node" aria-hidden="true" />
            {e.type === 'milestone' ? (
              <div className="timeline-milestone">
                <p className="timeline-date">
                  <Flag size={14} aria-hidden="true" />
                  {e.milestone.approximate && <span className="timeline-approx">{t('approx')} </span>}
                  {e.milestone.approximate ? formatMonth(e.date, locale) : formatDate(e.date, locale)}
                </p>
                <p className="timeline-title font-title">{pick(e.milestone.title, locale)}</p>
                <span className="badge">{t('milestone')}</span>
              </div>
            ) : (
              <div className="timeline-video">
                <p className="timeline-date">{formatDate(e.date, locale)}</p>
                <p className="timeline-title font-title">{pick(e.video.title, locale)}</p>
                <InlineVideo video={e.video} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
