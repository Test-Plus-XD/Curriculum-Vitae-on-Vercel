# CV Website Project - CLAUDE.md

**Owner**: NG Yu Ham Baldwin | 吳宇涵

## Project Overview
Bilingual (Traditional Chinese / British English) CV and portfolio built with Next.js 16 (App Router) for Vercel. The visual identity is **"Merz" — a Dada photomontage in Soviet poster colours**: Schwitters-style collage cut from the CV's own data (course codes, grades, project footage), Lissitzky's red wedge, Rodchenko red/black, torn paper, tape, ink stamps, ransom-note lettering — over a constructivist space-age background printed as a press sheet: halftone screens with a misregistered red plate, registration marks, colour bar, marginalia and ghosted readymade prints that drift behind the content as it scrolls. Animated with **GSAP**, plus **Three.js**: a Merzbau on the landing page and four **Dada set pieces** rendered live as halftone photomontage cut-outs — three **readymades** (Hausmann's head on Education, Duchamp's bicycle wheel on Projects, Man Ray's iron on the 404) and a hanging **found-object mobile** of four everyday scans on the Projects hero. A fresh visit opens with a six-second **title sequence** (constructivist poster → whip pan → a 3D hand releases Sputnik, whose torn ribbon opens a window onto the site). The CV sheet itself stays formal and prints as a clean black-and-white A4 document.

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
- **three 0.186** — the Merzbau scene, the readymades and the found-object mobile, lazy-loaded (`next/dynamic`, `ssr: false`) once the page is idle and the figure is near the viewport; CC0 glTF models from Poly Haven in `public/models/`, plus the MIT WebXR generic hand for the opening (credits in `public/models/CREDITS.txt`); the opening loads three.js at once when it plays
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
│       ├── projects/page.tsx      # The projects gazette (paginated broadsheet) + newspaper-clipping collaborations
│       ├── projects/[id]/page.tsx # Case study: highlights, platforms, timeline, sidebar
│       ├── not-found.tsx · [...rest]/page.tsx
├── components/
│   ├── Header · Footer · Telemetry · ThemeProvider · ThemeToggle · LanguageToggle · PrintButton
│   ├── CvSection · SheetIntro                 # CV sheet building blocks
│   ├── SemesterTrack                          # Education: pinned horizontal track
│   ├── ProjectsGazette · PosterArt              # Projects: newspaper pages with a GSAP page turn
│   ├── DevTimeline · InlineVideo · OrbitDiagram
│   ├── collage/                               # Dada collage system (see below)
│   ├── readymade/                             # Three.js readymades: figure, canvas, stage, print pass, works/
│   ├── objets/                                # Found-object mobile: catalogue, scene, canvas, figure
│   ├── opening/                               # Title sequence: gate, labels, timeline, solids, stage, hand, low-poly layer, ribbon
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
public/images/        # Header monogram, Pour Rice icons, press/ halftone prints for the scroll wall
public/models/        # CC0 glTF models for the readymades and the mobile (textures shrunk for the web) + CREDITS.txt
```

## Content: where to edit
- **Personal details / summary** → `src/lib/profile.ts`
- **Courses, grades, GPA** → `src/lib/education.ts`
- **Skills, jobs, languages, achievements** → `src/lib/cv.ts`
- **Projects, videos, milestones, collaborations** → `src/lib/projects.ts` (ids are route slugs; `FEATURED_IDS` picks the three on the CV; dates are ISO `YYYY-MM-DD`; `approximate: true` shows a milestone as "approx. Month Year")
- **UI labels** → `src/messages/*.json` (keep keys identical in both files — tested)
- **Scroll wall** — the ghosted prints are `public/images/press/*.webp` (regenerate them from the live print pass if a model changes); the furniture and their positions are `PATTERNS` / `PRINTS` in `src/components/fx/ScrollWall.tsx`.
- **Opening sequence** — copy is the `opening` namespace in `src/messages/*.json`; timing is `src/components/opening/labels.ts`; the hand's pose is `POSE` in `opening/scene.ts`.
- **Found-object mobile** — the four objects (model folder, catalogue size, idle spin and hanging turn) are catalogued in `src/components/objets/objects.ts`; its label, stamp, swing hint and object names are the `objets` namespace in `src/messages/*.json`.
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
- **`/education`** — hero with GlitchRevealText institution, programme facts and **Readymade № 1** (Hausmann's head, beside the text from 1024 px, below it on phones), counter stat cards, **pinned horizontal semester track** (≥ 1024 px with full motion; stacked otherwise) of taped sheets holding **ticket-stub** courses.
- **`/projects`** — hero with the **found-object mobile** (four everyday scans hung from a wire, below the lede and beside Readymade № 2 from 1024 px) and **Readymade № 2** (Duchamp's bicycle wheel: drag across it to spin); the projects printed as a **broadsheet** (`ProjectsGazette`): a "MERZ" masthead with ears, motto and dateline, the category filter as a section index, a front page (lead story with its description in two columns plus a sidebar of two) and inner pages (a wide story over three briefs) cut by `paginateEdition` (3 on the front, 4 after); halftone grey photographs (full colour on hover; each is a button that opens the latest video in the FLIP player of `InlineVideo`, `variant="press"`) with a wire-style credit line, drop caps on the feature stories (not in 繁中) and datelines ("HONG KONG –" / 【本報訊】) on the briefs, typewritten filing lines. The copy reads as a real paper in both languages (`projects.gazette` messages: volume and number, dateline with the weekday, edition, price, ears, jump lines). The pager, numbered pages and a dog-eared corner (click, or **drag it** to turn the page by hand: the leaf follows the pointer round the spine and finishes or falls back on release) **turn the page** in 3D, held by a **Dada hand** (`gazetteHand.ts`): the opening's halftone hand print, cut out and posed frame by frame on the leaf's free edge with the turn's 2600 px perspective (it grows as the page lifts). It is placed by the view: the broadsheet is taller than the window, so the hand holds the edge at a fixed height on screen (where the dog-ear was clicked, or 56 % down for the pager; a left hand, mirrored, for turning back), and sits under the pointer while the corner is dragged. It boils like stop-motion collage, a red halftone plate of its silhouette slips out of register behind it, hovering the dog-ear makes it peek in (fine pointers), and it is absent under reduced motion. The turn itself: the old page is copied into a leaf with a newsprint back that swings over the spine while it shadows the page beneath (backwards, the earlier page swings back in); reduced motion cross-fades. The sheet stays paper in both themes (warm newsprint by day, light grey at night); collaborations as newspaper clippings (body copy at the card size, 15 px).
- **404** — ransom-note "Signal lost" beside **Readymade № 3** (Man Ray's tack-studded iron).
- **`/projects/[id]`** — a red **reading rule** along the top edge (`ReadingRule`), hero with the gazette's wedge driven in behind the copy (`HeroWedge`) + live/repo actions and, except on Pour Rice (app icon), the latest reel's still taped on as a halftone **press photograph** that drifts in its frame and opens the reel (`DetailPhoto`), highlight counters, overview opening on a drop cap (not in 繁中), Pour Rice **orbit diagram** of its platforms, newest-first timeline (kraft-paper milestone notes, video thumbnails opening a FLIP modal), sticky sidebar (tech, courses, repos), and torn **previous / next story** clippings in the gazette's order (wrapping round). Headlines keep hyphenated compounds whole (`KeepCompounds`).

## GSAP effects system
**Rules (important):**
- Import `gsap` and plugins **only** from `@/lib/gsap` (registers everything once, defines `soviet` and `rewind` eases, disables lag smoothing so entrances finish on time).
- Use `useGSAP` with a `scope`; branch with `gsap.matchMedia()` on `FULL_MOTION` / `REDUCED_MOTION` / `FINE_POINTER`.
- **Inside a `mm.add()` handler, use the handler's own second argument (`contextSafe`)** for deferred callbacks — never `useGSAP`'s `contextSafe`. Mixing them makes two GSAP contexts reference each other and revert recursion crashes the page ("Maximum call stack size exceeded"). `playOnReveal(contextSafe, fn)` in `src/lib/reveal.ts` wraps this correctly; return its result from the handler.
- **GSAP runs tween and ScrollTrigger callbacks inside the context that created them.** Never call another component's context-bound code (or `ScrollTrigger.refresh()`) from inside such a callback or a `useGSAP` body — defer it to a fresh task/frame. The transition cover's tweens live outside any context for this reason.
- Entrance animations must wait for the page-transition cover: use `playOnReveal` (it runs immediately when nothing is covering).
- Elements animated in from hidden carry `data-fx-hide`; CSS hides them before first paint (`html.js-fx`, rendered directly on `<html>` — the only inline script is the opening's gate; a `<noscript>` style un-hides everything without JavaScript) and a 3 s CSS failsafe reveals them if hydration fails. Call `markReady(el)` after setting the initial GSAP state.
- GSAP leaves inline `transform`s on animated elements, so CSS hover lifts use the separate `translate` / `rotate` properties.
- Never put a CSS `transform` on something GSAP animates with `x/xPercent`; use DrawSVG only on solid strokes.

**Components (`src/components/fx/`):**
| Component | Effect |
|---|---|
| `BackgroundStage` | Fixed press sheet: CSS grid → two halftone screens with a misregistered red plate → `CosmosCanvas` → `ConstructivistField` → press-sheet dressing (registration marks, colour bar, marginalia) → `PressLamp` → grain, scanlines (dark), vignette. Client-only, `no-print`. |
| `CosmosCanvas` | 2D canvas star field (3 depths), pointer + scroll parallax, twinkle, HUD lines and shooting stars in dark mode; drawn on `gsap.ticker`. |
| `ConstructivistField` | SVG poster: screen-printed red sun (a halftone dot pattern over the gradient), orbit rings with satellites (MotionPath), diagonal band, rays, star, "КОСМОС"; draws in; scroll parallax; **re-poses per route**. |
| `DadaTypography` | Per-glyph deconstruction (spec in the profile document): seeded PRNG, 2 px first-paint clamp, double-rAF + 10 ms alignment, hover re-scatter ×1.8, optional misregistration. |
| `GlitchText` / `GlitchRevealText` | Cyrillic/Bauhaus scramble overlay (Bauhaus-only in 繁中); `loadIn` mode starts as glyph noise and resolves once revealed and in view. Hover replays ignore touch taps. |
| `Scramble` | `GlitchText` in load-in mode without hover replay — the nav-link randomise effect used across the site on labels, codes, dates, chips, badges, buttons, timeline and CV entries. |

**Scramble speed — the two knobs:** how long each noise glyph holds before it changes is `GLITCH_GLYPH_HOLD_MS` in `src/lib/text-fx.ts` (110 ms, randomised ±30 % per glyph; raise it to slow the flicker, or pass `glyphHold` to one instance). How fast the real text resolves is the `speed` prop (ms per character; defaults in `GlitchText.tsx`: 10 for English, 4 for 繁中).
| `Scatter` | Children settle from a +32 px (`collage`: +48 px) diagonal, or `rise`; fade only under reduced motion. |
| `RevealHeading` | SplitText line-mask rise + extending rule + scrambled "§ 0n" index. |
| `Counter` · `TiltCard` · `Magnetic` · `CursorReticle` · `MorseCodeTicker` | Count-up figures; 3D tilt with spotlight and brackets; magnetic buttons; targeting cursor (hides the system pointer only while it is live — a coarse pointer, reduced motion, forced colours and pen/touch keep theirs; the dot is written straight from the pointer event, only the ring trails; an ink shadow in light mode, a strong warm glow (about triple) in dark; a left press prints the page in negative under the reticle via `backdrop-filter`: a 200 px disc at full strength out to 95 % of its radius and fading only over the outer 5 %, opening with a ripple, held (breathing) while the button is down and rippling away on release); Morse strips. |
| `InkMisregistration` | The two fixed halftone screens: the red plate drifts with the pointer, slides ±12 px under the black one as the page scrolls, and is knocked out of register for a second on every navigation. |
| `PressLamp` | One soft pool of warm light (cream in light mode, red-orange in dark) that follows the pointer across the sheet. |
| `ScrollWall` | Ghosted halftone prints of the site's own readymades plus printer's furniture (outlined `Merz` / `DADA` / `КОСМОС` words, serial strips, halftone discs, orbit arcs, registration marks) laid down the document behind the content, each drifting at its own rate as the page scrolls. |

**Press sheet (`src/components/fx/`)** — the printed paper the whole site sits on:
- **Screens.** `InkMisregistration` draws two full-page 45° dot screens: a black one (`--screen-ink`) and a red plate (`--screen-red`) a hair out of register, both faded by `--screen-opacity`. The red plate follows the pointer with a `quickTo` drift (mouse and pen only); a scrubbed ScrollTrigger slides its inner copy ±12 px under the black screen so the dots creep as you read; every navigation knocks the black screen from -13/8 px back into register (skipped under reduced motion). Only transform is animated, all of it `gsap.matchMedia`-gated on `FULL_MOTION` / `FINE_POINTER` and reverted by the `useGSAP` context.
- **Dressing.** Four corner registration crosses (from 1280 px), a vertical colour bar of four swatches (from 1440 px) and two vertical typewritten marginalia slugs ("Merz · Hannover · 1926", "HKCT · CGPA 3.8 · 2026") live in `.bg-dressing`; aria-hidden, `no-print`, pointer-transparent.
- **Lamp.** `PressLamp` renders a 120 vmax radial pool that is translated with the pointer, so paper, screen and field shift under it; it stays at the centre under reduced motion or a coarse pointer.
- **Scroll wall.** `ScrollWall` is rendered once in `[locale]/layout.tsx` as the first child of `<main>` (`position: absolute; inset: 0; z-index: -1`, above the fixed stage but behind every section) and spans the whole document. `PATTERNS` — outlined words, typewritten strips, halftone discs, dashed orbit arcs and registration marks — repeats once down long pages (mirrored, turned the other way); `PRINTS` gives each route two to six ghosted halftone prints of its own models. Light-theme prints use `mix-blend-mode: multiply` so their paper margins vanish into the sheet; the dark theme keeps them plain and dimmer. Every item gets one scrubbed `fromTo` on `y` (depth 0.5–1.7), so the wall drifts at different rates while scrolling. Hidden below 900 px, aria-hidden, `no-print`; under reduced motion nothing parallaxes.
- **Prints.** `public/images/press/*.webp` are transparent halftone cut-outs produced from the live `print.ts` pass (the Duchamp wheel, the Hausmann head, the Man Ray iron and the four found objects). They are renders of the CC0 models, covered by `public/models/CREDITS.txt`; regenerate them from the same scene if a model or a print option changes.

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

**Readymades (`src/components/readymade/`)** — real objects printed as halftone photomontage cut-outs:
| File | What it does |
|---|---|
| `ReadymadeFigure` | The `<figure>`: stage + typewritten museum label (`readymade.*` messages) with an action button. Mounts the canvas only when idle and near the viewport; a dotted cutting line (✂) holds the place meanwhile; hides itself if WebGL fails. Screen only. |
| `ReadymadeCanvas` | Creates the stage, builds the work, plays its entrance after `fx:reveal` once in view, drives it on `gsap.ticker` while visible (30 fps cap on touch devices). One `gsap.context` for everything, reverted on unmount. Mouse/pen turn the piece; Duchamp's wheel also spins on horizontal drags (Draggable proxy, vertical touch scrolling untouched). Reduced motion: one still frame, no action button. |
| `stage.ts` | Renderer, studio lights, a RoomEnvironment reflection, disposal of every geometry/material/texture. |
| `print.ts` | The look: scene rendered off-screen, then redrawn as a 45° black halftone + 15° (misregistered) red screen on paper, solid line work, a hand-cut paper margin following the silhouette, and a red halftone shadow plate. Colours stay paper in both themes. |
| `works/hausmann.ts` | After *Der Geist unserer Zeit* (1920): scanned marble bust fitted with a pocket watch (ticking), measuring tape pulled across the brow, spectacles, enamel cup and a "3.8" grade card. Click: knock the parts off and refit. |
| `works/duchamp.ts` | After *Bicycle Wheel* (1913): scanned white stool, built wheel (red rim, laced spokes, fork). Drag / scroll / button spin it; it free-wheels back to an idle turn. |
| `works/manray.ts` | After *Cadeau* (1921): built flat-iron; fourteen tacks hammered in one by one. Click: hammer again. |

Each work loads its assets, builds the **assembled** scene, then returns a factory that makes a paused GSAP timeline of `from` tweens with labels (so reverting leaves it assembled) plus `update/look/drag/scroll/act`. Models live in bust/stool units (metres) inside a scaled group. To add a model: download the 1k glTF from Poly Haven (CC0) into `public/models/<name>/`, shrink textures to 512–1024 px, drop maps the print look doesn't need and any `KHR_materials_transmission` (expensive extra pass), and add it to `CREDITS.txt` (a test checks the files and the credit).

**Found-object mobile (objets/trouvés, `src/components/objets/`)** — the mobile on the `/projects` hero: four everyday CC0 scans (a cross-pein hammer, a wooden spoon, a vintage stapler and a vintage telephone wall clock) hung from a wire drawn in SVG. It sits under the lede on narrow screens and in the hero's left column beside Readymade № 2 from 1024 px. Each object hangs from a Group pivot so it swings like a pendulum, with a child Group turning it slowly; the scan is turned into its hanging pose and measured first, so its top centre becomes the pivot the string holds.

| File | What it does |
|---|---|
| `objects.ts` | The catalogue: model folder, catalogue size, idle spin (rad/s, the sign sets the direction) and the turn applied before measuring, per object. |
| `scene.ts` | `buildObjets(stage)`: loads the glTFs through the readymade asset loader, hangs the four objects in the composition the stage width calls for — WIDE (hero column) or the deeper NARROW phone/zoom arrangement — frames a 32° camera from the measured stage box (distance and focus height, so any aspect ratio fits), and returns a factory for the paused GSAP intro plus `layout/update/look/scroll/anchor`. |
| `ObjetsCanvas.tsx` | The dynamic-imported client canvas: creates the readymade stage with the mobile's print options, plays the drop-in once the page is revealed and the figure is in view, drives it on `gsap.ticker` while visible (about 30 fps on coarse pointers, one still frame under reduced motion), rewrites the SVG strings and catalogue tags from the projected anchors every frame, and on a resize calls `layout()` so browser zoom and rotation re-frame (and, across the breakpoint, re-hang) the mobile. |
| `ObjetsFigure.tsx` | The `<figure>`: mounts the canvas once the page is idle and the figure is near the viewport (a dotted ✂ cutting line holds the place), draws the wire, strings, clamps, tape and "№ 1…4" hanging tags, and carries the red `RIEN / NI UTILE NI NEUF` stamp and a typewritten label card listing the four objects. Hidden if WebGL fails; screen only (`no-print`). |

Two compositions share the same prints: the wide one spreads them along the wire for the hero's left column, and the phone one (stage widths under 640 px) hangs them deeper on longer strings and larger, so on phones and zoomed pages they fill the taller 5/4 stage instead of huddling under the wire. The camera is framed from the measured stage box on every resize, so browser zoom behaves like a phone and rotation simply re-frames. The `anchor()` projection ties the two renderers together: each frame the hanging point is projected to CSS pixels and the figure's SVG strings, clamps, tape ends and catalogue tags are rewritten to match, so they stay tied through the drop-in, the pendulum swing and the camera sway. The halftone print pass is reused — with a finer screen and more ink (cell 3, margin 5, red shadow [6, 8] at 0.38, black 0.13, white 0.8, gamma 1.3) — so the objects print as two-colour newspaper cut-outs with hand-cut paper margins and a misregistered red shadow plate, paper-coloured in both themes. There is no action button, but the prints are a toy: a tap or click calls `gust()`, which pushes each hung object with a damped spring (stiffness 28, damping 3.4) and gives its turn a decaying spin kick; the label prints `objets.swingHint` (hidden under reduced motion) and the stage shows a pointer cursor. Otherwise the motion is the idle turn, the entrance, pointer parallax and scroll sway. The canvas and the SVG rig are `aria-hidden`; the label card stays real text, and the stamp and catalogue tags are drawn as crisp DOM text rather than into the canvas. Every visible string comes from the `objets` namespace, and its styles are the `objets trouvés` block after the readymades in `src/app/globals.css`. `data.test.ts` checks all ten models' files and credits (the nine scans and the opening's hand).

**Page transitions** (`components/transition/`): `TransitionLink` asks `TransitionProvider` to sweep a red slab and an ink slab — **torn along their long edges** (`tornSlab`) — across while the destination is pasted up from cut-out letters; the route changes under the cover, then the slabs sweep off and `fx:reveal` releases entrance animations. `<html data-cover="on|off">` reflects the state. The latest click wins; modified clicks, same-page links, hidden tabs and reduced motion bypass it; timer failsafes navigate (0.9 s) and uncover (1.5 s). **Language switches do a full page load** of the translated URL. The theme toggle uses a View Transitions circular reveal where supported.

**Opening sequence (`src/components/opening/`)** — a six-second title sequence on a fresh visit, choreographed after the first seconds of a Bauhaus-style motion-graphics reference (timing only: none of its text or art is used) and translated into Merz: torn paper, Soviet red/ink/kraft on creased graph paper, halftone and misregistered plates, 3D printed through the readymade pass.

- **When it plays** — `gate.ts` is the one inline script in `<head>` (`[locale]/layout.tsx`). Before the first paint it sets `html[data-opening="on"]` and `data-cover="on"` only for a reload, or a navigation from outside the site (empty or cross-origin referrer); language switches, back/forward and links opened from the site skip it, and it never plays under `prefers-reduced-motion`. `?intro=1` forces it, `?intro=0` skips it; in development `?intro=1&at=2.5` holds it at a moment (callbacks on the way still run) and `window.__opening` exposes the timeline. The gate's decision table is tested (`gate.test.ts`).
- **Beats** (`labels.ts`, seconds): `lamp` 0.1 paper lit up from black, two discs part · `morph` 1.25 cut-to-cut torn shapes (disc + bolt → sliver → triangle → Malevich's tilted square → Lissitzky's wedge pierces it) · `build` 1.75 the poster snaps together (nucleus, C-ring, orbits, bars, dials, pen nib, caption = the name, typewritten slug) · `breathe` 1.95 wedge sweeps, orbits multiply · `scatter` 2.75 the name tears off as ransom letters along an arc, the slug scrambles · `tilt` 3.25 ring and orbits turn in CSS 3D, slabs fan in · `whip` 3.6 whip pan past an "МЕРЦ·2026" slab · `collage`/`hand` 3.9 a 3D hand rises with Sputnik on its fingertip · `launch` 4.75 Sputnik flies a hook trailing a torn red/ink ribbon · `reveal` 4.85 the cover lifts (`fx:reveal`) while the ribbon is still a thin streak, so the page does its entrance set-up off-camera · `window` 5.35 the ribbon opens a window onto the live page, mid-entrance, and the camera pushes into it · `end` 6.0.
- **Camera** — a virtual camera (`cam`: pan, roll, zoom; one tween chain in `timeline.ts`) moves through scene A the whole time: a dolly in from a wide rolled frame, a jolt on `build`, a long drift and roll into the whip. It is applied to the `[data-op="cam"]` wrapper and read by the low-poly layer, so the two parallax against each other.
- **Low-poly layer** (`poly.ts`) — one full-screen transparent three.js canvas: three to five flat-shaded solids (Platonic bodies and a five-sided wedge) in the poster papers, outlined in ink, tumbling at depth around the poster (swept off with the whip), and the low-poly Sputnik that flies the ribbon (the SVG Sputnik is the fallback). Which bodies turn up, where they sit, how big they are and how they tumble is thrown fresh for every visit by `solids.ts` — a seeded generator with a tested count of 3–5 (down from the old fixed seven), one body per edge slot with jitter, balanced on both sides and kept clear of the poster's centre. No halftone pass full-screen (too costly); built from primitives.
- **Hand** (`scene.ts`) — the WebXR "generic hand" (MIT, `public/models/generic_hand/`, credited in `CREDITS.txt`). Its 25 joints are siblings in the file, so they are re-parented into finger chains; joints curl about local x and fan about local z (`POSE`). A lathe forearm, Sputnik and two orbit rings are built from primitives; everything prints through the readymade pass in a canvas the size of the hand's box. If three.js or the model is late, or WebGL fails, the baked print `public/images/opening/hand.webp` rises instead (re-bake it from the live canvas if the pose changes; `PRINT_TIP` in `timeline.ts` is its fingertip).
- **Ribbon window** (`ribbon.ts`, pure and tested) — the overlay's `clip-path: path(evenodd, viewport + hole)` is rewritten every frame from a sampled flight path with width, twist and per-sample tears; the rims are SVG quads. For the reveal the streamer is scaled about a point inside it while that point is carried to the screen centre, which never folds the outline, so even-odd stays correct until the window covers the screen.
- **Rules** — everything lives in one GSAP context in `OpeningSequence.tsx` (the hand's and solids' tweens are added to the master when their modules load); the reveal is dispatched from `setTimeout(…, 0)`; Strict Mode's revert/re-run is handled by a run counter. Any key, click, tap, wheel or touch scroll skips it (fade out, cover lifted); a background tab starts it when first looked at. JS removes the CSS failsafe (8.5 s) once it runs and keeps its own (end + 1.9 s). While it plays, `TransitionProvider` leaves the cover on and the background poster's draw-in waits for the reveal.
- **A smooth hand-over** — the hand's print pass stops redrawing once the window opens (the canvas keeps its last frame); scene B, both canvases and the rim sit on their own compositor layers so the per-frame clip-path only redraws the clip; on-screen page images are decoded during the collage. The end frame only hides the overlay and unlocks the scroll; WebGL disposal and unmounting wait for idle, then `fx:opening-end` is sent. Heavy page work uses `onPageSettled()` (`lib/reveal.ts`: revealed *and* no opening playing) — the Merzbau, readymade and mobile canvases mount after it, and the Merzbau's code is prefetched while the opening plays.
- **Copy** — the `opening` namespace (`skip`, `caption`, `slugTop`, `slugBottom`, `strip`); "МЕРЦ·2026" is decorative Cyrillic like the hero's words. Styles are the `opening sequence` block in `globals.css` (screen only; hidden under reduced motion and in print).

## Styling
- Tokens live in `globals.css` (`:root` = light aged paper, `:root.dark` = night launch site). Palette: Soviet red `#8f0000`, vermilion `#c8231a`, orange `#db5b00`, gold `#ffa500`, paper `#f5efe6`, dark `#161412`, plus collage papers that stay paper-coloured in both themes: scrap `#f6efe2`, newsprint `#e7ddc8`, kraft `#c39a63`, ink `#17120f`, tape.
- Paper elements (tickets, clippings, milestone notes) **re-scope the tokens** (`--ink`, `--muted`, `--accent-text`…) so everything inside stays readable on paper in dark mode.
- Component styles are plain CSS in `@layer components`; Tailwind supplies preflight, the theme and occasional utilities. Links and accents are red.
- Press-sheet tokens: `--screen-ink` / `--screen-red` / `--screen-opacity` (the two dot screens), `--reg-ink` (registration marks), `--slug-ink` (marginalia) and `--lamp-core` / `--lamp-opacity` (the reading lamp), set in both themes. Light-mode field alphas were raised (`--field-opacity` 0.62) so the poster geometry reads through the screen; on the night sheet the screens (`--screen-opacity` 0.1), marginalia, registration marks, the field's КОСМОС stroke and the scroll wall's outlined words, arcs, halftone discs and prints are inked more heavily so the background's dots and text stay legible in dark mode.
- Avoid `mix-blend-mode` on large animated layers (it cost most of the frame budget on the grain layer). The only exception is the small scroll-wall prints (`multiply` in light mode), never a full-screen layer.
- **Mobile stability**: `html` has `overflow-x: clip`, so content sliding in from off-screen (entrances, tilted cards) never widens the phone's layout viewport — otherwise the browser rescales the whole page mid-animation. The fixed background stage is `100lvh` tall (mobile toolbars don't resize it) and the star canvas keeps its stars on resize. Parallax and hover effects ignore touch pointers.

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
- Hidden: header, footer, background (including the press sheet and the scroll wall), cursor, cover, opening sequence, collage hero, cut-up poem, readymades, the found-object mobile, buttons, stamps, tape, registration marks (`.no-print`).
- Anything GSAP left mid-animation is forced visible and untransformed; scramble text that has not resolved prints its real text (`.glitch-base`); counters restore their value on `beforeprint`.
- Verify with Chrome/Edge print-to-PDF in **both locales and both themes**.

## Commands
```bash
npm install
npm run dev
npm run build
npm test          # vitest run (data integrity, age, YouTube parsing, text-fx, collage generators, readymade and found-object models)
npm run test:ui
```

## Notes for agents
- British English in all copy and comments.
- Data files may be edited by the owner while you work — make targeted edits, never rewrite them wholesale.
- The in-app browser pane and plain headless Chromium throttle `requestAnimationFrame`; verify animations in a real browser or a DevTools-protocol harness with background throttling disabled.
- In `next dev`, the 404 page logs a next-themes "script tag" warning (the not-found boundary renders client-side); production is clean.
- See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the in-depth guide.
