import { bi, type Bilingual } from './i18n-text';

export type Category = 'mobile' | 'web' | 'game' | 'backend';
export const CATEGORIES: Category[] = ['mobile', 'web', 'game', 'backend'];

export type VideoKind = 'presentation' | 'operation' | 'demo';

export interface Video {
  url: string;
  /** ISO date (YYYY-MM-DD) the video was recorded or published. */
  date: string;
  kind: VideoKind;
  title: Bilingual;
}

export interface Milestone {
  date: string;
  title: Bilingual;
  /** The source marks this date as a placeholder; show it as approximate. */
  approximate?: boolean;
}

export interface Platform {
  name: Bilingual;
  stack: string;
  course?: string;
  primary?: boolean;
}

export interface Repo {
  label: Bilingual;
  url: string;
}

export interface Highlight {
  value: number;
  suffix?: string;
  label: Bilingual;
}

export interface Project {
  id: string;
  title: Bilingual;
  tagline: Bilingual;
  categories: Category[];
  /** One or two sentences for cards and the CV page. */
  summary: Bilingual;
  description: Bilingual;
  details?: Bilingual[];
  courses: string[];
  tech: string[];
  repos: Repo[];
  live?: { url: string; label: Bilingual };
  highlights?: Highlight[];
  platforms?: Platform[];
  milestones: Milestone[];
  videos: Video[];
}

