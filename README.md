# CV Website on Vercel

A bilingual (Traditional Chinese / British English) professional CV website built with Next.js 16+ (App Router) for Vercel deployment.

## Features

- **Bilingual Support**: Full EN and ZH-HK translations with language toggle
- **Dark Mode**: System preference detection + manual toggle
- **Responsive Design**: Mobile-first, optimised for both desktop and mobile
- **Print-Friendly**: Landing page CV optimised for printing
- **Performance Monitoring**: Vercel Speed Insights integration
- **Project Showcase**: Individual project pages with development timelines and YouTube video thumbnails

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing CV (professional, print-friendly) |
| `/education` | Full course listing by semester with timeline |
| `/projects` | Project grid with category filtering |
| `/projects/[id]` | Individual project pages with development timeline |

## Tech Stack

- **Framework**: Next.js 16.1.6+ (App Router)
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Icons**: lucide-react
- **Themes**: next-themes
- **Analytics**: @vercel/speed-insights
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
