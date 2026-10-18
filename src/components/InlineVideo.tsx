'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { Play, X } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { formatDate, pick } from '@/lib/i18n-text';
import { embedUrl, parseYouTube, thumbnailUrl } from '@/lib/youtube';
import type { Video } from '@/lib/projects';
import Scramble from './fx/Scramble';

/**
 * YouTube thumbnail that opens a player. The player frame grows out of the thumbnail (FLIP: measured from
 * the thumbnail's rectangle to its final one), the iframe loads only once the frame has landed, and closing
 * shrinks it back. Escape, the backdrop and the close button all close it; focus returns to the thumbnail.
 */
export default function InlineVideo({ video }: { video: Video }) {
  const locale = useLocale();
  const t = useTranslations('controls');
  const tp = useTranslations('project');
  const yt = parseYouTube(video.url);
  const title = pick(video.title, locale);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  const { contextSafe } = useGSAP({ scope: modalRef, dependencies: [open] });

  // Opening: runs once the portal has mounted.
  useGSAP(
    () => {
      if (!open) return;
      const modal = modalRef.current;
      const thumb = thumbRef.current;
      const frame = modal?.querySelector<HTMLElement>('[data-frame]');
      if (!modal || !thumb || !frame) return;
      document.documentElement.classList.add('is-modal-open');
      closeRef.current?.focus({ preventScroll: true });
      if (prefersReducedMotion()) {
        setPlaying(true);
        return;
      }
      const from = thumb.getBoundingClientRect();
      const to = frame.getBoundingClientRect();
      gsap
        .timeline({ onComplete: () => setPlaying(true) })
        .fromTo(modal.querySelector('[data-backdrop]'), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        .fromTo(
          frame,
          {
            x: from.left - to.left,
            y: from.top - to.top,
            scaleX: from.width / to.width,
            scaleY: from.height / to.height,
            transformOrigin: '0 0',
          },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.7, ease: 'expo.inOut' },
          0,
        )
        .fromTo(modal.querySelectorAll('[data-chrome]'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 }, 0.5);
    },
    { dependencies: [open], scope: modalRef },
  );

  const close = contextSafe(() => {
    const modal = modalRef.current;
    const thumb = thumbRef.current;
    const frame = modal?.querySelector<HTMLElement>('[data-frame]');
    const finish = () => {
      closingRef.current = false;
      setPlaying(false);
      setOpen(false);
      document.documentElement.classList.remove('is-modal-open');
      thumb?.focus({ preventScroll: true });
    };
    if (closingRef.current) return;
    closingRef.current = true;
    if (!modal || !thumb || !frame || prefersReducedMotion()) {
      finish();
      return;
    }
    setPlaying(false);
    const from = frame.getBoundingClientRect();
    const to = thumb.getBoundingClientRect();
    gsap
      .timeline({ onComplete: finish })
      .to(modal.querySelectorAll('[data-chrome]'), { opacity: 0, duration: 0.2 })
      .to(
        frame,
        {
          x: to.left - from.left,
          y: to.top - from.top,
          scaleX: to.width / from.width,
          scaleY: to.height / from.height,
          transformOrigin: '0 0',
          duration: 0.55,
          ease: 'expo.inOut',
        },
        0.05,
      )
      .to(modal.querySelector('[data-backdrop]'), { opacity: 0, duration: 0.4 }, 0.15);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && modalRef.current) {
        // Keep focus inside the dialog.
        const focusables = modalRef.current.querySelectorAll<HTMLElement>('button, iframe');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => () => document.documentElement.classList.remove('is-modal-open'), []);

  if (!yt) return null;

  return (
    <>
      <button
        ref={thumbRef}
        type="button"
        className={`video-thumb ${yt.isShort ? 'is-short' : ''}`}
        onClick={() => setOpen(true)}
        aria-label={t('play', { title })}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- YouTube CDN thumbnail */}
        <img src={thumbnailUrl(yt.id)} alt="" loading="lazy" decoding="async" />
        <span className="video-thumb-play" aria-hidden="true">
          <Play size={20} fill="currentColor" />
        </span>
        <span className="video-thumb-meta" aria-hidden="true">
          <span className={`badge badge-kind-${video.kind}`}>
            <Scramble text={tp(video.kind)} delay={200} />
          </span>
          <Scramble className="video-thumb-date" text={formatDate(video.date, locale)} delay={300} />
        </span>
      </button>

      {open &&
        createPortal(
          <div ref={modalRef} className="video-modal" role="dialog" aria-modal="true" aria-label={title}>
            <div data-backdrop className="video-backdrop" onClick={close} />
            <div className="video-stage">
              <div data-frame className={`video-frame ${yt.isShort ? 'is-short' : ''}`}>
                {playing ? (
                  <iframe
                    src={embedUrl(yt.id)}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- poster while the frame animates
                  <img src={thumbnailUrl(yt.id)} alt="" />
                )}
              </div>
              <div className="video-chrome">
                <p data-chrome className="video-caption">
                  <span className="font-title">{title}</span>
                  <span className="video-caption-meta">
                    {tp(video.kind)} · {formatDate(video.date, locale)}
                  </span>
                </p>
                <button ref={closeRef} data-chrome type="button" className="icon-button video-close" onClick={close} aria-label={t('close')}>
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