export const PROJECTS: Project[] = [
  {
    id: 'pourrice',
    title: bi('Pour Rice', 'Pour Rice 倒米'),
    tagline: bi('Final Year Project · Solo developer', '畢業專題・獨立開發'),
    categories: ['mobile', 'backend'],
    summary: bi(
      'A full-stack, cross-platform vegetarian restaurant discovery, booking and promotion platform for Hong Kong, designed and built independently.',
      '為香港而設的全端跨平台素食餐廳搜尋、訂座及推廣平台，由本人獨立設計及開發。',
    ),
    description: bi(
      'A full-stack, comprehensive cross-platform vegetarian restaurant discovery, booking and promotion platform for Hong Kong, built independently as the Final Year Project. It supports bilingual diner and restaurant-owner workflows, including native Google sign-in, reservation updates through push notifications, AI-assisted questions about restaurant menus, real-time diner–owner chat, QR-code menu deep links and Stripe-backed restaurant advertising, with location-based services and one shared backend across every platform.',
      '一個全面的全端跨平台素食餐廳搜尋、訂座及推廣平台，為本人獨立完成的畢業專題。平台支援食客及餐廳東主的雙語流程，包括原生 Google 登入、以推送通知更新訂座狀態、以 AI 解答餐牌相關問題、食客與東主之間的即時聊天、QR 碼餐牌深層連結，以及由 Stripe 支援的餐廳廣告；並提供定位服務，所有平台共用同一後端。',
    ),
    details: [
      bi(
        'Handled architecture, frontend, backend, real-time systems, third-party integrations and deployment across the full development lifecycle.',
        '負責整個開發週期的架構、前端、後端、即時系統、第三方整合及部署。',
      ),
      bi(
        'Backend: Express.js REST API on Vercel; Socket.IO real-time server on Railway; Firebase Authentication, Firestore and Storage; Algolia search; Stripe payments; Google Gemini AI; Google Maps API.',
        '後端：部署於 Vercel 的 Express.js REST API；部署於 Railway 的 Socket.IO 即時伺服器；Firebase 驗證、Firestore 及 Storage；Algolia 搜尋；Stripe 付款；Google Gemini AI；Google Maps API。',
      ),
    ],
    courses: ['06CIT4002', '03CIT4044', '03CIT4047', '03CIT4043'],
    tech: ['Flutter / Dart', 'Ionic / Angular', 'TypeScript', 'Swift', 'Express.js', 'Socket.IO', 'Firebase', 'Google Gemini AI', 'Algolia', 'Stripe', 'Google Maps API'],
    repos: [
      { label: bi('Ionic PWA', 'Ionic PWA'), url: 'https://github.com/Test-Plus-XD/Cross-Platform-Assignment' },
      { label: bi('Flutter Android', 'Flutter Android'), url: 'https://github.com/Test-Plus-XD/Android-Assignment' },
      { label: bi('Swift iOS', 'Swift iOS'), url: 'https://github.com/Test-Plus-XD/iOS-Assignment' },
    ],
    live: { url: 'https://cross-platform-assignment.vercel.app/home', label: bi('Launch the live PWA', '開啟 PWA 網上版') },
    highlights: [
      { value: 21031, label: bi('lines of Flutter code', '行 Flutter 程式碼') },
      { value: 100, label: bi('Dart files', '個 Dart 檔案') },
      { value: 16, label: bi('UI pages', '個介面頁面') },
      { value: 50, label: bi('reusable widgets', '個可重用元件') },
      { value: 45, label: bi('unit tests, 100% passing', '個單元測試，全數通過') },
      { value: 2, label: bi('languages, fully bilingual', '種語言，全面雙語') },
    ],
    platforms: [
      { name: bi('Ionic / Angular PWA', 'Ionic / Angular 漸進式網頁應用'), stack: 'Ionic · Angular · TypeScript', course: '03CIT4044', primary: true },
      { name: bi('Flutter Android app', 'Flutter Android 應用程式'), stack: 'Flutter · Dart', course: '03CIT4047' },
      { name: bi('Native Swift iOS app', '原生 Swift iOS 應用程式'), stack: 'Swift', course: '03CIT4043' },
      { name: bi('Vercel backend API', 'Vercel 後端 API'), stack: 'Express.js · Firebase · Algolia · Stripe · Gemini' },
      { name: bi('Railway real-time server', 'Railway 即時伺服器'), stack: 'Socket.IO' },
    ],
    milestones: [
      { date: '2025-10-01', title: bi('Project development started', '項目開發展開') },
      { date: '2026-01-01', title: bi('Native Swift iOS app started', '原生 Swift iOS 應用程式開發展開'), approximate: true },
    ],
    videos: [
      { url: 'https://youtube.com/shorts/ZJHVqbcWlck', date: '2025-11-02', kind: 'operation', title: bi('Flutter Assignment 1', 'Flutter 作業一') },
      { url: 'https://youtu.be/ybg66eH3-hI', date: '2025-11-12', kind: 'operation', title: bi('Ionic Operation', 'Ionic 操作示範') },
      { url: 'https://youtube.com/shorts/422JoEHT4SE', date: '2025-11-27', kind: 'operation', title: bi('Flutter Assignment 2', 'Flutter 作業二') },
      { url: 'https://youtu.be/tl7z5B5YT7M', date: '2025-12-12', kind: 'demo', title: bi('Ionic Demonstration', 'Ionic 示範') },
      { url: 'https://youtu.be/WB2t-f88AME', date: '2025-12-29', kind: 'operation', title: bi('Flutter Operation', 'Flutter 操作示範') },
      { url: 'https://youtu.be/rXnUfZ1FnUE', date: '2025-12-29', kind: 'presentation', title: bi('Flutter Presentation', 'Flutter 簡報') },
      { url: 'https://youtu.be/SsHJJNL3MKs', date: '2026-04-30', kind: 'demo', title: bi('FYP Overview Demo (live backend)', '畢業專題總覽示範（連線後端）') },
      { url: 'https://youtu.be/CTI5XFZ7POQ', date: '2026-05-04', kind: 'presentation', title: bi('FYP Technical Overview', '畢業專題技術總覽簡報') },
      { url: 'https://youtube.com/shorts/yT6ES-SnVKU', date: '2026-03-15', kind: 'operation', title: bi('Swift iOS Assignment 1', 'Swift iOS 作業一') },
      { url: 'https://youtube.com/shorts/c5yJIbbt8Wg', date: '2026-04-03', kind: 'operation', title: bi('Swift iOS Assignment 2', 'Swift iOS 作業二') },
      { url: 'https://youtu.be/r9jqsguKJlE', date: '2026-04-28', kind: 'operation', title: bi('Swift iOS Project Operation', 'Swift iOS 項目操作示範') },
      { url: 'https://youtu.be/DMCyLYqmvcw', date: '2026-05-07', kind: 'demo', title: bi('FYP PWA Demo', '畢業專題 PWA 示範') },
    ],
  },
  {
    id: 'steam-platform',
    title: bi('Steam-like E-Commerce Platform', '仿 Steam 電子商貿平台'),
    tagline: bi('Multi-course web project', '跨科目網頁項目'),
    categories: ['web', 'backend'],
    summary: bi(
      'A responsive e-commerce platform emulating Steam for digital product sales, built across three courses.',
      '模仿 Steam 的響應式數碼產品電子商貿平台，橫跨三個科目開發。',
    ),
    description: bi(
      'A comprehensive, responsive e-commerce platform emulating Steam functionality for digital product sales, developed across the web development, PHP and database courses.',
      '一個模仿 Steam 功能、用於銷售數碼產品的全面響應式電子商貿平台，橫跨網頁開發、PHP 及數據庫科目開發。',
    ),
    courses: ['03CIT4053', '03CIT4054', '03CIT4048'],
    tech: ['PHP', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'MySQL'],
    repos: [{ label: bi('Web Assignment'), url: 'https://github.com/Test-Plus-XD/Web-Assignment' }],
    milestones: [{ date: '2024-09-01', title: bi('Web development coursework began', '網頁開發課業展開') }],
    videos: [
      { url: 'https://youtu.be/OmaRpubezoA', date: '2024-10-19', kind: 'operation', title: bi('TWD Assignment 1', '網絡開發技術作業一') },
      { url: 'https://youtu.be/j_4idSlAHkU', date: '2024-11-27', kind: 'operation', title: bi('TWD Assignment 2', '網絡開發技術作業二') },
      { url: 'https://youtu.be/GNkpLG3K0B0', date: '2024-12-31', kind: 'operation', title: bi('TWD Final Operation', '網絡開發技術期末操作示範') },
      { url: 'https://youtu.be/vaPRcK98VzQ', date: '2025-02-13', kind: 'operation', title: bi('PHP Assignment 1', 'PHP 作業一') },
      { url: 'https://youtu.be/RHIbLWDbQuY', date: '2025-04-28', kind: 'operation', title: bi('PHP Final Operation', 'PHP 期末操作示範') },
      { url: 'https://youtu.be/zQh2nmy-E88', date: '2025-04-30', kind: 'presentation', title: bi('PHP Final Presentation', 'PHP 期末簡報') },
    ],
  },
  {
    id: '3d-game',
    title: bi('3D Mobile Game (Unity)', '3D 手機遊戲（Unity）'),
    tagline: bi('Unity · custom 3ds Max assets', 'Unity・自製 3ds Max 資產'),
    categories: ['mobile', 'game'],
    summary: bi('A Unity 3D mobile game with custom assets modelled in Autodesk 3ds Max.', '以 Unity 開發的 3D 手機遊戲，配合以 Autodesk 3ds Max 自製的遊戲資產。'),
    description: bi(
      'A Unity-based 3D mobile game developed with custom game assets created in Autodesk 3ds Max, delivered as shooter and runner gameplay builds.',
      '一款以 Unity 開發的 3D 手機遊戲，使用以 Autodesk 3ds Max 自製的遊戲資產，並完成射擊及跑酷兩種玩法版本。',
    ),
    courses: ['03CIT4046', '03CIT4041'],
    tech: ['Unity', 'C#', 'Autodesk 3ds Max'],
    repos: [],
    milestones: [{ date: '2025-01-01', title: bi('Unity 3D game development began', 'Unity 3D 遊戲開發展開') }],
    videos: [
      { url: 'https://youtube.com/shorts/TjW_fJ801HU', date: '2025-05-02', kind: 'operation', title: bi('3D Runner Gameplay', '3D 跑酷遊戲實機') },
      { url: 'https://youtu.be/lzrNLRafMHg', date: '2025-05-12', kind: 'presentation', title: bi('3D Game Presentation', '3D 遊戲簡報') },
      { url: 'https://youtu.be/Rf3YQ5JqGh8', date: '2025-05-12', kind: 'operation', title: bi('3D Shooter Gameplay', '3D 射擊遊戲實機') },
    ],
  },
  {
    id: '2d-puzzle',
    title: bi('2D Puzzle Game (Unity)', '2D 解謎遊戲（Unity）'),
    tagline: bi('Unity · mobile puzzle', 'Unity・手機解謎'),
    categories: ['mobile', 'game'],
    summary: bi('A Unity 2D mobile puzzle game with animations, scoring and multiple difficulty levels.', '以 Unity 開發的 2D 手機解謎遊戲，設有動畫、計分系統及多個難度。'),
    description: bi(
      'A Unity-based 2D mobile puzzle game with animations, a scoring system and multiple difficulty levels.',
      '一款以 Unity 開發的 2D 手機解謎遊戲，設有動畫效果、計分系統及多個難度級別。',
    ),
    courses: ['03CIT4045'],
    tech: ['Unity', 'C#'],
    repos: [{ label: bi('2D Puzzle Game Assignment'), url: 'https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment' }],
    milestones: [{ date: '2025-09-01', title: bi('2D puzzle game development began', '2D 解謎遊戲開發展開') }],
    videos: [
      { url: 'https://youtube.com/shorts/7mM4UJyezGw', date: '2025-11-02', kind: 'operation', title: bi('Puzzle Game Assignment 1', '解謎遊戲作業一') },
      { url: 'https://youtube.com/shorts/03PpUxeYq78', date: '2025-11-20', kind: 'operation', title: bi('Puzzle Game Assignment 2', '解謎遊戲作業二') },
    ],
  },
  {
    id: '2d-chess',
    title: bi('2D Chess Game (Unity)', '2D 棋類遊戲（Unity）'),
    tagline: bi('Hex-grid strategy meets real-time combat', '六角格策略結合即時戰鬥'),
    categories: ['mobile', 'game'],
    summary: bi(
      'Chess-inspired, turn-based strategy on an axial hex grid combined with SUPERHOT-style real-time platformer combat.',
      '結合軸向座標六角格上的回合制棋類策略，以及 SUPERHOT 風格的即時平台戰鬥。',
    ),
    description: bi(
      'A Unity-based 2D mobile tactical game that combines chess-inspired, turn-based strategy on an axial-coordinate hex grid with SUPERHOT-style real-time platformer combat.',
      '一款以 Unity 開發的 2D 手機戰術遊戲，結合軸向座標六角格上受國際象棋啟發的回合制策略，以及 SUPERHOT 風格的即時平台戰鬥。',
    ),
    details: [
      bi('Weighted AI decision-making algorithms evaluate spatial advantages on the board.', '以加權 AI 決策演算法評估棋盤上的空間優勢。'),
      bi('Raycast-based line-of-sight targeting supports both gameplay modes.', '以射線偵測實現視線瞄準，同時支援兩種玩法模式。'),
    ],
    courses: ['03CIT4045'],
    tech: ['Unity', 'C#'],
    repos: [{ label: bi('2D Chess Project'), url: 'https://github.com/Test-Plus-XD/2D-Chess-Project' }],
    milestones: [{ date: '2025-09-01', title: bi('2D chess game development began', '2D 棋類遊戲開發展開') }],
    videos: [
      { url: 'https://youtu.be/Ftt7lIPo0Jc', date: '2025-12-22', kind: 'presentation', title: bi('2D Game Presentation', '2D 遊戲簡報') },
      { url: 'https://youtu.be/oeiCjfTcAOY', date: '2025-12-23', kind: 'operation', title: bi('Chess Game Demo', '棋類遊戲示範') },
    ],
  },
  {
    id: 'ai-annotation',
    title: bi('AI Annotation Tool', 'AI 標註工具'),
    tagline: bi('Next.js · Test-Driven Development', 'Next.js・測試驅動開發'),
    categories: ['backend'],
    summary: bi(
      'A full-stack web application for uploading images and labelling them for AI datasets, built test-first.',
      '用於上載圖片並為 AI 數據集標註的全端網頁應用程式，以測試驅動方式開發。',
    ),
    description: bi(
      'An AI dataset annotation tool — a full-stack web application for uploading images and labelling them for AI datasets — developed using Test-Driven Development (TDD).',
      '一個 AI 數據集標註工具：用於上載圖片並為 AI 數據集加上標籤的全端網頁應用程式，以測試驅動開發（TDD）方法完成。',
    ),
    details: [
      bi('Frontend: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Zod 4.', '前端：Next.js 16、React 19、TypeScript 5、Tailwind CSS 4、Zod 4。'),
      bi(
        'Backend: Next.js API routes with better-sqlite3 (SQLite) and a custom data-access layer on Node.js.',
        '後端：Next.js API 路由，配合 better-sqlite3（SQLite）及自訂數據存取層，運行於 Node.js。',
      ),
      bi(
        'Firebase Authentication, Firebase Storage and a Google Gemini chatbot, all reached through a centralised Vercel API so keys stay server-side.',
        'Firebase 驗證、Firebase Storage 及 Google Gemini 聊天機械人，全部經由集中式 Vercel API 存取，確保金鑰只存放於伺服器端。',
      ),
      bi(
        'Testing: Jest with React Testing Library, Mocha and Chai for the database, Playwright end-to-end, plus fast-check, MSW and supertest.',
        '測試：Jest 配合 React Testing Library、以 Mocha 及 Chai 測試數據庫、以 Playwright 進行端對端測試，並使用 fast-check、MSW 及 supertest。',
      ),
    ],
    courses: ['03CIT4042'],
    tech: ['Next.js', 'TypeScript', 'SQLite', 'Firebase', 'Jest / Mocha / Playwright', 'TDD'],
    repos: [
      {
        label: bi('AI Annotation Tool v2'),
        url: 'https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/tree/main/AI%20Annotation%20Tool%20v2',
      },
    ],
    milestones: [{ date: '2025-09-01', title: bi('TDD-based development began', '以 TDD 方式展開開發') }],
    videos: [
      { url: 'https://youtu.be/mgE3mYxxpYw', date: '2025-12-26', kind: 'operation', title: bi('Software Engineering Assignment 2 Operation', '軟件工程作業二操作示範') },
    ],
  },
  {
    id: 'zuul-game',
    title: bi('Zuul Text Adventure Game', 'Zuul 文字冒險遊戲'),
    tagline: bi('Java · MVC', 'Java・MVC'),
    categories: ['game'],
    summary: bi('An Arcane-themed text adventure with room navigation, inventory and NPCs, built on MVC.', '以《Arcane》為主題的文字冒險遊戲，設有房間導航、物品欄及 NPC，採用 MVC 架構。'),
    description: bi(
      'An Arcane-themed text-based adventure game implementing MVC architecture, room navigation, inventory management and NPC interactions.',
      '一款以《Arcane》為主題的文字冒險遊戲，實現 MVC 架構、房間導航、物品管理及 NPC 互動。',
    ),
    courses: ['03CIT4052'],
    tech: ['Java', 'MVC Pattern'],
    repos: [],
    milestones: [
      { date: '2024-09-01', title: bi('Development started', '開發展開') },
      { date: '2025-01-01', title: bi('Project completed', '項目完成') },
    ],
    videos: [],
  },
  {
    id: 'card-game',
    title: bi('Card Matching Game', '翻牌配對遊戲'),
    tagline: bi('Java Swing desktop game', 'Java Swing 桌面遊戲'),
    categories: ['game'],
    summary: bi('A Java desktop game with card-flip animations, rising difficulty and an audio system.', '設有翻牌動畫、難度遞增及音效系統的 Java 桌面遊戲。'),
    description: bi(
      'An interactive Java desktop game with smooth card-flip animations, dynamic difficulty progression and an audio system.',
      '一款互動 Java 桌面遊戲，具備流暢的翻牌動畫、動態難度遞增及音效系統。',
    ),
    courses: ['03CIT4049'],
    tech: ['Java Swing', 'Audio Playback'],
    repos: [{ label: bi('Card Matching Game'), url: 'https://github.com/Test-Plus-XD/NetBeans-Projects/tree/main/CardMatchingGame' }],
    milestones: [{ date: '2024-09-01', title: bi('Java programming coursework began', 'Java 程序設計課業展開') }],
    videos: [{ url: 'https://youtu.be/yxGm6arDMzs', date: '2024-12-18', kind: 'operation', title: bi('Card Matching Game Demo', '翻牌配對遊戲示範') }],
  },
  {
    id: 'linux-server',
    title: bi('Linux Server Administration', 'Linux 伺服器管理'),
    tagline: bi('WireGuard · Docker · NGINX', 'WireGuard・Docker・NGINX'),
    categories: ['backend'],
    summary: bi(
      'Encrypted WireGuard tunnels across Ubuntu VMs, multi-tier VPN chaining and containerised NGINX pipelines.',
      '於 Ubuntu 虛擬機之間建立 WireGuard 加密隧道、多層 VPN 串接及容器化 NGINX 流程。',
    ),
    description: bi(
      'A server configuration and administration project covering essential Linux services and system management: encrypted WireGuard VPN tunnels across Ubuntu virtual machines, IPv4 packet forwarding, cross-platform client integration, multi-tier VPN chaining and containerised NGINX web pipelines built with custom Dockerfiles.',
      '一個涵蓋 Linux 核心服務及系統管理的伺服器配置項目：於 Ubuntu 虛擬機之間建立 WireGuard 加密 VPN 隧道、IPv4 封包轉發、跨平台客戶端整合、多層 VPN 串接，以及以自訂 Dockerfile 建構的容器化 NGINX 網頁流程。',
    ),
    details: [
      bi(
        'Dockerfiles automate image building and support service isolation and migration without reconfiguration.',
        '以 Dockerfile 自動建構映像，實現服務隔離，並可在毋須重新配置下遷移。',
      ),
    ],
    courses: ['03CIT4055'],
    tech: ['Linux', 'Shell / Bash', 'WireGuard', 'Docker', 'NGINX'],
    repos: [],
    milestones: [{ date: '2025-01-01', title: bi('Server administration project began', '伺服器管理項目展開') }],
    videos: [{ url: 'https://youtu.be/U9pubOUTG-8', date: '2025-05-08', kind: 'presentation', title: bi('Linux Server Presentation', 'Linux 伺服器簡報') }],
  },
  {
    id: 'data-comm-networking',
    title: bi('Game Server Network Design', '遊戲伺服器網絡設計'),
    tagline: bi('Data Communication and Networking', '數據通信與網絡'),
    categories: ['backend'],
    summary: bi(
      'Networked game-server architecture, client-server protocols and data-exchange patterns.',
      '探討網絡遊戲伺服器架構、客戶端－伺服器通訊協定及數據交換模式。',
    ),
    description: bi(
      'An assignment presentation covering networked game-server architecture, client-server communication protocols and data-exchange patterns.',
      '一份作業簡報，涵蓋網絡遊戲伺服器架構、客戶端－伺服器通訊協定及數據交換模式。',
    ),
    courses: ['03CIT4050'],
    tech: ['Networking Protocols', 'Client-Server Architecture'],
    repos: [],
    milestones: [{ date: '2026-01-01', title: bi('Coursework started', '課業展開'), approximate: true }],
    videos: [{ url: 'https://youtu.be/tykZszgwRaY', date: '2026-05-02', kind: 'presentation', title: bi('Game Server Network Design Presentation', '遊戲伺服器網絡設計簡報') }],
  },
  {
    id: 'computer-ethics',
    title: bi('Computer Ethics Presentation', '計算機倫理專題簡報'),
    tagline: bi('Captioned for accessibility', '附字幕以提升無障礙性'),
    categories: [],
    summary: bi('A project presentation examining ethical issues in computing and technology.', '探討電腦及科技倫理議題的專題簡報。'),
    description: bi(
      'A project presentation examining ethical issues in computing and technology, captioned for accessibility.',
      '一份探討電腦及科技倫理議題的專題簡報，並附有字幕以提升無障礙性。',
    ),
    courses: ['03CIT4010'],
    tech: [],
    repos: [],
    milestones: [{ date: '2026-01-01', title: bi('Coursework started', '課業展開'), approximate: true }],
    videos: [{ url: 'https://youtu.be/JHXK4-w5x38', date: '2026-05-03', kind: 'presentation', title: bi('Computer Ethics Project Presentation', '計算機倫理專題簡報') }],
  },
];

