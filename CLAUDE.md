# CV Website Project - CLAUDE.md

## Project Overview
Bilingual (Traditional Chinese / British English) CV website built with Next.js 16+ (App Router) for Vercel deployment. Formal academic tone required. The Landing Page should be a printer friendly CV.

## Critical Requirements
1. **Bilingual Support**: All content in EN and ZH-HK with language toggle
2. **Dark Mode**: System preference detection + manual toggle
3. **Responsive**: Mobile-first, test on both desktop and mobile
4. **Academic Focus**: Education and projects are primary; work experience is secondary (brief)
5. **British English**: Use colour, centre, organisation, programme throughout

## Content Source
Refer to `cv-content-guide.md` for all verified links, video URLs, repository links, and bilingual content.

## Placeholder Comments
Add JSX comments for missing information that the user must provide:
```jsx
{/* PLACEHOLDER: Enter full English name */}
{/* PLACEHOLDER: Enter Chinese name */}
{/* PLACEHOLDER: Enter GPA if available */}
{/* PLACEHOLDER: Add profile photo URL */}
{/* PLACEHOLDER: Enter personal statement (2-3 sentences) */}
{/* PLACEHOLDER: List certifications */}
{/* PLACEHOLDER: Enter date of birth */}
{/* PLACEHOLDER: Enter nationality */}
```

## Tech Stack
- Next.js 16.1.6+ (App Router)
- Tailwind CSS
- next-intl for i18n
- lucide-react for icons
- Vercel deployment

## File Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx          # Landing CV (single-page)
│   │   ├── projects/
│   │   │   └── page.tsx      # Projects grid with video embeds
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx            # Nav + language toggle + theme toggle
│   ├── Footer.tsx            # Contact links (6 platforms)
│   ├── ProjectCard.tsx       # Project display with video links
│   ├── ThemeToggle.tsx       # Dark/light mode
│   ├── LanguageToggle.tsx    # EN/繁體中文
│   └── VideoEmbed.tsx        # YouTube embed component
├── messages/
│   ├── en.json               # English translations
│   └── zh-hk.json            # Traditional Chinese translations
└── lib/
    ├── projects.ts           # Project data with all links
    └── videos.ts             # Video data organised by type
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

## YouTube Video Embedding
Convert `youtu.be` links to embed format:
- Input: `https://youtu.be/WB2t-f88AME`
- Embed: `https://www.youtube.com/embed/WB2t-f88AME`

## Landing Page CV Sections (in order)
1. **Header**: Name, title, language/theme toggles
2. **Profile**: Photo placeholder, personal statement placeholder
3. **Education**: HKCT details, courses by semester, GPA placeholder
4. **Featured Projects**: Top 3-4 projects with links
5. **Skills**: Technologies grouped by category
6. **Work Experience**: Brief Hotel ICON entry (2-3 lines max)
7. **Certifications**: Placeholder section
8. **Footer**: All 6 contact links with icons

## Projects Page Features
- Filter by: All, Mobile, Web, Game, Backend
- Each card shows: Title, description, tech stack, GitHub link, video links
- Video modal or inline embed for presentations/operations

## Key Project: PourRice (FYP)
This is the Final Year Project spanning 3 platforms:
- Ionic PWA: https://github.com/Test-Plus-XD/PourRice-Ionic
- Flutter Android: https://github.com/Test-Plus-XD/PourRice
- Swift iOS: Pending (course just started)
- Backend: Private repos (Vercel + Railway)

## Repository Links (Embed These)
| Repo | URL |
|------|-----|
| PourRice-Ionic | https://github.com/Test-Plus-XD/Cross-Platform-Assignment |
| PourRice-Swift | https://github.com/Test-Plus-XD/iOS-Assignment |
| PourRice-Flutter | https://github.com/Test-Plus-XD/Android-Assignment |
| Web-Assignment | https://github.com/Test-Plus-XD/Web-Assignment |
| 3D-Game | No Repo |
| 2D-Chess-Game | https://github.com/Test-Plus-XD/2D-Chess-Project |
| 2D-Puzzle-Game | https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment|
| Software-Engineering-Git-Assignment | https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/tree/main/AI%20Annotation%20Tool%20v2 |
| Zuul-Game | No Repo |
| Java-Assignment2 | https://github.com/Test-Plus-XD/NetBeans-Projects/tree/main/CardMatchingGame |
| Linux-Server | No Repo |

## Video Links (All 23)
### Presentations (5)
1. https://youtu.be/rXnUfZ1FnUE - Flutter Presentation (29/12/2025)
2. https://youtu.be/Ftt7lIPo0Jc - 2D Game Presentation (22/12/2025)
3. https://youtu.be/lzrNLRafMHg - 3D Game Presentation (12/5/2025)
4. https://youtu.be/U9pubOUTG-8 - Linux Presentation (8/5/2025)
5. https://youtu.be/zQh2nmy-E88 - PHP Presentation (30/4/2025)

### Operations/Demos (17)
1. https://youtu.be/WB2t-f88AME - Flutter Operation (29/12/2025)
2. https://youtu.be/mgE3mYxxpYw - SE Assignment 2 (26/12/2025)
3. https://youtu.be/oeiCjfTcAOY - 2D Chess Game Demo (23/12/2025)
4. https://youtu.be/tl7z5B5YT7M - Ionic Demonstration (12/12/2025)
5. https://youtube.com/shorts/422JoEHT4SE - Flutter Assignment 2 (27/11/2025)
6. https://youtube.com/shorts/03PpUxeYq78 - 2D Puzzle Game Assignment 2 (20/11/2025)
7. https://youtu.be/ybg66eH3-hI - Ionic Operation (12/11/2025)
8. https://youtube.com/shorts/7mM4UJyezGw - 2D Puzzle Game Assignment 1 (2/11/2025)
9. https://youtube.com/shorts/ZJHVqbcWlck - Flutter Assignment 1 (2/11/2025)
10. https://youtu.be/Rf3YQ5JqGh8 - 3D Shooter Game Gameplay (12/5/2025)
11. https://youtube.com/shorts/TjW_fJ801HU - 3D Runner Game Gameplay (2/5/2025)
12. https://youtu.be/RHIbLWDbQuY - PHP Final Operation (28/4/2025)
13. https://youtu.be/vaPRcK98VzQ - PHP Assignment 1 (13/2/2025)
14. https://youtu.be/GNkpLG3K0B0 - TWD Final Operation (31/12/2024)
15. https://youtu.be/yxGm6arDMzs - Java Card Game (18/12/2024)
16. https://youtu.be/j_4idSlAHkU - TWD Assignment 2 (27/11/2024)
17. https://youtu.be/OmaRpubezoA - TWD Assignment 1 (19/10/2024)

## Styling Guidelines
- Use Tailwind CSS utility classes
- Dark mode: `dark:` prefix for all colour variations
- Professional colour scheme (slate/zinc for dark, white/gray for light)
- Accent colour: Choose a professional blue or teal
- Minimal animations (subtle hover effects only)
- No excessive gradients or shadows

## Deployment
- Deploy to Vercel
- Configure i18n routing in `next.config.js`
- Set up environment variables if needed
- Test both locales before final deployment

## Commands
```bash
npm create next-app@latest cv-website
cd cv-website
npm install next-intl lucide-react
npm run dev
```

## Notes
- All text content is in `cv-content-guide.md`
- Use British English spellings
- Academic emphasis > work experience
- Mobile-first responsive design
- Ensure all links are clickable and open in new tabs