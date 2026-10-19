'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, Draggable, FULL_MOTION, REDUCED_MOTION, prefersReducedMotion } from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';
import {
  CATEGORIES,
  latestFiling,
  paginateEdition,
  videosNewestFirst,
  type Category,
  type Project,
} from '@/lib/projects';
import { formatDate, pick } from '@/lib/i18n-text';
import { parseYouTube } from '@/lib/youtube';
import InlineVideo from './InlineVideo';
import TransitionLink from './transition/TransitionLink';
import PosterArt from './PosterArt';
import Scramble from './fx/Scramble';

type Section = 'all' | Category;
type View = { section: Section; page: number };
type Role = 'lead' | 'side' | 'wide' | 'brief';
/** A page turn waiting for React to render the page it reveals. */
type Turn =
  | { kind: 'forward'; leaf: HTMLElement; height: number }
  | { kind: 'back'; leaf: HTMLElement; under: HTMLElement; height: number }
  /** The leaf follows a drag on the dog-eared corner; the drag itself finishes or cancels the turn. */
  | { kind: 'manual'; leaf: HTMLElement; height: number }
  /** A drag let go too early: the leaf has fallen back, and the page under it is printed again. */
  | { kind: 'cancel'; leaf: HTMLElement }
  | { kind: 'fade' };

const TURN_PERSPECTIVE = 2600;
const SPINE = { transformOrigin: '0% 50%', transformPerspective: TURN_PERSPECTIVE };

/** One story: kicker, headline, deck, halftone photograph with caption, body, filing line and stack. */
function Story({ project, role }: { project: Project; role: Role }) {
  const locale = useLocale();
  const t = useTranslations('projects');
  const title = pick(project.title, locale);
  const video = videosNewestFirst(project)[0];
  const yt = video ? parseYouTube(video.url) : null;
  // The big stories carry the full description; the rest run the summary.
  const body = role === 'lead' || role === 'wide' ? project.description : project.summary;
  const href = `/projects/${project.id}`;

  return (
    <article className={`story story-${role}`} data-story="">
      <p className="story-kicker">
        {project.categories.map((c) => (
          <span key={c}>{t(c)}</span>
        ))}
      </p>
      <h3 className="story-head">
        <TransitionLink href={href} label={title} className="story-link">
          {title}
        </TransitionLink>
      </h3>
      <p className="story-deck">{pick(project.tagline, locale)}</p>
      <figure className="story-photo">
        <div className="story-plate">
          {video && yt ? <InlineVideo video={video} variant="press" /> : <PosterArt seed={project.id} label="" />}
        </div>
        {video && (
          <figcaption>
            <PlayCircle size={12} aria-hidden="true" />
            <span>
              {pick(video.title, locale)} · {t('videos', { count: project.videos.length })}
            </span>
          </figcaption>
        )}
      </figure>
      <div className="story-body">
        <p>{pick(body, locale)}</p>
      </div>
      <dl className="story-meta">
        {project.courses.length > 0 && (
          <div>
            <dt>{t('gazette.filedUnder')}</dt>
            <dd>{project.courses.join(' · ')}</dd>
          </div>
        )}
        {project.tech.length > 0 && (
          <div>
            <dt>{t('gazette.builtWith')}</dt>
            <dd>{project.tech.join(' / ')}</dd>
          </div>
        )}
      </dl>
      <TransitionLink href={href} label={title} className="story-more" aria-label={`${t('gazette.fullStory')}: ${title}`}>
        {t('gazette.fullStory')} <ArrowRight size={13} aria-hidden="true" />
      </TransitionLink>
    </article>
  );
}

/** A turning leaf: a front face (a copy of the page being turned, if any) and a newsprint back. */
function makeLeaf(page: HTMLElement | null): HTMLElement {
  const leaf = document.createElement('div');
  leaf.className = 'gazette-leaf';
  if (page) {
    const front = copyPage(page);
    front.classList.add('gazette-leaf-front');
    const shade = document.createElement('div');
    shade.className = 'gazette-leaf-shade';
    front.append(shade);
    leaf.append(front);
  }
  const back = document.createElement('div');
  back.className = 'gazette-leaf-back';
  if (page) {
    // The other side of newsprint: the page shows through, mirrored and faint.
    const ghost = copyPage(page);
    ghost.classList.add('gazette-leaf-ghost');
    back.append(ghost);
  }
  leaf.append(back);
  return leaf;
}