/** Route ids for /projects/[id]. */
export const PROJECT_IDS: string[] = PROJECTS.map((p) => p.id);

/** Projects shown on the CV landing page. */
export const FEATURED_IDS = ['pourrice', 'steam-platform', '2d-chess'];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Newest videos first. */
export function videosNewestFirst(project: Project): Video[] {
  return [...project.videos].sort((a, b) => b.date.localeCompare(a.date));
}

export type TimelineEntry =
  | { type: 'milestone'; date: string; milestone: Milestone }
  | { type: 'video'; date: string; video: Video };

/**
 * Milestones and videos merged into one list, newest first. On the same day, videos come before a
 * milestone (milestones mark where work started, so they sit below that day's results); otherwise the
 * order in the data is kept.
 */
export function buildTimeline(project: Project): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...project.milestones.map((m) => ({ type: 'milestone' as const, date: m.date, milestone: m })),
    ...project.videos.map((v) => ({ type: 'video' as const, date: v.date, video: v })),
  ];
  const rank = (e: TimelineEntry) => (e.type === 'video' ? 0 : 1);
  return entries.sort((a, b) => b.date.localeCompare(a.date) || rank(a) - rank(b));
}

/**
 * Lay a list out as newspaper pages: the front page carries `front` stories (a lead and its sidebar), every
 * page after it `inner`. Never returns an empty edition: no stories still makes one empty front page.
 */
