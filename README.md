# NG Yu Ham Baldwin — Software Developer Portfolio

A bilingual (Traditional Chinese / British English) portfolio and CV website for **NG Yu Ham Baldwin (吳宇涵)**, a Computer Science student and Software Developer based in Hong Kong. Built with Next.js 16+ App Router and deployed on Vercel, the site presents academic achievements, personal projects, and work experience through a distinctive **Soviet retro-futuristic** interface inspired by 1960s Soviet space-age graphics, Russian constructivism, and retrofuturistic games such as *Atomic Heart* and *Reverse:1999*.

## Features

- **Bilingual**: Full EN and ZH-HK (Traditional Chinese) content with one-click language toggle
- **Soviet Retro-Futuristic Aesthetic**: Constructivist geometry, film-grain textures, CRT glitch effects, Dada collage accents, parallax star fields, and animated shooting-star trails across all non-CV pages
- **Academic Focus**: Detailed Education page with GPA, semester breakdowns, and 19 bilingual course listings; Projects page with category filtering and per-project development timelines
- **Dark / Light Modes**: System preference detection + manual toggle; full Soviet effects in dark mode, subtler aged-paper palette in light mode
- **Print-Friendly CV**: Landing page designed for clean black-and-white printing — all visual effects are suppressed via `@media print`
- **Interactive Animations**: Framer Motion stagger entrances, 3D card tilt, Cyrillic GlitchText scramble, mouse-following cursor glow, and time-rewind page transitions
- **Performance Monitoring**: Vercel Speed Insights + Analytics integration

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing CV (professional, print-friendly) |
| `/education` | Full course listing by semester with timeline |
| `/projects` | Project grid with category filtering |
| `/projects/[id]` | Individual project pages with development timeline |

## Tech Stack

- **Framework**: Next.js 16.1.6+ (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4.1 (`@theme` block, no `tailwind.config.js`, PostCSS via `@tailwindcss/postcss`)
- **Animations**: Framer Motion 12, react-wavify
- **i18n**: next-intl 4
- **Icons**: lucide-react
- **Themes**: next-themes
- **Analytics**: @vercel/speed-insights + @vercel/analytics
- **Testing**: Vitest + @testing-library/react + fast-check
- **Deployment**: Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Landing CV
│   │   ├── education/page.tsx    # Education details
│   │   ├── projects/
│   │   │   ├── page.tsx          # Projects grid
│   │   │   └── [id]/page.tsx     # Project detail
│   │   └── layout.tsx
│   └── layout.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx
│   ├── ThemeToggle.tsx
│   ├── LanguageToggle.tsx
│   └── VideoEmbed.tsx
├── lib/
│   ├── projects.ts               # Project data
│   └── timeline.ts               # Timeline utilities
└── messages/
    ├── en.json
    └── zh-hk.json
```

## Customisation

Edit the placeholder comments in the source files to add personal information:

```jsx
{/* PLACEHOLDER: Enter full English name */}
{/* PLACEHOLDER: Enter Chinese name */}
{/* PLACEHOLDER: Enter personal statement (2-3 sentences) */}
{/* PLACEHOLDER: Add profile photo URL */}
```

## Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

## Licence

MIT