/**
 * Pose a hand-turned leaf at `theta` radians over the spine (0 lying on the page, π turned over): it lifts
 * and bows most when upright, its shade deepens as it rises and the shadow it casts fades as it leaves.
 */
function poseLeaf(leaf: HTMLElement, theta: number, cast: HTMLElement | null) {
  const turned = theta / Math.PI;
  const lift = Math.sin(theta);
  gsap.set(leaf, {
    rotationY: -turned * 180,
    y: -10 * lift,
    skewY: -1.6 * lift,
    opacity: turned > 0.85 ? 1 - (turned - 0.85) / 0.15 : 1,
  });
  const shade = leaf.querySelector('.gazette-leaf-shade');
  if (shade) gsap.set(shade, { opacity: Math.min(1, turned * 2) });
  if (cast) gsap.set(cast, { opacity: 0.85 * (1 - turned) });
}

/** A static, inert copy of a rendered page (no ids, nothing focusable, hidden from assistive tech). */
function copyPage(page: HTMLElement): HTMLElement {
  const copy = page.cloneNode(true) as HTMLElement;
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  return copy;
}

/**
 * The projects as a broadsheet: a masthead and section index over pages of stories — the front page leads
 * with one story and a sidebar of two, every later page runs a wide story over three briefs. Choosing a
 * section prints that section's edition; moving between pages turns the page in 3D (the old page is copied
 * into a leaf that swings over the spine with its newsprint back, casting a shadow on the page beneath), and
 * the dog-eared corner can be dragged to turn the page by hand. Reduced motion: pages cross-fade, no drag.
 * The paper itself stays paper-coloured in both themes (light grey at night).
 */
