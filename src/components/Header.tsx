'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { gsap, useGSAP, ScrollTrigger, FULL_MOTION } from '@/lib/gsap';
import TransitionLink from './transition/TransitionLink';
import GlitchText from './fx/GlitchText';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import Telemetry from './Telemetry';

const NAV = [
  { href: '/', key: 'cv', index: '01' },
  { href: '/education', key: 'education', index: '02' },
  { href: '/projects', key: 'projects', index: '03' },
] as const;

function activeKey(pathname: string) {
  if (pathname.startsWith('/education')) return 'education';
  if (pathname.startsWith('/projects')) return 'projects';
  return 'cv';
}

/**
 * Fixed header: monogram, numbered navigation with a sliding constructivist marker, live telemetry, language
 * and theme controls, and a scroll-progress rule. It slides away while scrolling down and returns on the way up.
 */
export default function Header() {
  const t = useTranslations('nav');
  const tt = useTranslations('transition');
  const pathname = usePathname();
  const active = activeKey(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const firstRef = useRef(true);

  // Entrance, hide-on-scroll and progress rule.
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap.from(header.querySelectorAll('[data-header-item]'), {
          y: -24,
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.8,
          stagger: 0.06,
          ease: 'expo.out',
          delay: 0.1,
          clearProps: 'filter',
        });
        let hidden = false;
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const shouldHide = self.direction === 1 && self.scroll() > 160;
            if (shouldHide !== hidden) {
              hidden = shouldHide;
              gsap.to(header, { yPercent: hidden ? -100 : 0, duration: 0.45, ease: hidden ? 'power3.in' : 'expo.out' });
            }
          },
        });
      });
      gsap.to(header.querySelector('[data-progress]'), {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3, invalidateOnRefresh: true },
      });
    },
    { scope: headerRef },
  );

  // Slide the marker under the active item.
  useGSAP(
    () => {
      const header = headerRef.current;
      const marker = header?.querySelector<HTMLElement>('[data-marker]');
      const link = header?.querySelector<HTMLElement>(`[data-nav="${active}"]`);
      if (!marker || !link) return;
      const place = (animate: boolean) => {
        const vars = { x: link.offsetLeft, width: link.offsetWidth };
        if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.to(marker, { ...vars, duration: 0.7, ease: 'expo.inOut' });
        } else {
          gsap.set(marker, vars);
        }
      };
      place(!firstRef.current);
      firstRef.current = false;
      // Fonts and resizes change link widths.
      const onResize = () => place(false);
      window.addEventListener('resize', onResize);
      document.fonts?.ready.then(() => place(false));
      return () => window.removeEventListener('resize', onResize);
    },
    { scope: headerRef, dependencies: [active] },
  );

  return (
    <header ref={headerRef} className="site-header no-print">
      <div className="header-inner">
        <TransitionLink href="/" label={tt('cv')} className="monogram" aria-label={t('home')} data-header-item="">
          <span className="monogram-mark" aria-hidden="true">
            <svg viewBox="-50 -50 100 100">
              <polygon points="0,-40 9.4,-13 38,-12.4 15.2,5 23.5,33 0,16.5 -23.5,33 -15.2,5 -38,-12.4 -9.4,-13" />
            </svg>
          </span>
          <span className="monogram-text">
            <span className="font-title">NG Yu Ham</span>
            <span className="monogram-zh" lang="zh-HK">
              吳宇涵
            </span>
          </span>
        </TransitionLink>

        <nav aria-label={t('label')} className="site-nav" data-header-item="">
          <ul>
            {NAV.map((item) => (
              <li key={item.key}>
                <TransitionLink
                  href={item.href}
                  label={tt(item.key)}
                  data-nav={item.key}
                  className={`nav-link ${active === item.key ? 'is-active' : ''}`}
                  aria-current={active === item.key ? 'page' : undefined}
                >
                  <span className="nav-index" aria-hidden="true">
                    {item.index}
                  </span>
                  <GlitchText text={t(item.key)} className="nav-label" />
                </TransitionLink>
              </li>
            ))}
          </ul>
          <span data-marker className="nav-marker" aria-hidden="true" />
        </nav>

        <div className="header-tools">
          <Telemetry />
          <span data-header-item="">
            <LanguageToggle />
          </span>
          <span data-header-item="">
            <ThemeToggle />
          </span>
        </div>
      </div>
      <span data-progress className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
