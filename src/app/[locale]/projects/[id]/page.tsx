import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, ExternalLink, Play, Clock, CheckCircle, Circle, Video, Calendar } from 'lucide-react';
import { projects } from '@/lib/projects';
import { projectTimelines, sortTimelineEvents, formatTimelineDate } from '@/lib/timeline';
import InlineVideo from '@/components/InlineVideo';
import GlitchRevealText from '@/components/GlitchRevealText';
import DadaTypography from '@/components/DadaTypography';

type Lang = 'en' | 'zh';

const catColour: Record<string, string> = {
  mobile: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  web: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  game: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  backend: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

const catLabel: Record<string, { en: string; zh: string }> = {
  mobile: { en: 'Mobile', zh: '手機應用' },
  web: { en: 'Web', zh: '網絡' },
  game: { en: 'Game', zh: '遊戲' },
  backend: { en: 'Backend', zh: '後端' },
};

const statusLabel: Record<string, { en: string; zh: string }> = {
  complete: { en: 'Complete', zh: '已完成' },
  'in-progress': { en: 'In Progress', zh: '進行中' },
  pending: { en: 'Pending', zh: '待開始' },
};

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const t = await getTranslations('projects');
  const lang: Lang = locale === 'zh-hk' ? 'zh' : 'en';

  const timeline = sortTimelineEvents(projectTimelines[id] || []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/${locale}/projects`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        {t('backToProjects')}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {project.categories.map((cat) => (
            <span key={cat} className={`text-xs px-3 py-1 rounded-full font-medium ${catColour[cat]}`}>
              {catLabel[cat][lang]}
            </span>
          ))}
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
              project.status === 'complete'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {project.status === 'complete' ? <CheckCircle size={12} /> : <Clock size={12} />}
            {statusLabel[project.status][lang]}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-title font-light italic glow-heading">
          <DadaTypography text={project.title[lang]} as="span" intensity={0.5} scatterOnView />
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
          <GlitchRevealText text={project.description[lang]} speed={4} glitchOnHover={false} />
        </p>

        {/* Related Courses */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t('courses')}
          </span>
          <div className="mt-1 flex flex-wrap gap-2">
            {project.courses.map((course, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
              >
                <span className="font-mono text-slate-400">{course.code}</span>
                <span className="mx-1">–</span>
                {course.name[lang]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Timeline */}
        <div className="lg:col-span-2">
          <h2 className="text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-6 font-title font-light italic glow-heading">
            <Calendar className="text-blue-600 dark:text-soviet-orange" size={20} />
            <DadaTypography text={t('timeline')} as="span" intensity={0.4} scatterOnView />
          </h2>

          {timeline.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 soviet-timeline-line" />

              <div className="space-y-6">
                {timeline.map((event, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.type === 'video'
                          ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                          : event.type === 'release'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {event.type === 'video' ? (
                        <Video size={14} />
                      ) : event.type === 'release' ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Circle size={14} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/50 transition-shadow glow-card">
                        <div className="soviet-shimmer" />
                        {/* YouTube Embed */}
                        {event.videoId && event.embedUrl && (
                          <InlineVideo
                            embedUrl={event.embedUrl}
                            title={event.title[lang]}
                            videoId={event.videoId}
                          />
                        )}

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 font-title italic">
                                <DadaTypography text={event.title[lang]} as="span" intensity={0.35} scatterOnView />
                              </h3>
                              {event.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                  {event.description[lang]}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 whitespace-nowrap">
                              {formatTimelineDate(event.date, locale)}
                            </span>
                          </div>

                          {event.videoUrl && (
                            <a
                              href={event.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:underline"
                            >
                              <Play size={14} />
                              {locale === 'zh-hk' ? '觀看影片' : 'Watch Video'}
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              {locale === 'zh-hk' ? '暫無時間線數據' : 'No timeline data available'}
            </div>
          )}
        </div>

        {/* Right: Info sidebar */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 glow-card">
            <div className="soviet-shimmer" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-title italic">
              <DadaTypography text={t('techStack')} as="span" intensity={0.3} scatterOnView />
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg soviet-tech-tag"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Repositories */}
          {(project.repo || project.platforms?.some((p) => p.repo)) && (
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 glow-card">
              <div className="soviet-shimmer" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-title italic">
                <DadaTypography text={t('viewRepo')} as="span" intensity={0.3} scatterOnView />
              </h3>
              <div className="space-y-2">
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Github size={16} />
                    <span className="truncate">{project.repo.replace('https://github.com/', '')}</span>
                    <ExternalLink size={12} className="flex-shrink-0" />
                  </a>
                )}
                {project.platforms?.filter((p) => p.repo).map((plat, i) => (
                  <a
                    key={i}
                    href={plat.repo!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Github size={16} />
                    <span className="truncate">{plat.name[lang]}</span>
                    <ExternalLink size={12} className="flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Platform Components (PourRice only) */}
          {project.platforms && (
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 glow-card">
              <div className="soviet-shimmer" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-title italic">
                <DadaTypography text={t('pourRicePlatforms')} as="span" intensity={0.3} scatterOnView />
              </h3>
              <div className="space-y-3">
                {project.platforms.map((plat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{plat.name[lang]}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        plat.status === 'complete'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : plat.status === 'in-progress'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {statusLabel[plat.status][lang]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights (PourRice only) */}
          {project.highlights && (
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900/50 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-title italic">
                <DadaTypography text={t('highlights')} as="span" intensity={0.3} scatterOnView />
              </h3>
              <ul className="space-y-2">
                {project.highlights[lang].map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* All Videos */}
          {project.videos.length > 0 && (
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 glow-card">
              <div className="soviet-shimmer" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-title italic">
                <DadaTypography text={`${t('videos')} (${project.videos.length})`} as="span" intensity={0.3} scatterOnView />
              </h3>
              <div className="space-y-2">
                {project.videos.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Play size={14} className="text-red-600 dark:text-red-400" />
                    <span className="truncate">{video.title[lang]}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{video.date}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
