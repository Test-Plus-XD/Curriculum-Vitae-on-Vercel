'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  Draggable,
  FULL_MOTION,
  REDUCED_MOTION,
  FINE_POINTER,
  prefersReducedMotion,
} from '@/lib/gsap';
import { markReady, playOnReveal } from '@/lib/reveal';
import {
  CATEGORIES,
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
import KeepCompounds from './KeepCompounds';
import { TURN_PERSPECTIVE, dropHand, poseHand, takeHand, type HandRig, type Hold } from './gazetteHand';

type Section = 'all' | Category;

const WEEKDAYS = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  zh: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
};

/** The day of the week of an ISO date, worked out by hand so server and browser print the same dateline. */
function weekday(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return WEEKDAYS[locale === 'zh-hk' ? 'zh' : 'en'][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
type View = { section: Section; page: number };
type Role = 'lead' | 'side' | 'wide' | 'brief';
/** A page turn waiting for React to render the page it reveals. */
type Turn =
  /** `clickY`: where on screen the dog-ear was clicked (the hand holds the page there); null from the pager. */
  | { kind: 'forward'; leaf: HTMLElement; height: number; clickY: number | null }
  | { kind: 'back'; leaf: HTMLElement; under: HTMLElement; height: number }
  /** The leaf follows a drag on the dog-eared corner; the drag itself finishes or cancels the turn. */
  | { kind: 'manual'; leaf: HTMLElement; height: number }
  /** A drag let go too early: the leaf has fallen back, and the page under it is printed again. */
  | { kind: 'cancel'; leaf: HTMLElement }
  | { kind: 'fade' };

const SPINE = { transformOrigin: '0% 50%', transformPerspective: TURN_PERSPECTIVE };
/** The hand's angle reaching up from below to the dog-eared corner, and reaching in from the side (deg). */
const FROM_BELOW = -4;
const FROM_SIDE = -62;

/** Lissitzky's wedge through the nameplate (800 × 190 box): the two corners of its base and its tip. */
const WEDGE_PATH = 'M750 112 L50 50 L750 178 Z';
/** The middle of the wedge's base, which it is driven from. */
const WEDGE_BASE = '750 145';

/** The nameplate's letters, left to right (painter's order puts them in the document out of order). */
function mastLetters(mast: Element): SVGTextElement[] {
  return Array.from(mast.querySelectorAll<SVGTextElement>('[data-mast-letter]')).sort(
    (a, b) => Number(a.dataset.mastLetter) - Number(b.dataset.mastLetter),
  );
}

/** The wedge strikes home: the name shudders and every letter is knocked along its line and springs back. */
function jolt(tl: gsap.core.Timeline, name: Element | null, letters: Element[], wedge: Element | null, at: gsap.Position) {
  tl.fromTo(wedge, { scale: 1.06 }, { scale: 1, svgOrigin: WEDGE_BASE, duration: 0.55, ease: 'elastic.out(1, 0.4)', immediateRender: false }, at)
    .fromTo(name, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.25)', immediateRender: false, clearProps: 'transform' }, at)
    .fromTo(letters, { x: -15 }, { x: 0, duration: 0.9, ease: 'elastic.out(1, 0.3)', stagger: { each: 0.04, from: 'end' }, immediateRender: false }, at);
}

/**
 * The masthead is set like hot metal: the letters drop into the forme askew and are knocked square, the red
 * plate goes down after the black one and out of register, the wedge is driven through the name from its base
 * (the letters jolt on impact), the ears are stamped on, the dateline opens from the centre and the motto is typed.
 */
function mastEntrance(mast: Element, onSettled: () => void): gsap.core.Timeline {
  const q = gsap.utils.selector(mast);
  const letters = mastLetters(mast);
  const wedge = mast.querySelector('[data-mast-wedge]');
  letters.forEach((letter) => gsap.set(letter, { svgOrigin: `${letter.getAttribute('x')} 96` }));
  const tl = gsap.timeline({ delay: 0.3, onComplete: onSettled });
  tl.from(letters, {
    y: (i: number) => -170 - 26 * (i % 2),
    rotation: (i: number) => [-18, 12, -10, 16][i % 4],
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.6)',
    stagger: 0.085,
  })
    .from(q('[data-mast-plate]'), { x: -30, y: 18, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .from(wedge, { scale: 0, svgOrigin: WEDGE_BASE, duration: 0.36, ease: 'power4.in' }, '-=0.42')
    .addLabel('impact');
  jolt(tl, mast.querySelector('.mast-name'), letters, wedge, 'impact');
  tl.fromTo(
    q('.mast-line'),
    { clipPath: 'inset(0% 50% 0% 50%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut', clearProps: 'clipPath' },
    'impact-=0.15',
  )
    .from(
      q('.mast-ear'),
      { scale: 1.6, rotation: (i: number) => (i ? 8 : -8), opacity: 0, duration: 0.4, ease: 'power4.in', stagger: 0.14 },
      'impact+=0.05',
    )
    .fromTo(
      q('.mast-motto'),
      { clipPath: 'inset(-20% 100% -20% 0%)' },
      { clipPath: 'inset(-20% -4% -20% 0%)', duration: 1.1, ease: 'steps(26)', clearProps: 'clipPath' },
      'impact+=0.25',
    );
  return tl;
}

/** One story: kicker, headline, deck, halftone photograph with caption, body, filing line and stack. */
function Story({ project, role }: { project: Project; role: Role }) {
  const locale = useLocale();
  const t = useTranslations('projects');
  const title = pick(project.title, locale);
  const video = videosNewestFirst(project)[0];
  const yt = video ? parseYouTube(video.url) : null;
  // The big stories carry the full description under a drop cap; the rest run the summary after a dateline.
  const feature = role === 'lead' || role === 'wide';
  const body = feature ? project.description : project.summary;
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
          <KeepCompounds text={title} />
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
              {pick(video.title, locale)}{' '}
              <span className="story-credit">{t('gazette.credit', { count: project.videos.length })}</span>
            </span>
          </figcaption>
        )}
      </figure>
      <div className="story-body">
        <p>
          {!feature && (
            // A Chinese paper runs 【本報訊】 straight into the text; an English dateline takes a space.
            <span className="story-dateline">{`${t('gazette.place')}${locale === 'zh-hk' ? '' : ' '}`}</span>
          )}
          {pick(body, locale)}
        </p>
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

let copies = 0;

/**
 * A static, inert copy of a rendered page (nothing focusable, hidden from assistive tech). Ids are dropped,
 * except the masthead's screens and gradient, which are renamed with their fills so the copy still prints
 * them once the original page is gone.
 */
function copyPage(page: HTMLElement): HTMLElement {
  const copy = page.cloneNode(true) as HTMLElement;
  const suffix = `-copy${++copies}`;
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach((n) => {
    if (!n.closest('defs')) return n.removeAttribute('id');
    const id = n.id;
    n.id = id + suffix;
    copy.querySelectorAll(`[fill="url(#${id})"]`).forEach((u) => u.setAttribute('fill', `url(#${id}${suffix})`));
  });
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
export default function ProjectsGazette({ projects, issueDate }: { projects: Project[]; issueDate: string }) {
  const locale = useLocale();
  const t = useTranslations('projects');
  const [view, setView] = useState<View>({ section: 'all', page: 0 });
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLButtonElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  /** The hand that turns the pages; null until it has first been on the paper. */
  const rig = useRef<HandRig | null>(null);
  /** Ends the hand's peek at the corner (its boil and its tween) when a turn takes the hand over. */
  const stopPeek = useRef<() => void>(() => {});
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
  const reels = edition.reduce((n, p) => n + p.videos.length, 0);
  const sectionName = t(view.section);
  const editionName = t('gazette.edition', { section: view.section, name: sectionName });
  const nameplate = t('gazette.nameplate');
  const mastheadId = useId().replace(/[^\w-]/g, '');
  const mastheadLetters = Array.from(nameplate);
  const mastheadCellWidth = 720 / Math.max(1, mastheadLetters.length);
  const front = page === 0;
  /** True once the masthead has been set, so pointer play never fights its entrance. */
  const mastSettled = useRef(false);
  const mastLetter = (character: string, index: number, plate = false) => (
    <text
      key={`${plate ? 'plate' : 'ink'}-${index}`}
      className={plate ? 'mast-name-svg-letter' : 'mast-name-svg-letter mast-ink'}
      data-mast-letter={plate ? undefined : index}
      x={40 + mastheadCellWidth * (index + 0.5)}
      y="154"
      textLength={mastheadCellWidth - 10}
      lengthAdjust="spacingAndGlyphs"
    >
      {character}
    </text>
  );
  // The corner's Draggable is made once, so it reads the current page from here.
  const live = useRef({ view, page, last });
  useEffect(() => {
    live.current = { view, page, last };
  });

  /** Put the hand on the paper to hold `page` (the element that turns) from `side`; none under reduced motion. */
  const holdPage = (page: HTMLElement, side: 1 | -1, hold: Hold): HandRig | null => {
    const hand = handRef.current;
    const plate = plateRef.current;
    const stage = stageRef.current;
    if (!hand || !plate || !stage || prefersReducedMotion()) return null;
    stopPeek.current();
    hand.classList.add('is-inked');
    plate.classList.add('is-inked');
    rig.current = takeHand(hand, plate, stage, page, side, hold, rig.current);
    return rig.current;
  };

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
    dropHand(rig.current);
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
                gsap.from(stage.querySelectorAll('[data-story]'), {
                  opacity: 0,
                  y: 16,
                  duration: 0.6,
                  stagger: 0.06,
                  delay: 0.9,
                  ease: 'power2.out',
                });
                const mast = stage.querySelector('[data-mast]');
                if (mast) mastEntrance(mast, () => (mastSettled.current = true));
                // Ink the page-turning hand now, so its print has loaded before the first turn.
                handRef.current?.classList.add('is-inked');
                plateRef.current?.classList.add('is-inked');
              }
            },
          });
        });
      });
    },
    { scope: rootRef },
  );

  // Pointer play on the masthead (mouse and pen): the red plate drifts out of register away from the pointer,
  // the wedge takes aim, the letter under the pointer lifts and leans; a click drives the wedge in again.
  useGSAP(
    () => {
      const mast = rootRef.current?.querySelector<HTMLElement>('[data-mast]');
      const svg = mast?.querySelector('svg');
      const plate = mast?.querySelector('[data-mast-plate]');
      const wedge = mast?.querySelector('[data-mast-wedge]');
      if (!mast || !svg || !plate || !wedge) return;
      const mm = gsap.matchMedia();
      mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, (_ctx, contextSafe) => {
        const letters = mastLetters(mast);
        const name = mast.querySelector('.mast-name');
        gsap.set(wedge, { svgOrigin: WEDGE_BASE });
        letters.forEach((letter) => gsap.set(letter, { svgOrigin: `${letter.getAttribute('x')} 96` }));
        const plateX = gsap.quickTo(plate, 'x', { duration: 0.7, ease: 'power3' });
        const plateY = gsap.quickTo(plate, 'y', { duration: 0.7, ease: 'power3' });
        const aim = gsap.quickTo(wedge, 'rotation', { duration: 0.9, ease: 'power3' });
        const lifts = letters.map((l) => gsap.quickTo(l, 'y', { duration: 0.45, ease: 'power3' }));
        const leans = letters.map((l) => gsap.quickTo(l, 'rotation', { duration: 0.6, ease: 'power3' }));
        let stab: gsap.core.Timeline | null = null;

        const move = contextSafe!((e: PointerEvent) => {
          if (!mastSettled.current || e.pointerType === 'touch') return;
          const r = svg.getBoundingClientRect();
          const px = gsap.utils.clamp(-1.4, 1.4, ((e.clientX - r.left) / r.width) * 2 - 1);
          const py = gsap.utils.clamp(-1.4, 1.4, ((e.clientY - r.top) / r.height) * 2 - 1);
          plateX(-px * 8);
          plateY(-py * 6);
          aim(py * 2.4);
          letters.forEach((letter, i) => {
            const d = px - ((Number(letter.getAttribute('x')) / 800) * 2 - 1);
            const near = Math.max(0, 1 - Math.abs(d) * 2.4);
            lifts[i](-16 * near);
            leans[i](gsap.utils.clamp(-7, 7, -d * 30) * near);
          });
        }) as (e: PointerEvent) => void;
        const leave = contextSafe!(() => {
          plateX(0);
          plateY(0);
          aim(0);
          lifts.forEach((lift) => lift(0));
          leans.forEach((lean) => lean(0));
        }) as () => void;
        // Withdraw the wedge and drive it through the name once more.
        const strike = contextSafe!(() => {
          if (!mastSettled.current || stab?.isActive()) return;
          stab = gsap
            .timeline()
            .to(wedge, { scale: 0, svgOrigin: WEDGE_BASE, duration: 0.22, ease: 'power2.in' })
            .to(wedge, { scale: 1, svgOrigin: WEDGE_BASE, duration: 0.3, ease: 'power4.in' })
            .addLabel('impact');
          jolt(stab, name, letters, wedge, 'impact');
        }) as () => void;
        mast.addEventListener('pointermove', move);
        mast.addEventListener('pointerleave', leave);
        name?.addEventListener('click', strike);
        return () => {
          mast.removeEventListener('pointermove', move);
          mast.removeEventListener('pointerleave', leave);
          name?.removeEventListener('click', strike);
        };
      });
    },
    // The masthead is printed again whenever the front page comes back.
    { scope: rootRef, dependencies: [front], revertOnUpdate: true },
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

      // The hand holds the page's free edge throughout (a right hand turning on, a left hand turning back), at
      // the height on screen where the dog-ear was clicked, or a little below the middle of the window.
      const forward = turn.kind === 'forward';
      const clickY = turn.kind === 'forward' ? turn.clickY : null;
      const hand = holdPage(forward ? turn.leaf : sheet, forward ? 1 : -1, {
        angle: clickY === null ? FROM_SIDE : FROM_BELOW,
        screenY: clickY ?? window.innerHeight * 0.56,
      });
      const held = { theta: forward ? 0 : Math.PI };
      const tl = gsap.timeline({
        onUpdate: hand ? () => poseHand(hand, held.theta) : undefined,
        onComplete: () => finishTurn(turn.leaf, turn.kind === 'back' ? turn.under : undefined),
      });

      if (turn.kind === 'forward') {
        // The hand reaches the corner and takes hold; the old page lifts from the right, bows a little and
        // swings over the spine, shadowing the new one.
        const lead = hand ? 0.22 : 0;
        const shade = turn.leaf.querySelector('.gazette-leaf-shade');
        gsap.set(turn.leaf, SPINE);
        tl.to(turn.leaf, { rotationY: -180, duration: 1.15, ease: 'power2.inOut' }, lead)
          .to(turn.leaf, { skewY: -1.6, y: -10, duration: 0.55, ease: 'sine.out' }, lead)
          .to(turn.leaf, { skewY: 0, y: 0, duration: 0.6, ease: 'sine.in' }, lead + 0.55)
          .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.57, ease: 'power1.in' }, lead)
          .fromTo(cast, { opacity: 0.85 }, { opacity: 0, duration: 1.05, ease: 'power2.in' }, lead + 0.05)
          .to(turn.leaf, { opacity: 0, duration: 0.25, ease: 'power1.in' }, lead + 0.9);
        if (hand) {
          tl.to(hand, { reach: 0, alpha: 1, duration: lead + 0.08, ease: 'power3.out' }, 0)
            .to(held, { theta: Math.PI, duration: 1.15, ease: 'power2.inOut' }, lead)
            .to(hand, { alpha: 0, duration: 0.3, ease: 'power1.in' }, lead + 0.85);
        }
      } else {
        // The earlier page comes back over the spine: its newsprint back first, then the page itself.
        gsap.set([turn.leaf, sheet], SPINE);
        gsap.set(sheet, { rotationY: -90 });
        tl.fromTo(turn.leaf, { rotationY: -180, opacity: 0 }, { rotationY: -90, opacity: 1, duration: 0.5, ease: 'power2.in' }, 0)
          .set(turn.leaf, { autoAlpha: 0 })
          .to(sheet, { rotationY: 0, duration: 0.6, ease: 'power2.out' })
          .fromTo(cast, { opacity: 0 }, { opacity: 0.7, duration: 0.5, ease: 'power1.in' }, 0)
          .to(cast, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.5);
        if (hand) {
          tl.fromTo(hand, { reach: 0.5 }, { reach: 0, alpha: 1, duration: 0.35, ease: 'power3.out' }, 0)
            .to(held, { theta: Math.PI / 2, duration: 0.5, ease: 'power2.in' }, 0)
            .to(held, { theta: 0, duration: 0.6, ease: 'power2.out' }, 0.5)
            .to(hand, { reach: 1, alpha: 0, duration: 0.32, ease: 'power2.in' }, 0.98);
        }
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
        /** Pose the page-turning hand under the pointer (or where it let go) on the dragged leaf. */
        const holdAt = (theta: number, x?: number, y?: number) => {
          const held = rig.current;
          if (!held) return;
          if (x !== undefined && y !== undefined) held.pointer = { x, y };
          poseHand(held, theta);
        };
        const pointerX = (e: Event) =>
          'clientX' in e ? (e as PointerEvent).clientX : (e as TouchEvent).changedTouches[0].clientX;
        const pointerY = (e: Event) =>
          'clientY' in e ? (e as PointerEvent).clientY : (e as TouchEvent).changedTouches[0].clientY;
        // While the corner is held the hand keeps boiling, and its red plate settles, even if the pointer rests.
        const boil = () => {
          if (hand) holdAt(hand.theta);
        };
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
            const y = pointerY(this.pointerEvent);
            const held = holdPage(leaf, 1, { angle: FROM_BELOW, screenY: y });
            if (held) {
              held.pointer = { x, y };
              held.reach = 0;
              held.alpha = 1;
              poseHand(held, 0);
            }
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
            gsap.ticker.add(boil);
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
            holdAt(hand.theta, x, pointerY(this.pointerEvent));
          },
          onDragEnd() {
            draggedAt.current = performance.now();
            gsap.ticker.remove(boil);
            if (!hand) return;
            const h = hand;
            hand = null;
            const complete = h.theta > Math.PI * 0.4 || (h.leftward && h.theta > 0.25);
            const target = complete ? Math.PI : 0;
            const pose = { theta: h.theta };
            // Let go: the hand slides back up its arm while the page finishes (or falls back) on its own.
            if (rig.current) gsap.to(rig.current, { reach: 1, alpha: 0, duration: 0.3, ease: 'power2.in' });
            playing.current = gsap.to(pose, {
              theta: target,
              duration: 0.3 + (0.6 * Math.abs(target - h.theta)) / Math.PI,
              ease: complete ? 'power2.out' : 'power2.inOut',
              onUpdate: () => {
                poseLeaf(h.leaf, pose.theta, castRef.current);
                holdAt(pose.theta);
              },
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
        return () => {
          gsap.ticker.remove(boil);
          draggable.kill();
        };
      });
    },
    { scope: rootRef },
  );

  // Hovering the dog-eared corner (mouse or pen) brings the hand in from the margin to take hold of it; it
  // boils on the spot while it waits, and drops back out when the pointer leaves.
  useGSAP(
    () => {
      const corner = cornerRef.current;
      if (!corner) return;
      const mm = gsap.matchMedia();
      mm.add(`${FULL_MOTION} and ${FINE_POINTER}`, (_ctx, contextSafe) => {
        let tween: gsap.core.Tween | null = null;
        const boil = () => {
          if (rig.current) poseHand(rig.current, 0);
        };
        const stop = () => {
          tween?.kill();
          tween = null;
          gsap.ticker.remove(boil);
        };
        const turning = () => stageRef.current?.classList.contains('is-turning') ?? false;
        const enter = contextSafe!(() => {
          const sheet = sheetRef.current;
          if (!sheet || corner.disabled || turning()) return;
          const box = corner.getBoundingClientRect();
          const held = holdPage(sheet, 1, { angle: FROM_BELOW, screenY: box.top + box.height / 2 });
          if (!held) return;
          stopPeek.current = stop;
          gsap.ticker.add(boil);
          tween = gsap.to(held, { reach: 0.16, alpha: 1, duration: 0.5, ease: 'back.out(1.7)' });
        }) as () => void;
        const leave = contextSafe!(() => {
          const held = rig.current;
          if (!held || turning()) return;
          tween?.kill();
          tween = gsap.to(held, { reach: 1, alpha: 0, duration: 0.35, ease: 'power2.in', onComplete: stop });
        }) as () => void;
        corner.addEventListener('pointerenter', enter);
        corner.addEventListener('pointerleave', leave);
        return () => {
          stop();
          corner.removeEventListener('pointerenter', enter);
          corner.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: rootRef },
  );

  const go = (next: View, clickY: number | null = null) => {
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
        const held = clickY === null ? null : gsap.utils.clamp(window.innerHeight * 0.15, window.innerHeight * 0.85, clickY);
        turnRef.current = { kind: 'forward', leaf, height: sheet.offsetHeight, clickY: held };
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
    <section ref={rootRef} className="gazette" aria-label={editionName} data-fx-hide="">
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
              <h2 className="mast-name" aria-label={nameplate}>
                <svg className="mast-name-svg" viewBox="0 0 800 190" aria-hidden="true" focusable="false">
                  <defs>
                    <pattern
                      id={`${mastheadId}-screen`}
                      className="mast-screen"
                      width="6"
                      height="6"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(15)"
                    >
                      <circle cx="3" cy="3" r="2.2" />
                    </pattern>
                    <pattern
                      id={`${mastheadId}-wedge-screen`}
                      className="mast-wedge-screen"
                      width="5"
                      height="5"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <circle cx="2.5" cy="2.5" r="1.3" />
                    </pattern>
                    <linearGradient id={`${mastheadId}-wedge-ink`} gradientUnits="userSpaceOnUse" x1="50" y1="50" x2="750" y2="145">
                      <stop offset="0" className="mast-wedge-tip" />
                      <stop offset="1" className="mast-wedge-base" />
                    </linearGradient>
                  </defs>
                  {/* The second colour: the name again as a red halftone screen, printed out of register. */}
                  <g transform="translate(5 4)">
                    <g className="mast-plate" data-mast-plate="" fill={`url(#${mastheadId}-screen)`}>
                      {mastheadLetters.map((character, index) => mastLetter(character, index, true))}
                    </g>
                  </g>
                  {/* Painter's order pierces the name: the wedge lies over the even letters and under the odd ones. */}
                  {mastheadLetters.map((character, index) => (index % 2 === 0 ? mastLetter(character, index) : null))}
                  <g className="mast-wedge" data-mast-wedge="">
                    <path className="mast-wedge-shadow" d={WEDGE_PATH} transform="translate(8 10)" fill={`url(#${mastheadId}-screen)`} />
                    <path d={WEDGE_PATH} fill={`url(#${mastheadId}-wedge-ink)`} />
                    <path className="mast-wedge-dots" d={WEDGE_PATH} fill={`url(#${mastheadId}-wedge-screen)`} />
                  </g>
                  {mastheadLetters.map((character, index) => (index % 2 === 1 ? mastLetter(character, index) : null))}
                </svg>
              </h2>
              <p className="mast-ear mast-ear-r">{t('gazette.earReels', { count: reels })}</p>
              <p className="mast-motto">{t('gazette.motto')}</p>
              <p className="mast-line">
                <span>{t('gazette.volume', { count: projects.length })}</span>
                <span>{t('gazette.dateline', { date: formatDate(issueDate, locale), weekday: weekday(issueDate, locale) })}</span>
                <span>{editionName}</span>
                <span>{t('gazette.price')}</span>
              </p>
            </header>
          ) : (
            <header className="gazette-folio">
              <span className="folio-name">{t('gazette.nameplate')}</span>
              <span>{editionName}</span>
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
        {/* The hand that turns the pages, and its red plate slipping out of register behind it. */}
        <div ref={plateRef} className="gazette-hand-plate no-print" aria-hidden="true" />
        <div ref={handRef} className="gazette-hand no-print" aria-hidden="true" />
        {/* Always rendered, so the Draggable on it survives page changes; hidden on the last page. */}
        <button
          ref={cornerRef}
          type="button"
          className={`gazette-corner no-print ${page < last ? '' : 'is-off'}`}
          aria-label={t('gazette.turn')}
          disabled={page >= last}
          onClick={(e) => {
            // A keyboard press has no pointer height: the hand then holds the page as for the pager.
            if (performance.now() - draggedAt.current > 400) go({ ...view, page: page + 1 }, e.clientY || null);
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
