'use client';

import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { gsap, useGSAP, ScrollTrigger, FULL_MOTION } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';
import { pick } from '@/lib/i18n-text';
import type { Semester } from '@/lib/education';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const TRAVEL = `(min-width: 1024px) and ${FULL_MOTION}`;

/**
 * The four semesters as poster panels. On wide screens with full motion the section pins and the panels
 * travel horizontally with vertical scroll, a rail draws itself across, the current semester's node lights
 * up, and each panel's courses scatter in as it arrives. Elsewhere the panels stack and scatter in vertically.
 * The CSS uses the same media query, so layout and animation always agree.
 */
export default function SemesterTrack({ semesters }: { semesters: Semester[] }) {
  const locale = useLocale();
  const t = useTranslations('education');
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add({ travel: TRAVEL, stacked: `not all and ${TRAVEL}` }, (ctx, contextSafe) => {
        const { travel } = ctx.conditions as { travel: boolean; stacked: boolean };
        const q = gsap.utils.selector(root);
        const track = q('[data-track]')[0] as HTMLElement;
        const panels = q('[data-panel]') as HTMLElement[];
        const cards = q('[data-course]') as HTMLElement[];
        const nodes = q('[data-node]') as HTMLElement[];
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (travel) {
          // Pin + horizontal travel, created synchronously so the pin spacing exists before later triggers.
          const distance = () => Math.max(0, track.scrollWidth - (track.parentElement?.clientWidth ?? window.innerWidth));
          const light = (progress: number) => {
            const current = Math.round(progress * (panels.length - 1));
            nodes.forEach((n, i) => {
              n.classList.toggle('is-lit', i === current);
              n.classList.toggle('is-passed', i <= current);
            });
          };
          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              pin: true,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => light(self.progress),
              onRefresh: (self) => light(self.progress),
            },
          });
          gsap.fromTo(
            q('[data-rail-line]'),
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: () => `+=${distance()}`,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
          gsap.set(cards, { opacity: 0, x: 48, y: 48, rotation: () => gsap.utils.random(-3, 3) });
          gsap.set(q('[data-numeral]'), { yPercent: 40, opacity: 0 });
          markReady(root);

          return playOnReveal(contextSafe, () => {
            panels.forEach((panel, i) => {
              gsap
                .timeline({
                  scrollTrigger:
                    i === 0
                      ? { trigger: root, start: 'top 70%', once: true }
                      : { trigger: panel, containerAnimation: tween, start: 'left 72%', once: true },
                })
                .to(panel.querySelector('[data-numeral]'), { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out' })
                .to(
                  panel.querySelectorAll('[data-course]'),
                  { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.9, stagger: 0.07, ease: 'back.out(1.4)' },
                  0.1,
                );
            });
          });
        }

        // Stacked layout: narrow screens, or reduced motion on wide screens.
        gsap.set(cards, reduced ? { opacity: 0 } : { opacity: 0, x: 32, y: 32 });
        markReady(root);
        return playOnReveal(contextSafe, () => {
          ScrollTrigger.batch(cards, {
            start: 'top 92%',
            once: true,
            onEnter: (batch) =>
              gsap.to(
                batch,
                reduced
                  ? { opacity: 1, duration: 0.5, stagger: 0.04 }
                  : { opacity: 1, x: 0, y: 0, duration: 0.8, stagger: 0.06, ease: 'back.out(1.4)' },
              ),
          });
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="semester-track" data-fx-hide="">
      <div className="track-hud no-print" aria-hidden="true">
        <svg className="track-rail" viewBox="0 0 1000 8" preserveAspectRatio="none">
          <line x1="0" y1="4" x2="1000" y2="4" className="rail-base" />
          <line x1="0" y1="4" x2="1000" y2="4" className="rail-line" data-rail-line="" />
        </svg>
        <ol className="track-nodes">
          {semesters.map((s, i) => (
            <li key={s.id} data-node="" className="track-node">
              <span className="track-node-dot" />
              <span className="track-node-label">{ROMAN[i]}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="track-viewport">
        <ol className="track" data-track="">
          {semesters.map((s, i) => (
            <li key={s.id} className="semester-panel" data-panel="" aria-labelledby={`sem-${s.id}`}>
              <div className="panel-head">
                <span className="panel-numeral font-title" data-numeral="" aria-hidden="true">
                  {ROMAN[i]}
                </span>
                <div>
                  <h3 id={`sem-${s.id}`} className="panel-title font-title">
                    {pick(s.label, locale)}
                  </h3>
                  <p className="panel-count">{t('courseCount', { count: s.courses.length })}</p>
                </div>
              </div>
              <ul className="course-grid">
                {s.courses.map((c) => (
                  <li key={c.code} className="course-card" data-course="">
                    <span className="course-code">{c.code}</span>
                    <span className="course-name">{pick(c.name, locale)}</span>
                    <span className="course-alt" lang={locale === 'zh-hk' ? 'en-GB' : 'zh-HK'}>
                      {pick(c.name, locale === 'zh-hk' ? 'en' : 'zh-hk')}
                    </span>
                    {c.grade && (
                      <span className="course-grade">
                        <span className="sr-only">{t('grade')}: </span>
                        <span className="font-title course-grade-value">{c.grade}</span>
                        <span className="course-credits">{t('credits', { count: c.credits ?? 0 })}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
