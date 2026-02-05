# CV Website Project - CLAUDE.md

## Project Overview
Bilingual (Traditional Chinese / British English) CV website built with Next.js 16+ (App Router) for Vercel deployment. Formal academic tone required. The Landing Page should be a printer-friendly CV with a professional tech company aesthetic.

## Critical Requirements
1. **Bilingual Support**: All content in EN and ZH-HK with language toggle
2. **Dark Mode**: System preference detection + manual toggle
3. **Responsive**: Mobile-first, test on both desktop and mobile
4. **Academic Focus**: Education and projects are primary; work experience is secondary (brief)
5. **British English**: Use colour, centre, organisation, programme throughout
6. **Performance**: Vercel Speed Insights enabled

## Tech Stack
- Next.js 16.1.6+ (App Router)
- Tailwind CSS
- next-intl for i18n
- next-themes for dark mode
- lucide-react for icons
- @vercel/speed-insights for analytics
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
│   ├── Footer.tsx                # Contact links (6 platforms)
│   ├── ProjectCard.tsx           # Project display with video links
│   ├── ThemeToggle.tsx           # Dark/light mode
│   ├── LanguageToggle.tsx        # EN/繁體中文
│   ├── ThemeProvider.tsx         # next-themes wrapper
│   └── VideoEmbed.tsx            # YouTube embed component
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
{/* PLACEHOLDER: Enter personal statement (2-3 sentences) */}
{/* PLACEHOLDER: Add profile photo URL */}
{/* PLACEHOLDER: Enter date of birth */}
```

## Contact Links (Footer) - All Required
| Platform | Value |
|----------|-------|
| Email | baldwon0xd@gmail.com |
| Phone | +852 67016557 |
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
- Certifications (IELTS 6.5, HKCS, HKDEA memberships)

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
- **IELTS Academic**: Band 6.5
- **HKCS**: Hong Kong Computer Society — Student Member
- **HKDEA**: Hong Kong Digital Entertainment Association — Member

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

## Styling Guidelines
- Use Tailwind CSS utility classes
- Dark mode: `dark:` prefix for all colour variations
- Professional colour scheme (slate/zinc for dark, white/gray for light)
- Accent colour: Blue (blue-600/blue-400)
- Minimal animations (subtle hover effects only)
- Print-friendly: `print:` prefix for CV page

## Commands
```bash
npm install
npm run dev
npm run build
```

## Notes
- Use British English spellings
- Academic emphasis > work experience
- Mobile-first responsive design
- Ensure all links open in new tabs
- YouTube thumbnails loaded via img.youtube.com
