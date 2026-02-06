import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import RetroWave from '@/components/RetroWave';

/* ────────────────────────────────────────────────── inline static data */
type Lang = 'en' | 'zh';

interface CourseEntry {
  code: string;
  en: string;
  zh: string;
}

const SEMESTERS: { translationKey: string; courses: CourseEntry[] }[] = [
  {
    translationKey: 'education.term_2025_2026_t2',
    courses: [
      { code: '03CIT4010', en: 'Computer Ethics', zh: '計算機倫理' },
      { code: '03CIT4043', en: 'Proprietary Mobile Software Design (iOS)', zh: '專有手機軟件設計 (iOS)' },
      { code: '03CIT4050', en: 'Data Communication and Networking', zh: '數據通信與網絡' },
      { code: '03ENG4005', en: 'Professional English Communication', zh: '專業英語溝通' },
    ],
  },
  {
    translationKey: 'education.term_2025_2026_t1',
    courses: [
      { code: '03CIT4042', en: 'Software Engineering and Professional Practice', zh: '軟件工程與專業實踐' },
      { code: '03CIT4044', en: 'Cross-Platform Mobile Application Development', zh: '跨平台手機應用開發' },
      { code: '03CIT4045', en: '2D Mobile Game Development', zh: '2D 手機遊戲開發' },
      { code: '03CIT4047', en: 'Open Mobile Software Design', zh: '開放手機軟件設計' },
      { code: '06CIT4002', en: 'Final Year Project', zh: '畢業專題' },
    ],
  },
  {
    translationKey: 'education.term_2024_2025_t2',
    courses: [
      { code: '03CIT4046', en: '3D Mobile Game Development', zh: '3D 手機遊戲開發' },
      { code: '03CIT4048', en: 'Introduction to Database Systems', zh: '數據庫系統導論' },
      { code: '03CIT4052', en: 'Object-Oriented Analysis and Design', zh: '物件導向分析與設計' },
      { code: '03CIT4054', en: 'PHP Application Development', zh: 'PHP 應用開發' },
      { code: '03CIT4055', en: 'Open System Administration', zh: '開放系統管理' },
    ],
  },
  {
    translationKey: 'education.term_2024_2025_t1',
    courses: [
      { code: '03CIT3042', en: 'Discrete Mathematics and Statistics', zh: '離散數學與統計' },
      { code: '03CIT4041', en: 'Game Asset Development', zh: '遊戲資產開發' },
      { code: '03CIT4049', en: 'Java Programming', zh: 'Java 程序設計' },
      { code: '03CIT4053', en: 'Technology for Web Development', zh: '網絡開發技術' },
      { code: '03ENG4004', en: 'Academic English Skills', zh: '學術英語技能' },
    ],
  },
];

/* ───────────────────────────────────────────────────── page component */
export default async function EducationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const lang: Lang = locale === 'zh-hk' ? 'zh' : 'en';

  const totalCourses = SEMESTERS.reduce((acc, sem) => acc + sem.courses.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        {locale === 'zh-hk' ? '返回履歷' : 'Back to CV'}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-slate-900 dark:text-white flex items-center gap-3 font-title font-light italic glow-heading">
          <GraduationCap className="text-blue-600 dark:text-cyan-400" size={28} />
          {t('sections.education')}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {locale === 'zh-hk'
            ? `${totalCourses} 門課程，分佈於 ${SEMESTERS.length} 個學期`
            : `${totalCourses} courses across ${SEMESTERS.length} semesters`}
        </p>
      </div>

      {/* Institution Card */}
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900/50 rounded-2xl p-6 mb-4 border border-blue-100 dark:border-cyan-900/40 glow-card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('education.institution')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t('education.institutionZh')}
            </p>
            <p className="text-base text-slate-700 dark:text-slate-200 mt-3 font-medium">
              {t('education.programme')}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <BookOpen size={12} />
                {t('education.code')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {t('education.level')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {t('education.duration')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-blue-600 dark:bg-cyan-700 text-white px-4 py-2 rounded-lg">
              <Calendar size={16} />
              <span className="font-semibold">{t('education.graduation')}</span>
            </div>
            <p className="mt-2 text-lg font-bold text-blue-600 dark:text-cyan-400">
              {t('education.gpa')}
            </p>
          </div>
        </div>
      </div>

      <RetroWave height={40} />

      {/* Course Timeline */}
      <div className="space-y-8">
        {SEMESTERS.map((sem, semIndex) => (
          <div key={sem.translationKey} className="relative">
            {/* Timeline connector */}
            {semIndex < SEMESTERS.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
            )}

            {/* Semester header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                semIndex === 0
                  ? 'bg-blue-600 dark:bg-cyan-600'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}>
                <span className="text-white text-xs font-bold">{SEMESTERS.length - semIndex}</span>
              </div>
              <h3 className={`font-semibold ${
                semIndex === 0
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}>
                {t(sem.translationKey)}
                {semIndex === 0 && (
                  <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {locale === 'zh-hk' ? '進行中' : 'Current'}
                  </span>
                )}
              </h3>
            </div>

            {/* Course cards */}
            <div className="ml-9 grid grid-cols-1 md:grid-cols-2 gap-3">
              {sem.courses.map((course) => (
                <div
                  key={course.code}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow glow-card"
                >
                  <span className="inline-block font-mono text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mb-2">
                    {course.code}
                  </span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {course[lang]}
                  </p>
                  {lang === 'zh' && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {course.en}
                    </p>
                  )}
                  {lang === 'en' && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {course.zh}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCourses}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === 'zh-hk' ? '總課程數' : 'Total Courses'}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{SEMESTERS.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === 'zh-hk' ? '學期' : 'Semesters'}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">3.7</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === 'zh-hk' ? '大一 GPA' : 'Year 1 GPA'}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">2026</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === 'zh-hk' ? '預計畢業' : 'Expected Grad'}
          </p>
        </div>
      </div>
    </div>
  );
}
