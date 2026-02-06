import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Mail, Phone, Github, Linkedin, ExternalLink } from 'lucide-react';
import { featuredProjects } from '@/lib/projects';

/* ────────────────────────────────────────────────── inline static data */
type Lang = 'en' | 'zh';

const CURRENT_COURSES = [
  { code: '03CIT4010', en: 'Computer Ethics', zh: '計算機倫理' },
  { code: '03CIT4043', en: 'Proprietary Mobile Software Design (iOS)', zh: '專有手機軟件設計 (iOS)' },
  { code: '03CIT4050', en: 'Data Communication and Networking', zh: '數據通信與網絡' },
  { code: '03ENG4005', en: 'Professional English Communication', zh: '專業英語溝通' },
];

const SKILL_GROUPS: { key: string; items: string[] }[] = [
  { key: 'languages', items: ['JavaScript/TypeScript', 'Dart', 'Java', 'PHP', 'C#', 'Swift', 'Python'] },
  { key: 'frameworks', items: ['Flutter', 'Ionic/Angular', 'Express.js', 'Unity'] },
  { key: 'backendDb', items: ['Firebase', 'MySQL', 'Socket.IO', 'REST APIs'] },
  { key: 'cloud', items: ['Vercel', 'Railway', 'Google Cloud'] },
  { key: 'tools', items: ['Git', 'Android Studio', 'Xcode', 'Visual Studio'] },
];

const CONTACTS = [
  { icon: Mail, value: 'baldwon0xd@gmail.com', href: 'mailto:baldwon0xd@gmail.com' },
  { icon: Phone, value: '+852 6701 6557', href: 'tel:+85267016557' },
  { icon: Github, value: 'Test-Plus-XD', href: 'https://github.com/Test-Plus-XD' },
  { icon: Linkedin, value: 'LinkedIn', href: 'https://www.linkedin.com/in/test-plus-004601285/' },
];