export function paginateEdition<T>(items: T[], front = 3, inner = 4): T[][] {
  const pages: T[][] = [items.slice(0, front)];
  for (let i = front; i < items.length; i += inner) pages.push(items.slice(i, i + inner));
  return pages;
}

/** The latest dated thing in a set of projects (a video or a milestone), as an ISO date. */
export function latestFiling(projects: Project[]): string | undefined {
  const dates = projects.flatMap((p) => [...p.videos.map((v) => v.date), ...p.milestones.map((m) => m.date)]);
  return dates.sort().at(-1);
}

export interface Collaboration {
  id: string;
  title: Bilingual;
  owner: string;
  /** Omitted for private repositories. */
  url?: string;
  visibility: 'public' | 'private';
  summary: Bilingual;
  contributions: Bilingual[];
  tech: string[];
}

export const COLLABORATIONS: Collaboration[] = [
  {
    id: 'yolo-object-detection',
    title: bi('YOLO Object Detection (YOLO26)', 'YOLO 物件偵測（YOLO26）'),
    owner: 'keithku321',
    url: 'https://github.com/keithku321/object-detection',
    visibility: 'public',
    summary: bi(
      'Supporting a four-person HKMU final-year team on robust detection under hard visual conditions: underwater, adverse weather, small objects and camouflage, merged into one repository and one Gradio demo.',
      '協助一支四人香港都會大學畢業專題團隊，研究在困難視覺條件下的穩健物件偵測：水底、惡劣天氣、細小物件及偽裝目標，並整合為單一程式庫及 Gradio 示範程式。',
    ),
    contributions: [
      bi(
        'Multi-task scaffolding: shared code, per-plan training scripts, notebooks, demo tabs, tests and Ultralytics integration; project governance and workflow documents.',
        '多任務項目框架：共用程式碼、各方案訓練腳本、筆記本、示範分頁、測試及 Ultralytics 整合；並撰寫項目管治及工作流程文件。',
      ),
      bi(
        'Underwater baseline (YOLO26n, 20 epochs on Brackish): validation mAP50 0.584, mAP50-95 0.345, with results plots and a normalised confusion matrix.',
        '水底基準模型（YOLO26n，於 Brackish 訓練 20 個 epoch）：驗證 mAP50 0.584、mAP50-95 0.345，並附結果圖表及正規化混淆矩陣。',
      ),
    ],
    tech: ['Python', 'PyTorch', 'Ultralytics YOLO26', 'OpenCV', 'ONNX Runtime', 'Gradio', 'pytest', 'Google Colab'],
  },
  {
    id: 'gaming-ai-companion',
    title: bi('Gaming AI Companion “Kaguya”', '遊戲 AI 伴侶「かぐや」'),
    owner: 'keithku321',
    visibility: 'private',
    summary: bi(
      'A local-first AI companion that watches gameplay, speaks and chats on Discord with memory and a Live2D avatar, with every model running locally.',
      '一個以本地運行為先的 AI 伴侶，能觀看遊戲畫面、說話，並在 Discord 上以記憶及 Live2D 虛擬形象聊天，所有模型均於本地運行。',
    ),
    contributions: [
      bi(
        'Avatar motion for VTube Studio: seeded blink, gaze and sway controllers, mood easing over valence–arousal–dominance, and voice-driven mouth gestures, with 435 lines of tests.',
        '為 VTube Studio 實現虛擬形象動作：以種子控制的眨眼、視線及擺動，依情緒維度平滑過渡的情感表現，以及跟隨語音的口部動作，並附 435 行測試。',
      ),
      bi(
        'Image understanding in Discord chats through a local Ollama vision model, treating captions as untrusted data so nothing from a picture reaches memory or the cloud; 38 tests.',
        '透過本地 Ollama 視覺模型理解 Discord 聊天中的圖片，並將圖片描述視為不可信數據，確保圖片內容不會進入記憶或雲端；附 38 個測試。',
      ),
    ],
    tech: ['Python', 'Ollama', 'GPT-SoVITS', 'faster-whisper', 'discord.py', 'VTube Studio API', 'OpenCV', 'pytest'],
  },
];
