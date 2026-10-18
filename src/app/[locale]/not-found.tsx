import { getTranslations } from 'next-intl/server';
import GlitchText from '@/components/fx/GlitchText';
import TransitionLink from '@/components/transition/TransitionLink';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const tn = await getTranslations('transition');
  return (
    <div className="page page-404">
      <p className="code-404 font-title" aria-hidden="true">
        404
      </p>
      <GlitchText as="h1" text={t('title')} className="hero-title font-title" glitchOnMount />
      <p className="hero-lede">{t('body')}</p>
      <TransitionLink href="/" label={tn('cv')} className="action-button action-primary">
        {t('home')}
      </TransitionLink>
    </div>
  );
}