/* ───────────────────────────────────────────────────── page component */
export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const lang: Lang = locale === 'zh-hk' ? 'zh' : 'en';

  return (
    <div className="max-w-[850px] mx-auto px-6 py-8 print:py-4 print:px-4">
      {/* ═══════════════════════════════ HEADER ═══════════════════════ */}
      <header className="border-b-2 border-slate-800 dark:border-slate-200 pb-4 mb-6 print:pb-3 print:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight print:text-2xl font-title font-light italic glow-heading">
              {t('placeholders.name')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t('placeholders.nameAlt')}
            </p>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-1 font-medium">
              {t('title')}
            </p>
          </div>

          {/* Contact info - inline for print-friendly layout */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 print:text-[10px]">
            {CONTACTS.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors print:text-slate-700"
              >
                <c.icon size={12} className="flex-shrink-0" />
                <span>{c.value}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Personal Statement */}
        {/* PLACEHOLDER: Enter personal statement (2-3 sentences) */}
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed print:text-xs">
          {t('placeholders.personalStatement')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:gap-4">
        {/* ═══════════════════════ LEFT COLUMN (2/3 width) ════════════════ */}
        <div className="lg:col-span-2 space-y-6 print:space-y-4">

          {/* ─────────────────────── EDUCATION ─────────────────────── */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-soviet-red/40 pb-1 mb-3 print:text-xs font-title italic print:font-sans print:not-italic">
              {t('sections.education')}
            </h2>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm print:text-xs">
                  {t('education.institution')}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200 print:text-xs">
                  {t('education.programmeShort')}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 print:text-[10px]">
                <p>{t('education.graduation')}</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{t('education.gpa')}</p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 print:text-[10px]">
              <span>{t('education.code')}</span>
              <span>•</span>
              <span>{t('education.level')}</span>
              <span>•</span>
              <span>{t('education.duration')}</span>
            </div>

            {/* Current Semester Preview */}
            <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 print:p-2 print:bg-transparent print:border print:border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider print:text-[10px]">
                  {t('education.currentSemester')}
                </span>
                <Link
                  href={`/${locale}/education`}
                  className="print:hidden text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {t('education.viewDetails')}
                  <ExternalLink size={10} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {CURRENT_COURSES.map((course) => (
                  <div key={course.code} className="text-xs text-slate-600 dark:text-slate-300 print:text-[10px]">
                    <span className="font-mono text-slate-400 dark:text-slate-500">{course.code}</span>
                    <span className="mx-1">–</span>
                    <span>{course[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─────────────────────── FEATURED PROJECTS ─────────────────────── */}
          <section>
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-1 mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider print:text-xs font-title italic print:font-sans print:not-italic">
                {t('sections.featuredProjects')}
              </h2>
              <Link
                href={`/${locale}/projects`}
                className="print:hidden text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('projects.viewAll')}
              </Link>
            </div>

            <div className="space-y-4 print:space-y-3">
              {featuredProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Link
                        href={`/${locale}/projects/${project.id}`}
                        className="font-semibold text-slate-800 dark:text-slate-100 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors print:text-xs print:pointer-events-none"
                      >
                        {project.title[lang]}
                      </Link>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 print:text-[10px]">
                        {project.description[lang]}
                      </p>
                    </div>
                    {project.status === 'in-progress' && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 rounded flex-shrink-0">
                        {t('projects.inProgress')}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {project.techStack.slice(0, 5).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded print:bg-transparent print:border print:border-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="text-[10px] text-slate-400">+{project.techStack.length - 5}</span>
                    )}
                  </div>

                  {/* Links row */}
                  <div className="mt-1 flex gap-3 print:hidden">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                      >
                        <Github size={10} />
                        {t('projects.viewRepo')}
                      </a>
                    )}
                    {project.platforms?.filter(p => p.repo).slice(0, 2).map((plat, i) => (
                      <a
                        key={i}
                        href={plat.repo!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                      >
                        <Github size={10} />
                        {plat.name[lang]}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─────────────────────── WORK EXPERIENCE ─────────────────────── */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-soviet-red/40 pb-1 mb-3 print:text-xs font-title italic print:font-sans print:not-italic">
              {t('sections.experience')}
            </h2>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm print:text-xs">
                  {t('experience.hotelIcon')}
                  <span className="font-normal text-slate-500 dark:text-slate-400 ml-1">
                    ({locale === 'zh-hk' ? t('experience.hotelIconZh') : '唯港薈'})
                  </span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 print:text-xs">
                  {t('experience.position')}
                </p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 print:text-[10px]">
                {t('experience.duration')}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 print:text-[10px]">
              {t('experience.description')}
            </p>
          </section>
        </div>

        {/* ═══════════════════════ RIGHT COLUMN (1/3 width) ════════════════ */}
        <div className="space-y-6 print:space-y-4">

          {/* ─────────────────────── SKILLS ─────────────────────── */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-soviet-red/40 pb-1 mb-3 print:text-xs font-title italic print:font-sans print:not-italic">
              {t('sections.skills')}
            </h2>

            <div className="space-y-3 print:space-y-2">
              {SKILL_GROUPS.map((group) => (
                <div key={group.key}>
                  <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 print:text-[10px]">
                    {t(`skills.${group.key}`)}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 print:text-[10px]">
                    {group.items.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─────────────────────── CERTIFICATIONS ─────────────────────── */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-soviet-red/40 pb-1 mb-3 print:text-xs font-title italic print:font-sans print:not-italic">
              {t('sections.certifications')}
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 print:text-[10px]">
              {t('certifications.ielts')}
            </p>
          </section>

          {/* ─────────────────────── ADDITIONAL INFO ─────────────────────── */}
          <section className="print:hidden">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-soviet-red/40 pb-1 mb-3 font-title italic">
              {locale === 'zh-hk' ? '其他資訊' : 'Additional Info'}
            </h2>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <p>
                <span className="font-medium">{locale === 'zh-hk' ? '地區：' : 'Location: '}</span>
                {t('placeholders.nationality')}
              </p>
              {/* PLACEHOLDER: Enter date of birth */}
              {/* PLACEHOLDER: Enter nationality */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
