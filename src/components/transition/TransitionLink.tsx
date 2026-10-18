'use client';

import type { ComponentProps, MouseEvent } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { usePageTransition } from './TransitionProvider';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  /** Destination name shown on the transition cover. */
  label?: string;
};

/** A locale-aware link that plays the page transition. Modified clicks and same-page links behave normally. */
export default function TransitionLink({ href, label, onClick, locale, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;
    if (href === pathname && !locale) return;
    e.preventDefault();
    navigate(href, { label, locale: typeof locale === 'string' ? locale : undefined });
  };

  return <Link href={href} locale={locale} onClick={handleClick} {...rest} />;
}
