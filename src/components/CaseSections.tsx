import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { Dispatch, Excerpt, Exhibit, FlowStep } from '@/lib/casefile';
import { pick } from '@/lib/i18n-text';
import { Tape } from './collage/Paper';
import Scatter from './fx/Scatter';

/// The evidence sections of a case study. All four are server components with plain text in the DOM, so the
/// facts stay readable without JavaScript and under reduced motion; only their entrance uses `Scatter`.

// How the system works: a numbered wiring sheet that reads top to bottom at every width, so it needs no
// separate phone layout. Each hand-over between stages is labelled on its connector.
export async function CaseFlow({ steps }: { steps: FlowStep[] }) {
  const locale = await getLocale();
  return (
    <Scatter as="ol" className="case-flow" variant="rise">
      {steps.map((step, index) => (
        <li key={step.name.en} className="flow-step">
          <span className="flow-number font-title" aria-hidden="true">
            {index + 1}
          </span>
          <div className="flow-card">
            <p className="flow-name">{pick(step.name, locale)}</p>
            <p className="flow-note">{pick(step.note, locale)}</p>
          </div>
          {step.link && index < steps.length - 1 && (
            <p className="flow-link">
              <ArrowDown size={13} aria-hidden="true" />
              <span>{pick(step.link, locale)}</span>
            </p>
          )}
        </li>
      ))}
    </Scatter>
  );
}

// Engineering stories as newspaper clippings: paper in both themes, each split into problem, decision and result.
export async function CaseDispatches({ dispatches }: { dispatches: Dispatch[] }) {
  const locale = await getLocale();
  const t = await getTranslations('project');
  return (
    <Scatter className="case-dispatches" variant="collage">
      {dispatches.map((dispatch, index) => (
        <article key={dispatch.title.en} className="dispatch">
          <p className="dispatch-kicker">{t('dispatch', { number: index + 1 })}</p>
          <h3 className="dispatch-title">{pick(dispatch.title, locale)}</h3>
          <dl className="dispatch-body">
            <div>
              <dt>{t('problem')}</dt>
              <dd>{pick(dispatch.problem, locale)}</dd>
            </div>
            <div>
              <dt>{t('decision')}</dt>
              <dd>{pick(dispatch.decision, locale)}</dd>
            </div>
            <div>
              <dt>{t('result')}</dt>
              <dd>{pick(dispatch.result, locale)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </Scatter>
  );
}

// Pictures from the project, taped down at their true proportions; the first lies across the full column.
export async function CaseExhibits({ exhibits }: { exhibits: Exhibit[] }) {
  const locale = await getLocale();
  return (
    <Scatter className="case-exhibits" variant="collage">
      {exhibits.map((exhibit) => (
        <figure key={exhibit.src} className="exhibit">
          <Tape className="tape-tl no-print" />
          <Image
            src={exhibit.src}
            alt={pick(exhibit.alt, locale)}
            width={exhibit.width}
            height={exhibit.height}
            sizes="(min-width: 1100px) 760px, 100vw"
            loading="lazy"
          />
          <figcaption>{pick(exhibit.caption, locale)}</figcaption>
        </figure>
      ))}
    </Scatter>
  );
}

// Real source, shown verbatim on paper with a permalink to the commit it came from. The block takes keyboard
// focus because a focusable scroll area is the only way a keyboard reader can reach its overflow, and it is a
// named group because a bare `pre` is generic, a role that may not carry an `aria-label`.
export async function CaseExcerpts({ excerpts }: { excerpts: Excerpt[] }) {
  const locale = await getLocale();
  const t = await getTranslations('project');
  return (
    <div className="case-excerpts">
      {excerpts.map((excerpt) => (
        <figure key={excerpt.url} className="excerpt">
          <figcaption className="excerpt-head">
            <span className="excerpt-title">{pick(excerpt.title, locale)}</span>
            <a href={excerpt.url} target="_blank" rel="noopener noreferrer" className="excerpt-path">
              <span>{excerpt.path}</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </figcaption>
          <pre role="group" tabIndex={0} aria-label={`${t('excerptLabel')}: ${excerpt.path}`}>
            <code lang="en" data-language={excerpt.language}>
              {excerpt.code}
            </code>
          </pre>
          <p className="excerpt-note">{pick(excerpt.note, locale)}</p>
        </figure>
      ))}
    </div>
  );
}
