'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname as useRawPathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getPathname, useRouter } from '@/i18n/navigation';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { REVEAL_EVENT } from '@/lib/reveal';
import { GLITCH_CHARS } from '@/lib/text-fx';

interface NavigateOptions {
  label?: string;
  locale?: string;
}

interface TransitionApi {
  navigate: (href: string, options?: NavigateOptions) => void;
}

const TransitionContext = createContext<TransitionApi>({ navigate: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

/** If the cover animation stalls (e.g. a throttled background tab), navigate anyway after this long. */
const COVER_FAILSAFE_MS = 900;
/** If the new route has not rendered by then, uncover anyway so the page is never stuck behind the cover. */
const REVEAL_FAILSAFE_MS = 1500;

/**
 * Constructivist page transition. A red slab and an ink slab sweep across on a diagonal while the
 * destination name scrambles in; the route changes under the cover, then the slabs sweep off and entrance
 * animations are released (`fx:reveal`). Reduced motion navigates instantly.
 *
 * The cover's tweens deliberately live outside any GSAP context: their callbacks start other components'
 * entrance animations, and running those inside a context would link the contexts together (GSAP runs
 * tween callbacks inside the context that created the tween). They are killed on unmount instead.
 *
 * A language switch re-renders the whole document (<html lang>, fonts, messages), so after the cover has
 * swept in it does a full page load of the translated URL rather than a client-side remount.
 */
export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const rawPathname = useRawPathname();
  const coverRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef(false);
  /** covering: slabs sweeping in · waiting: route changing under the cover · revealing: slabs sweeping out */
  const phaseRef = useRef<'idle' | 'covering' | 'waiting' | 'revealing'>('idle');
  const targetRef = useRef<{ href: string; options: NavigateOptions }>({ href: '/', options: {} });
  const timersRef = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };
  const setCovered = (on: boolean) => {
    document.documentElement.dataset.cover = on ? 'on' : 'off';
  };

  const reveal = useCallback(() => {
    const cover = coverRef.current;
    if (!cover || !pendingRef.current) return;
    pendingRef.current = false;
    phaseRef.current = 'revealing';
    clearTimers();
    const q = gsap.utils.selector(cover);
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(cover, { autoAlpha: 0 });
          phaseRef.current = 'idle';
        },
      })
      .to(q('[data-cover-content]'), { opacity: 0, y: -24, duration: 0.25, ease: 'power2.in' })
      .to(q('[data-slab="ink"]'), { xPercent: 125, duration: 0.6, ease: 'rewind' }, 0.05)
      .to(q('[data-slab="red"]'), { xPercent: 125, duration: 0.6, ease: 'rewind' }, 0.12)
      .add(() => {
        setCovered(false);
        // Dispatch from a fresh task so listeners never run inside this timeline's callback.
        window.setTimeout(() => window.dispatchEvent(new Event(REVEAL_EVENT)), 0);
      }, 0.3);
  }, []);

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      targetRef.current = { href, options };
      const go = () => {
        const target = targetRef.current;
        if (target.options.locale && target.options.locale !== locale) {
          window.location.assign(getPathname({ href: target.href, locale: target.options.locale }));
          return;
        }
        pendingRef.current = true;
        router.push(target.href);
        later(reveal, REVEAL_FAILSAFE_MS);
      };
      const cover = coverRef.current;
      const label = cover?.querySelector<HTMLElement>('[data-cover-label]');
      const scramble = (text?: string) => {
        if (label && text) gsap.to(label, { duration: 0.35, scrambleText: { text, chars: GLITCH_CHARS, speed: 0.6 } });
      };

      // Still sweeping in: the latest click wins — retarget and relabel the cover.
      if (phaseRef.current === 'covering') {
        scramble(options.label);
        return;
      }
      if (phaseRef.current !== 'idle' || prefersReducedMotion() || !cover || document.visibilityState === 'hidden') {
        go();
        return;
      }

      phaseRef.current = 'covering';
      let gone = false;
      const proceed = () => {
        if (gone) return;
        gone = true;
        phaseRef.current = 'waiting';
        go();
      };
      const q = gsap.utils.selector(cover);
      gsap.set(cover, { autoAlpha: 1 });
      gsap.set(q('[data-slab]'), { xPercent: -125 });
      gsap.set(q('[data-cover-content]'), { opacity: 0, y: 24 });
      if (label) label.textContent = '';
      setCovered(true);
      gsap
        .timeline({ onComplete: proceed })
        .to(q('[data-slab="red"]'), { xPercent: 0, duration: 0.5, ease: 'rewind' })
        .to(q('[data-slab="ink"]'), { xPercent: 0, duration: 0.5, ease: 'rewind' }, 0.07)
        .to(q('[data-cover-content]'), { opacity: 1, y: 0, duration: 0.3 }, 0.3)
        .fromTo(
          q('[data-cover-star]'),
          { rotation: -180, scale: 0.4, transformOrigin: '50% 50%' },
          { rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' },
          0.25,
        )
        .add(() => scramble(targetRef.current.options.label), 0.3);
      later(proceed, COVER_FAILSAFE_MS);
    },
    [locale, router, reveal],
  );

  // The route rendered: sweep the cover away once the new page has painted.
  useEffect(() => {
    if (!pendingRef.current) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(reveal);
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [rawPathname, reveal]);

  useEffect(() => {
    setCovered(false);
    const cover = coverRef.current;
    // Coming back from the bfcache after a language switch: make sure the old cover is gone.
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted || !cover) return;
      gsap.set(cover, { autoAlpha: 0 });
      setCovered(false);
      phaseRef.current = 'idle';
    };
    window.addEventListener('pageshow', onShow);
    return () => {
      window.removeEventListener('pageshow', onShow);
      clearTimers();
      if (cover) gsap.killTweensOf(cover.querySelectorAll('*'));
    };
  }, []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={coverRef} className="page-cover no-print" aria-hidden="true">
        <div data-slab="red" className="cover-slab cover-slab-red" />
        <div data-slab="ink" className="cover-slab cover-slab-ink" />
        <div data-cover-content className="cover-content">
          <svg data-cover-star viewBox="-50 -50 100 100" className="cover-star">
            <polygon points="0,-46 11,-15 44,-14 18,6 27,38 0,19 -27,38 -18,6 -44,-14 -11,-15" />
          </svg>
          <span data-cover-label className="cover-label font-title" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
