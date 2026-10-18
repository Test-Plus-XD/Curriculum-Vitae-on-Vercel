# CV Website Project - CLAUDE.md

**Owner**: NG Yu Ham Baldwin | 吳宇涵

## Project Overview
Bilingual (Traditional Chinese / British English) CV and portfolio built with Next.js 16 (App Router) for Vercel. The visual identity is an evolved Soviet constructivist / space-age poster with Dada accents, animated with **GSAP**. The CV landing page is a printable A4 "sheet" that prints as a clean black-and-white document. Formal academic tone.

## Critical Requirements
1. **Bilingual**: every visible string exists in EN and ZH-HK (data: `{ en, zh }` pairs; UI: `src/messages/*.json`, same keys in both).
2. **British English**: colour, centre, organisation, programme, labelling, optimise. A unit test rejects common American spellings in English copy.
3. **Light mode default**; manual toggle only (`enableSystem={false}`).
4. **Printable CV**: `/` must always print as clean B/W A4 (target ≤ 2 pages) — see *Print*.
5. **Responsive**: mobile-first; check 375 px and desktop.
6. **Accessibility**: every effect respects `prefers-reduced-motion`; decorative layers are `aria-hidden`; real text always stays in the DOM.
7. **Academic focus**: education and projects first; work experience brief.
8. **Privacy**: never render the birth date (only the computed age) or the street address.

