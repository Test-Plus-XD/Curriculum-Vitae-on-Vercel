import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { featuredProjects } from '@/lib/projects';

/* ────────────────────────────────────────────────── inline static data   */
type Lang = 'en' | 'zh';

interface CourseEntry {
  code: string;
  en  : string;
  zh  : string;
}

const SEMESTERS: { translationKey: string; courses: CourseEntry[] }[] = [
  {
    translationKey: 'education.term_2025_2026_t2',
    courses: [
      { code: '03CIT4010', en: 'Computer Ethics',                                zh: '計算機倫理' },
      { code: '03CIT4043', en: 'Proprietary Mobile Software Design (iOS)',       zh: '專有手機軟件設計 (iOS)' },
      { code: '03CIT4050', en: 'Data Communication and Networking',             zh: '數據通信與網絡' },
      { code: '03ENG4005', en: 'Professional English Communication',            zh: '專業英語沝通' },
    ],
  },
  {
    translationKey: 'education.term_2025_2026_t1',
    courses: [
      { code: '03CIT4042', en: 'Software Engineering and Professional Practice',zh: '軟件工程與專業實踐' },
      { code: '03CIT4044', en: 'Cross-Platform Mobile Application Development', zh: '跨平台手機應用開發' },
      { code: '03CIT4045', en: '2D Mobile Game Development',                    zh: '2D 手機遊戲開發' },
      { code: '03CIT4047', en: 'Open Mobile Software Design',                   zh: '開放手機軟件設計' },
      { code: '06CIT4002', en: 'Final Year Project',                            zh: '畢業專題' },
    ],
  },
  {
    translationKey: 'education.term_2024_2025_t2',
    courses: [
      { code: '03CIT4046', en: '3D Mobile Game Development',                    zh: '3D 手機遊戲開發' },
      { code: '03CIT4048', en: 'Introduction to Database Systems',              zh: '數據庫系統導論' },
      { code: '03CIT4052', en: 'Object-Oriented Analysis and Design',           zh: '物件導向分析與設計' },
      { code: '03CIT4054', en: 'PHP Application Development',                   zh: 'PHP 應用開發' },
      { code: '03CIT4055', en: 'Open System Administration',                    zh: '開放系統管理' },
    ],
  },
  {
    translationKey: 'education.term_2024_2025_t1',
    courses: [
      { code: '03CIT3042', en: 'Discrete Mathematics and Statistics',           zh: '離散數學與統計' },
      { code: '03CIT4041', en: 'Game Asset Development',                        zh: '遊戲資產開發' },
      { code: '03CIT4049', en: 'Java Programming',                              zh: 'Java 程序設計' },
      { code: '03CIT4053', en: 'Technology for Web Development',                zh: '網絡開發技術' },
      { code: '03ENG4004', en: 'Academic English Skills',                        zh: '學術英語技能' },
    ],
  },
];

const SKILL_GROUPS: { key: string; items: string[] }[] = [
  { key: 'languages',    items: ['JavaScript / TypeScript', 'Dart', 'Java', 'PHP', 'C#', 'Shell / Bash', 'Swift (Learning)', 'Python (Learning)'] },
  { key: 'frameworks',   items: ['Flutter / Material Design 3', 'Ionic / Angular', 'Express.js / Node.js', 'Unity Game Engine'] },
  { key: 'frontend',     items: ['HTML5', 'CSS3', 'Bootstrap 5', 'Responsive Web Design'] },
  { key: 'backendDb',    items: ['Firebase (Auth, Firestore, Storage)', 'MySQL', 'Socket.IO', 'RESTful API Design', 'Vercel Serverless Functions'] },
  { key: 'cloud',        items: ['Vercel', 'Railway', 'Firebase', 'Google Cloud Platform'] },
  { key: 'integrations', items: ['Google Gemini AI', 'Algolia Search', 'Google Maps API', 'Google OAuth'] },
  { key: 'tools',        items: ['Git / GitHub', 'Android Studio', 'Xcode (Learning)', 'Unity', 'Autodesk 3ds Max', 'Visual Studio'] },
];

