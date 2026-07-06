export interface Video {
  type: 'presentation' | 'operation' | 'demo';
  title: { en: string; zh: string };
  url: string;
  embedUrl: string;
  date: string;
}

export interface Platform {
  name: { en: string; zh: string };
  course: string;
  status: 'complete' | 'in-progress' | 'pending';
  repo: string | null;
}

export interface Project {
  id: string;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  categories: ('mobile' | 'web' | 'game' | 'backend')[];
  featured: boolean;
  order: number;
  courses: { code: string; name: { en: string; zh: string } }[];
  status: 'complete' | 'in-progress';
  repo: string | null;
  techStack: string[];
  videos: Video[];
  platforms?: Platform[];
  highlights?: { en: string[]; zh: string[] };
  liveUrl?: string;
  relatedProjects?: { id: string; label: { en: string; zh: string } }[];
}

function ytEmbed(id: string): string {
  return `https://www.youtube.com/embed/${id}`;
}

export const projects: Project[] = [
  // --- 1. PourRice (FYP) ---------------------------------------------------
  {
    id: 'pourrice',
    title: {
      en: 'Pour Rice 倒米 — Final Year Project',
      zh: '倒米 Pour Rice — 畢業專題',
    },
    description: {
      en: 'A comprehensive cross-platform vegetarian restaurant discovery platform for Hong Kong, featuring real-time chat, AI-powered assistance, and location-based services. This Final Year Project spans multiple platforms — including a native Swift iOS app built for the Proprietary Mobile Software Design course — with a shared backend infrastructure.',
      zh: '全面的跨平台香港素食餐廳探索平台，具備實時聊天、AI輔助及定位服務功能。此畢業專題橫跨多個平台（包括為專有手機軟件設計課程開發的原生 Swift iOS 應用程式），共用後端基礎設施。',
    },
    categories: ['mobile', 'backend'],
    featured: true,
    order: 1,
    courses: [
      { code: '06CIT4002', name: { en: 'Final Year Project', zh: '畢業專題' } },
      { code: '03CIT4044', name: { en: 'Cross-Platform Mobile Application Development', zh: '跨平台手機應用開發' } },
      { code: '03CIT4047', name: { en: 'Open Mobile Software Design', zh: '開放手機軟件設計' } },
      { code: '03CIT4043', name: { en: 'Proprietary Mobile Software Design (iOS)', zh: '專有手機軟件設計 (iOS)' } },
    ],
    status: 'complete',
    repo: null,
    liveUrl: 'https://cross-platform-assignment.vercel.app/home',
    relatedProjects: [
      { id: 'pourrice-ios', label: { en: 'Swift iOS Platform (Sub-Project)', zh: 'Swift iOS 平台（子項目）' } },
    ],
    techStack: [
      'Flutter / Dart',
      'Ionic / Angular',
      'TypeScript',
      'Express.js',
      'Socket.IO',
      'Firebase',
      'Google Gemini AI',
      'Algolia',
      'Google Maps API',
    ],
    platforms: [
      {
        name: { en: 'Ionic PWA (Primary)', zh: 'Ionic PWA (主平台)' },
        course: '03CIT4044',
        status: 'complete',
        repo: 'https://github.com/Test-Plus-XD/Cross-Platform-Assignment',
      },
      {
        name: { en: 'Flutter Android', zh: 'Flutter Android' },
        course: '03CIT4047',
        status: 'complete',
        repo: 'https://github.com/Test-Plus-XD/Android-Assignment',
      },
      {
        name: { en: 'Swift iOS', zh: 'Swift iOS' },
        course: '03CIT4043',
        status: 'complete',
        repo: 'https://github.com/Test-Plus-XD/iOS-Assignment',
      },
      {
        name: { en: 'Vercel Backend API', zh: 'Vercel 後端 API' },
        course: 'Shared',
        status: 'complete',
        repo: null,
      },
      {
        name: { en: 'Railway Socket.IO', zh: 'Railway Socket.IO' },
        course: 'Shared',
        status: 'complete',
        repo: null,
      },
    ],
    highlights: {
      en: [
        '21,031 lines of Flutter code across 100 Dart files',
        '16 UI pages, 50 reusable widgets, 14 services, 10 models',
        '100% test pass rate (45 unit tests)',
        'Full bilingual support (English / Traditional Chinese)',
      ],
      zh: [
        'Flutter 代碼共 21,031 行，分佈於 100 個 Dart 文件',
        '16 個 UI 頁面、50 個可重用組件、14 個服務、10 個模型',
        '單元測試通過率 100%（共 45 個測試）',
        '完整雙語支持（英語 / 繁體中文）',
      ],
    },
    videos: [
      { type: 'operation', title: { en: 'Flutter Operation', zh: 'Flutter 操作演示' }, url: 'https://youtu.be/WB2t-f88AME', embedUrl: ytEmbed('WB2t-f88AME'), date: '29/12/2025' },
      { type: 'presentation', title: { en: 'Flutter Presentation', zh: 'Flutter 簡報' }, url: 'https://youtu.be/rXnUfZ1FnUE', embedUrl: ytEmbed('rXnUfZ1FnUE'), date: '29/12/2025' },
      { type: 'demo', title: { en: 'Ionic Demonstration', zh: 'Ionic 演示' }, url: 'https://youtu.be/tl7z5B5YT7M', embedUrl: ytEmbed('tl7z5B5YT7M'), date: '12/12/2025' },
      { type: 'operation', title: { en: 'Ionic Operation', zh: 'Ionic 操作演示' }, url: 'https://youtu.be/ybg66eH3-hI', embedUrl: ytEmbed('ybg66eH3-hI'), date: '12/11/2025' },
      { type: 'operation', title: { en: 'Flutter Assignment 2', zh: 'Flutter 作業 2' }, url: 'https://youtube.com/shorts/422JoEHT4SE', embedUrl: ytEmbed('422JoEHT4SE'), date: '27/11/2025' },
      { type: 'operation', title: { en: 'Flutter Assignment 1', zh: 'Flutter 作業 1' }, url: 'https://youtube.com/shorts/ZJHVqbcWlck', embedUrl: ytEmbed('ZJHVqbcWlck'), date: '2/11/2025' },
      { type: 'demo', title: { en: 'FYP Overview Demo (with live backend)', zh: '畢業專題總覽演示（連接實時後端）' }, url: 'https://youtu.be/SsHJJNL3MKs', embedUrl: ytEmbed('SsHJJNL3MKs'), date: '30/4/2026' },
      { type: 'presentation', title: { en: 'FYP Technical Overview Presentation', zh: '畢業專題技術總覽簡報' }, url: 'https://youtu.be/CTI5XFZ7POQ', embedUrl: ytEmbed('CTI5XFZ7POQ'), date: '4/5/2026' },
      { type: 'demo', title: { en: 'FYP PWA Demo', zh: '畢業專題 PWA 演示' }, url: 'https://youtu.be/DMCyLYqmvcw', embedUrl: ytEmbed('DMCyLYqmvcw'), date: '7/5/2026' },
    ],
  },

  // --- 2. Steam-like E-Commerce Platform -------------------------------------
  {
    id: 'steam-platform',
    title: {
      en: 'Steam-like E-Commerce Platform',
      zh: 'Steam 式電子商務平台',
    },
    description: {
      en: 'Comprehensive responsive e-commerce platform emulating Steam functionality for digital product sales, developed across multiple related courses.',
      zh: '全面響應式電子商務平台，模擬 Steam 功能進行數碼產品銷售，跨多個相關課程開發。',
    },
    categories: ['web', 'backend'],
    featured: true,
    order: 2,
    courses: [
      { code: '03CIT4053', name: { en: 'Technology for Web Development', zh: '網絡開發技術' } },
      { code: '03CIT4054', name: { en: 'PHP Application Development', zh: 'PHP 應用開發' } },
      { code: '03CIT4048', name: { en: 'Introduction to Database Systems', zh: '數據庫系統導論' } },
    ],
    status: 'complete',
    repo: 'https://github.com/Test-Plus-XD/Web-Assignment',
    techStack: ['PHP', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'MySQL'],
    videos: [
      { type: 'presentation', title: { en: 'PHP Final Presentation', zh: 'PHP 期末簡報' }, url: 'https://youtu.be/zQh2nmy-E88', embedUrl: ytEmbed('zQh2nmy-E88'), date: '30/4/2025' },
      { type: 'operation', title: { en: 'PHP Final Operation', zh: 'PHP 期末操作演示' }, url: 'https://youtu.be/RHIbLWDbQuY', embedUrl: ytEmbed('RHIbLWDbQuY'), date: '28/4/2025' },
      { type: 'operation', title: { en: 'PHP Assignment 1', zh: 'PHP 作業 1' }, url: 'https://youtu.be/vaPRcK98VzQ', embedUrl: ytEmbed('vaPRcK98VzQ'), date: '13/2/2025' },
      { type: 'operation', title: { en: 'TWD Final Operation', zh: 'TWD 期末操作演示' }, url: 'https://youtu.be/GNkpLG3K0B0', embedUrl: ytEmbed('GNkpLG3K0B0'), date: '31/12/2024' },
      { type: 'operation', title: { en: 'TWD Assignment 2', zh: 'TWD 作業 2' }, url: 'https://youtu.be/j_4idSlAHkU', embedUrl: ytEmbed('j_4idSlAHkU'), date: '27/11/2024' },
      { type: 'operation', title: { en: 'TWD Assignment 1', zh: 'TWD 作業 1' }, url: 'https://youtu.be/OmaRpubezoA', embedUrl: ytEmbed('OmaRpubezoA'), date: '19/10/2024' },
    ],
  },

  // --- 3. 3D Mobile Game ----------------------------------------------------
  {
    id: '3d-game',
    title: {
      en: '3D Mobile Game (Unity)',
      zh: '3D 手機遊戲 (Unity)',
    },
    description: {
      en: 'Unity-based 3D mobile game developed with custom game assets created in Autodesk 3ds Max.',
      zh: '基於 Unity 的 3D 手機遊戲，配合在 Autodesk 3ds Max 中創建的自製遊戲資產。',
    },
    categories: ['mobile', 'game'],
    featured: true,
    order: 3,
    courses: [
      { code: '03CIT4046', name: { en: '3D Mobile Game Development', zh: '3D 手機遊戲開發' } },
      { code: '03CIT4041', name: { en: 'Game Asset Development', zh: '遊戲資產開發' } },
    ],
    status: 'complete',
    repo: null,
    techStack: ['Unity', 'C#', 'Autodesk 3ds Max'],
    videos: [
      { type: 'presentation', title: { en: '3D Game Presentation', zh: '3D 遊戲簡報' }, url: 'https://youtu.be/lzrNLRafMHg', embedUrl: ytEmbed('lzrNLRafMHg'), date: '12/5/2025' },
      { type: 'operation', title: { en: '3D Shooter Gameplay', zh: '3D 射擊遊戲操作' }, url: 'https://youtu.be/Rf3YQ5JqGh8', embedUrl: ytEmbed('Rf3YQ5JqGh8'), date: '12/5/2025' },
      { type: 'operation', title: { en: '3D Runner Gameplay', zh: '3D 跑步遊戲操作' }, url: 'https://youtube.com/shorts/TjW_fJ801HU', embedUrl: ytEmbed('TjW_fJ801HU'), date: '2/5/2025' },
    ],
  },

  // --- 4. 2D Puzzle Game ----------------------------------------------------
  {
    id: '2d-puzzle',
    title: {
      en: '2D Puzzle Game (Unity)',
      zh: '2D 益智遊戲 (Unity)',
    },
    description: {
      en: 'Unity-based 2D mobile puzzle game with animations, scoring system, and multiple difficulty levels.',
      zh: '基於 Unity 的 2D 手機益智遊戲，具備動畫、計分系統及多個難度等級。',
    },
    categories: ['mobile', 'game'],
    featured: false,
    order: 4,
    courses: [
      { code: '03CIT4045', name: { en: '2D Mobile Game Development', zh: '2D 手機遊戲開發' } },
    ],
    status: 'complete',
    repo: 'https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment',
    techStack: ['Unity', 'C#'],
    videos: [
      { type: 'operation', title: { en: 'Puzzle Game — Assignment 2', zh: '益智遊戲 — 作業 2' }, url: 'https://youtube.com/shorts/03PpUxeYq78', embedUrl: ytEmbed('03PpUxeYq78'), date: '20/11/2025' },
      { type: 'operation', title: { en: 'Puzzle Game — Assignment 1', zh: '益智遊戲 — 作業 1' }, url: 'https://youtube.com/shorts/7mM4UJyezGw', embedUrl: ytEmbed('7mM4UJyezGw'), date: '2/11/2025' },
    ],
  },

  // --- 5. 2D Chess Game ----------------------------------------------------
  {
    id: '2d-chess',
    title: {
      en: '2D Chess Game (Unity)',
      zh: '2D 國際象棋遊戲 (Unity)',
    },
    description: {
      en: 'Unity-based 2D mobile chess game featuring classic chess mechanics and gameplay.',
      zh: '基於 Unity 的 2D 手機國際象棋遊戲，具備經典國際象棋機制及遊戲玩法。',
    },
    categories: ['mobile', 'game'],
    featured: false,
    order: 5,
    courses: [
      { code: '03CIT4045', name: { en: '2D Mobile Game Development', zh: '2D 手機遊戲開發' } },
    ],
    status: 'complete',
    repo: 'https://github.com/Test-Plus-XD/2D-Chess-Project',
    techStack: ['Unity', 'C#'],
    videos: [
      { type: 'presentation', title: { en: '2D Game Presentation', zh: '2D 遊戲簡報' }, url: 'https://youtu.be/Ftt7lIPo0Jc', embedUrl: ytEmbed('Ftt7lIPo0Jc'), date: '22/12/2025' },
      { type: 'operation', title: { en: 'Chess Game Demo', zh: '國際象棋演示' }, url: 'https://youtu.be/oeiCjfTcAOY', embedUrl: ytEmbed('oeiCjfTcAOY'), date: '23/12/2025' },
    ],
  },

  // --- 6. AI Annotation Tool ------------------------------------------------
  {
    id: 'ai-annotation',
    title: {
      en: 'AI Annotation Tool',
      zh: 'AI 數據集標註工具',
    },
    description: {
      en: 'AI Dataset Annotation Tool developed using Test-Driven Development (TDD) methodology.',
      zh: '使用測試驅動開發（TDD）方法開發的 AI 數據集標註工具。',
    },
    categories: ['backend'],
    featured: false,
    order: 6,
    courses: [
      { code: '03CIT4042', name: { en: 'Software Engineering and Professional Practice', zh: '軟件工程與專業實踐' } },
    ],
    status: 'complete',
    // PLACEHOLDER: Confirm exact technology stack used for the AI Annotation Tool
    repo: 'https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/tree/main/AI%20Annotation%20Tool%20v2',
    techStack: ['Python', 'TDD'],
    videos: [
      { type: 'operation', title: { en: 'SE Assignment 2 Operation', zh: 'SE 作業 2 操作演示' }, url: 'https://youtu.be/mgE3mYxxpYw', embedUrl: ytEmbed('mgE3mYxxpYw'), date: '26/12/2025' },
    ],
  },

  // --- 7. Zuul Text Adventure -----------------------------------------------
  {
    id: 'zuul-game',
    title: {
      en: 'Zuul Text Adventure Game',
      zh: 'Zuul 文字冒險遊戲',
    },
    description: {
      en: 'Arcane-themed text-based adventure game implementing MVC architecture with room navigation, inventory management, and NPC interactions.',
      zh: '以奧術為主題的文字冒險遊戲，實現 MVC 架構，具備房間導航、物品管理及 NPC 互動功能。',
    },
    categories: ['game'],
    featured: false,
    order: 7,
    courses: [
      { code: '03CIT4052', name: { en: 'Object-Oriented Analysis and Design', zh: '物件導向分析與設計' } },
    ],
    status: 'complete',
    repo: null,
    techStack: ['Java', 'MVC Pattern'],
    videos: [],
  },

  // --- 8. Card Matching Game ------------------------------------------------
  {
    id: 'card-game',
    title: {
      en: 'Card Matching Game',
      zh: '翻牌配對遊戲',
    },
    description: {
      en: 'Interactive Java desktop game with smooth card flip animations, dynamic difficulty progression, and audio system.',
      zh: '互動式 Java 桌面遊戲，具備流暢的翻牌動畫、動態難度進階及音效系統。',
    },
    categories: ['game'],
    featured: false,
    order: 8,
    courses: [
      { code: '03CIT4049', name: { en: 'Java Programming', zh: 'Java 程序設計' } },
    ],
    status: 'complete',
    repo: 'https://github.com/Test-Plus-XD/NetBeans-Projects/tree/main/CardMatchingGame',
    techStack: ['Java Swing', 'Audio Playback'],
    videos: [
      { type: 'operation', title: { en: 'Card Matching Game Demo', zh: 'Java 翻牌配對遊戲演示' }, url: 'https://youtu.be/yxGm6arDMzs', embedUrl: ytEmbed('yxGm6arDMzs'), date: '18/12/2024' },
    ],
  },

  // --- 9. Linux Server Administration ---------------------------------------
  {
    id: 'linux-server',
    title: {
      en: 'Linux Server Administration',
      zh: 'Linux 伺服器管理',
    },
    description: {
      en: 'Server configuration and administration project covering essential Linux services and system management.',
      zh: '伺服器配置及管理專題，涵蓋基本 Linux 服務及系統管理。',
    },
    categories: ['backend'],
    featured: false,
    order: 9,
    courses: [
      { code: '03CIT4055', name: { en: 'Open System Administration', zh: '開放系統管理' } },
    ],
    status: 'complete',
    repo: null,
    techStack: ['Linux', 'Shell / Bash', 'Server Services'],
    videos: [
      { type: 'presentation', title: { en: 'Linux Server Presentation', zh: 'Linux 伺服器簡報' }, url: 'https://youtu.be/U9pubOUTG-8', embedUrl: ytEmbed('U9pubOUTG-8'), date: '8/5/2025' },
    ],
  },

  // --- 10. Data Communication and Networking ---------------------------------
  {
    id: 'data-comm-networking',
    title: {
      en: 'Data Communication and Networking — Game Server Design',
      zh: '數據通信與網絡 — 遊戲伺服器設計',
    },
    description: {
      en: 'Assignment presentation covering the design of a networked game server architecture, including client-server communication protocols and data exchange patterns.',
      zh: '作業簡報，涵蓋網絡遊戲伺服器架構設計，包括客戶端與伺服器通信協定及數據交換模式。',
    },
    categories: ['backend'],
    featured: false,
    order: 10,
    courses: [
      { code: '03CIT4050', name: { en: 'Data Communication and Networking', zh: '數據通信與網絡' } },
    ],
    status: 'complete',
    // PLACEHOLDER: Confirm exact technology stack used for the Game Server Network Design assignment
    repo: null,
    techStack: ['Networking Protocols', 'Client-Server Architecture'],
    videos: [
      { type: 'presentation', title: { en: 'Game Server Network Design — Assignment 2 Presentation', zh: '遊戲伺服器網絡設計 — 作業 2 簡報' }, url: 'https://youtu.be/tykZszgwRaY', embedUrl: ytEmbed('tykZszgwRaY'), date: '2/5/2026' },
    ],
  },

  // --- 11. Computer Ethics ---------------------------------------------------
  {
    id: 'computer-ethics',
    title: {
      en: 'Computer Ethics — Project Presentation',
      zh: '計算機倫理 — 專題簡報',
    },
    description: {
      en: 'Project presentation examining ethical issues in computing and technology, presented with captioning for accessibility.',
      zh: '專題簡報探討計算機及科技相關的倫理議題，附字幕以提高可及性。',
    },
    categories: [],
    featured: false,
    order: 11,
    courses: [
      { code: '03CIT4010', name: { en: 'Computer Ethics', zh: '計算機倫理' } },
    ],
    status: 'complete',
    // PLACEHOLDER: Confirm exact project topic/technology (if any) for the Computer Ethics presentation
    repo: null,
    techStack: [],
    videos: [
      { type: 'presentation', title: { en: 'Computer Ethics Project Presentation (captioned)', zh: '計算機倫理專題簡報（附字幕）' }, url: 'https://youtu.be/JHXK4-w5x38', embedUrl: ytEmbed('JHXK4-w5x38'), date: '3/5/2026' },
    ],
  },

  // --- 12. Pour Rice — Swift iOS (sub-project) --------------------------------
  {
    id: 'pourrice-ios',
    title: {
      en: 'Pour Rice — Swift iOS App',
      zh: '倒米 Pour Rice — Swift iOS 應用程式',
    },
    description: {
      en: 'The native iOS platform component of the Pour Rice Final Year Project, built with Swift for the Proprietary Mobile Software Design course. Shares the same backend infrastructure as the other Pour Rice platforms.',
      zh: '倒米 Pour Rice 畢業專題的原生 iOS 平台組件，以 Swift 開發，對應專有手機軟件設計課程，與其他倒米平台共用相同的後端基礎設施。',
    },
    categories: ['mobile'],
    featured: false,
    order: 12,
    courses: [
      { code: '03CIT4043', name: { en: 'Proprietary Mobile Software Design (iOS)', zh: '專有手機軟件設計 (iOS)' } },
    ],
    status: 'complete',
    repo: 'https://github.com/Test-Plus-XD/iOS-Assignment',
    // PLACEHOLDER: Confirm exact iOS frameworks/libraries used (e.g. SwiftUI vs UIKit, Core Data)
    techStack: ['Swift'],
    relatedProjects: [
      { id: 'pourrice', label: { en: 'Pour Rice — Final Year Project (Main)', zh: '倒米 Pour Rice — 畢業專題（主頁）' } },
    ],
    videos: [
      { type: 'operation', title: { en: 'iOS Assignment 1', zh: 'iOS 作業 1' }, url: 'https://youtube.com/shorts/yT6ES-SnVKU', embedUrl: ytEmbed('yT6ES-SnVKU'), date: '15/3/2026' },
      { type: 'operation', title: { en: 'iOS Assignment 2', zh: 'iOS 作業 2' }, url: 'https://youtube.com/shorts/c5yJIbbt8Wg', embedUrl: ytEmbed('c5yJIbbt8Wg'), date: '3/4/2026' },
      { type: 'operation', title: { en: 'iOS Project Operation', zh: 'iOS 專題操作演示' }, url: 'https://youtu.be/r9jqsguKJlE', embedUrl: ytEmbed('r9jqsguKJlE'), date: '28/4/2026' },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
