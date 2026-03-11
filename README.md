# NG Yu Ham Baldwin (吳宇涵)
## Academic Portfolio & Curriculum Vitae Website

A bilingual (English / Traditional Chinese) portfolio and curriculum vitae website presenting my academic trajectory, technical competencies, and software engineering projects as a Computer Science student at the Hong Kong College of Technology (HKCT).

Designed and developed with Next.js, React, TypeScript, and Tailwind CSS, this project serves as both:
- a professional digital CV for employers and collaborators, and
- a curated academic record of coursework, projects, and final-year capstone development.

## Executive Profile

This website documents my progression as a full-stack developer through structured academic evidence and project-based outcomes. Core focus areas include:

- **Applied Software Engineering**: Building production-oriented web and mobile systems.
- **Human-Centred Product Development**: Designing interfaces and workflows that prioritise clarity and usability.
- **Cross-Platform Implementation**: Delivering projects across web, iOS, Flutter, and game engines.
- **Evidence-Led Presentation**: Showcasing coursework, grades, technologies, and deliverables in a transparent format.

## Featured Academic Work

### Final Year Project — *Pour Rice*
A cross-platform vegetarian restaurant discovery platform integrating:
- intelligent recommendation and AI-assisted interaction,
- geolocation and nearby venue discovery,
- real-time messaging and user-centric browsing workflows.

This project is presented as a full case study with technical stack details, development context, and demonstrable outcomes.

### Additional Project Portfolio
Beyond the capstone, the website includes 8+ projects across:
- **Mobile Development** (Swift, Flutter, Ionic)
- **Web Applications** (Next.js, React)
- **Backend Services** (Node.js, Express, Firebase)
- **Game Development** (2D/3D interactive systems)

## Website Capabilities

- **Bilingual delivery** with English and Traditional Chinese content.
- **Structured education timeline** with semester progression, course listings, and GPA references.
- **Project taxonomy and filtering** by engineering domain.
- **Print-optimised CV layout** suitable for formal application submission.
- **Responsive and accessible interface** for desktop and mobile review.
- **SEO and discoverability features** including metadata, sitemap generation, and locale-aware routing.

## Information Architecture

| Route | Purpose |
|---|---|
| `/` | Primary CV landing page and professional summary |
| `/education` | Academic timeline, coursework, and performance indicators |
| `/projects` | Portfolio index with category filtering |
| `/projects/[id]` | Individual project case-study pages |

Available in:
- English: `/en`
- Traditional Chinese: `/zh-hk`

## Full Technical Stack

### Core Runtime Dependencies

| Category | Packages |
|---|---|
| Framework & UI | `next@16`, `react@19`, `react-dom@19` |
| Language & Validation | `typescript@5`, `zod` |
| Styling | `tailwindcss@4`, `@tailwindcss/postcss`, `postcss`, `autoprefixer` |
| Internationalisation | `next-intl` |
| Motion & Effects | `framer-motion`, `react-wavify` |
| Theming | `next-themes` |
| UI Assets | `lucide-react` |
| Analytics & Performance | `@vercel/analytics`, `@vercel/speed-insights` |

### Development & Testing Tooling

| Category | Packages |
|---|---|
| Unit / Component Testing | `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` |
| Property-Based Testing | `fast-check` |
| Build & Tooling | `@vitejs/plugin-react`, `@vitest/ui`, `@types/node`, `@types/react`, `@types/react-dom` |

### Build Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run linter (configured via Next.js)
npm run test     # Run Vitest test suites
```

## Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Full Repository Structure

```text
.
├── ARCHITECTURE.md
├── CLAUDE.md
├── LICENSE
├── README.md
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.extension.json
├── tsconfig.json
├── vitest.config.ts
├── vitest.setup.ts
├── public/
│   └── dada/
│       ├── collage-1-dark.svg
│       ├── collage-1.svg
│       ├── collage-2-dark.svg
│       ├── collage-2.svg
│       ├── collage-3-dark.svg
│       ├── collage-3.svg
│       ├── collage-4-dark.svg
│       ├── collage-4.svg
│       ├── collage-5-dark.svg
│       └── collage-5.svg
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── sitemap.ts
    │   └── [locale]/
    │       ├── layout.tsx
    │       ├── page.tsx
    │       ├── education/
    │       │   └── page.tsx
    │       └── projects/
    │           ├── layout.tsx
    │           ├── page.tsx
    │           └── [id]/
    │               └── page.tsx
    ├── components/
    │   ├── AnimatedCard.tsx
    │   ├── CosmicStarfield.tsx
    │   ├── DadaCollage.tsx
    │   ├── DadaScatterLayout.tsx
    │   ├── DadaTypography.tsx
    │   ├── DeconstructedGrid.example.tsx
    │   ├── DeconstructedGrid.tsx
    │   ├── EnhancedBackground.example.tsx
    │   ├── EnhancedBackground.tsx
    │   ├── Footer.tsx
    │   ├── GlitchRevealText.tsx
    │   ├── GlitchText.tsx
    │   ├── Header.tsx
    │   ├── InlineVideo.tsx
    │   ├── LanguageToggle.tsx
    │   ├── LocaleSetter.tsx
    │   ├── MorseCodeTicker.tsx
    │   ├── PrintButton.tsx
    │   ├── ProjectCard.tsx
    │   ├── RetroFuturisticCard.example.tsx
    │   ├── RetroFuturisticCard.tsx
    │   ├── RetroWave.tsx
    │   ├── SovietBackground.tsx
    │   ├── SovietCursorGlow.tsx
    │   ├── SovietParticles.tsx
    │   ├── SovietPropagandaPoster.tsx
    │   ├── SovietTelemetry.tsx
    │   ├── TemporalMotifs.example.tsx
    │   ├── TemporalMotifs.tsx
    │   ├── ThemeProvider.tsx
    │   ├── ThemeToggle.tsx
    │   ├── TimeRewindTransition.example.tsx
    │   ├── TimeRewindTransition.tsx
    │   └── VideoEmbed.tsx
    ├── i18n/
    │   └── request.ts
    ├── lib/
    │   ├── aesthetics.test.ts
    │   ├── aesthetics.ts
    │   ├── projects.ts
    │   ├── timeline.ts
    │   └── videos.ts
    └── messages/
        ├── en.json
        └── zh-hk.json
```

## Professional Objective

This portfolio is intended to communicate not only what I have built, but how I think and work: with technical rigour, academic discipline, and a commitment to maintainable, user-focused software.

## Licence

MIT
