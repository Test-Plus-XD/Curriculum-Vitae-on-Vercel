# CV Website Architecture — In-Depth Guide

**Author**: NG Yu Ham Baldwin 吳宇涵
**Stack**: Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · next-intl · GSAP 3.15
**Purpose**: Bilingual (EN / 繁體中文) CV and portfolio — a Dada photomontage in Soviet poster colours over a constructivist space-age background — with a printable CV

---

## Contents

1. [Overview](#overview)
2. [Directory structure](#directory-structure)
3. [Routing and internationalisation](#routing-and-internationalisation)
4. [Data layer](#data-layer)
5. [Rendering model](#rendering-model)
6. [Animation architecture](#animation-architecture)
7. [Collage system](#collage-system)
8. [Readymades](#readymades)
9. [Page transitions](#page-transitions)
10. [Background stage](#background-stage)
11. [Pages](#pages)
12. [Styling and theming](#styling-and-theming)
13. [Fonts](#fonts)
14. [Print](#print)
15. [Accessibility and reduced motion](#accessibility-and-reduced-motion)
16. [Testing](#testing)
17. [Adding content](#adding-content)
18. [Deployment](#deployment)

---

## Overview

Every route is statically generated for both locales (33 pages at build time). Pages are **server components** that read typed data modules and render real, complete HTML; interactive and animated parts are small **client islands** that only add motion on top. Consequences:

- The site is fully readable without JavaScript (the pre-hide CSS has a 3 s failsafe).
- Every animated element has a meaningful final state that also prints.
- GSAP never runs on the server — it is only touched inside `useGSAP` / effects.

---

## Directory structure

```
.
├── src/
│   ├── proxy.ts                      # next-intl locale routing (Next 16 "proxy", formerly middleware)
│   ├── app/
│   │   ├── layout.tsx                # Pass-through root layout
│   │   ├── not-found.tsx             # Global 404 (outside a locale)
│   │   ├── globals.css               # Tokens, themes, components, reduced motion, print
│   │   ├── icon.png · robots.ts · sitemap.ts
│   │   └── [locale]/
│   │       ├── layout.tsx            # <html>/<body>, fonts, providers, background, header, footer
│   │       ├── page.tsx              # Collage hero + CV sheet + cut-up poem
│   │       ├── education/page.tsx
│   │       ├── projects/page.tsx
│   │       ├── projects/[id]/page.tsx
│   │       ├── not-found.tsx         # Localised 404
│   │       └── [...rest]/page.tsx    # Sends unknown paths to the localised 404
│   ├── components/
│   │   ├── fx/                       # Reusable GSAP effects
│   │   ├── collage/                  # Dada collage system and the Three.js Merzbau
│   │   ├── readymade/                # Three.js readymades: figure, canvas, stage, print pass, works/
│   │   ├── transition/               # Page-transition provider and link
│   │   └── *.tsx                     # Page sections and site chrome
│   ├── i18n/                         # routing.ts · navigation.ts · request.ts
│   ├── lib/                          # Data modules and pure helpers (+ *.test.ts)
│   └── messages/                     # en.json · zh-hk.json
├── public/images/                    # Header amplifier monogram, Pour Rice app icons
├── public/models/                    # CC0 glTF models for the readymades + CREDITS.txt
├── next.config.mjs                   # next-intl plugin, Turbopack root, pourrice-ios redirect
├── postcss.config.js                 # @tailwindcss/postcss
├── vitest.config.ts · vitest.setup.ts
├── CLAUDE.md                         # Project rules for AI agents
└── ARCHITECTURE.md                   # This file
```

---

## Routing and internationalisation

- `src/i18n/routing.ts` defines `locales: ['en', 'zh-hk']` and `defaultLocale: 'en'`, plus an `isLocale()` guard.
- `src/proxy.ts` runs next-intl's middleware, so `/` redirects to `/en` and every path carries a locale prefix.
- `src/i18n/navigation.ts` exports locale-aware `Link`, `useRouter` and `usePathname` (path **without** the locale). All internal links go through `TransitionLink`, which wraps this `Link`.
- `src/i18n/request.ts` loads `messages/{locale}.json`.
- `[locale]/layout.tsx` validates the locale (`hasLocale`), calls `setRequestLocale` for static rendering, sets `<html lang="en-GB|zh-HK">` and the `locale-en|locale-zh` body class.
- Content strings live in the data modules as `{ en, zh }` pairs and are chosen with `pick(text, locale)`; interface labels come from `useTranslations` / `getTranslations`.
- Metadata: each page sets title and description per locale, plus canonical and `hreflang` alternates (`lib/seo.ts`). `sitemap.ts` lists every path with its alternates.

---

## Data layer

| Module | Contents |
|---|---|
| `profile.ts` | Name, title, descriptor, location, summary, contacts (screen label + print form), `getAge(now)` evaluated in Hong Kong time from May 2005 |
| `education.ts` | Programme facts, four semesters, 19 courses (bilingual names, final-semester grades and credits), `getCourse()` |
| `cv.ts` | Skill groups, experience (with an optional "next phase" note), languages, IELTS, achievements |
| `projects.ts` | 11 projects (categories, bilingual copy, courses, tech, repos, live link, highlights, platforms, milestones, videos), `FEATURED_IDS`, `COLLABORATIONS`, `buildTimeline()` (newest first), `videosNewestFirst()`. Pour Rice includes its native Swift iOS app (12 videos); `/projects/pourrice-ios` redirects permanently to `/projects/pourrice` (`next.config.mjs`) |
| `collage.ts` | Seeded collage generators: `rng`, `hashSeed`, `shuffled`, `tornClipPath()`, `tornSlab()`, `ransomGlyphs()` (neighbouring letters never share a paper), `cutUp()` |
| `youtube.ts` | `parseYouTube()` (youtu.be, Shorts, watch, embed), thumbnails, privacy-enhanced embed URLs |
| `i18n-text.ts` | `Bilingual` type, `bi()`, `pick()`, `formatDate()`, `formatMonth()` |
| `text-fx.ts` | Pure text-effect helpers: segmentation, seeded PRNG, displacements, glitch glyph pools |

The CV page exports `revalidate = 86400`, so the displayed age stays current without a redeploy.

---

## Rendering model

```
[locale]/layout.tsx (server)
└── NextIntlClientProvider
    └── ThemeProvider (next-themes, client)
        └── TransitionProvider (client: cover + navigate())
            ├── CollageDefs (shared SVG filters, aria-hidden)
            ├── BackgroundStage (client, fixed, aria-hidden)
            ├── Header (client)
            ├── <main> page (server) ── client islands: DadaTypography, Scatter, Counter, SemesterTrack, …
            ├── Footer (server, with client tickers)
            └── CursorReticle (client)
```

`<html>` is rendered with `className="js-fx …"` and `data-cover="off"`, so the pre-hide applies from the first byte without an inline script; a `<noscript><style>` block un-hides everything when JavaScript is off.

---

## Animation architecture

### One registration point
`src/lib/gsap.ts` imports GSAP and every plugin, registers them once (`useGSAP`, ScrollTrigger, SplitText, Flip, DrawSVGPlugin, CustomEase, MotionPathPlugin, Draggable, InertiaPlugin), creates the custom eases `soviet` and `rewind`, and exports the media-query constants `FULL_MOTION`, `REDUCED_MOTION`, `FINE_POINTER`. Components import from here only.

### Component pattern
```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add(FULL_MOTION, (ctx, contextSafe) => {
    gsap.set(items, { opacity: 0, x: 32, y: 32 });   // initial state, before paint
    markReady(root);                                   // stop the CSS pre-hide
    return playOnReveal(contextSafe, () => {           // wait for the transition cover
      ScrollTrigger.batch(items, { once: true, onEnter: (b) => gsap.to(b, { opacity: 1, x: 0, y: 0 }) });
    });
  });
}, { scope: rootRef });
```

Rules this pattern encodes:

1. **Scope everything** to a ref so selectors never leak outside the component; `useGSAP` reverts animations and ScrollTriggers on unmount.
2. **Branch on media queries with `gsap.matchMedia()`**; it reverts and re-runs handlers when the user's motion or pointer preference changes.
3. **Use the matchMedia handler's own `contextSafe`** (its second argument) for anything created later. Calling `useGSAP`'s `contextSafe` from inside a matchMedia handler makes the two contexts contain each other, and reverting them recurses until the stack overflows.
4. **Gate entrances on the cover** with `playOnReveal`, so nothing plays hidden behind a page transition.
5. **Keep contexts apart**: GSAP runs tween and ScrollTrigger callbacks inside their creating context, so anything that triggers other components' GSAP code (dispatching the reveal event, `ScrollTrigger.refresh()`) is deferred to a fresh task or frame.
6. **Pre-hide without flashing**: `[data-fx-hide]` elements are invisible under `html.js-fx` until `markReady()` adds `.fx-ready`; a 3 s CSS animation reveals them if hydration never happens.
7. **Let GSAP own transforms** on elements it moves (no competing CSS `transform`), and only DrawSVG solid strokes.

### Effect inventory
| Component | Technique |
|---|---|
| `DadaTypography` | Text segmented into nowrap word groups, fixed-width spaces and breakable CJK glyphs; each glyph is a transform target. Seeded Park–Miller PRNG, first paint clamped to ±2 px, alignment scheduled with two rAFs and a 10 ms failsafe, hover re-scatters with a fresh seed (×1.8), springs approximated with `back.out` eases and per-glyph stagger; optional hue/drop-shadow misregistration. Plain text until mounted. |
| `GlitchText` | rAF loop resolving one character per `max(4, speed)` ms; unresolved characters drawn from Cyrillic + symbol pools (English) or Bauhaus glyphs only (Chinese) in an `aria-hidden` overlay while the base text keeps the layout. Each noise glyph holds for `GLITCH_GLYPH_HOLD_MS` (110 ms ± 30 %, `lib/text-fx.ts`; the `glyphHold` prop overrides it) instead of changing every frame. Hover replays ignore touch pointers. Triggers: view (once, −30 px margin, 100 ms delay), mount (200 ms), hover. `loadIn` mode paints glyph noise before the first frame and resolves once the page is revealed and the text is in view; the base text is hidden with `opacity`, never `visibility`, so it stays accessible and prints. |
| `Scramble` | `GlitchText` in `loadIn` mode without hover replay — the header nav's randomise effect used as a load-in across the site (labels, badges, dates, chips, course codes, buttons, CV entries, timeline titles). |
| `Scatter` | `ScrollTrigger.batch` entrances: `scatter` (+32 px diagonal and slight rotation), `collage` (+48 px), `rise`; fade-only for reduced motion. |
| `RevealHeading` | `SplitText` with `mask: 'lines'` and `autoSplit` (re-splits after font load), lines rise, rule extends, index slides in. |
| `Counter` | Tweens a number on scroll; formats with thousands separators; restores the server value before printing. |
| `TiltCard` / `Magnetic` | `gsap.quickTo` for pointer-driven rotation / translation; elastic release. |
| `CursorReticle` | quickTo-driven ring and dot; ring rotates 45° and widens over interactive elements. |
| `MorseCodeTicker` | Duplicated track, `xPercent` loop. |
| `SemesterTrack` | Pinned section; the track tweens `x` with `ease: 'none'` scrubbed to scroll; panel entrances use `containerAnimation`; a DrawSVG rail and node classes show progress. Same media query in CSS and JS. |
| `ProjectsFilterGrid` | `Flip.getState()` before the React state change, `Flip.from()` after it (absolute, nested, with enter/leave tweens); the active filter pill is matched across buttons by `data-flip-id`. |
| `InlineVideo` | Manual FLIP from the thumbnail rect to the modal frame; the iframe loads after landing; focus trap, Escape, scroll lock, focus return. |
| `DevTimeline` | Scrubbed spine fill; entries slide in from alternating sides and light their nodes. |
| `OrbitDiagram` | Bodies placed on two elliptical orbits each frame with depth scaling, links re-drawn to the nearest service, packets travelling along links; paused off-screen via ScrollTrigger `onToggle`. |
| `SheetIntro` | CV sheet unrolls with `clip-path`, registration marks pop, header settles, stamp lands with a jolt. |

---

## Collage system

The site's Dada layer: Schwitters' *Merz* (collage built from the scraps at hand), here cut from the CV's own data. Everything lives in `src/components/collage/` and draws its randomness from the seeded generators in `lib/collage.ts`, so server and client render identical shapes.

| Component | Technique |
|---|---|
| `CollageDefs` | One hidden SVG with shared filters: `fx-ink` / `fx-ink-soft` (turbulence-displaced rubber-stamp ink), `fx-duotone` (luminance → red/black print, for the hero's photo scraps), `fx-duotone-soft` (the duotone composited over the original at about one third, `feComposite arithmetic k2=0.66 k3=0.34`, for card and video thumbnails, which return to full colour on hover), and the `fx-dots` halftone pattern. |
| `RansomText` | `ransomGlyphs()` gives each letter its own paper (scrap, red, ink, newsprint, kraft, bare), face (display, title or body; never the typewriter face) and tilt. Letters paste in with a stagger and flutter on hover; the real string is kept in an sr-only span. |
| `Stamp` | Ring text on a `useId` circular `textPath`, a centre numeral, `fx-ink`; slams on (scale 1.6 → 1, rotation jolt) when scrolled into view. |
| `Paper` | `Tape`, `Torn` (a `tornClipPath()` polygon and paper shadow), `NewsScrap`, `Seal` (a vermilion 白文 name chop), `LabelTape` (embossed Dymo strip). |
| `CollageHero` | Screen-only landing photomontage: kicker, ransom-note name, label-tape title, typed descriptor and cue (all with `Scramble`), three duotone footage scraps, seal, newsprint and stamp. Fragments paste in, become `Draggable` with inertia on fine pointers and scatter as the page scrolls. `MerzbauScene` is imported with `next/dynamic` once the browser is idle. |
| `MerzbauScene` | Three.js scene behind the hero: torn paper scraps painted on canvases from CV data (17 on desktop, 10 on narrow screens) drifting in depth and flipping on hover (raycasting), a Lissitzky red wedge piercing a white disc, and a Tatlin-tower helix. The camera moves in a little with scroll; fog follows the theme; rendering pauses off-screen and in hidden tabs; reduced motion renders one frame; geometries, materials, textures and the renderer are disposed on unmount. |
| `CutUpPoem` | Tzara's recipe for a Dada poem: the profile summary cut into slips (`cutUp()`), "shaken" with `Flip`, restorable; each arrangement is announced in a polite live region. Screen only. |

Paper surfaces (course tickets, collaboration clippings, milestone notes) keep their paper colour in both themes and re-scope the text tokens so their contents stay readable in dark mode.

---

## Readymades

Three Dada objects rendered live with Three.js and printed as halftone photomontage cut-outs, each with a typewritten museum label: Raoul Hausmann's *Der Geist unserer Zeit* (1920) on `/education`, Marcel Duchamp's *Bicycle Wheel* (1913) on `/projects` and Man Ray's *Cadeau* (1921) on the 404. Real objects come from CC0 scans (Poly Haven, credited in `public/models/CREDITS.txt`); the rest is built from primitives.

**Loading.** `ReadymadeFigure` (server-rendered markup: the stage box and the label) watches the stage with an `IntersectionObserver` (400 px margin) and, once the browser is idle, mounts `ReadymadeCanvas` through `next/dynamic` — so three.js, the GLTF loader and the models are only fetched for a figure that is about to be seen. Until the piece is ready, a dotted cutting line with scissors holds its place. If the WebGL context cannot be created, or loading fails, the figure removes itself.

**Stage** (`stage.ts`). Transparent canvas, pixel ratio capped (2, or 1.5 on touch devices), hemisphere + key + rim lights and a low-intensity `RoomEnvironment` reflection so metals read as metal. `dispose()` walks the scene and frees every geometry, material and texture, then the print pass and the renderer.

**Print pass** (`print.ts`). The scene renders into a 4× MSAA render target; a full-screen triangle then redraws it:

1. **Tone** — ACES curve, gamma, then per-work black and white points and a mid-tone gamma.
2. **Two plates** — a 45° black halftone screen for the tones (dot radius ∝ √ink) and a 15° red screen where the subject is red (redness = red minus the larger of green and blue), offset by about a pixel like a misregistered press; very dark pixels (line work: spokes, tick marks) print solid.
3. **Cut-out** — the coverage is dilated by up to ~7 CSS px (24 taps), the radius wandering with value noise, giving a paper margin with a hand-cut edge; the same dilation, offset, becomes a red halftone shadow plate.
4. Output is premultiplied straight to the canvas; paper, ink and red are fixed sRGB values, so the cut-out stays paper in dark mode too.

**Works** (`works/*.ts`) share one shape (`works/types.ts`): an async build that loads assets and assembles the scene (in its finished state), returning a factory that — inside the figure's `gsap.context` — makes:

- `intro`, a paused timeline of `from` tweens with labels (`arrive` / `parts` / `tape` / `settled`, `stool` / `wheel` / `spin`, `iron` / `tacks`), so reverting the context always leaves the piece assembled and reduced motion simply jumps to `progress(1)`;
- `update(time, dt)` for idle motion (sway, a ticking second hand, the free-wheeling spin), `look(x, y)` for mouse/pen, `scroll(progress, velocity)` from a ScrollTrigger on the figure, `drag(dx)` (Duchamp, via a `Draggable` proxy whose `onClick` still acts) and `act()`;
- actions replay parts of the intro with `tweenTo(label)` then `play(label)`: the head's instruments are knocked off and refitted, the tacks pulled and hammered again; the wheel gets a spin.

Models stay in their own units (metres) inside a scaled `body` group, nested in an entrance group (`rig`) and an idle/pointer group (`turn`), so the three kinds of motion never fight over one transform.

**Cost.** The loop runs on `gsap.ticker` only while the figure intersects the viewport (and not at all in hidden tabs), capped at 30 fps on touch devices. Shader-compile logging is off in production.

**Adding a model.** Download the 1k glTF from Poly Haven into `public/models/<name>/`, shrink its textures to 512–1024 px, remove maps the print look does not need and any `KHR_materials_transmission` (it costs an extra render pass), and add the model to `CREDITS.txt`; `data.test.ts` checks that every referenced file exists and that each model is credited.

---

## Page transitions

`TransitionProvider` renders a fixed cover (red slab and ink slab, both torn along their long edges by `tornSlab()` clip-paths, with a grid, star and label) and exposes `navigate(href, { label, locale })`. It tracks a phase — `idle → covering → waiting → revealing → idle`:

1. **covering** — `navigate` sets `<html data-cover="on">`, sweeps the slabs in (`xPercent` −125 → 0, `rewind` ease) and pastes the destination label up from cut-out ransom letters that fly in. Further clicks in this phase only retarget the cover (the latest click wins).
2. **waiting** — when the sweep completes (or after a 0.9 s timer, so stalled animation frames can never block navigation) it calls `router.push()` and arms a 1.5 s reveal failsafe.
3. **revealing** — when `usePathname()` (from `next/navigation`) changes, it waits two frames, sweeps the slabs out, sets `data-cover="off"` and dispatches `fx:reveal` from a fresh task.
4. `playOnReveal()` in each component runs its entrance at that moment.

The cover's tweens are created outside any GSAP context on purpose: GSAP runs a tween's callbacks inside the context that created it, so dispatching the reveal from a context-bound tween would execute every page component's entrance inside the cover's context and tie the contexts together. They are killed on unmount instead.

**Language switches** use the same cover, then `window.location.assign()` the translated URL (`getPathname({ href, locale })`). The `[locale]` layout owns `<html>`, `<head>` and the fonts, so a client-side remount would re-render inline scripts and drop the `js-fx` class; a full load is cleaner and keeps every page statically served.

`TransitionLink` ignores modified clicks, non-primary buttons, other targets and same-page links. Reduced motion and hidden tabs navigate instantly. The theme toggle uses `document.startViewTransition` with a clip-path circle from the click point (`flushSync` so next-themes applies the class inside the transition; a skipped transition is caught).

---

## Background stage

`BackgroundStage` mounts client-side only and stacks:

1. `.bg-grid` — 40 px architectural grid and 45° diagonals (CSS gradients).
2. `CosmosCanvas` — DPR-capped canvas; stars in three depths with pointer and scroll parallax; in dark mode cross glints, HUD lines from the pointer to nearby foreground stars, and shooting stars. Runs on `gsap.ticker`; reduced motion draws one still frame; reacts to theme changes via a `MutationObserver` on `<html>`. Pointer parallax follows a mouse or pen only (a finger is tapping or scrolling); the canvas is sized to the stage and keeps its stars when resized.
3. `ConstructivistField` — 1600×1000 SVG (`slice`): rays, striped diagonal band, sun disc with rings, orbit ellipses with two MotionPath satellites, rotating star, outlined "КОСМОС · 1961". Each layer has a pose group (route-dependent), a parallax group (scrubbed over the whole document) and its own perpetual motion. `POSES` defines the composition for `cv`, `education`, `projects` and `detail`; changing route tweens every layer to its new pose.
4. `.bg-grain` (animated SVG noise), `.bg-scanlines` (dark only) and `.bg-vignette`.

In light mode the CV variant is quieter (field 30 %, canvas 50 %) so the paper sheet reads clearly.

**Mobile stability.** The stage is `100lvh` tall rather than `inset: 0`, so mobile toolbars sliding in and out never resize it (which would rescale the poster and move the stars). `html { overflow-x: clip }` keeps anything an entrance animation slides in from off-screen from widening the phone's layout viewport; without it the browser zooms the whole page out and back while the animation runs.

---

## Pages

| Route | Composition |
|---|---|
| `/` | `CollageHero` (screen only), then the toolbar (eyebrow + `PrintButton`), `SheetIntro` → taped `article.cv-sheet` with marks and an inked `Stamp`, header (identity + `dl` contacts with screen/print variants), two `Scatter` columns of `CvSection`s, then `CutUpPoem` (screen only). Hero content is built from the real data (final grades, featured footage). |
| `/education` | Hero (DadaTypography, GlitchRevealText institution, programme facts in a 2 × 2 grid, graduation badge) with Readymade № 1 in a second column from 1024 px, stat cards (`TiltCard` + `Counter`), `RevealHeading`, `SemesterTrack` of perforated ticket-stub courses, grade note. |
| `/projects` | Hero with Readymade № 2, `ProjectsFilterGrid` of `ProjectCard`s (`TiltCard`, torn-edged soft-duotone thumbnails or `PosterArt`, stretched link), Collaborations as newspaper clippings with Unbounded headlines and 15 px body copy (private repositories have no link). |
| 404 | Outlined "404", ransom-note title, home link, and Readymade № 3 beside them from 1024 px. |
| `/projects/[id]` | Back link, hero (badges, live and repository actions in `Magnetic`; Pour Rice shows its app icon), highlight counters, overview and key points, platforms (`OrbitDiagram` + list) for multi-platform projects, `DevTimeline` (newest first, kraft-paper milestone notes) with `InlineVideo`s, sticky sidebar (tech, courses, repositories). `dynamicParams = false`. |

---

## Styling and theming

- `@import "tailwindcss"`, `@custom-variant dark (&:where(.dark, .dark *))`, `@theme` font and colour tokens.
- Design tokens are CSS custom properties on `:root` (light) and `:root.dark`; component CSS lives in `@layer components` and uses only tokens, so both themes and print are a matter of redefining variables.
- next-themes runs with `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}` and `enableColorScheme={false}` — `color-scheme` comes from the stylesheet so print can force it to light.

---

## Fonts

Loaded with `next/font/google` and exposed as CSS variables on `<html>`:

- **Noto Serif Display** (variable weight and width, normal + italic, Latin + Cyrillic) → `--ff-title`; `.font-title` renders light italic, numerals use `font-stretch` for a condensed constructivist look.
- **LINE Seed JP** 400/700 → `--ff-en` (English body).
- **Iansui** 400 → `--ff-zh` (Chinese body and `lang="zh-HK"` elements); not preloaded, since its CJK slices load on demand.
- **Unbounded** (variable, Latin + Cyrillic) → `--ff-display`: stamps, cut-out letters, label tape, clipping headlines. Not preloaded.
- **Special Elite** → `--ff-type`: typewritten scraps, ticket serials, cut-up slips; never used at display sizes. Not preloaded.

---

## Print

`@media print` turns the CV into a two-page A4 document:

- `@page { size: A4; margin: 12mm 13mm }`, all colour tokens redefined to black/white, `color-scheme: light !important`.
- Chrome and decoration are hidden (`.no-print`, header, footer, background, cover, cursor, modal, collage hero, cut-up poem, tape, stamps).
- Scramble text that has not resolved prints its real text (`.glitch-base { opacity: 1 !important }`, overlay hidden).
- Shadows, filters, text shadows, animations and transitions are removed inside `<main>`; GSAP leftovers (`opacity`, transforms, `clip-path`) are overridden for `[data-fx-hide]` content and the sheet.
- Print-specific type scale in pt; contact rows switch to printable URLs (`.print-only`); entries avoid breaking across pages.

---

## Accessibility and reduced motion

- Decorative layers (`BackgroundStage`, cover, cursor, tickers, diagram, glitch overlays) are `aria-hidden`; text effects keep the real text (`aria-label` on DadaTypography, SplitText's own labels).
- `prefers-reduced-motion: reduce` → no pinning, no displacement, fades only, a still star field, and CSS loops stopped.
- Skip link, visible focus rings, `aria-current` in navigation, `aria-pressed` on filters, a live region for the filter count, and a focus-trapped video dialog.

---

## Testing

`npm test` runs Vitest:

| File | Covers |
|---|---|
| `profile.test.ts` | Age boundaries in Hong Kong time; contact links |
| `youtube.test.ts` | URL parsing and embed URLs |
| `text-fx.test.ts` | Lossless segmentation (fast-check), CJK splitting, PRNG determinism, displacement clamps, glitch pools and frames, the glyph cycler holding each noise glyph for its hold time |
| `data.test.ts` | 11 projects / 30 unique videos / 19 courses, the Swift iOS app folded into Pour Rice (12 videos), references between data, ISO dates, newest-first timelines, private collaborations unlinked, bilingual completeness, matching message keys, readymade labels in both languages, every model's files present and credited (no transmission pass), British spelling |
| `collage.test.ts` | Seeded PRNG range and determinism, shuffle as a permutation, torn clip-paths (only the requested sides, inside the box), torn slabs, ransom glyphs (deterministic, bare spaces, no paper repeated on neighbours), lossless cut-up in English and Chinese |

---

## Adding content

- **New project**: add an entry to `PROJECTS` in `src/lib/projects.ts` (unique `id`, bilingual fields, course codes that exist in `education.ts`, ISO dates). The route, sitemap entry and static params follow automatically. Run `npm test`.
- **New video**: append to the project's `videos` with its date and kind; the card thumbnails and the newest-first timeline update automatically.
- **New UI label**: add the key to both `messages/en.json` and `messages/zh-hk.json`.
- **New effect**: build it in `components/fx/` following the component pattern above.

---

## Deployment

Vercel builds with `next build`; all locale pages and project pages are pre-rendered (`●`), the CV page revalidates daily, and `proxy.ts` handles locale redirects at the edge. Vercel Analytics and Speed Insights are mounted in the locale layout.
