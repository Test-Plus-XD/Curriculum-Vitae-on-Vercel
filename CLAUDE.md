# CV Website Project - CLAUDE.md

**Owner**: NG Yu Ham Baldwin | 吳宇涵

## Project Overview
Bilingual (Traditional Chinese / British English) CV website built with Next.js 16+ (App Router) for Vercel deployment. Soviet retro-futuristic aesthetic in both light and dark modes (except the landing CV page in light mode) with print-friendly CV landing page. Formal academic tone required.

## Critical Requirements
1. **Bilingual Support**: All content in EN and ZH-HK with language toggle
2. **Light Mode Default**: Defaults to light theme; manual toggle in header (Moon icon = switch to dark)
3. **Responsive**: Mobile-first, test on both desktop and mobile
4. **Academic Focus**: Education and projects are primary; work experience is secondary (brief)
5. **British English**: Use colour, centre, organisation, programme throughout
6. **Performance**: Vercel Speed Insights enabled

## Tech Stack
- Next.js 16.1.6+ (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4.1.0 (upgraded from v3; PostCSS via `@tailwindcss/postcss`, no `tailwind.config.js`; dark mode via `@custom-variant dark` in globals.css)
- next-intl 4.0.0 (i18n)
- next-themes 0.4.0 (dark mode)
- lucide-react 0.460.0 (icons)
- framer-motion 12.33.0 (animation library — installed)
- react-wavify (retro wave animation — installed)
- zod ^4.3.6 (runtime validation for aesthetics module)
- @vercel/speed-insights + @vercel/analytics
- Vercel deployment
- vitest + @testing-library/react + fast-check (dev — `npm test`)

## File Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Landing CV (professional, print-friendly)
│   │   ├── education/
│   │   │   └── page.tsx          # Full course listing by semester
│   │   ├── projects/
│   │   │   ├── page.tsx          # Projects grid with filtering
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Individual project with timeline
│   │   └── layout.tsx
│   ├── layout.tsx                # Root layout with Speed Insights
│   └── globals.css
├── components/
│   ├── Header.tsx                # Nav with Framer Motion stagger + GlitchText links
│   ├── Footer.tsx                # Contact links with stagger animations + neon glow
│   ├── ProjectCard.tsx           # AnimatedCard-wrapped cards with scan sweep + tilt
│   ├── AnimatedCard.tsx          # 3D tilt, spotlight tracking, staggered entrance
│   ├── GlitchText.tsx            # Cyrillic text scramble on hover (CRT effect)
│   ├── SovietCursorGlow.tsx      # Mouse-following radial glow (spring physics)
│   ├── PrintButton.tsx           # Soviet-styled print CV action button
│   ├── ThemeToggle.tsx           # Dark/light mode
│   ├── LanguageToggle.tsx        # EN/繁體中文
│   ├── ThemeProvider.tsx         # next-themes wrapper
│   ├── VideoEmbed.tsx            # Legacy YouTube modal
│   ├── InlineVideo.tsx           # YouTube embed (thumbnail → fullscreen iframe)
│   ├── RetroWave.tsx             # Enlarged (440px) mountain range with react-wavify waves
│   ├── SovietParticles.tsx       # 20 floating particles (stars, gears, sickles)
│   ├── SovietBackground.tsx      # Full-page grid/diagonal/grain + holographic stripe + radar rings
│   ├── CosmicStarfield.tsx       # 35 stars (18 mobile), 2 nebulae, 1 orbital ring, 4 shooting stars
│   ├── MorseCodeTicker.tsx       # Dual scrolling Morse code strips (top + bottom)
│   ├── SovietTelemetry.tsx       # Side-panel telemetry readout (lg+ screens)
│   ├── SovietPropagandaPoster.tsx # Constructivist geometric decorations
│   ├── DadaCollage.tsx           # Floating Dada collage fragments, stamps, scattered text
│   ├── DadaTypography.tsx        # Deconstructed text with per-character displacement on hover
│   ├── EnhancedBackground.tsx    # Parallax layered background (grain, sepia, aged spots) for enhanced pages; no duplicate layers
│   ├── DeconstructedGrid.tsx     # Grid with random tilt/offset per item (deconstructivist layout)
│   ├── TimeRewindTransition.tsx  # Page transition with scale+blur+scanline sweep (Reverse:1999)
│   ├── TemporalMotifs.tsx        # Floating SVG motifs (clocks, triangles, gears, stars)
│   └── RetroFuturisticCard.tsx   # Card with layered shadows, corner brackets, shimmer, holo border
├── messages/
│   ├── en.json                   # English translations
│   └── zh-hk.json                # Traditional Chinese translations
└── lib/
    ├── projects.ts               # Project data with all links
    ├── aesthetics.ts              # Page type classification (cv vs enhanced) + config
    ├── timeline.ts               # Timeline data and utilities
    └── videos.ts                 # Video data organised by type
```

## Placeholder Comments
Add JSX comments for missing information that the user must provide:
```jsx
{/* PLACEHOLDER: Enter full English name */}
{/* PLACEHOLDER: Enter Chinese name */}
{/* PLACEHOLDER: Enter personal statement (2-3 sentences) */}  {/* Rendered <p> is commented out in page.tsx */}
{/* PLACEHOLDER: Add profile photo URL */}
{/* PLACEHOLDER: Enter date of birth */}
```

## Personal Information
| Field | Value |
|-------|-------|
| Name (EN) | NG Yu Ham Baldwin |
| Name (ZH) | 吳宇涵 |
| Email | baldwon0xd@gmail.com |
| Phone | +852 6701 6557 |
| GitHub | https://github.com/Test-Plus-XD |
| LinkedIn | https://www.linkedin.com/in/test-plus-004601285/ |
| YouTube | https://youtube.com/playlist?list=PLkzUf67y42SM-JlZk4eJEDIYPdb7VKbVo |
| Discord | test_plus |

## Page Structure

### Landing CV (/)
Professional, concise CV layout with:
- Header with name, title, contact info
- Education summary (links to full details)
- Featured projects (top 3)
- Skills grouped by category
- Work experience (brief - 炒散侍應 in Chinese)
- Certifications (IELTS Academic Band 6.5 only)

### Education Page (/education)
- Timeline layout showing all 4 semesters
- 19 courses with bilingual names
- GPA display (3.7 Year 1)
- Statistics cards

### Projects Page (/projects)
- Filter by: All, Mobile, Web, Game, Backend
- Card grid with "View Details" links
- Shows first 2 videos per project

### Project Detail Page (/projects/[id])
- Development timeline with YouTube thumbnails
- Video dates as timeline markers
- Tech stack sidebar
- Repository links
- Platform components (for multi-platform projects)

## Key Certifications
- **IELTS Academic**: Band 6.5 (only certification listed)

## Repository Links
| Repo | URL |
|------|-----|
| PourRice-Ionic | https://github.com/Test-Plus-XD/Cross-Platform-Assignment |
| PourRice-Swift | https://github.com/Test-Plus-XD/iOS-Assignment |
| PourRice-Flutter | https://github.com/Test-Plus-XD/Android-Assignment |
| Web-Assignment | https://github.com/Test-Plus-XD/Web-Assignment |
| 2D-Chess-Game | https://github.com/Test-Plus-XD/2D-Chess-Project |
| 2D-Puzzle-Game | https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment |
| SE-Assignment | https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/tree/main/AI%20Annotation%20Tool%20v2 |
| Card-Game | https://github.com/Test-Plus-XD/NetBeans-Projects/tree/main/CardMatchingGame |

## Video Links (23 total)
All video data is stored in `src/lib/projects.ts` and `src/lib/timeline.ts`.

### Presentations (5)
- Flutter, 2D Game, 3D Game, Linux, PHP presentations

### Operations/Demos (18)
- Various assignment and final project demonstrations

## Font System
Three Google Fonts with a strict priority hierarchy:

| Priority | Font | Usage | Weight/Style | CSS Variable |
|----------|------|-------|--------------|--------------|
| **1 (Highest)** | **Noto Serif Display** | Names, card/grid titles, section headings | 300 Italic | `--font-title` |
| **2** | **Iansui** | Chinese (繁體中文) body text | 400 | `--font-zh` |
| **2** | **LINE Seed JP** | English body text | 400 | `--font-en` |

**Implementation**:
- **Iansui** loaded via `next/font/google` (primary — injects `--font-zh` CSS variable with optimised loading)
- **LINE Seed JP** + **Noto Serif Display** loaded via CDN `<link>` tags (not available in `next/font/google`)
- Iansui CDN `<link>` also present as fallback
- Locale-specific classes (`.locale-en`, `.locale-zh`) switch body font automatically
- `.font-title` class **overrides** locale font with `!important` — always renders Noto Serif Display regardless of language
- Body text uses locale-specific fonts; headings/titles always use Noto Serif Display
- Apply `font-title` to: names (h1), section headings (h2), card titles, stat numbers, semester headers

## Styling Guidelines

### Soviet Retro-Futuristic Aesthetic (Both Light & Dark Modes)
Inspired by 1960s Soviet space age graphics, Russian constructivism, and retrofuturistic games (Atomic Heart, Reverse:1999 Cosmic Overture, Arknights Lone Trail).

**Mode Behaviour**:
- **Dark mode**: Full intensity Soviet effects on ALL pages (including CV)
- **Light mode**: Subtler aged-paper Soviet effects on education/projects pages ONLY
- **CV page**: Excluded from light-mode effects via `.cv-page` CSS class
- **Print**: All effects disabled

**Background & Overlay Effects** (via `SovietBackground` component):
- **Grid Background**: Brutalist architectural grid (red `#8f0000`, 40px × 40px)
- **Diagonal Lines**: Constructivist 45° orange diagonal lines (repeating every 80px)
- **Film Grain**: Subtle SVG noise texture overlay for aged aesthetic
- **Scanlines**: Industrial horizontal scanlines (`.scanlines::after`)
- **Vignette**: Warm radial gradient edge darkening

**Component-level Effects**:
- `.glow-heading` — Soviet red/orange text shadow with breathing animation
- `.glow-card` — Angular geometric borders with constructivist corner brackets + shimmer
- `.soviet-line` / `.soviet-line-animated` — Red-to-orange gradient accent lines
- `.soviet-link` — Animated gradient underline scan on hover with glow
- `.soviet-stat` / `.soviet-badge` / `.soviet-filter` — Themed UI elements
- `.soviet-tech-tag` — Hover effects on tech stack tags
- `.soviet-ripple` — Click ripple effect on interactive elements
- `.soviet-glitch` / `.soviet-crt-hover` — CRT glitch effects on hover
- `.soviet-scan-sweep` — Horizontal scan line sweep on hover
- `.soviet-holo-scan` — Holographic scanner sweep on interactive elements
- `.soviet-holo-border` — Animated conic gradient border on hover
- `.soviet-rgb-split` — RGB channel split glitch on hover (requires `data-text`)
- `.soviet-spotlight` — Radial glow following cursor position (CSS custom props)
- `.soviet-magnetic` — Subtle pull towards cursor on hover
- `.soviet-cursor-blink` — Typewriter cursor blink for terminal elements
- `.soviet-print-btn` — Soviet-styled action button with gradient background
- `.retro-card` / `.retro-card-glow-*` — RetroFuturisticCard base + glow levels (low/medium/high)
- `.retro-card-holographic` — Holographic rotating border effect on RetroFuturisticCard
- `.corner-bracket-*` — Animated corner bracket decorations (tl/tr/bl/br) for RetroFuturisticCard
- `.retro-shimmer` / `.retro-shimmer-active` — Shimmer sweep inside RetroFuturisticCard
- Text selection — Soviet propaganda red/gold highlight with glow

**Dada / Deconstructivist Effects** (Reverse:1999 inspired):
- `.dada-torn-edge` — Clip-path simulating ripped/torn paper edges
- `.dada-fragment` — Aged paper collage snippet with tilt + shadow
- `.dada-stamp` / `.dada-stamp-rect` — Circular/rectangular ink stamp decorations
- `.dada-scatter` — Rotated, displaced typographic fragments (positioned absolute)
- `.dada-diagonal` — Constructivist/deconstructivist diagonal line divider via `::before`
- `.dada-noise` — Heavy SVG grain overlay for collage texture areas
- `.dada-redact` — Censorship/redaction bar over text via `::after`
- `.dada-cutout` — Newspaper clipping style inline text (slightly rotated, bordered)
- `.dada-tilt` — Slight chaotic rotation on hover (uses `--dada-hover-rotate` CSS var)

**Atmospheric Components** (hidden on CV page in light mode):
- `RetroWave` — Enlarged (440px) SVG mountain range with react-wavify animated waves, perspective grid, dual glow lines, stronger horizon glow
- `SovietParticles` — 20 floating particles (stars, dots, diamonds, sickles, gears)
- `SovietBackground` — Full-page grid/diagonal/grain/vignette overlay + holographic stripe overlay + concentric radar rings (pulsing grid and data stream removed for GPU optimisation)
- `CosmicStarfield` — 35 interactive stars / 18 on mobile (3 depth layers, 8× parallax), 2 pulsing nebulae, 1 cosmic orbital ring, circular sparkle glow effects, 4 shooting star trails with dual-layer glow (outer halo + bright core); halo intensity intentionally reduced (stdDeviation 1.0/1.5, opacity ×0.15)
- `MorseCodeTicker` — Dual scrolling Morse code strips (top + reversed bottom) with Soviet space messages
- `SovietTelemetry` — Side-panel mission control readout with fluctuating values (lg+ screens)
- `SovietPropagandaPoster` — Enlarged corner brackets, rotating star, dashed lines, geodesic nodes, aurora band
- `SovietCursorGlow` — Mouse-following radial glow with spring physics (Atomic Heart polymer glove HUD)
- `DadaCollage` — Floating Dada collage fragments (torn paper, diagonal slashes, ink stamps, scattered typographic text), inspired by Reverse:1999 / Tzara / Heartfield
- `DadaTypography` — Per-character deconstructed text displacement on hover with spring physics (used on education/projects headings)
- `EnhancedBackground` — Parallax background (film grain, sepia, aged spots, temporal distortion) for enhanced pages only; light mode uses sepia/aged-paper textures; scanlines/diagonals/vignette removed (handled by SovietBackground); **parallax uses CSS custom properties (`--parallax-slow/med`) not React state — no re-renders on scroll**
- `TemporalMotifs` — Floating SVG decorative motifs (clocks, triangles, gears, stars) with drift + flicker animations, parallax scroll, density control (sparse/medium/dense); **scroll offset uses CSS custom property (`--motif-scroll`) with RAF throttling — no re-renders on scroll**

**Interactive / Layout Components**:
- `GlitchText` — Cyrillic text scramble on hover, inspired by CRT displays and Atomic Heart telemetry
- `AnimatedCard` — 3D tilt effect with spotlight tracking and staggered entrance animation (wraps ProjectCard)
- `TimeRewindTransition` — Page transition wrapper with scale-down (0.97) effect (Reverse:1999 time-rewind); uses `AnimatePresence mode="sync"` so navigation is never blocked; only activates on enhanced pages, respects `prefers-reduced-motion`
- `DeconstructedGrid` — CSS Grid with seeded random tilt (-1.5° to +1.5°) and vertical offset per item; used on projects page for deconstructivist layout
- `RetroFuturisticCard` — Card component with layered Soviet box-shadows, animated corner brackets, shimmer sweep, optional holographic rotating border; used on education stats

**Colour Palette**:
  - Soviet red: `#8f0000` (deep crimson)
  - Soviet orange: `#db5b00` (warm orange-red)
  - Aged beige: `#e3d5c1` (paper texture)
  - Industrial gray: `#8c8670` (concrete)
  - Space age gold: `#ffa500` (accents)
  - Warm background (light): `#f5efe6` (aged paper)
  - Background (dark): `#1a1a1a` (dark with warm undertone)
  - Text: `slate-100` (dark) / `slate-800` (light)

**Design Philosophy**:
- Geometric & angular (NOT smooth/organic)
- Warm colours (red/orange/gold, NOT cool cyan/purple)
- Brutalist architecture influence
- 1960s Soviet space race imagery
- Constructivist typography principles
- Analogue tech aesthetic (CRT, Morse code, telemetry, radar)
- Dada/Deconstructivist accents: collage fragments, torn edges, scattered typography, ink stamps, slight tilts (Reverse:1999 / Tzara)
- Interactive elements respond to mouse/hover/click

### General Styling
- Tailwind CSS utility classes throughout
- **Tailwind v4**: Uses `@import "tailwindcss"` + `@custom-variant dark (&:where(.dark, .dark *))` + `@theme { }` syntax in `globals.css` (no `tailwind.config.js`); custom CSS goes *after* the `@theme { }` block
- Dark mode: `dark:` prefix for all colour variations (class-based via `@custom-variant dark`, toggled by next-themes on `<html>`)
- Print overrides: All retro effects disabled, clean black/white output
- Mobile-first responsive design
- Accent colours: Blue (blue-600/blue-400) for links

## Commands
```bash
npm install
npm run dev
npm run build
npm test          # Vitest (unit tests for aesthetics module)
npm run test:ui   # Vitest UI browser interface
```

## Key Features

### Video Embedding System
- **InlineVideo Component**: Click thumbnail → fullscreen YouTube iframe
- Thumbnails: Direct `<img>` from `img.youtube.com/vi/{videoId}/hqdefault.jpg`
- Fixes Next.js Image loading issues with external YouTube CDN
- All timeline videos embedded directly (no external links needed)

### Dark Mode Theming
- System preference auto-detection
- Manual toggle with sun/moon icon
- Theme persisted in localStorage
- Soviet retro effects active in BOTH modes (subtler in light mode)
- CV page excluded from light-mode effects (`.cv-page` class)
- All atmospheric components use `usePathname()` to detect CV page
- Print mode forces light theme with clean output

### Framer Motion Animation System
- **Header**: Staggered nav item entrance with blur-in, animated active indicator (`layoutId` spring)
- **Footer**: Staggered contact link entrance, icon neon glow, `whileHover`/`whileTap` micro-interactions
- **ProjectCard**: Wrapped in `AnimatedCard` for 3D tilt + spotlight; category badge entrance animations; tech tag scale interactions
- **GlitchText**: Cyrillic character scramble effect on nav links (hover-triggered)
- **SovietCursorGlow**: Global mouse-following radial glow with Framer Motion spring physics

### Print Support
- `PrintButton` component on CV landing page (Soviet-styled action button)
- All retro effects, animations, shadows, and text-shadows disabled in `@media print`
- Scanlines, corner brackets, and section-header accents hidden
- Clean black/white output with neutral borders

## Notes
- **British English** required (colour, centre, organisation, programme)
- **Academic emphasis** > work experience
- Mobile-first responsive design
- All external links open in new tabs (`target="_blank"`)
- Print-friendly CV page (hidden nav, no background effects)
- For full architecture details, see [`ARCHITECTURE.md`](./ARCHITECTURE.md)
