import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { PROFILE, CONTACTS, getAge } from '@/lib/profile';
import { PROGRAMME, SEMESTERS } from '@/lib/education';
import { SKILL_GROUPS, EXPERIENCE, LANGUAGES, CERTIFICATION, ACHIEVEMENTS } from '@/lib/cv';
import { FEATURED_IDS, PROJECTS, getProject, videosNewestFirst, type Project } from '@/lib/projects';
import { ALL_COURSES } from '@/lib/education';
import { pick } from '@/lib/i18n-text';
import { alternates } from '@/lib/seo';
import CvSection from '@/components/CvSection';
import PrintButton from '@/components/PrintButton';
import TransitionLink from '@/components/transition/TransitionLink';
import DadaTypography from '@/components/fx/DadaTypography';
import Scatter from '@/components/fx/Scatter';
import SheetIntro from '@/components/SheetIntro';
import Scramble from '@/components/fx/Scramble';
import CollageHero from '@/components/collage/CollageHero';
import CutUpPoem from '@/components/collage/CutUpPoem';
import Stamp from '@/components/collage/Stamp';
import { Tape } from '@/components/collage/Paper';
import { parseYouTube } from '@/lib/youtube';

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
  const tn = await getTranslations('transition');
  const th = await getTranslations('hero');
  const tc = await getTranslations('cutup');
  const L = (text: { en: string; zh: string }) => pick(text, locale);
  const featured = FEATURED_IDS.map(getProject).filter(Boolean) as Project[];
  const finalSemester = SEMESTERS[SEMESTERS.length - 1];
  const printedContacts = CONTACTS.filter((c) => ['email', 'phone', 'github', 'linkedin'].includes(c.kind));

  // The collage is cut from the CV itself: real codes, grades, projects and footage.
  const upper = (text: string) => (locale === 'zh-hk' ? text : text.toUpperCase());
  const graded = finalSemester.courses.map((c) => `${c.code} ${upper(L(c.name))} ${c.grade}`);
  const heroThumbs = ['pourrice', '2d-chess', '3d-game'].flatMap((id) => {
    const project = getProject(id);
    const video = project && videosNewestFirst(project)[0];
    const yt = video && parseYouTube(video.url);
    return yt && project ? [{ id: yt.id, caption: `${upper(L(project.title))} · ${video.date.slice(0, 4)}` }] : [];
  });
  const hero = {
    label: th('label'),
    kicker: th('kicker'),
    nameLines: ['NG YU HAM', 'BALDWIN'],
    zhName: ['吳', '宇', '涵'] as [string, string, string],
    title: L(PROFILE.title),
    typed: th('typed', { descriptor: L(PROFILE.descriptor), cgpa: PROGRAMME.cgpa.toFixed(1) }),
    cue: th('cue'),
    dragHint: th('drag'),
    thumbs: heroThumbs,
    news: { headline: 'ДАДА', lines: [...graded, `CGPA ${PROGRAMME.cgpa} · GPA ${PROGRAMME.finalTermGpa}`] },
    stamp: { ring: th('stampRing'), centre: PROGRAMME.cgpa.toFixed(1), sub: upper(th('stampSub')) },
    merz: {
      snippets: [
        ...ALL_COURSES.map((c) => `${c.code} ${upper(L(c.name))}${c.grade ? ` ${c.grade}` : ''}`),
        ...PROJECTS.map((p) => `${upper(L(p.title))} — ${p.tech.slice(0, 3).join(', ')}`),
      ],
      numerals: [
        { value: PROGRAMME.cgpa.toFixed(1), caption: th('numCgpa') },
        { value: PROGRAMME.finalTermGpa.toFixed(1), caption: th('numTerm') },
        { value: 'A+', caption: th('numFyp') },
        { value: String(ALL_COURSES.length), caption: th('numCourses') },
        { value: String(PROJECTS.reduce((n, p) => n + p.videos.length, 0)), caption: th('numVideos') },
        { value: String(PROJECTS.length), caption: th('numProjects') },
        { value: '2026', caption: th('numGrad') },
        { value: '1916', caption: th('numDada') },
      ],
      words: ['ДАДА', 'МЕРЦ', 'КОД', 'DADA', 'MERZ', 'ПУСК', 'HKCT'],
      cjk: ['倒米', '港', '碼', '夢', '達達'],
      tickets: ALL_COURSES.map((c) => c.code),
    },
  };

  return (
    <>
      <CollageHero {...hero} />
      <div className="page page-cv">
        <div className="cv-toolbar no-print">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            <Scramble text={`${t('document')} · 2026`} />
          </p>
          <PrintButton />
        </div>

        <SheetIntro>
          <Tape className="tape-tl sheet-tape no-print" />
          <Tape className="tape-tr sheet-tape no-print" />
          <article className="cv-sheet" id="cv-sheet">
            <span className="sheet-mark sheet-mark-tl no-print" aria-hidden="true" />
            <span className="sheet-mark sheet-mark-tr no-print" aria-hidden="true" />
            <span className="sheet-mark sheet-mark-bl no-print" aria-hidden="true" />
            <span className="sheet-mark sheet-mark-br no-print" aria-hidden="true" />
            <span className="sheet-stamp no-print" aria-hidden="true">
              <Stamp ring={th('sheetRing')} centre="2026" sub={upper(th('numGrad'))} size={118} rotate={0} slam={false} />
            </span>

            <header className="cv-head" data-sheet-part="">
              <div className="cv-identity">
                <p className="cv-doc-label">
                  <Scramble text={t('document')} delay={150} />
                </p>
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
                    <dt>
                      <Scramble text={t(`labels.${c.kind as 'email' | 'phone' | 'github' | 'linkedin'}`)} delay={200} />
                    </dt>
                    <dd>
                      <a href={c.href} {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        <span className="screen-only">{c.label}</span>
                        <span className="print-only">{c.print}</span>
                      </a>
                    </dd>
                  </div>
                ))}
                <div className="cv-contact-row">
                  <dt>
                    <Scramble text={t('labels.location')} delay={260} />
                  </dt>
                  <dd>{L(PROFILE.location)}</dd>
                </div>
                <div className="cv-contact-row">
                  <dt>
                    <Scramble text={t('labels.age')} delay={300} />
                  </dt>
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
                      <h3 className="cv-entry-title">
                        <Scramble text={L(PROGRAMME.title)} />
                      </h3>
                      <Scramble className="cv-entry-period" text={L(PROGRAMME.period)} />
                    </div>
                    <p className="cv-entry-org">
                      <Scramble text={`${L(PROGRAMME.institution)} · QF ${PROGRAMME.qfLevel} · ${PROGRAMME.code}`} delay={120} />
                    </p>
                    <ul className="cv-figures">
                      <li>
                        <span className="cv-figure font-title">{PROGRAMME.cgpa.toFixed(1)}</span>
                        <Scramble className="cv-figure-label" text={t('cgpa')} />
                      </li>
                      <li>
                        <span className="cv-figure font-title">{PROGRAMME.finalTermGpa.toFixed(1)}</span>
                        <Scramble className="cv-figure-label" text={t('termGpa')} delay={80} />
                      </li>
                      <li>
                        <span className="cv-figure-text">{L(PROGRAMME.graduated)}</span>
                      </li>
                    </ul>
                    <p className="cv-final-label">
                      <Scramble text={t('finalSemester')} />
                    </p>
                    <ul className="cv-grades">
                      {finalSemester.courses.map((c) => (
                        <li key={c.code}>
                          <span>{L(c.name)}</span>
                          <span className="cv-grade">{c.grade}</span>
                        </li>
                      ))}
                    </ul>
                    <TransitionLink href="/education" label={tn('education')} className="cv-more no-print">
                      <Scramble text={t('fullRecord')} /> <ArrowUpRight size={14} aria-hidden="true" />
                    </TransitionLink>
                  </div>
                </CvSection>

                <CvSection title={t('featured')}>
                  {featured.map((p) => (
                    <div key={p.id} className="cv-entry">
                      <div className="cv-entry-head">
                        <h3 className="cv-entry-title">
                          <TransitionLink href={`/projects/${p.id}`} label={L(p.title)}>
                            <Scramble text={L(p.title)} />
                          </TransitionLink>
                        </h3>
                        <Scramble className="cv-entry-period" text={L(p.tagline)} />
                      </div>
                      <p>{L(p.summary)}</p>
                      {p.tech.length > 0 && <p className="cv-tech">{p.tech.slice(0, 7).join(' · ')}</p>}
                    </div>
                  ))}
                  <TransitionLink href="/projects" label={tn('projects')} className="cv-more no-print">
                    <Scramble text={t('allProjects')} /> <ArrowUpRight size={14} aria-hidden="true" />
                  </TransitionLink>
                </CvSection>

                <CvSection title={t('experience')}>
                  {EXPERIENCE.map((e) => (
                    <div key={e.id} className="cv-entry">
                      <div className="cv-entry-head">
                        <h3 className="cv-entry-title">
                          <Scramble text={L(e.role)} />
                        </h3>
                        <Scramble className="cv-entry-period" text={L(e.period)} />
                      </div>
                      <p className="cv-entry-org">
                        <Scramble text={L(e.organisation)} delay={120} />
                      </p>
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
                        <h3 className="cv-skill-label">
                        <Scramble text={L(g.label)} />
                      </h3>
                        <p className="cv-skill-items">{g.items.map((i) => L(i)).join(' · ')}</p>
                      </div>
                    ))}
                  </div>
                </CvSection>

                <CvSection title={t('languages')}>
                  <ul className="cv-langs">
                    {LANGUAGES.map((l) => (
                      <li key={l.name.en}>
                        <Scramble className="cv-lang-name" text={L(l.name)} />
                        <Scramble className="cv-lang-level" text={L(l.level)} delay={120} />
                      </li>
                    ))}
                  </ul>
                </CvSection>

                <CvSection title={t('certification')}>
                  <p className="cv-cert">
                    <Scramble className="cv-lang-name" text={L(CERTIFICATION.name)} />
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
                        <p className="cv-ach-award">
                          <Scramble text={L(a.award)} delay={150} />
                        </p>
                        <p className="cv-ach-detail">{L(a.detail)}</p>
                      </li>
                    ))}
                  </ul>
                </CvSection>
              </Scatter>
            </div>
          </article>
        </SheetIntro>

        <CutUpPoem
          text={PROFILE.summary.map((p) => L(p)).join(' ')}
          title={tc('title')}
          hint={tc('hint')}
          shake={tc('shake')}
          restore={tc('restore')}
          credit={tc('credit')}
          resultLabel={tc('result')}
        />
      </div>
    </>
  );
}