export default function ProjectsGazette({ projects }: { projects: Project[] }) {
  const locale = useLocale();
  const t = useTranslations('projects');
  const [view, setView] = useState<View>({ section: 'all', page: 0 });
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLButtonElement>(null);
  const turnRef = useRef<Turn | null>(null);
  const playing = useRef<gsap.core.Animation | null>(null);
  /** When a corner drag last ended, so the click that follows it does not turn a second page. */
  const draggedAt = useRef(0);

  const sections: Section[] = ['all', ...CATEGORIES];
  const inSection = (s: Section) => (s === 'all' ? projects : projects.filter((p) => p.categories.includes(s)));
  const edition = inSection(view.section);
  const pages = paginateEdition(edition);
  const page = Math.min(view.page, pages.length - 1);
  const last = pages.length - 1;
  const stories = pages[page];
  const latest = latestFiling(edition);
  const reels = edition.reduce((n, p) => n + p.videos.length, 0);
  const sectionName = t(view.section);
  // The corner's Draggable is made once, so it reads the current page from here.
  const live = useRef({ view, page, last });
  useEffect(() => {
    live.current = { view, page, last };
  });

  /** Clear a finished (or abandoned) turn: copies, held height, transforms, shadow; then re-measure scrolling. */
  const finishTurn = (leaf: HTMLElement, under?: HTMLElement) => {
    const stage = stageRef.current;
    leaf.remove();
    under?.remove();
    if (stage) {
      gsap.set(stage, { clearProps: 'minHeight' });
      stage.classList.remove('is-turning');
    }
    if (sheetRef.current) gsap.set(sheetRef.current, { clearProps: 'transform' });
    if (castRef.current) gsap.set(castRef.current, { opacity: 0 });
    if (hostRef.current) hostRef.current.dataset.mode = '';
    playing.current = null;
    // Page heights differ: refresh scroll positions outside any context, on the next frame.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  // First view: the paper drops onto the desk and the stories settle.
  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;
      const mm = gsap.matchMedia();
      mm.add({ full: FULL_MOTION, reduced: REDUCED_MOTION }, (ctx, contextSafe) => {
        const { full } = ctx.conditions as { full: boolean };
        gsap.set(
          stage,
          full
            ? { opacity: 0, y: 70, rotation: -2.2, rotationX: 16, transformPerspective: 1600, transformOrigin: '50% 0%' }
            : { opacity: 0 },
        );
        markReady(root);
        return playOnReveal(contextSafe, () => {
          ScrollTrigger.create({
            trigger: stage,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              gsap.to(
                stage,
                full
                  ? { opacity: 1, y: 0, rotation: 0, rotationX: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' }
                  : { opacity: 1, duration: 0.5 },
              );
              if (full) {
                gsap.from(stage.querySelectorAll('[data-story], [data-mast] > *'), {
                  opacity: 0,
                  y: 16,
                  duration: 0.6,
                  stagger: 0.06,
                  delay: 0.3,
                  ease: 'power2.out',
                });
              }
            },
          });
        });
      });
    },
    { scope: rootRef },
  );

  // After React prints the new page, turn the old one away (or bring the earlier one back).
  useGSAP(
    () => {
      const turn = turnRef.current;
      turnRef.current = null;
      const stage = stageRef.current;
      const sheet = sheetRef.current;
      const host = hostRef.current;
      const cast = castRef.current;
      if (!turn || !stage || !sheet || !host || !cast) return;

      if (turn.kind === 'fade') {
        playing.current = gsap.fromTo(sheet, { opacity: 0 }, { opacity: 1, duration: 0.3, clearProps: 'opacity' });
        return;
      }
      if (turn.kind === 'cancel') {
        finishTurn(turn.leaf);
        return;
      }
      gsap.set(stage, { minHeight: Math.max(turn.height, sheet.offsetHeight) });
      // A hand turn is driven by the corner's drag from here on.
      if (turn.kind === 'manual') return;

      const tl = gsap.timeline({ onComplete: () => finishTurn(turn.leaf, turn.kind === 'back' ? turn.under : undefined) });

      if (turn.kind === 'forward') {
        // The old page lifts from the right, bows a little and swings over the spine, shadowing the new one.
        const shade = turn.leaf.querySelector('.gazette-leaf-shade');
        gsap.set(turn.leaf, SPINE);
        tl.to(turn.leaf, { rotationY: -180, duration: 1.15, ease: 'power2.inOut' }, 0)
          .to(turn.leaf, { skewY: -1.6, y: -10, duration: 0.55, ease: 'sine.out' }, 0)
          .to(turn.leaf, { skewY: 0, y: 0, duration: 0.6, ease: 'sine.in' }, 0.55)
          .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.57, ease: 'power1.in' }, 0)
          .fromTo(cast, { opacity: 0.85 }, { opacity: 0, duration: 1.05, ease: 'power2.in' }, 0.05)
          .to(turn.leaf, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0.9);
      } else {
        // The earlier page comes back over the spine: its newsprint back first, then the page itself.
        gsap.set([turn.leaf, sheet], SPINE);
        gsap.set(sheet, { rotationY: -90 });
        tl.fromTo(turn.leaf, { rotationY: -180, opacity: 0 }, { rotationY: -90, opacity: 1, duration: 0.5, ease: 'power2.in' }, 0)
          .set(turn.leaf, { autoAlpha: 0 })
          .to(sheet, { rotationY: 0, duration: 0.6, ease: 'power2.out' })
          .fromTo(cast, { opacity: 0 }, { opacity: 0.7, duration: 0.5, ease: 'power1.in' }, 0)
          .to(cast, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.5);
      }
      playing.current = tl;
    },
    { scope: rootRef, dependencies: [view] },
  );

  // The dog-eared corner can be pulled over by hand: the leaf follows the pointer round the spine (its edge
  // stays under the pointer, so the angle is the arc-cosine of the pointer's distance from the spine). Let go
  // past about 40 % (or while flicking left) and the page finishes turning; otherwise it falls back.
  useGSAP(
    () => {
      const corner = cornerRef.current;
      if (!corner) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        type Hand = { leaf: HTMLElement; from: View; left: number; width: number; start: number; theta: number; leftward: boolean };
        let hand: Hand | null = null;
        let lastX = 0;
        const pointerX = (e: Event) =>
          'clientX' in e ? (e as PointerEvent).clientX : (e as TouchEvent).changedTouches[0].clientX;
        const [draggable] = Draggable.create(document.createElement('div'), {
          trigger: corner,
          type: 'x,y',
          dragClickables: true,
          minimumMovement: 6,
          zIndexBoost: false,
          onDragStart(this: Draggable) {
            const now = live.current;
            const stage = stageRef.current;
            const sheet = sheetRef.current;
            const host = hostRef.current;
            if (!stage || !sheet || !host || now.page >= now.last) return;
            playing.current?.progress(1);
            const rect = sheet.getBoundingClientRect();
            const x = pointerX(this.pointerEvent);
            const leaf = makeLeaf(sheet);
            host.dataset.mode = 'over';
            host.append(leaf);
            stage.classList.add('is-turning');
            gsap.set(leaf, SPINE);
            lastX = x;
            hand = {
              leaf,
              from: now.view,
              left: rect.left,
              width: rect.width,
              start: Math.max(0.2, (x - rect.left) / rect.width),
              theta: 0,
              leftward: false,
            };
            turnRef.current = { kind: 'manual', leaf, height: sheet.offsetHeight };
            setView({ ...now.view, page: now.page + 1 });
          },
          onDrag(this: Draggable) {
            if (!hand) return;
            const x = pointerX(this.pointerEvent);
            if (Math.abs(x - lastX) > 0.5) hand.leftward = x < lastX;
            lastX = x;
            const along = (x - hand.left) / hand.width / hand.start;
            hand.theta = Math.acos(gsap.utils.clamp(-1, 1, along));
            poseLeaf(hand.leaf, hand.theta, castRef.current);
          },
          onDragEnd() {
            draggedAt.current = performance.now();
            if (!hand) return;
            const h = hand;
            hand = null;
            const complete = h.theta > Math.PI * 0.4 || (h.leftward && h.theta > 0.25);
            const target = complete ? Math.PI : 0;
            const pose = { theta: h.theta };
            playing.current = gsap.to(pose, {
              theta: target,
              duration: 0.3 + (0.6 * Math.abs(target - h.theta)) / Math.PI,
              ease: complete ? 'power2.out' : 'power2.inOut',
              onUpdate: () => poseLeaf(h.leaf, pose.theta, castRef.current),
              onComplete: () => {
                if (complete) {
                  finishTurn(h.leaf);
                } else {
                  // Print the page that was being turned again, then drop the leaf that covers it.
                  turnRef.current = { kind: 'cancel', leaf: h.leaf };
                  setView(h.from);
                }
              },
            });
          },
        });
        return () => draggable.kill();
      });
    },
    { scope: rootRef },
  );

  const go = (next: View) => {
    if (next.section === view.section && next.page === page) return;
    // A turn in flight lands at once (its completion clears its leaf); an abandoned hand turn is cleared now.
    playing.current?.progress(1);
    const stale = turnRef.current;
    if (stale?.kind === 'cancel') {
      turnRef.current = null;
      finishTurn(stale.leaf);
    }
    const stage = stageRef.current;
    const sheet = sheetRef.current;
    const host = hostRef.current;
    const forward = next.section !== view.section || next.page > page;
    if (stage && sheet && host) {
      if (prefersReducedMotion()) {
        turnRef.current = { kind: 'fade' };
      } else if (forward) {
        const leaf = makeLeaf(sheet);
        stage.classList.add('is-turning');
        host.dataset.mode = 'over';
        host.append(leaf);
        turnRef.current = { kind: 'forward', leaf, height: sheet.offsetHeight };
      } else {
        const under = copyPage(sheet);
        under.classList.add('gazette-under');
        const leaf = makeLeaf(null);
        stage.classList.add('is-turning');
        host.dataset.mode = 'under';
        host.append(under, leaf);
        turnRef.current = { kind: 'back', leaf, under, height: sheet.offsetHeight };
      }
      // Read the new page from its top.
      const top = stage.getBoundingClientRect().top;
      if (top < 0) window.scrollTo({ top: window.scrollY + top - 96, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
    setView(next);
  };

  return (
    <section ref={rootRef} className="gazette" aria-label={t('gazette.edition', { section: sectionName })} data-fx-hide="">
      <div className="gazette-sections" role="group" aria-label={t('filterLabel')}>
        {sections.map((s) => (
          <button
            key={s}
            type="button"
            className={`gazette-section ${view.section === s ? 'is-active' : ''}`}
            aria-pressed={view.section === s}
            onClick={() => go({ section: s, page: 0 })}
          >
            <Scramble text={t(s)} delay={150} />
            <span className="gazette-section-count">{inSection(s).length}</span>
          </button>
        ))}
        <p className="gazette-status" aria-live="polite">
          {t('showing', { count: edition.length })}
        </p>
      </div>

      <div ref={stageRef} className="gazette-stage">
        <div ref={hostRef} className="gazette-leaves no-print" aria-hidden="true" />
        <div ref={sheetRef} className={`gazette-sheet ${page === 0 ? 'is-front' : 'is-inner'}`}>
          {page === 0 ? (
            <header className="gazette-mast" data-mast="">
              <p className="mast-ear">{t('gazette.earStories', { count: edition.length })}</p>
              <h2 className="mast-name">{t('gazette.nameplate')}</h2>
              <p className="mast-ear mast-ear-r">{t('gazette.earReels', { count: reels })}</p>
              <p className="mast-motto">{t('gazette.motto')}</p>
              <p className="mast-line">
                <span>{t('gazette.place')}</span>
                <span>{t('gazette.edition', { section: sectionName })}</span>
                <span>{latest ? t('gazette.latest', { date: formatDate(latest, locale) }) : ''}</span>
              </p>
            </header>
          ) : (
            <header className="gazette-folio">
              <span className="folio-name">{t('gazette.nameplate')}</span>
              <span>{t('gazette.edition', { section: sectionName })}</span>
              <span>{t('gazette.folio', { page: page + 1 })}</span>
            </header>
          )}
          <div className={`gazette-grid ${page === 0 ? 'grid-front' : 'grid-inner'} has-${stories.length}`}>
            {stories.map((p, i) => (
              <Story key={p.id} project={p} role={page === 0 ? (i === 0 ? 'lead' : 'side') : i === 0 ? 'wide' : 'brief'} />
            ))}
          </div>
          <footer className="gazette-foot">
            <span>{t('gazette.folio', { page: page + 1 })}</span>
            {page < last && <span className="foot-continued">{t('gazette.continued', { page: page + 2 })}</span>}
          </footer>
        </div>
        <div ref={castRef} className="gazette-cast no-print" aria-hidden="true" />
        {/* Always rendered, so the Draggable on it survives page changes; hidden on the last page. */}
        <button
          ref={cornerRef}
          type="button"
          className={`gazette-corner no-print ${page < last ? '' : 'is-off'}`}
          aria-label={t('gazette.turn')}
          disabled={page >= last}
          onClick={() => {
            if (performance.now() - draggedAt.current > 400) go({ ...view, page: page + 1 });
          }}
        />
      </div>

      {pages.length > 1 && (
        <nav className="gazette-pager no-print" aria-label={t('gazette.pageOf', { page: page + 1, total: pages.length })}>
          <button type="button" className="pager-step" disabled={page === 0} onClick={() => go({ ...view, page: page - 1 })}>
            <ArrowLeft size={14} aria-hidden="true" /> {t('gazette.previous')}
          </button>
          <ol className="pager-pages">
            {pages.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="pager-page"
                  aria-current={i === page ? 'page' : undefined}
                  aria-label={t('gazette.folio', { page: i + 1 })}
                  onClick={() => go({ ...view, page: i })}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="pager-step" disabled={page === last} onClick={() => go({ ...view, page: page + 1 })}>
            {t('gazette.next')} <ArrowRight size={14} aria-hidden="true" />
          </button>
          <p className="sr-only" aria-live="polite">
            {t('gazette.pageOf', { page: page + 1, total: pages.length })}
          </p>
        </nav>
      )}
    </section>
  );
}
