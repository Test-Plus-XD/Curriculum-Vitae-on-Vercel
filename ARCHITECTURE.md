# CV Website Architecture — In-Depth Guide

**Author**: NG Yu Ham Baldwin 吳宇涵  
**Stack**: Next.js 16 App Router + TypeScript + Tailwind CSS + next-intl  
**Purpose**: Bilingual (EN/繁體中文) retro-futuristic CV portfolio

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Tech Stack Deep Dive](#tech-stack-deep-dive)
4. [Font System](#font-system)
5. [Internationalisation (i18n)](#internationalisation-i18n)
6. [Dark Mode & Theming](#dark-mode--theming)
7. [Retro-Futuristic Styling](#retro-futuristic-styling)
8. [Data Architecture](#data-architecture)
9. [Component Breakdown](#component-breakdown)
10. [Page Structure](#page-structure)
11. [Adding New Content](#adding-new-content)
12. [Deployment](#deployment)

---

## Project Overview

This is a **bilingual academic CV website** showcasing projects, education, and skills. It features:

- **Retro-futuristic aesthetic** (neon glows, scanlines, animated waves) in dark mode
- **Print-friendly** landing page CV
- **Embedded YouTube videos** with custom thumbnail handling
- **Mobile-first responsive design**
- **Static generation** for optimal performance on Vercel

The site is built entirely with **Next.js 16 App Router** using server components where possible, with client components only where interactivity is required (theme toggle, video modals, wave animations).

---

## Directory Structure

```
/home/user/Curriculum-Vitae-on-Vercel/
├── src/
│   ├── app/                          # Next.js App Router structure
│   │   ├── layout.tsx                # Root layout (fonts, Speed Insights)
│   │   ├── globals.css               # Global styles (retro effects, print overrides)
│   │   └── [locale]/                 # Locale-based routing (en, zh-hk)
│   │       ├── layout.tsx            # Locale layout (Header, Footer, ThemeProvider, RetroWave)
│   │       ├── page.tsx              # Landing CV page (print-optimised)
│   │       ├── education/page.tsx    # Full course list (4 semesters, 19 courses)
│   │       └── projects/
│   │           ├── page.tsx          # Projects grid (filter by category)
│   │           └── [id]/page.tsx     # Project detail (timeline + embedded videos)
│   ├── components/
│   │   ├── Header.tsx                # Navigation + language/theme toggles
│   │   ├── Footer.tsx                # Contact links (6 platforms)
│   │   ├── ProjectCard.tsx           # Project card component (with glow effect)
│   │   ├── ThemeToggle.tsx           # Sun/moon icon toggle (client component)
│   │   ├── LanguageToggle.tsx        # EN/繁 toggle (client component)
│   │   ├── ThemeProvider.tsx         # next-themes wrapper (client component)
│   │   ├── VideoEmbed.tsx            # Legacy modal video player
│   │   ├── InlineVideo.tsx           # 🆕 YouTube embed component (thumbnail → fullscreen iframe)
│   │   └── RetroWave.tsx             # 🆕 Animated wave overlay (react-wavify)
│   ├── lib/
│   │   ├── projects.ts               # 🗂️ All 9 projects + 23 YouTube videos
│   │   ├── timeline.ts               # Timeline events (videos + milestones)
│   │   └── videos.ts                 # Video aggregation helper
│   ├── messages/
│   │   ├── en.json                   # English translations
│   │   └── zh-hk.json                # Traditional Chinese translations
│   └── i18n/
│       └── request.ts                # next-intl configuration
├── middleware.ts                     # Locale detection and redirection
├── next.config.mjs                   # Next.js config (next-intl plugin)
├── tailwind.config.js                # Tailwind (custom colours, font families)
├── CLAUDE.md                         # Project specifications
└── ARCHITECTURE.md                   # 📘 This file

```

---

## Tech Stack Deep Dive

### Core Framework
- **Next.js 16.1.6** (App Router) — Server Components by default, file-based routing
- **React 19** — Latest concurrent features
- **TypeScript 5** — Full type safety across codebase

### Styling
- **Tailwind CSS 3.4.6** — Utility-first CSS with custom extensions:
  - Neon colours (`neon-cyan`, `neon-purple`)
  - Custom font variables (`--font-en`, `--font-zh`, `--font-title`)
  - Dark mode via `class` strategy
- **PostCSS** — Tailwind + Autoprefixer

### Internationalisation
- **next-intl 4.0.0** — Type-safe i18n with:
  - Locale-based routing (`/en/...`, `/zh-hk/...`)
  - Automatic message loading
  - Server-side translation functions

### Theming
- **next-themes 0.4.0** — System preference detection + manual toggle
  - Avoids flash of unstyled content (FOUC)
  - Persists theme in localStorage

### Icons & UI
- **lucide-react 0.460.0** — Clean, consistent icon set
- **react-wavify** — SVG wave animation (retro-futuristic effect)

### Analytics
- **@vercel/speed-insights** — Real User Monitoring (RUM)
- **@vercel/analytics** — Page views and Web Vitals

---

## Font System

### Google Fonts Integration

Three fonts are loaded via `next/font/google` in `src/app/layout.tsx`:

```typescript
import { Iansui } from 'next/font/google';           // Chinese body text
import { LINE_Seed_JP } from 'next/font/google';     // English body text
import { Noto_Serif_Display } from 'next/font/google'; // Titles (Light 300 Italic)
```

Each font exports a CSS variable:
- `--font-zh` → Iansui (繁體中文 body)
- `--font-en` → LINE Seed JP (English body)
- `--font-title` → Noto Serif Display (headings, name)

### Locale-Aware Font Switching

In `src/app/[locale]/layout.tsx`, the root `<div>` has dynamic classes:

```tsx
<div className={`scanlines ${locale === 'zh-hk' ? 'locale-zh' : 'locale-en'}`}>
```

In `globals.css`:
```css
.locale-en { font-family: var(--font-en), sans-serif; }
.locale-zh { font-family: var(--font-zh), sans-serif; }
```

This ensures **Chinese pages use Iansui** and **English pages use LINE Seed JP** automatically.

### Title Font Usage

Use the `font-title` class for elegant headings:
```tsx
<h1 className="font-title font-light italic glow-heading">
  {t('placeholders.name')}
</h1>
```

---

## Internationalisation (i18n)

### How next-intl Works

1. **Middleware** (`middleware.ts`) intercepts requests and:
   - Detects locale from URL (`/en` or `/zh-hk`)
   - Redirects to default locale if none specified
   
2. **Routing**: All pages live under `[locale]` dynamic segment
   - `/en/projects` → English projects page
   - `/zh-hk/projects` → Chinese projects page

3. **Translation Files**: `src/messages/{locale}.json`
   - Flat JSON structure with dot notation keys
   - Example: `t('projects.viewAll')` → "View All Projects" (EN) / "查看全部項目" (ZH)

4. **Server Components**: Use `getTranslations()` from `next-intl/server`
   ```tsx
   const t = await getTranslations('projects');
   return <h1>{t('title')}</h1>;
   ```

5. **Client Components**: Use `useTranslations()` hook
   ```tsx
   const t = useTranslations('footer');
   return <p>{t('copyright', { year: 2026 })}</p>;
   ```

### Adding New Translations

1. Edit both `src/messages/en.json` and `src/messages/zh-hk.json`
2. Use the same key structure in both files
3. Access via `t('section.key')`

Example:
```json
// en.json
{
  "projects": {
    "newFeature": "New Feature"
  }
}

// zh-hk.json  
{
  "projects": {
    "newFeature": "新功能"
  }
}
```

---

## Dark Mode & Theming

### How next-themes Works

1. **ThemeProvider** wraps the app in `src/app/[locale]/layout.tsx`:
   ```tsx
   <ThemeProvider>
     {/* All content */}
   </ThemeProvider>
   ```

2. **System Preference Detection**: On first visit, detects OS preference
3. **Manual Toggle**: `ThemeToggle.tsx` allows user override
4. **Persistence**: Choice saved in `localStorage`

### Styling Dark Mode

Tailwind's `dark:` prefix automatically applies when theme is `'dark'`:

```tsx
<div className="bg-white dark:bg-slate-900">
  {/* White background in light, dark slate in dark */}
</div>
```

### Avoiding Hydration Mismatch

Components using `useTheme()` check `mounted` state:
```tsx
const { theme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);
if (!mounted) return null; // Prevents server/client mismatch
```

---

## Retro-Futuristic Styling

### Key Visual Elements

#### 1. **Grid Background** (`globals.css`)
```css
.dark body {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
}
```
Creates a subtle cyan grid in dark mode only.

#### 2. **Scanlines** (`.scanlines::after`)
```css
.dark .scanlines::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0, 0, 0, 0.025) 2px, rgba(0, 0, 0, 0.025) 4px
  );
  pointer-events: none;
  z-index: 999;
}
```
Horizontal CRT-style scanlines overlay.

#### 3. **Glow Effects**
- `.glow-heading` — Cyan text shadow on headings
- `.glow-card` — Border glow + box-shadow on hover

```css
.dark .glow-card {
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.06);
}
.dark .glow-card:hover {
  box-shadow: 0 0 22px rgba(6, 182, 212, 0.15);
}
```

#### 4. **RetroWave Component** (`RetroWave.tsx`)
Animated SVG wave at the bottom of the page using `react-wavify`:
```tsx
<Wave
  fill="url(#wave-gradient)"
  options={{ height: 15, amplitude: 25, speed: 0.15, points: 4 }}
/>
```
Gradient from cyan to purple, opacity 20%, dark mode only.

### Print-Friendly Overrides

All retro effects are disabled for print:
```css
@media print {
  .scanlines::after { display: none !important; }
  .glow-card { border-color: #cbd5e1 !important; }
  * { box-shadow: none !important; text-shadow: none !important; }
}
```

---

## Data Architecture

### Project Data (`src/lib/projects.ts`)

#### Interface Structure
```typescript
interface Project {
  id: string;                        // URL slug
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  categories: ('mobile' | 'web' | 'game' | 'backend')[];
  featured: boolean;                 // Show on landing page?
  order: number;                     // Display order
  courses: { code: string; name: { en: string; zh: string } }[];
  status: 'complete' | 'in-progress';
  repo: string | null;               // GitHub URL
  techStack: string[];
  videos: Video[];
  platforms?: Platform[];            // For multi-platform projects (PourRice)
  highlights?: { en: string[]; zh: string[] };
}

interface Video {
  type: 'presentation' | 'operation' | 'demo';
  title: { en: string; zh: string };
  url: string;                       // Full YouTube URL
  embedUrl: string;                  // Embed URL (for iframe)
  date: string;                      // DD/MM/YYYY format
}
```

#### Adding a New Project

1. Add to `projects` array in `src/lib/projects.ts`:
   ```typescript
   {
     id: 'my-new-project',
     title: { en: 'My Project', zh: '我的項目' },
     description: { en: '...', zh: '...' },
     categories: ['web'],
     featured: false,
     order: 10,
     courses: [{ code: '01ABC1234', name: { en: '...', zh: '...' } }],
     status: 'in-progress',
     repo: 'https://github.com/username/repo',
     techStack: ['React', 'Node.js'],
     videos: [],
   }
   ```

2. Add translations to `messages/{locale}.json` if needed

3. (Optional) Add timeline events in `src/lib/timeline.ts`

### Timeline Data (`src/lib/timeline.ts`)

```typescript
interface TimelineEvent {
  date: string;                      // DD/MM/YYYY
  type: 'video' | 'milestone' | 'release';
  title: { en: string; zh: string };
  description?: { en: string; zh: string };
  videoUrl?: string;
  videoId?: string;                  // YouTube video ID (e.g., 'dQw4w9WgXcQ')
  embedUrl?: string;                 // https://www.youtube.com/embed/{videoId}
}
```

Videos in timeline are automatically embedded using `InlineVideo` component.

---

## Component Breakdown

### Server Components (Default)
- `src/app/[locale]/page.tsx` — Landing CV
- `src/app/[locale]/education/page.tsx` — Education timeline
- `src/app/[locale]/projects/page.tsx` — Projects grid
- `src/app/[locale]/projects/[id]/page.tsx` — Project detail

All pages are **pre-rendered at build time** (Static Site Generation).

### Client Components (`'use client'`)
Required for interactivity or hooks:

- **Header.tsx** — Navigation links (uses `usePathname` for active state)
- **Footer.tsx** — Contact info (uses `useTranslations`)
- **ThemeToggle.tsx** — Theme switcher (uses `useTheme`)
- **LanguageToggle.tsx** — Locale switcher (uses `useLocale`, `useRouter`)
- **ThemeProvider.tsx** — Wraps `next-themes`
- **ProjectCard.tsx** — Project cards (uses `useLocale`)
- **VideoEmbed.tsx** — Legacy modal video player
- **InlineVideo.tsx** — YouTube embed with thumbnail → fullscreen
- **RetroWave.tsx** — Animated wave (uses `useTheme` to show only in dark mode)

### Component Communication

- **Props drilling**: Parent server components fetch data and pass to client components
- **No global state**: All state is local (theme in localStorage, locale in URL)

---

## Page Structure

### Landing Page (`src/app/[locale]/page.tsx`)

**Purpose**: Single-page printable CV  
**Layout**: Two-column (2/3 left, 1/3 right sidebar)  
**Sections**:
- Header (name, title, contact links)
- Education summary (current semester preview)
- Featured projects (top 3)
- Work experience (brief)
- Skills (grouped by category)
- Certifications (IELTS only)

**Print Optimisations**:
- Hides header/footer navigation
- Removes background effects
- Uses print-safe fonts and sizes

### Education Page (`/education`)

**Purpose**: Full academic record  
**Data**: 19 courses across 4 semesters  
**Features**:
- Semester-by-semester breakdown
- GPA display (3.7 Year 1)
- Course codes + bilingual names
- Statistics cards (total credits, GPA)

### Projects Page (`/projects`)

**Purpose**: Filterable project grid  
**Filters**: All, Mobile, Web, Game, Backend  
**Uses**: `ProjectCard` component for each project

### Project Detail Page (`/projects/[id]`)

**Purpose**: Deep dive into single project  
**Layout**: Timeline (left 2/3) + Sidebar (right 1/3)  
**Features**:
- **Timeline**: Chronological video embeds + milestones
- **Sidebar**: Tech stack, repos, platforms, highlights
- **Videos**: Embedded via `InlineVideo` (click thumbnail → fullscreen iframe)

---

## Adding New Content

### 1. Add a New Project

Edit `src/lib/projects.ts`:
```typescript
export const projects: Project[] = [
  // ... existing projects
  {
    id: 'new-project-id',
    title: { en: 'New Project', zh: '新項目' },
    description: { en: 'Description...', zh: '描述...' },
    categories: ['web'],
    featured: false,
    order: 10,
    courses: [],
    status: 'in-progress',
    repo: 'https://github.com/...',
    techStack: ['Next.js', 'Tailwind'],
    videos: [],
  },
];
```

### 2. Add Timeline Events

Edit `src/lib/timeline.ts`:
```typescript
export const projectTimelines: Record<string, TimelineEvent[]> = {
  'new-project-id': [
    {
      date: '06/02/2026',
      type: 'video',
      title: { en: 'Demo Video', zh: '演示影片' },
      videoUrl: 'https://youtu.be/ABC123',
      videoId: 'ABC123',
      embedUrl: 'https://www.youtube.com/embed/ABC123',
    },
    {
      date: '01/01/2026',
      type: 'milestone',
      title: { en: 'Project Started', zh: '項目開始' },
    },
  ],
};
```

### 3. Add Translations

Edit `src/messages/en.json` and `src/messages/zh-hk.json`:
```json
{
  "projects": {
    "newProjectTitle": "My New Feature"
  }
}
```

### 4. Update Personal Info

Edit `src/messages/{locale}.json`:
```json
{
  "placeholders": {
    "name": "Your Name",
    "personalStatement": "Your statement here..."
  }
}
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel dashboard
3. **Auto-detect**: Next.js project (no config needed)
4. Deploy

### Environment Variables

None required for basic deployment. Speed Insights and Analytics are enabled by default for Vercel projects.

### Build Command
```bash
npm run build
```

### Build Output
- Static HTML for all pages (SSG)
- Client JS bundles (optimised with tree-shaking)
- Font files (self-hosted via `next/font`)

### Performance Optimisations

- **Image Optimisation**: YouTube thumbnails use direct CDN URLs
- **Code Splitting**: Each page loads only required JS
- **Font Subsetting**: Google Fonts API serves minimal character sets
- **Static Generation**: All pages pre-rendered at build time

---

## Troubleshooting

### Hydration Mismatches
If you see "Text content does not match server-rendered HTML":
- Check client components using `useTheme` have `mounted` check
- Ensure date formatting is consistent server/client

### YouTube Thumbnails Not Loading
- InlineVideo uses direct `<img>` tags (not Next.js Image) for reliability
- Falls back to `hqdefault.jpg` quality (always available)

### Fonts Not Switching
- Verify `locale-zh` / `locale-en` classes are applied to root div
- Check `globals.css` has font-family rules for these classes

### Dark Mode Flash
- ThemeProvider uses `suppressHydrationWarning` on `<html>` tag
- Theme is injected via script tag before hydration

---

## Future Enhancements

Potential improvements to consider:

1. **CMS Integration** — Connect to Notion/Contentful for easier content editing
2. **Blog Section** — Add `/blog` route for project writeups
3. **Contact Form** — Integrate Formspree/EmailJS
4. **Animations** — Framer Motion for page transitions
5. **SEO** — Add structured data (JSON-LD) for Google Search
6. **PDF Export** — Automatic CV PDF generation via Puppeteer
7. **Analytics Dashboard** — Custom stats page showing project views

---

## Learning Resources

### Next.js App Router
- [Official Docs](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

### next-intl
- [Documentation](https://next-intl-docs.vercel.app/)
- [Server vs Client Components](https://next-intl-docs.vercel.app/docs/environments/server-client-components)

### Tailwind CSS
- [Docs](https://tailwindcss.com/docs)
- [Dark Mode Guide](https://tailwindcss.com/docs/dark-mode)

### TypeScript
- [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## Contact & Support

**Developer**: NG Yu Ham Baldwin 吳宇涵  
**Email**: baldwon0xd@gmail.com  
**GitHub**: [@Test-Plus-XD](https://github.com/Test-Plus-XD)

For questions about this codebase, open an issue on the [repository](https://github.com/Test-Plus-XD/Curriculum-Vitae-on-Vercel).
