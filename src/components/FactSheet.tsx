import { getLocale, getTranslations } from 'next-intl/server';
import { pick } from '@/lib/i18n-text';
import type { Highlight } from '@/lib/projects';
import Counter from './fx/Counter';
import Scatter from './fx/Scatter';
import Scramble from './fx/Scramble';

// A project's measured facts, set as a press sheet rather than a grid of cards: the first fact is the lead,
// struck large in a red Lissitzky slab, and the rest run as a newspaper box score with dot leaders. The order
// in the data therefore matters, so each case file puts its strongest figure first. Figures stay real text.
export default async function FactSheet({ facts }: { facts: Highlight[] }) {
  const locale = await getLocale();
  const t = await getTranslations('project');
  const [lead, ...rest] = facts;
  return (
    <section aria-label={t('byNumbers')}>
      <Scatter as="div" className={`fact-sheet ${rest.length === 0 ? 'is-single' : ''}`} variant="collage">
        <div className="fact-lead">
          <p className="fact-kicker">{t('byNumbers')}</p>
          <Counter value={lead.value} decimals={lead.decimals} suffix={lead.suffix} className="fact-lead-value font-title" />
          <Scramble className="fact-lead-label" text={pick(lead.label, locale)} delay={300} />
        </div>
        {rest.length > 0 && (
          <ul className="fact-ledger">
            {rest.map((fact) => (
              <li key={fact.label.en}>
                <Scramble className="fact-label" text={pick(fact.label, locale)} delay={300} />
                <span className="fact-leader" aria-hidden="true" />
                <Counter value={fact.value} decimals={fact.decimals} suffix={fact.suffix} className="fact-figure font-title" />
              </li>
            ))}
          </ul>
        )}
      </Scatter>
    </section>
  );
}