/* ───────────────────────────────────────────────── shared sub-component  */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
      {children}
    </h2>
  );
}

/* ───────────────────────────────────────────────────── page component    */
export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t    = await getTranslations();
  const lang: Lang = locale === 'zh-hk' ? 'zh' : 'en';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">

      {/* ═══════════════════════════════ PROFILE ═══════════════════════ */}
      <section className="text-center">
        {/* PLACEHOLDER: Add profile photo URL */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
          <span className="text-slate-400 dark:text-slate-500 text-xs">
            {t('placeholders.photoLabel')}
          </span>
        </div>

        {/* PLACEHOLDER: Enter full English name */}
        {/* PLACEHOLDER: Enter Chinese name */}
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t('placeholders.name')}
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('title')}
        </p>

        {/* PLACEHOLDER: Enter personal statement (2-3 sentences) */}
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed italic">
          {t('placeholders.personalStatement')}
        </p>

        <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {/* PLACEHOLDER: Enter date of birth */}
          {/* PLACEHOLDER: Enter nationality */}
          {t('placeholders.nationality')}
        </div>
      </section>

      {/* ═══════════════════════════════ EDUCATION ═════════════════════ */}
      <section>
        <SectionHeading>{t('sections.education')}</SectionHeading>

        {/* Institution card */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-5 mb-5">
          <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100">
            {t('education.institution')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('education.institutionZh')}
          </p>

          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            {t('education.programme')}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{t('education.code')}</span>
            <span>{t('education.level')}</span>
            <span>{t('education.duration')}</span>
            <span>{t('education.graduation')}</span>
          </div>

          <div className="mt-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('education.gpa')}
            </span>
            {/* PLACEHOLDER: Enter GPA if available */}
          </div>
        </div>

        {/* Courses grouped by semester */}
        <div className="space-y-5">
          {SEMESTERS.map((sem) => (
            <div key={sem.translationKey}>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t(sem.translationKey)}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 dark:border-slate-800 border-b border-slate-200">
                      <th className="pb-1.5 pr-4 font-medium">{t('education.courseCode')}</th>
                      <th className="pb-1.5 font-medium">{t('education.courseName')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((course) => (
                      <tr key={course.code} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                        <td className="py-1.5 pr-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                          {course.code}
                        </td>
                        <td className="py-1.5 text-slate-700 dark:text-slate-300">
                          {course[lang]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Awards */}
        <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {t('education.awards')}
          </h4>
          {/* PLACEHOLDER: List any Dean's List, scholarships, etc. */}
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            {t('education.awardsPlaceholder')}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED PROJECTS ═════════════════ */}
      <section>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {t('sections.featuredProjects')}
          </h2>
          <Link
            href={`/${locale}/projects`}
            className="print:hidden text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            {t('projects.viewAll')}
          </Link>
        </div>

        <div className="space-y-4">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════ SKILLS ════════════════════════ */}
      <section>
        <SectionHeading>{t('sections.skills')}</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SKILL_GROUPS.map((group) => (
            <div key={group.key} className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                {t(`skills.${group.key}`)}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ WORK EXPERIENCE ═══════════════════ */}
      <section>
        <SectionHeading>{t('sections.experience')}</SectionHeading>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              {t('experience.hotelIcon')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('experience.position')}
            </p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
            {t('experience.duration')}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('experience.description')}
        </p>
      </section>

      {/* ═══════════════════════════ CERTIFICATIONS ════════════════════ */}
      <section>
        <SectionHeading>{t('sections.certifications')}</SectionHeading>

        {/* Professional memberships */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {t('certifications.memberships')}
          </h4>
          <ul className="space-y-1.5">
            <li className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              {t('certifications.hkcs')}
            </li>
            <li className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              {t('certifications.hkdea')}
            </li>
          </ul>
        </div>

        {/* PLACEHOLDER: List certifications */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            {t('certifications.placeholder')}
          </p>
        </div>
      </section>
    </div>
  );
}