## Tech Stack
- Next.js 16.4 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS 4 (`@import "tailwindcss"`, `@custom-variant dark`, `@theme` tokens; no `tailwind.config.js`)
- next-intl 4.8 (`src/i18n/routing.ts`, `navigation.ts`, `request.ts`; locale routing in `src/proxy.ts` — Next 16's replacement for `middleware.ts`)
- next-themes 0.4 (class strategy, `enableColorScheme={false}`)
- **gsap 3.15 + @gsap/react 2.1** — plugins: ScrollTrigger, SplitText, ScrambleText, Flip, DrawSVG, MotionPath, CustomEase (all free, from the public `gsap` package)
- lucide-react icons, @vercel/analytics, @vercel/speed-insights
- vitest + @testing-library + fast-check (`npm test`)

## File Structure
```
src/
├── app/
│   ├── layout.tsx                 # Pass-through root layout (html/body live in [locale]/layout)
│   ├── not-found.tsx              # Fallback 404 outside any locale
│   ├── globals.css                # Tokens, both themes, all component styles, reduced-motion, print
│   ├── icon.svg · robots.ts · sitemap.ts
│   └── [locale]/
│       ├── layout.tsx             # Fonts, providers, BackgroundStage, Header, Footer, CursorReticle
│       ├── page.tsx               # CV sheet (printable; revalidates daily for the age)
│       ├── education/page.tsx     # Programme, stats, pinned semester track
│       ├── projects/page.tsx      # Flip-filtered grid + Collaborations
│       ├── projects/[id]/page.tsx # Case study: highlights, platforms, timeline, sidebar
│       ├── not-found.tsx · [...rest]/page.tsx
├── components/
│   ├── Header · Footer · Telemetry · ThemeProvider · ThemeToggle · LanguageToggle · PrintButton
│   ├── CvSection · SheetIntro                 # CV sheet building blocks
│   ├── SemesterTrack                          # Education: pinned horizontal track
│   ├── ProjectsFilterGrid · ProjectCard · PosterArt
│   ├── DevTimeline · InlineVideo · OrbitDiagram
│   ├── transition/TransitionProvider · TransitionLink
│   └── fx/                                    # Reusable GSAP effects (see below)
├── i18n/ routing.ts · navigation.ts · request.ts
├── lib/
│   ├── profile.ts     # Name, title, contacts, summary, getAge()
│   ├── education.ts   # Programme, 4 semesters / 19 courses, grades
│   ├── cv.ts          # Skill groups, experience, languages, IELTS, achievements
│   ├── projects.ts    # 12 projects, 30 videos, milestones, collaborations, buildTimeline()
│   ├── youtube.ts     # URL parsing, thumbnails, nocookie embeds
│   ├── i18n-text.ts   # Bilingual type, pick(), date formatting
│   ├── text-fx.ts     # Pure helpers for Dada/glitch text (tested)
│   ├── gsap.ts        # The only place plugins are registered
│   ├── reveal.ts      # Transition ↔ entrance coordination
│   └── seo.ts         # canonical + hreflang alternates
├── messages/ en.json · zh-hk.json
└── proxy.ts
```

## Content: where to edit
- **Personal details / summary** → `src/lib/profile.ts`
- **Courses, grades, GPA** → `src/lib/education.ts`
- **Skills, jobs, languages, achievements** → `src/lib/cv.ts`
- **Projects, videos, milestones, collaborations** → `src/lib/projects.ts` (ids are route slugs; `FEATURED_IDS` picks the three on the CV; dates are ISO `YYYY-MM-DD`; `approximate: true` shows a milestone as "approx. Month Year")
- **UI labels** → `src/messages/*.json` (keep keys identical in both files — tested)
- Development timelines are rendered **newest first** (`buildTimeline`); a same-day milestone sits below that day's videos.
- Missing information gets a JSX comment: `{/* PLACEHOLDER: … */}`. Not supplied so far: profile photo, academic awards, earlier-semester grades, exact start dates for Computer Ethics, Data Communication and Networking and the Swift iOS sub-project (marked `approximate`).

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

**Videos**: 30 distinct YouTube links across the 12 projects (tested).

## Pages
- **`/` CV** — paper sheet with registration marks and an HKCT stamp; header (DadaTypography name, contacts, age), profile, education with final-semester grades, three featured projects, experience, skills, languages, IELTS, achievements (collaborations appear on `/projects` only). Feeds out like printer paper on load (`SheetIntro`).
- **`/education`** — hero with GlitchRevealText institution, programme facts, counter stat cards, **pinned horizontal semester track** (≥ 1024 px with full motion; stacked otherwise).
- **`/projects`** — category filter (All/Mobile/Web/Game/Backend) re-flowing the grid with **Flip**; cards with diagonal split thumbnails or a generated poster; Collaborations section.
- **`/projects/[id]`** — hero + live/repo actions, highlight counters, overview, Pour Rice **orbit diagram** of its platforms, newest-first development timeline with FLIP video modal, sticky sidebar (tech, courses, repos, related).

## GSAP effects system
**Rules (important):**
- Import `gsap` and plugins **only** from `@/lib/gsap` (registers everything once, defines `soviet` and `rewind` eases).
- Use `useGSAP` with a `scope`; branch with `gsap.matchMedia()` on `FULL_MOTION` / `REDUCED_MOTION` / `FINE_POINTER`.
- **Inside a `mm.add()` handler, use the handler's own second argument (`contextSafe`)** for deferred callbacks — never `useGSAP`'s `contextSafe`. Mixing them makes two GSAP contexts reference each other and revert recursion crashes the page ("Maximum call stack size exceeded"). `playOnReveal(contextSafe, fn)` in `src/lib/reveal.ts` wraps this correctly; return its result from the handler.
- **GSAP runs tween and ScrollTrigger callbacks inside the context that created them.** Never call another component's context-bound code (or `ScrollTrigger.refresh()`) from inside such a callback or a `useGSAP` body — defer it to a fresh task/frame (`setTimeout`, `requestAnimationFrame`). The transition cover's tweens live outside any context for this reason.
- Entrance animations must wait for the page-transition cover: use `playOnReveal` (it runs immediately when nothing is covering).
- Elements animated in from hidden carry `data-fx-hide`; CSS hides them before first paint (`html.js-fx`, set by an inline script) and a 3 s CSS failsafe reveals them if scripts never run. Call `markReady(el)` after setting the initial GSAP state.
- Never put a CSS `transform` on something GSAP animates with `x/xPercent` (GSAP folds it into its own values).
- Use DrawSVG only on solid strokes (it overwrites `stroke-dasharray`).

**Components (`src/components/fx/`):**
| Component | Effect |
|---|---|
| `BackgroundStage` | Fixed layers: CSS grid → `CosmosCanvas` → `ConstructivistField` → grain, scanlines (dark), vignette. Client-only, `no-print`. |
| `CosmosCanvas` | 2D canvas star field (3 depths), pointer + scroll parallax, twinkle, pointer-linked HUD lines and shooting stars in dark mode; drawn on `gsap.ticker`. |
| `ConstructivistField` | SVG poster: red sun, orbit rings with satellites (MotionPath), diagonal band, rays, star, outlined "КОСМОС"; strokes draw in; scroll parallax; **re-poses per route** (`POSES`). |
| `DadaTypography` | Per-glyph deconstruction (spec in the profile document): seeded PRNG, 2 px first-paint clamp, double-rAF + 10 ms alignment, hover re-scatter ×1.8, optional red/gold misregistration. |
| `GlitchText` / `GlitchRevealText` | Cyrillic/Bauhaus scramble overlay (Bauhaus-only in 繁中), base text keeps layout. |
| `Scatter` | Children settle from a +32 px (`collage`: +48 px) diagonal, or `rise`; fade only under reduced motion. |
| `RevealHeading` | SplitText line-mask rise + extending rule + "§ 0n" index. |
| `Counter` | Count-up on view; final value is server-rendered and restored before printing. |
| `TiltCard` | 3D tilt, cursor spotlight (`--mx/--my`), closing corner brackets. |
| `Magnetic` | Pulls buttons towards the pointer, elastic release. |
| `CursorReticle` | Trailing crosshair that locks on to interactive elements (fine pointers only). |
| `MorseCodeTicker` | Looping Morse strips in the footer. |

**Page transitions** (`components/transition/`): `TransitionLink` (wraps next-intl `Link`) asks `TransitionProvider` to sweep a red slab and an ink slab across while the destination name scrambles in; the route changes under the cover, then the slabs sweep off and `fx:reveal` releases entrance animations. `<html data-cover="on|off">` reflects the state. The latest click wins while the cover is sweeping in; modified clicks, same-page links, hidden tabs and reduced motion bypass it; timer failsafes navigate (0.9 s) and uncover (1.5 s) even if animation frames stall. **Language switches do a full page load** of the translated URL after the cover sweeps in — the `[locale]` layout owns `<html>`, and remounting it client-side would drop the `js-fx` class and re-render inline scripts. The theme toggle uses a View Transitions circular reveal where supported.

## Styling
- Tokens live in `globals.css` (`:root` = light aged paper, `:root.dark` = night launch site); components use only tokens. Palette: Soviet red `#8f0000`, orange `#db5b00`, gold `#ffa500`, paper `#f5efe6`, dark `#161412`.
- Component styles are plain CSS in `@layer components` (BEM-ish class names); Tailwind supplies preflight, the theme and occasional utilities.
- Links and accents are red (not blue). Design is geometric and warm: hard edges, diagonals, registration marks, stamps.

## Fonts (all via `next/font/google`)
| Priority | Font | Use | Variable |
|---|---|---|---|
| 1 | Noto Serif Display (variable, italic, `wdth` axis) | Names, headings, card titles, numerals (`.font-title`, light italic; condensed numerals via `font-stretch`) | `--ff-title` → `--font-title` |
| 2 | Iansui | Traditional Chinese body text and any `lang="zh-HK"` element | `--ff-zh` → `--font-zh` |
| 2 | LINE Seed JP 400/700 | English body text | `--ff-en` → `--font-en` |

`body.locale-zh` switches the body font; Chinese mode also disables `text-transform` so embedded Latin keeps its case.

## Print
- `@media print` + `@page { size: A4; margin: 12mm 13mm }`; colours forced to black/white and `color-scheme: light !important` (next-themes must not set an inline `color-scheme`).
- Hidden: header, footer, background, cursor, cover, buttons, stamps, registration marks (`.no-print`).
- Anything GSAP left mid-animation is forced visible and untransformed (`[data-fx-hide]`, `.sheet-intro`); counters restore their value on `beforeprint`.
- `.print-only` / `.screen-only` swap contact labels for printable URLs.
- Verify with Chrome/Edge print-to-PDF in **both locales and both themes**.

## Commands
```bash
npm install
npm run dev
npm run build
npm test          # vitest run (data integrity, age, YouTube parsing, text-fx)
npm run test:ui
```

## Notes for agents
- British English in all copy and comments.
- Data files may be edited by the owner while you work — make targeted edits, never rewrite them wholesale.
- Headless Chromium throttles `requestAnimationFrame`, so GSAP screenshots taken there can show mid-animation states; check interactions in a real browser tab.
- See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the in-depth guide.
