# CV Website Project - CLAUDE.md

**Owner**: NG Yu Ham Baldwin | 吳宇涵

## Project Overview
Bilingual (Traditional Chinese / British English) CV and portfolio built with Next.js 16 (App Router) for Vercel. The visual identity is **"Merz" — a Dada photomontage in Soviet poster colours**: Schwitters-style collage cut from the CV's own data (course codes, grades, project footage), Lissitzky's red wedge, Rodchenko red/black, torn paper, tape, ink stamps, ransom-note lettering — over a constructivist space-age background. Animated with **GSAP**, plus a **Three.js** Merzbau on the landing page. The CV sheet itself stays formal and prints as a clean black-and-white A4 document.

## Critical Requirements
1. **Bilingual**: every visible string exists in EN and ZH-HK (data: `{ en, zh }` pairs; UI: `src/messages/*.json`, same keys in both — tested).
2. **British English**: colour, centre, organisation, programme, labelling, optimise. A unit test rejects common American spellings in English copy.
3. **Light mode default**; manual toggle only (`enableSystem={false}`).
4. **Printable CV**: `/` must always print as clean B/W A4 (target ≤ 2 pages). The collage hero and the cut-up poem are screen-only — see *Print*.
5. **Responsive**: mobile-first; check 375 px and desktop.
6. **Accessibility**: every effect respects `prefers-reduced-motion`; decorative layers are `aria-hidden`; real text always stays in the DOM (scramble hides text with opacity, never `visibility`).
7. **Academic focus**: education and projects first; work experience brief.
8. **Privacy**: never render the birth date (only the computed age) or the street address.

