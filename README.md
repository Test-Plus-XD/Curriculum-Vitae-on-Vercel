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
| `/` | A collage hero, then the printable CV: profile, education, selected projects, experience, skills, languages, IELTS, achievements |
| `/education` | Programme facts, results and all 19 courses across four semesters |
| `/projects` | Eleven course projects, filterable by Mobile / Web / Game / Backend, plus collaborations |
| `/projects/[id]` | Case studies with highlights, platforms, technology, repositories and a newest-first development timeline of recorded videos |

Every page is available in English (`/en`) and Traditional Chinese (`/zh-hk`), in light and dark themes.

## Design

A Dada photomontage in Soviet poster colours — Schwitters-style *Merz* collage cut from the CV's own data, Lissitzky's red wedge, Rodchenko red and black, torn paper, tape, ink stamps and ransom-note lettering — over a constructivist 1960s space-age background: an aged-paper print in light mode and a night launch site in dark mode. Effects are built with **GSAP**, plus **Three.js** for the 3D set pieces:

- **Background** — a printed press sheet: a 45° halftone screen with its red plate a hair out of register (it slips under the pointer, creeps as you scroll and is knocked back into register on every page change), registration marks, colour bar and typewritten marginalia in the sheet margins, a pool of warm light that follows the cursor, and ghosted halftone prints of the site's own readymades drifting down the page as you scroll. Beneath it all, a canvas star field with parallax and shooting stars and a constructivist SVG composition (screen-printed red sun, orbit rings with satellites, diagonal bands, rays) that draws itself in and re-arranges itself on every page change.
- **Collage** — a landing photomontage with a ransom-note name, label-maker title, name chop, ink stamp and draggable duotone scraps of project footage, floating over a Three.js *Merzbau* of torn CV scraps, a red wedge and a Tatlin tower; a Tzara-style cut-up poem; courses as ticket stubs and collaborations as newspaper clippings.
- **Readymades** — three Dada sculptures rebuilt in Three.js from CC0 scanned objects and printed live as red-and-black halftone cut-outs with museum labels: Hausmann's *Spirit of Our Time* (a marble bust fitted with a pocket watch, tape measure, spectacles and a "3.8" grade card) on Education, Duchamp's *Bicycle Wheel* (spin it) on Projects, and Man Ray's tack-studded iron, *Gift*, on the 404.
- **Found-object mobile** — four things found around the house (a hammer, a spoon, a stapler and a telephone clock), scanned from Poly Haven's CC0 collection, hung from a wire on Projects and printed live as two-colour halftone cut-outs; they drop in, turn slowly, sway as the page scrolls and shift with the pointer.
- **Elements** — deconstructed Dada typography, Cyrillic text-scramble load-ins on labels across the site, scattered card entrances, line-mask headings, count-up figures, 3D tilt cards with spotlight, magnetic buttons, a targeting cursor, a Flip-animated project filter, a pinned horizontal semester track and an animated orbit diagram of Pour Rice's architecture.
- **Transitions** — torn red and black slabs that sweep across between pages while the destination name is pasted up from cut-out letters, a circular reveal for theme changes, and video players that grow out of their thumbnails.

Everything respects `prefers-reduced-motion`, and the CV prints as a plain black-and-white document whatever state the animations are in.

## Technology

| Area | Packages |
|---|---|
| Framework | `next@16`, `react@19`, `typescript@5` |
| Styling | `tailwindcss@4`, `@tailwindcss/postcss` |
| Animation | `gsap@3.15`, `@gsap/react` (ScrollTrigger, SplitText, Flip, DrawSVG, MotionPath, CustomEase, Draggable, Inertia) |
| 3D | `three` (landing-page Merzbau and the readymades, lazy-loaded); CC0 models from [Poly Haven](https://polyhaven.com), credited in `public/models/CREDITS.txt` |
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

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
