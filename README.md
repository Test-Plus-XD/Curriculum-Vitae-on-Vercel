# NG Yu Ham Baldwin — Full-Stack Software Developer Portfolio & CV

A professional bilingual (Traditional Chinese / British English) portfolio and CV website for **NG Yu Ham Baldwin (吳宇涵)**, a full-stack software developer and Computer Science student at Hong Kong College of Technology (HKCT). Built with Next.js 16+ (App Router), React 19, TypeScript, and Tailwind CSS v4, the site showcases academic excellence, comprehensive project portfolio, and technical expertise through a visually distinctive **Soviet retro-futuristic** interface inspired by 1960s Soviet space-age graphics, Russian constructivism, and contemporary retrofuturistic games such as *Atomic Heart*, *Arknights Lone Trail*, and *Reverse:1999*.

The portfolio features a **Final Year Project** (*Pour Rice* — cross-platform vegetarian restaurant discovery platform with AI-powered assistance), 8+ additional projects spanning **mobile development** (iOS/Swift, Flutter/Dart, Ionic), **web applications** (Next.js, React), **game development** (2D/3D), and **backend systems** (Node.js, Express, Firebase). Deployed on **Vercel** with performance monitoring via Vercel Speed Insights & Analytics.

## Key Features

### Content & Structure
- **Bilingual Support**: Full English and Traditional Chinese (繁體中文) content with seamless language toggle (EN/繁體中文)
- **Academic Excellence**: Comprehensive education timeline with 19 bilingual course listings, semester breakdown, and GPA metrics
- **Extensive Project Portfolio**: 8+ detailed projects with category filtering (Mobile/Web/Game/Backend), development timelines, tech stacks, and integrated video demonstrations
- **Final Year Project**: *Pour Rice* — comprehensive case study of a cross-platform restaurant discovery platform with real-time chat, AI assistance, and location services

### Visual & Interactive Design
- **Soviet Retro-Futuristic Aesthetic**: Inspired by 1960s Soviet space-age graphics and modern retrofuturistic media (Atomic Heart, Reverse:1999)
  - Constructivist geometric patterns, diagonal grids, and brutalist typography
  - Film-grain textures, CRT glitch effects, scanline overlays
  - Dada/deconstructivist collage accents with torn-paper styling
  - Parallax star fields with 35+ interactive stars and 7 curved shooting-star trails
  - Holographic borders, radial gradient effects, and electromagnetic pulse animations
- **Dynamic Theme System**:
  - Dark mode: Full intensity Soviet effects on all non-CV pages
  - Light mode: Subtler aged-paper aesthetic with sepia undertones
  - Automatic system preference detection + manual toggle
- **Interactive Animations**:
  - Framer Motion staggered entrances and micro-interactions
  - 3D perspective card tilts with spotlight tracking
  - Cyrillic text scramble GlitchText effects on navigation
  - Mouse-following radial cursor glow with spring physics
  - Page transition animations with time-rewind effects

### Accessibility & Deployment
- **Print-Friendly CV**: Landing page optimised for clean black-and-white printing via `@media print`
- **Performance Optimised**: Vercel Speed Insights + Analytics integration; GPU-optimised particle systems and animations
- **Responsive Design**: Mobile-first approach with tested mobile and desktop layouts
- **Open Graph & SEO**: Dynamic sitemap generation, comprehensive metadata, language alternates for Google

## Portfolio Pages

| Route | Description | Highlights |
|-------|-------------|-----------|
| `/` | Landing CV — Professional summary | Print-friendly, academic focus, featured projects |
| `/education` | Comprehensive education timeline | 4 semesters, 19 courses (bilingual), GPA metrics, statistics |
| `/projects` | Project grid with category filtering | Filter by Mobile/Web/Game/Backend, featured showcase |
| `/projects/[id]` | Individual project details | Development timeline, tech stack, video demos, repositories |

**Available in both English (`/en`) and Traditional Chinese (`/zh-hk`)**

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
