import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { PROFILE, CONTACTS, getAge } from '@/lib/profile';
import { PROGRAMME, SEMESTERS } from '@/lib/education';
import { SKILL_GROUPS, EXPERIENCE, LANGUAGES, CERTIFICATION, ACHIEVEMENTS } from '@/lib/cv';
import { FEATURED_IDS, getProject, type Project } from '@/lib/projects';
import { pick } from '@/lib/i18n-text';
import { alternates } from '@/lib/seo';
import CvSection from '@/components/CvSection';
import PrintButton from '@/components/PrintButton';
import TransitionLink from '@/components/transition/TransitionLink';
import DadaTypography from '@/components/fx/DadaTypography';
import Scatter from '@/components/fx/Scatter';
import SheetIntro from '@/components/SheetIntro';

// The age is derived from the current date, so regenerate the page daily.
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: { absolute: t('cvTitle') }, description: t('cvDescription'), alternates: alternates(locale, '') };
}

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('cv');
  const tn = await getTranslations('transition');  const L = (text: { en: string; zh: string }) => pick(text, locale);
  const featured = FEATURED_IDS.map(getProject).filter(Boolean) as Project[];
  const finalSemester = SEMESTERS[SEMESTERS.length - 1];
  const printedContacts = CONTACTS.filter((c) => ['email', 'phone', 'github', 'linkedin'].includes(c.kind));

  return (
    <div className="page page-cv">
      <div className="cv-toolbar no-print">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {t('document')} · 2026
        </p>
        <PrintButton />
      </div>

      <SheetIntro>
        <article className="cv-sheet" id="cv-sheet">
          <span className="sheet-mark sheet-mark-tl no-print" aria-hidden="true" />
          <span className="sheet-mark sheet-mark-tr no-print" aria-hidden="true" />
          <span className="sheet-mark sheet-mark-bl no-print" aria-hidden="true" />
          <span className="sheet-mark sheet-mark-br no-print" aria-hidden="true" />
          <span className="sheet-stamp no-print" aria-hidden="true">
            <span>HKCT</span>
            <span className="sheet-stamp-star">★</span>
            <span>2026</span>
          </span>

          <header className="cv-head" data-sheet-part="">
            <div className="cv-identity">
              <p className="cv-doc-label">{t('document')}</p>
              <DadaTypography as="h1" text={PROFILE.name.en} className="cv-name font-title" colorShift intensity={0.8} />
              <p className="cv-name-zh" lang="zh-HK">
                {PROFILE.name.zh}
              </p>
              <p className="cv-role">{L(PROFILE.title)}</p>
              <p className="cv-descriptor">{L(PROFILE.descriptor)}</p>
            </div>
            <dl className="cv-contact">
              {printedContacts.map((c) => (
                <div key={c.kind} className="cv-contact-row">
                  <dt>{t(`labels.${c.kind as 'email' | 'phone' | 'github' | 'linkedin'}`)}</dt>
                  <dd>
                    <a href={c.href} {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      <span className="screen-only">{c.label}</span>
                      <span className="print-only">{c.print}</span>
                    </a>
                  </dd>
                </div>
              ))}
              <div className="cv-contact-row">
                <dt>{t('labels.location')}</dt>
                <dd>{L(PROFILE.location)}</dd>
              </div>
              <div className="cv-contact-row">
                <dt>{t('labels.age')}</dt>
                <dd>{t('age', { age: getAge() })}</dd>
              </div>
            </dl>
          </header>

          <div className="cv-columns">
            <Scatter variant="rise" className="cv-main" stagger={0.1}>
              <CvSection title={t('profile')}>
                <div className="cv-summary">
                  {PROFILE.summary.map((p, i) => (
                    <p key={i}>{L(p)}</p>
                  ))}
                </div>
              </CvSection>

              <CvSection title={t('education')}>
                <div className="cv-entry">
                  <div className="cv-entry-head">
                    <h3 className="cv-entry-title">{L(PROGRAMME.title)}</h3>
                    <span className="cv-entry-period">{L(PROGRAMME.period)}</span>
                  </div>
                  <p className="cv-entry-org">
                    {L(PROGRAMME.institution)} · QF {PROGRAMME.qfLevel} · {PROGRAMME.code}
                  </p>
                  <ul className="cv-figures">
                    <li>
                      <span className="cv-figure font-title">{PROGRAMME.cgpa.toFixed(1)}</span>
                      <span className="cv-figure-label">{t('cgpa')}</span>
                    </li>
                    <li>
                      <span className="cv-figure font-title">{PROGRAMME.finalTermGpa.toFixed(1)}</span>
                      <span className="cv-figure-label">{t('termGpa')}</span>
                    </li>
                    <li>
                      <span className="cv-figure-text">{L(PROGRAMME.graduated)}</span>
                    </li>
                  </ul>
                  <p className="cv-final-label">{t('finalSemester')}</p>
                  <ul className="cv-grades">
                    {finalSemester.courses.map((c) => (
                      <li key={c.code}>
                        <span>{L(c.name)}</span>
                        <span className="cv-grade">{c.grade}</span>
                      </li>
                    ))}
                  </ul>
                  <TransitionLink href="/education" label={tn('education')} className="cv-more no-print">
                    {t('fullRecord')} <ArrowUpRight size={14} aria-hidden="true" />
                  </TransitionLink>
                </div>
              </CvSection>

              <CvSection title={t('featured')}>
                {featured.map((p) => (
                  <div key={p.id} className="cv-entry">
                    <div className="cv-entry-head">
                      <h3 className="cv-entry-title">
                        <TransitionLink href={`/projects/${p.id}`} label={L(p.title)}>
                          {L(p.title)}
                        </TransitionLink>
                      </h3>
                      <span className="cv-entry-period">{L(p.tagline)}</span>
                    </div>
                    <p>{L(p.summary)}</p>
                    {p.tech.length > 0 && <p className="cv-tech">{p.tech.slice(0, 7).join(' · ')}</p>}
                  </div>
                ))}
                <TransitionLink href="/projects" label={tn('projects')} className="cv-more no-print">
                  {t('allProjects')} <ArrowUpRight size={14} aria-hidden="true" />
                </TransitionLink>
              </CvSection>

              <CvSection title={t('experience')}>
                {EXPERIENCE.map((e) => (
                  <div key={e.id} className="cv-entry">
                    <div className="cv-entry-head">
                      <h3 className="cv-entry-title">{L(e.role)}</h3>
                      <span className="cv-entry-period">{L(e.period)}</span>
                    </div>
                    <p className="cv-entry-org">{L(e.organisation)}</p>
                    <ul className="cv-bullets">
                      {e.points.map((pt, i) => (
                        <li key={i}>{L(pt)}</li>
                      ))}
                    </ul>
                    {e.upcoming && <p className="cv-note">{L(e.upcoming)}</p>}
                  </div>
                ))}
              </CvSection>
            </Scatter>

            <Scatter variant="rise" className="cv-side" stagger={0.1}>
              <CvSection title={t('skills')}>
                <div className="cv-skills">
                  {SKILL_GROUPS.map((g) => (
                    <div key={g.id} className="cv-skill-group">
                      <h3 className="cv-skill-label">{L(g.label)}</h3>
                      <p className="cv-skill-items">{g.items.map((i) => L(i)).join(' · ')}</p>
                    </div>
                  ))}
                </div>
              </CvSection>

              <CvSection title={t('languages')}>
                <ul className="cv-langs">
                  {LANGUAGES.map((l) => (
                    <li key={l.name.en}>
                      <span className="cv-lang-name">{L(l.name)}</span>
                      <span className="cv-lang-level">{L(l.level)}</span>
                    </li>
                  ))}
                </ul>
              </CvSection>

              <CvSection title={t('certification')}>
                <p className="cv-cert">
                  <span className="cv-lang-name">{L(CERTIFICATION.name)}</span>
                  <span className="cv-cert-result font-title">{L(CERTIFICATION.result)}</span>
                </p>
              </CvSection>

              <CvSection title={t('achievements')}>
                <ul className="cv-achievements">
                  {ACHIEVEMENTS.map((a) => (
                    <li key={a.id}>
                      <p className="cv-ach-title">
                        {L(a.title)} <span className="cv-ach-year">{a.year}</span>
                      </p>
                      <p className="cv-ach-award">{L(a.award)}</p>
                      <p className="cv-ach-detail">{L(a.detail)}</p>
                    </li>
                  ))}
                </ul>
              </CvSection>
            </Scatter>
          </div>
        </article>
      </SheetIntro>
    </div>
  );
}
