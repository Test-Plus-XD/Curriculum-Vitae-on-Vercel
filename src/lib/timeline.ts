// Timeline data for projects - combines video dates with key milestones

export interface TimelineEvent {
  date: string; // DD/MM/YYYY format
  type: 'video' | 'milestone' | 'release';
  title: { en: string; zh: string };
  description?: { en: string; zh: string };
  videoUrl?: string;
  videoId?: string;
  embedUrl?: string;
}

export const projectTimelines: Record<string, TimelineEvent[]> = {
  pourrice: [
    {
      date: '29/12/2025',
      type: 'video',
      title: { en: 'Flutter App Final Presentation', zh: 'Flutter 應用最終簡報' },
      description: { en: 'Project presentation for Open Mobile Software Design course', zh: '開放手機軟件設計課程項目簡報' },
      videoUrl: 'https://youtu.be/rXnUfZ1FnUE',
      videoId: 'rXnUfZ1FnUE',
      embedUrl: 'https://www.youtube.com/embed/rXnUfZ1FnUE',
    },
    {
      date: '29/12/2025',
      type: 'video',
      title: { en: 'Flutter App Operation Demo', zh: 'Flutter 應用操作演示' },
      description: { en: 'Full operation demonstration of Flutter Android app', zh: 'Flutter Android 應用完整操作演示' },
      videoUrl: 'https://youtu.be/WB2t-f88AME',
      videoId: 'WB2t-f88AME',
      embedUrl: 'https://www.youtube.com/embed/WB2t-f88AME',
    },
    {
      date: '12/12/2025',
      type: 'video',
      title: { en: 'Ionic PWA Demonstration', zh: 'Ionic PWA 演示' },
      description: { en: 'Cross-platform mobile application demonstration', zh: '跨平台手機應用演示' },
      videoUrl: 'https://youtu.be/tl7z5B5YT7M',
      videoId: 'tl7z5B5YT7M',
      embedUrl: 'https://www.youtube.com/embed/tl7z5B5YT7M',
    },
    {
      date: '27/11/2025',
      type: 'video',
      title: { en: 'Flutter Assignment 2', zh: 'Flutter 作業 2' },
      videoUrl: 'https://youtube.com/shorts/422JoEHT4SE',
      videoId: '422JoEHT4SE',
      embedUrl: 'https://www.youtube.com/embed/422JoEHT4SE',
    },
    {
      date: '12/11/2025',
      type: 'video',
      title: { en: 'Ionic Operation Demo', zh: 'Ionic 操作演示' },
      videoUrl: 'https://youtu.be/ybg66eH3-hI',
      videoId: 'ybg66eH3-hI',
      embedUrl: 'https://www.youtube.com/embed/ybg66eH3-hI',
    },
    {
      date: '02/11/2025',
      type: 'video',
      title: { en: 'Flutter Assignment 1', zh: 'Flutter 作業 1' },
      videoUrl: 'https://youtube.com/shorts/ZJHVqbcWlck',
      videoId: 'ZJHVqbcWlck',
      embedUrl: 'https://www.youtube.com/embed/ZJHVqbcWlck',
    },
    {
      date: '01/10/2025',
      type: 'milestone',
      title: { en: 'Project Kickoff', zh: '項目啟動' },
      description: { en: 'Started Final Year Project development', zh: '開始畢業專題開發' },
    },
  ],

  'steam-platform': [
    {
      date: '30/04/2025',
      type: 'video',
      title: { en: 'PHP Final Presentation', zh: 'PHP 期末簡報' },
      description: { en: 'Final project presentation for PHP Application Development', zh: 'PHP 應用開發期末項目簡報' },
      videoUrl: 'https://youtu.be/zQh2nmy-E88',
      videoId: 'zQh2nmy-E88',
      embedUrl: 'https://www.youtube.com/embed/zQh2nmy-E88',
    },
    {
      date: '28/04/2025',
      type: 'video',
      title: { en: 'PHP Final Operation', zh: 'PHP 期末操作演示' },
      videoUrl: 'https://youtu.be/RHIbLWDbQuY',
      videoId: 'RHIbLWDbQuY',
      embedUrl: 'https://www.youtube.com/embed/RHIbLWDbQuY',
    },
    {
      date: '13/02/2025',
      type: 'video',
      title: { en: 'PHP Assignment 1', zh: 'PHP 作業 1' },
      videoUrl: 'https://youtu.be/vaPRcK98VzQ',
      videoId: 'vaPRcK98VzQ',
      embedUrl: 'https://www.youtube.com/embed/vaPRcK98VzQ',
    },
    {
      date: '31/12/2024',
      type: 'video',
      title: { en: 'TWD Final Operation', zh: 'TWD 期末操作演示' },
      description: { en: 'Technology for Web Development final demonstration', zh: '網絡開發技術期末演示' },
      videoUrl: 'https://youtu.be/GNkpLG3K0B0',
      videoId: 'GNkpLG3K0B0',
      embedUrl: 'https://www.youtube.com/embed/GNkpLG3K0B0',
    },
    {
      date: '27/11/2024',
      type: 'video',
      title: { en: 'TWD Assignment 2', zh: 'TWD 作業 2' },
      videoUrl: 'https://youtu.be/j_4idSlAHkU',
      videoId: 'j_4idSlAHkU',
      embedUrl: 'https://www.youtube.com/embed/j_4idSlAHkU',
    },
    {
      date: '19/10/2024',
      type: 'video',
      title: { en: 'TWD Assignment 1', zh: 'TWD 作業 1' },
      videoUrl: 'https://youtu.be/OmaRpubezoA',
      videoId: 'OmaRpubezoA',
      embedUrl: 'https://www.youtube.com/embed/OmaRpubezoA',
    },
    {
      date: '01/09/2024',
      type: 'milestone',
      title: { en: 'Project Started', zh: '項目開始' },
      description: { en: 'Began web development coursework', zh: '開始網絡開發課程作業' },
    },
  ],

  '3d-game': [
    {
      date: '12/05/2025',
      type: 'video',
      title: { en: '3D Game Presentation', zh: '3D 遊戲簡報' },
      description: { en: 'Final presentation for 3D Mobile Game Development', zh: '3D 手機遊戲開發期末簡報' },
      videoUrl: 'https://youtu.be/lzrNLRafMHg',
      videoId: 'lzrNLRafMHg',
      embedUrl: 'https://www.youtube.com/embed/lzrNLRafMHg',
    },
    {
      date: '12/05/2025',
      type: 'video',
      title: { en: '3D Shooter Gameplay', zh: '3D 射擊遊戲操作' },
      videoUrl: 'https://youtu.be/Rf3YQ5JqGh8',
      videoId: 'Rf3YQ5JqGh8',
      embedUrl: 'https://www.youtube.com/embed/Rf3YQ5JqGh8',
    },
    {
      date: '02/05/2025',
      type: 'video',
      title: { en: '3D Runner Gameplay', zh: '3D 跑酷遊戲操作' },
      videoUrl: 'https://youtube.com/shorts/TjW_fJ801HU',
      videoId: 'TjW_fJ801HU',
      embedUrl: 'https://www.youtube.com/embed/TjW_fJ801HU',
    },
    {
      date: '01/01/2025',
      type: 'milestone',
      title: { en: 'Development Started', zh: '開發開始' },
      description: { en: 'Started 3D game development in Unity', zh: '開始使用 Unity 進行 3D 遊戲開發' },
    },
  ],

  '2d-puzzle': [
    {
      date: '20/11/2025',
      type: 'video',
      title: { en: 'Puzzle Game Assignment 2', zh: '益智遊戲作業 2' },
      videoUrl: 'https://youtube.com/shorts/03PpUxeYq78',
      videoId: '03PpUxeYq78',
      embedUrl: 'https://www.youtube.com/embed/03PpUxeYq78',
    },
    {
      date: '02/11/2025',
      type: 'video',
      title: { en: 'Puzzle Game Assignment 1', zh: '益智遊戲作業 1' },
      videoUrl: 'https://youtube.com/shorts/7mM4UJyezGw',
      videoId: '7mM4UJyezGw',
      embedUrl: 'https://www.youtube.com/embed/7mM4UJyezGw',
    },
    {
      date: '01/09/2025',
      type: 'milestone',
      title: { en: 'Development Started', zh: '開發開始' },
      description: { en: 'Started 2D puzzle game development', zh: '開始 2D 益智遊戲開發' },
    },
  ],

  '2d-chess': [
    {
      date: '23/12/2025',
      type: 'video',
      title: { en: 'Chess Game Demo', zh: '國際象棋演示' },
      description: { en: 'Demonstration of 2D chess game mechanics', zh: '2D 國際象棋遊戲機制演示' },
      videoUrl: 'https://youtu.be/oeiCjfTcAOY',
      videoId: 'oeiCjfTcAOY',
      embedUrl: 'https://www.youtube.com/embed/oeiCjfTcAOY',
    },
    {
      date: '22/12/2025',
      type: 'video',
      title: { en: '2D Game Presentation', zh: '2D 遊戲簡報' },
      description: { en: 'Project report presentation', zh: '項目報告簡報' },
      videoUrl: 'https://youtu.be/Ftt7lIPo0Jc',
      videoId: 'Ftt7lIPo0Jc',
      embedUrl: 'https://www.youtube.com/embed/Ftt7lIPo0Jc',
    },
    {
      date: '01/09/2025',
      type: 'milestone',
      title: { en: 'Development Started', zh: '開發開始' },
      description: { en: 'Started 2D chess game project', zh: '開始 2D 國際象棋項目' },
    },
  ],

  'ai-annotation': [
    {
      date: '26/12/2025',
      type: 'video',
      title: { en: 'SE Assignment 2 Operation', zh: 'SE 作業 2 操作演示' },
      description: { en: 'Software Engineering assignment demonstration', zh: '軟件工程作業演示' },
      videoUrl: 'https://youtu.be/mgE3mYxxpYw',
      videoId: 'mgE3mYxxpYw',
      embedUrl: 'https://www.youtube.com/embed/mgE3mYxxpYw',
    },
    {
      date: '01/09/2025',
      type: 'milestone',
      title: { en: 'Development Started', zh: '開發開始' },
      description: { en: 'Started TDD-based AI annotation tool development', zh: '開始基於 TDD 的 AI 標註工具開發' },
    },
  ],

  'zuul-game': [
    {
      date: '01/01/2025',
      type: 'milestone',
      title: { en: 'Project Completed', zh: '項目完成' },
      description: { en: 'Completed Arcane-themed text adventure game', zh: '完成奧術主題文字冒險遊戲' },
    },
    {
      date: '01/09/2024',
      type: 'milestone',
      title: { en: 'Development Started', zh: '開發開始' },
      description: { en: 'Started MVC-based Java game development', zh: '開始基於 MVC 的 Java 遊戲開發' },
    },
  ],

  'card-game': [
    {
      date: '18/12/2024',
      type: 'video',
      title: { en: 'Card Matching Game Demo', zh: '翻牌配對遊戲演示' },
      description: { en: 'Java Swing card matching game demonstration', zh: 'Java Swing 翻牌配對遊戲演示' },
      videoUrl: 'https://youtu.be/yxGm6arDMzs',
      videoId: 'yxGm6arDMzs',
      embedUrl: 'https://www.youtube.com/embed/yxGm6arDMzs',
    },
    {
      date: '01/09/2024',
      type: 'milestone',
      title: { en: 'Development Started', zh: '開發開始' },
      description: { en: 'Started Java programming coursework', zh: '開始 Java 編程課程作業' },
    },
  ],

  'linux-server': [
    {
      date: '08/05/2025',
      type: 'video',
      title: { en: 'Linux Server Presentation', zh: 'Linux 伺服器簡報' },
      description: { en: 'Open System Administration final presentation', zh: '開放系統管理期末簡報' },
      videoUrl: 'https://youtu.be/U9pubOUTG-8',
      videoId: 'U9pubOUTG-8',
      embedUrl: 'https://www.youtube.com/embed/U9pubOUTG-8',
    },
    {
      date: '01/01/2025',
      type: 'milestone',
      title: { en: 'Development Started', zh: '開發開始' },
      description: { en: 'Started Linux server administration project', zh: '開始 Linux 伺服器管理項目' },
    },
  ],
};

// Helper to get YouTube thumbnail URL
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

// Sort timeline events by date (newest first)
export function sortTimelineEvents(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => {
    const parseDate = (d: string) => {
      const [day, month, year] = d.split('/').map(Number);
      return new Date(year, month - 1, day).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });
}

// Format date for display
export function formatTimelineDate(dateStr: string, locale: string): string {
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  if (locale === 'zh-hk') {
    return `${year}年${month}月${day}日`;
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
