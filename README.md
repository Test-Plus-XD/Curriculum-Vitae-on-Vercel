# NG Yu Ham Baldwin (吳宇涵)
## Curriculum Vitae & Academic Portfolio

A bilingual (English / Traditional Chinese) curriculum vitae and portfolio presenting my studies, technical skills and software projects as a Computer Studies graduate of the Hong Kong College of Technology (HKCT).

Live site: [test-plus.work](https://www.test-plus.work/en) · 繁體中文: [test-plus.work/zh-hk](https://www.test-plus.work/zh-hk)

It serves as:
- a professional CV that prints cleanly on A4 for formal applications, and
- a record of coursework, grades, projects and recorded demonstrations.

## Profile

Higher Diploma graduate in Computer Studies (Mobile Applications and Game Development), HKCT, May 2026 — final CGPA **3.8**, final-term GPA **4.1**. Hands-on full-stack experience across web, Android and iOS, most fully shown in **Pour Rice**, a cross-platform vegetarian restaurant discovery, booking and promotion platform I designed, built and deployed on my own as my Final Year Project.

## What's on the site

| Route | Content |
|---|---|
| `/` | Printable CV: profile, education, selected projects, experience, skills, languages, IELTS, achievements |
| `/education` | Programme facts, results and all 19 courses across four semesters |
| `/projects` | Twelve course projects, filterable by Mobile / Web / Game / Backend, plus collaborations |
| `/projects/[id]` | Case studies with highlights, platforms, technology, repositories and a newest-first development timeline of recorded videos |

Every page is available in English (`/en`) and Traditional Chinese (`/zh-hk`), in light and dark themes.

## Design

An evolved Soviet constructivist / 1960s space-age poster with Dada accents: an aged-paper print in light mode and a night launch site in dark mode. Effects are built with **GSAP**:

- **Background** — a canvas star field with parallax and shooting stars, beneath a constructivist SVG composition (red sun, orbit rings with satellites, diagonal bands, rays) that draws itself in and re-arranges itself on every page change.
- **Elements** — deconstructed Dada typography, Cyrillic glitch-reveal text, scattered card entrances, line-mask headings, count-up figures, 3D tilt cards with spotlight, magnetic buttons, a targeting cursor, a Flip-animated project filter, a pinned horizontal semester track and an animated orbit diagram of Pour Rice's architecture.
- **Transitions** — constructivist slab wipes between pages with the destination name scrambling in, a circular reveal for theme changes, and video players that grow out of their thumbnails.

Everything respects `prefers-reduced-motion`, and the CV prints as a plain black-and-white document whatever state the animations are in.

## Technology

| Area | Packages |
|---|---|
| Framework | `next@16`, `react@19`, `typescript@5` |
| Styling | `tailwindcss@4`, `@tailwindcss/postcss` |
| Animation | `gsap@3.15`, `@gsap/react` (ScrollTrigger, SplitText, ScrambleText, Flip, DrawSVG, MotionPath, CustomEase) |
| Internationalisation | `next-intl` |
| Theming & icons | `next-themes`, `lucide-react` |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` |
| Testing | `vitest`, `@testing-library/react`, `fast-check`, `jsdom` |

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # unit and data-integrity tests
npm run build     # production build (all pages statically generated)
npm run start
```

Content lives in typed, bilingual data modules under `src/lib/` (`profile.ts`, `education.ts`, `cv.ts`, `projects.ts`) and interface labels in `src/messages/`. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for how the site is put together.

## Licence

MIT
