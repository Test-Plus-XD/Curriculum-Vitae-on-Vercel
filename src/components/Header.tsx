'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';
import { gsap, useGSAP, ScrollTrigger, FULL_MOTION } from '@/lib/gsap';
import { isCovered } from '@/lib/reveal';
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
              // Under the page-transition cover (the new page resetting the scroll) the header snaps back at
              // once, so it is already in place when the cover lifts instead of sliding in during the reveal.
              gsap.to(header, {
                yPercent: hidden ? -100 : 0,
                duration: isCovered() ? 0 : 0.45,
                ease: hidden ? 'power3.in' : 'expo.out',
                overwrite: 'auto',
              });
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

  // Let the amplifier send a short visual shout from its orange-circle pivot.
  useGSAP(
    () => {
      const header = headerRef.current;
      const monogram = header?.querySelector<HTMLElement>('.monogram');
      const amplifier = monogram?.querySelector<HTMLElement>('.monogram-mark img');
      const names = monogram?.querySelectorAll<HTMLElement>('[data-shout-name]');
      const waves = monogram?.querySelectorAll<HTMLElement>('[data-shout-wave]');
      if (!monogram || !amplifier || !names?.length || !waves?.length) return;

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        let shoutTimeline: gsap.core.Timeline | undefined;
        let automaticShout: gsap.core.Tween | undefined;
        const shout = () => {
          automaticShout?.kill();
          automaticShout = undefined;
          shoutTimeline?.kill();
          shoutTimeline = gsap.timeline();
          shoutTimeline
            .fromTo(waves, { autoAlpha: 0, scale: 0.35 }, { autoAlpha: 0.7, scale: 2.8, duration: 0.58, stagger: 0.11, ease: 'power2.out', transformOrigin: 'center center' }, 0)
            .to(amplifier, { rotation: -9, scale: 1.08, duration: 0.16, ease: 'power2.out', transformOrigin: '24% 74%' }, 0)
            .to(amplifier, { rotation: 0, scale: 1, duration: 0.62, ease: 'elastic.out(1, 0.42)' }, 0.12)
            .fromTo(names, { x: -7, scaleX: 0.86, opacity: 0.84 }, { x: 0, scaleX: 1, opacity: 1, duration: 0.72, stagger: 0.06, ease: 'elastic.out(1, 0.45)', transformOrigin: 'left center' }, 0.05);
        };
        monogram.addEventListener('mouseenter', shout);
        monogram.addEventListener('focusin', shout);
        automaticShout = gsap.delayedCall(1.2, shout);
        return () => {
          monogram.removeEventListener('mouseenter', shout);
          monogram.removeEventListener('focusin', shout);
          automaticShout?.kill();
          shoutTimeline?.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: headerRef },
  );

  return (
    <header ref={headerRef} className="site-header no-print">
      <div className="header-inner">
        <TransitionLink href="/" label={tt('cv')} className="monogram" aria-label={t('home')} data-header-item="">
          <span className="monogram-mark" aria-hidden="true">
            <Image src="/images/amplifier.png" alt="" width={750} height={695} priority />
            <span className="monogram-wave" data-shout-wave="" />
            <span className="monogram-wave" data-shout-wave="" />
            <span className="monogram-wave" data-shout-wave="" />
          </span>
          <span className="monogram-text">
            <span className="font-title" data-shout-name="">
              NG Yu Ham
            </span>
            <span className="monogram-zh" lang="zh-HK" data-shout-name="">
              吳宇涵
            </span>
          </span>
        </TransitionLink>

        <nav aria-label={t('label')} className="site-nav" data-header-item="">
          <ul>
            {NAV.map((item, i) => (
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
                  <GlitchText text={t(item.key)} className="nav-label" loadIn delay={250 + i * 140} />
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
