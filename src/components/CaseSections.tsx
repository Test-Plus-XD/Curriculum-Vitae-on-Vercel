import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { Dispatch, Excerpt, Exhibit, FlowStep } from '@/lib/casefile';
import { hashSeed } from '@/lib/collage';
import { pick } from '@/lib/i18n-text';
import { LabelTape, Tape, Torn } from './collage/Paper';
import RansomText from './collage/RansomText';
import Stamp from './collage/Stamp';
import Scatter from './fx/Scatter';

/// The evidence sections of a case study. All four are server components with plain text in the DOM, so the
/// facts stay readable without JavaScript and under reduced motion; only their entrance uses `Scatter`.

// A case-study section heading cut out as a ransom note, like the landing page's name. The letters are seeded
// from the section id, so server and browser cut them the same; the real text stays for assistive technology.
export function CaseHeading({ id, text, index }: { id: string; text: string; index: string }) {
  return (
    <header className="case-heading">
      <span className="case-heading-index">{index}</span>
      <h2 id={id}>
        <RansomText text={text} seed={hashSeed(id)} paste={false} />
      </h2>
    </header>
  );
}

// How it works: numbered scraps of different papers, pasted in a zigzag down the page. It reads top to bottom
// at every width, and each hand-over between stages is a strip of label tape laid across the join.
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

// Engineering stories as torn newspaper clippings, pasted out of line and stamped once across the first corner.
// The stamp sits outside `Scatter`, because the clippings' torn clip-paths would cut it off.
export async function CaseDispatches({ dispatches }: { dispatches: Dispatch[] }) {
  const locale = await getLocale();
  const t = await getTranslations('project');
  return (
    <div className="case-dispatch-wall">
      <Stamp ring={t('stampRing')} centre={t('stampCentre')} size={104} rotate={13} className="dispatch-stamp no-print" />
      <Scatter className="case-dispatches" variant="collage">
        {dispatches.map((dispatch, index) => (
          <Torn key={dispatch.title.en} as="article" seed={dispatch.title.en} depth={7} className="dispatch" innerClassName="dispatch-sheet">
            <LabelTape as="p" className="dispatch-kicker">
              {t('dispatch', { number: index + 1 })}
            </LabelTape>
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
          </Torn>
        ))}
      </Scatter>
    </div>
  );
}

// Pictures from the project, taped down at their true proportions; the first lies across the full column.
export async function CaseExhibits({ exhibits }: { exhibits: Exhibit[] }) {
  const locale = await getLocale();
  return (
    <Scatter className="case-exhibits" variant="collage">
      {exhibits.map((exhibit, index) => (
        <figure key={exhibit.src} className="exhibit">
          <Tape className={`${index % 2 ? 'tape-tr' : 'tape-tl'} no-print`} />
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

// Real source, shown verbatim on a torn sheet taped to the page, with a permalink to the commit it came from. The block takes keyboard
// focus because a focusable scroll area is the only way a keyboard reader can reach its overflow, and it is a
// named group because a bare `pre` is generic, a role that may not carry an `aria-label`.
export async function CaseExcerpts({ excerpts }: { excerpts: Excerpt[] }) {
  const locale = await getLocale();
  const t = await getTranslations('project');
  return (
    <div className="case-excerpts">
      {excerpts.map((excerpt) => (
        <div key={excerpt.url} className="excerpt-wrap">
          <Tape className="tape-top no-print" />
          <Torn as="figure" seed={excerpt.url} sides={['bottom']} depth={8} className="excerpt" innerClassName="excerpt-sheet">
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
          </Torn>
        </div>
      ))}
    </div>
  );
}