## Tech Stack
- Next.js 16.4 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS 4 (`@import "tailwindcss"`, `@custom-variant dark`, `@theme` tokens; no `tailwind.config.js`)
- next-intl 4.8 (`src/i18n/routing.ts`, `navigation.ts`, `request.ts`; locale routing in `src/proxy.ts` — Next 16's replacement for `middleware.ts`)
- next-themes 0.4 (class strategy, `enableColorScheme={false}`)
- **gsap 3.15 + @gsap/react 2.1** — plugins: ScrollTrigger, SplitText, Flip, DrawSVG, MotionPath, CustomEase, Draggable, Inertia (all free, from the public `gsap` package)
- **three 0.186** — the Merzbau scene only, lazy-loaded (`next/dynamic`, `ssr: false`) after the page is idle
- lucide-react icons, @vercel/analytics, @vercel/speed-insights
- vitest + @testing-library + fast-check (`npm test`)

## File Structure
```
src/
├── app/
│   ├── layout.tsx                 # Pass-through root layout (html/body live in [locale]/layout)
│   ├── not-found.tsx              # Fallback 404 outside any locale
│   ├── globals.css                # Tokens, both themes, components, collage, reduced-motion, print
│   ├── icon.png · robots.ts · sitemap.ts
│   └── [locale]/
│       ├── layout.tsx             # Fonts, providers, CollageDefs, BackgroundStage, Header, Footer, CursorReticle
│       ├── page.tsx               # Collage hero + CV sheet (printable) + cut-up poem
│       ├── education/page.tsx     # Programme, stats, pinned semester track of ticket stubs
│       ├── projects/page.tsx      # Flip-filtered duotone cards + newspaper-clipping collaborations
│       ├── projects/[id]/page.tsx # Case study: highlights, platforms, timeline, sidebar
│       ├── not-found.tsx · [...rest]/page.tsx
├── components/
│   ├── Header · Footer · Telemetry · ThemeProvider · ThemeToggle · LanguageToggle · PrintButton
│   ├── CvSection · SheetIntro                 # CV sheet building blocks
│   ├── SemesterTrack                          # Education: pinned horizontal track
│   ├── ProjectsFilterGrid · ProjectCard · PosterArt
│   ├── DevTimeline · InlineVideo · OrbitDiagram
│   ├── collage/                               # Dada collage system (see below)
│   ├── transition/TransitionProvider · TransitionLink
│   └── fx/                                    # Reusable GSAP effects (see below)
├── i18n/ routing.ts · navigation.ts · request.ts
├── lib/
│   ├── profile.ts     # Name, title, contacts, summary, getAge()
│   ├── education.ts   # Programme, 4 semesters / 19 courses, grades
│   ├── cv.ts          # Skill groups, experience, languages, IELTS, achievements
│   ├── projects.ts    # 11 projects, 30 videos, milestones, collaborations, buildTimeline()
│   ├── collage.ts     # Seeded generators: torn clip-paths, torn slabs, ransom glyphs, cut-up, shuffle (tested)
│   ├── youtube.ts     # URL parsing, thumbnails, nocookie embeds
│   ├── i18n-text.ts   # Bilingual type, pick(), date formatting
│   ├── text-fx.ts     # Pure helpers for Dada/glitch text (tested)
│   ├── gsap.ts        # The only place plugins are registered
│   ├── reveal.ts      # Transition ↔ entrance coordination
│   └── seo.ts         # canonical + hreflang alternates
├── messages/ en.json · zh-hk.json
└── proxy.ts
public/images/        # Header amplifier monogram, Pour Rice app icons
```

## Content: where to edit
- **Personal details / summary** → `src/lib/profile.ts`
- **Courses, grades, GPA** → `src/lib/education.ts`
- **Skills, jobs, languages, achievements** → `src/lib/cv.ts`
- **Projects, videos, milestones, collaborations** → `src/lib/projects.ts` (ids are route slugs; `FEATURED_IDS` picks the three on the CV; dates are ISO `YYYY-MM-DD`; `approximate: true` shows a milestone as "approx. Month Year")
- **UI labels** → `src/messages/*.json` (keep keys identical in both files — tested)
- **Pour Rice** includes its native Swift iOS app (12 videos, platforms list, iOS start milestone). The old `/projects/pourrice-ios` URL permanently redirects to `/projects/pourrice` (`next.config.mjs`).
- Development timelines are rendered **newest first** (`buildTimeline`); a same-day milestone sits below that day's videos.
- The collage hero is assembled in `[locale]/page.tsx` from real data — change the data and the collage follows.
- Missing information gets a JSX comment: `{/* PLACEHOLDER: … */}`. Not supplied so far: profile photo, academic awards, earlier-semester grades, exact start dates for Computer Ethics, Data Communication and Networking and the Swift iOS app (marked `approximate`).

## Personal Information
| Field | Value |
|-------|-------|
| Name (EN) | NG Yu Ham Baldwin |
| Name (ZH) | 吳宇涵 |
| Title | Software Developer |
| Email | baldwon0xd@gmail.com |
| Phone | +852 6701 6557 |
| Location shown | Hong Kong SAR |
| Age | Computed by `getAge()` from May 2005 (Hong Kong time); never show the birth date |
| GitHub | https://github.com/Test-Plus-XD |
| LinkedIn | https://www.linkedin.com/in/test-plus-004601285/ |
| YouTube | https://youtube.com/playlist?list=PLkzUf67y42SM-JlZk4eJEDIYPdb7VKbVo |
| Discord | test_plus |

Education: HKCT Higher Diploma in Computer Studies (Mobile Applications and Game Development), HDPMAGDF, QF Level 4, Sept 2024 – May 2026 (graduated May 2026), final CGPA 3.8, final-term GPA 4.1. Certification: IELTS Academic Band 6.5 only.

## Repository Links
| Repo | URL |
|------|-----|
| PourRice-Ionic | https://github.com/Test-Plus-XD/Cross-Platform-Assignment |
| PourRice-Flutter | https://github.com/Test-Plus-XD/Android-Assignment |
| PourRice-Swift | https://github.com/Test-Plus-XD/iOS-Assignment |
| Web-Assignment | https://github.com/Test-Plus-XD/Web-Assignment |
| 2D-Chess-Game | https://github.com/Test-Plus-XD/2D-Chess-Project |
| 2D-Puzzle-Game | https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment |
| AI Annotation Tool v2 | https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/tree/main/AI%20Annotation%20Tool%20v2 |
| Card-Game | https://github.com/Test-Plus-XD/NetBeans-Projects/tree/main/CardMatchingGame |
| Collaboration (public) | https://github.com/keithku321/object-detection |
| Collaboration (private, never linked) | keithku321/gaming-ai-companion |

**Videos**: 30 distinct YouTube links across the 11 projects (tested).

## Pages
- **`/` CV** — (1) **collage hero** (screen only): ransom-note name, label-maker title, typewritten descriptor, vermilion name chop, ink stamp, newsprint scrap and draggable duotone scraps of project footage over the Three.js Merzbau; scrolling scatters it. (2) **CV sheet**: taped paper sheet with registration marks and an inked stamp; header (DadaTypography name, contacts, age), profile, education with final-semester grades, three featured projects, experience, skills, languages, IELTS, achievements. Feeds out like printer paper (`SheetIntro`). (3) **Cut-up poem** (screen only): Tzara-style "shake the bag" toy over the profile text.
- **`/education`** — hero with GlitchRevealText institution, programme facts, counter stat cards, **pinned horizontal semester track** (≥ 1024 px with full motion; stacked otherwise) of taped sheets holding **ticket-stub** courses.
- **`/projects`** — category filter re-flowing the grid with **Flip**; taped cards with torn-edged, lightly duotoned thumbnails (full colour on hover) or a generated poster; collaborations as newspaper clippings.
- **`/projects/[id]`** — hero + live/repo actions, highlight counters, overview, Pour Rice **orbit diagram** of its platforms, newest-first timeline (kraft-paper milestone notes, video thumbnails opening a FLIP modal), sticky sidebar (tech, courses, repos).

## GSAP effects system
**Rules (important):**
- Import `gsap` and plugins **only** from `@/lib/gsap` (registers everything once, defines `soviet` and `rewind` eases, disables lag smoothing so entrances finish on time).
- Use `useGSAP` with a `scope`; branch with `gsap.matchMedia()` on `FULL_MOTION` / `REDUCED_MOTION` / `FINE_POINTER`.
- **Inside a `mm.add()` handler, use the handler's own second argument (`contextSafe`)** for deferred callbacks — never `useGSAP`'s `contextSafe`. Mixing them makes two GSAP contexts reference each other and revert recursion crashes the page ("Maximum call stack size exceeded"). `playOnReveal(contextSafe, fn)` in `src/lib/reveal.ts` wraps this correctly; return its result from the handler.
- **GSAP runs tween and ScrollTrigger callbacks inside the context that created them.** Never call another component's context-bound code (or `ScrollTrigger.refresh()`) from inside such a callback or a `useGSAP` body — defer it to a fresh task/frame. The transition cover's tweens live outside any context for this reason.
- Entrance animations must wait for the page-transition cover: use `playOnReveal` (it runs immediately when nothing is covering).
- Elements animated in from hidden carry `data-fx-hide`; CSS hides them before first paint (`html.js-fx`, rendered directly on `<html>`; a `<noscript>` style un-hides everything without JavaScript) and a 3 s CSS failsafe reveals them if hydration fails. Call `markReady(el)` after setting the initial GSAP state.
- GSAP leaves inline `transform`s on animated elements, so CSS hover lifts use the separate `translate` / `rotate` properties.
- Never put a CSS `transform` on something GSAP animates with `x/xPercent`; use DrawSVG only on solid strokes.

**Components (`src/components/fx/`):**
| Component | Effect |
|---|---|
| `BackgroundStage` | Fixed layers: CSS grid → `CosmosCanvas` → `ConstructivistField` → grain, scanlines (dark), vignette. Client-only, `no-print`. |
| `CosmosCanvas` | 2D canvas star field (3 depths), pointer + scroll parallax, twinkle, HUD lines and shooting stars in dark mode; drawn on `gsap.ticker`. |
| `ConstructivistField` | SVG poster: red sun, orbit rings with satellites (MotionPath), diagonal band, rays, star, "КОСМОС"; draws in; scroll parallax; **re-poses per route**. |
| `DadaTypography` | Per-glyph deconstruction (spec in the profile document): seeded PRNG, 2 px first-paint clamp, double-rAF + 10 ms alignment, hover re-scatter ×1.8, optional misregistration. |
| `GlitchText` / `GlitchRevealText` | Cyrillic/Bauhaus scramble overlay (Bauhaus-only in 繁中); `loadIn` mode starts as glyph noise and resolves once revealed and in view. |
| `Scramble` | `GlitchText` in load-in mode without hover replay — the nav-link randomise effect used across the site on labels, codes, dates, chips, badges, buttons, timeline and CV entries. |
| `Scatter` | Children settle from a +32 px (`collage`: +48 px) diagonal, or `rise`; fade only under reduced motion. |
| `RevealHeading` | SplitText line-mask rise + extending rule + scrambled "§ 0n" index. |
| `Counter` · `TiltCard` · `Magnetic` · `CursorReticle` · `MorseCodeTicker` | Count-up figures; 3D tilt with spotlight and brackets; magnetic buttons; targeting cursor; Morse strips. |

**Collage (`src/components/collage/`):**
| Component | What it is |
|---|---|
| `CollageDefs` | Shared SVG filters: `fx-ink` / `fx-ink-soft` (rubber-stamp ink), `fx-duotone` (strong red/black print, hero scraps), `fx-duotone-soft` (~⅓ blend, video thumbnails), `fx-dots`. Rendered once in the layout. |
| `RansomText` | Cut-out letters, each from a different paper and face; pasted in on load, flutter on hover; real text kept for screen readers. |
| `Stamp` | SVG rubber stamp with ring text on a circular path, slams on when scrolled into view. |
| `Paper` | `Tape`, `Torn` (seeded torn clip-path + paper shadow), `NewsScrap`, `Seal` (白文 name chop), `LabelTape` (Dymo strip). |
| `CollageHero` | Landing photomontage; fragments are `Draggable` with inertia (fine pointers), scatter on scroll; mounts `MerzbauScene` after idle. |
| `MerzbauScene` | Three.js: canvas-painted torn scraps of CV data floating in depth (hover flips them), a Lissitzky red wedge piercing a white disc, a Tatlin tower spiral; renders only while visible; one still frame under reduced motion; disposes everything on unmount. |
| `CutUpPoem` | Tzara cut-up: profile cut into slips, "shake the bag" (Flip), restore; arrangement announced in a polite live region. |

**Page transitions** (`components/transition/`): `TransitionLink` asks `TransitionProvider` to sweep a red slab and an ink slab — **torn along their long edges** (`tornSlab`) — across while the destination is pasted up from cut-out letters; the route changes under the cover, then the slabs sweep off and `fx:reveal` releases entrance animations. `<html data-cover="on|off">` reflects the state. The latest click wins; modified clicks, same-page links, hidden tabs and reduced motion bypass it; timer failsafes navigate (0.9 s) and uncover (1.5 s). **Language switches do a full page load** of the translated URL. The theme toggle uses a View Transitions circular reveal where supported.

## Styling
- Tokens live in `globals.css` (`:root` = light aged paper, `:root.dark` = night launch site). Palette: Soviet red `#8f0000`, vermilion `#c8231a`, orange `#db5b00`, gold `#ffa500`, paper `#f5efe6`, dark `#161412`, plus collage papers that stay paper-coloured in both themes: scrap `#f6efe2`, newsprint `#e7ddc8`, kraft `#c39a63`, ink `#17120f`, tape.
- Paper elements (tickets, clippings, milestone notes) **re-scope the tokens** (`--ink`, `--muted`, `--accent-text`…) so everything inside stays readable on paper in dark mode.
- Component styles are plain CSS in `@layer components`; Tailwind supplies preflight, the theme and occasional utilities. Links and accents are red.
- Avoid `mix-blend-mode` on large animated layers (it cost most of the frame budget on the grain layer).

## Fonts (all via `next/font/google`)
| Priority | Font | Use | Variable |
|---|---|---|---|
| 1 | Noto Serif Display (variable, italic, `wdth`) | Names, headings, card titles, numerals (`.font-title`) | `--ff-title` → `--font-title` |
| 2 | Iansui | Traditional Chinese body text and any `lang="zh-HK"` element | `--ff-zh` → `--font-zh` |
| 2 | LINE Seed JP 400/700 | English body text | `--ff-en` → `--font-en` |
| accent | Unbounded (variable, Cyrillic) | Stamps, cut-out letters, label tape, clipping headlines | `--ff-display` → `--font-display` |
| accent | Special Elite | Typewritten scraps, ticket serials, cut-up slips (never at display sizes) | `--ff-type` → `--font-type` |

Accent faces are not preloaded. `body.locale-zh` switches the body font; Chinese mode disables `text-transform` so embedded Latin keeps its case.

## Print
- `@media print` + `@page { size: A4; margin: 12mm 13mm }`; colours forced to black/white and `color-scheme: light !important`.
- Hidden: header, footer, background, cursor, cover, collage hero, cut-up poem, buttons, stamps, tape, registration marks (`.no-print`).
- Anything GSAP left mid-animation is forced visible and untransformed; scramble text that has not resolved prints its real text (`.glitch-base`); counters restore their value on `beforeprint`.
- Verify with Chrome/Edge print-to-PDF in **both locales and both themes**.

## Commands
```bash
npm install
npm run dev
npm run build
npm test          # vitest run (data integrity, age, YouTube parsing, text-fx, collage generators)
npm run test:ui
```

## Notes for agents
- British English in all copy and comments.
- Data files may be edited by the owner while you work — make targeted edits, never rewrite them wholesale.
- The in-app browser pane and plain headless Chromium throttle `requestAnimationFrame`; verify animations in a real browser or a DevTools-protocol harness with background throttling disabled.
- In `next dev`, the 404 page logs a next-themes "script tag" warning (the not-found boundary renders client-side); production is clean.
- See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the in-depth guide.
