# CV Website Project - CLAUDE.md

**Owner**: NG Yu Ham Baldwin | 吳宇涵

## Project Overview
Bilingual (Traditional Chinese / British English) CV website built with Next.js 16+ (App Router) for Vercel deployment. Soviet retro-futuristic aesthetic in both light and dark modes (except the landing CV page in light mode) with print-friendly CV landing page. Formal academic tone required.

## Critical Requirements
1. **Bilingual Support**: All content in EN and ZH-HK with language toggle
2. **Dark Mode**: System preference detection + manual toggle
3. **Responsive**: Mobile-first, test on both desktop and mobile
4. **Academic Focus**: Education and projects are primary; work experience is secondary (brief)
5. **British English**: Use colour, centre, organisation, programme throughout
6. **Performance**: Vercel Speed Insights enabled

## Tech Stack
- Next.js 16.1.6+ (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3.4.6
- next-intl 4.0.0 (i18n)
- next-themes 0.4.0 (dark mode)
- lucide-react 0.460.0 (icons)
- framer-motion 12.33.0 (animation library — installed)
- react-wavify (retro wave animation — installed)
- @vercel/speed-insights + @vercel/analytics
- Vercel deployment

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
│   ├── Header.tsx                # Nav (CV/Education/Projects) + toggles
│   ├── Footer.tsx                # Contact links (7 platforms with neon accents)
│   ├── ProjectCard.tsx           # Project display with glow effects
│   ├── ThemeToggle.tsx           # Dark/light mode
│   ├── LanguageToggle.tsx        # EN/繁體中文
│   ├── ThemeProvider.tsx         # next-themes wrapper
│   ├── VideoEmbed.tsx            # Legacy YouTube modal
│   ├── InlineVideo.tsx           # YouTube embed (thumbnail → fullscreen iframe)
│   ├── RetroWave.tsx             # Animated SVG mountain range + radar sweep
│   ├── SovietParticles.tsx       # Floating Soviet-themed particles (stars, gears, sickles)
│   ├── SovietBackground.tsx      # Full-page grid/diagonal/grain background overlay
│   ├── CosmicStarfield.tsx       # Interactive parallax star field (mouse-responsive)
│   ├── MorseCodeTicker.tsx       # Animated Morse code strip (Soviet space comms)
│   ├── SovietTelemetry.tsx       # Side-panel telemetry readout (mission control)
│   └── SovietPropagandaPoster.tsx # Constructivist geometric decorations
├── messages/
│   ├── en.json                   # English translations
│   └── zh-hk.json                # Traditional Chinese translations
└── lib/
    ├── projects.ts               # Project data with all links
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
Three Google Fonts are used with locale-aware switching:

| Font | Usage | Weight/Style | CSS Variable |
|------|-------|--------------|--------------|
| **Iansui** | Chinese (繁體中文) body text | 400 | `--font-zh` |
| **LINE Seed JP** | English body text | 400 | `--font-en` |
| **Noto Serif Display** | Titles & headings | 300 Italic | `--font-title` |

**Implementation**:
- Fonts loaded in `src/app/layout.tsx` via `next/font/google`
- Locale-specific classes (`.locale-en`, `.locale-zh`) switch body font automatically
- Use `font-title` class for elegant headings with retro glow effect

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
- `.soviet-stat` / `.soviet-badge` / `.soviet-filter` — Themed UI elements
- `.soviet-tech-tag` — Hover effects on tech stack tags
- `.soviet-ripple` — Click ripple effect on interactive elements
- `.soviet-glitch` / `.soviet-crt-hover` — CRT glitch effects on hover

**Atmospheric Components** (hidden on CV page in light mode):
- `RetroWave` — Animated SVG mountain range with drifting peaks, radar sweep, horizon glow
- `SovietParticles` — 25 floating particles (stars, dots, diamonds, sickles, gears)
- `SovietBackground` — Full-page grid/diagonal/grain/vignette overlay
- `CosmicStarfield` — 60 interactive stars with mouse parallax (3 depth layers)
- `MorseCodeTicker` — Scrolling Morse code strip with Soviet space messages
- `SovietTelemetry` — Side-panel mission control readout with fluctuating values (xl+ only)
- `SovietPropagandaPoster` — Corner brackets, rotating star, dashed lines, geodesic nodes, aurora band

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
- Analog tech aesthetic (CRT, Morse code, telemetry, radar)
- Interactive elements respond to mouse/hover/click

### General Styling
- Tailwind CSS utility classes throughout
- Dark mode: `dark:` prefix for all colour variations
- Print overrides: All retro effects disabled, clean black/white output
- Mobile-first responsive design
- Accent colours: Blue (blue-600/blue-400) for links

## Commands
```bash
npm install
npm run dev
npm run build
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

## Notes
- **British English** required (colour, centre, organisation, programme)
- **Academic emphasis** > work experience
- Mobile-first responsive design
- All external links open in new tabs (`target="_blank"`)
- Print-friendly CV page (hidden nav, no background effects)
- For full architecture details, see [`ARCHITECTURE.md`](./ARCHITECTURE.md)
