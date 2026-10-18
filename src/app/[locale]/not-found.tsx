import { getTranslations } from 'next-intl/server';
import RansomText from '@/components/collage/RansomText';
import ReadymadeFigure from '@/components/readymade/ReadymadeFigure';
import TransitionLink from '@/components/transition/TransitionLink';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const tn = await getTranslations('transition');
  return (
    <div className="page page-404 has-readymade">
      <p className="code-404 font-title" aria-hidden="true">
        404
      </p>
      <RansomText as="h1" text={t('title')} className="ransom-404" />
      <p className="hero-lede">{t('body')}</p>
      <TransitionLink href="/" label={tn('cv')} className="action-button action-primary">
        {t('home')}
      </TransitionLink>
      <ReadymadeFigure work="manray" number={3} />
    </div>
  );
}
