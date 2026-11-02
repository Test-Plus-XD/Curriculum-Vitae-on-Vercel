import { bi, type Bilingual } from './i18n-text';

export type Category = 'mobile' | 'web' | 'game' | 'backend' | 'ai';
export const CATEGORIES: Category[] = ['mobile', 'web', 'game', 'backend', 'ai'];

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
  decimals?: number;
  suffix?: string;
  label: Bilingual;
}

// Marks a project co-authored in someone else's repository; private ones must have no `repos`.
export interface CoAuthorship {
  owner: string;
  visibility: 'public' | 'private';
}

export interface Project {
  id: string;
  title: Bilingual;
  coauthored?: CoAuthorship;
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
    tagline: bi('Final Year Project · One developer, AI coding agents', '畢業專題・一位開發者與 AI 編碼代理合作'),
    categories: ['mobile', 'backend'],
    summary: bi(
      'A full-stack, cross-platform vegetarian restaurant discovery, booking and promotion platform for Hong Kong, built by one human developer working with AI coding agents.',
      '為香港而設的全端跨平台素食餐廳搜尋、訂座及推廣平台，由一位開發者與 AI 編碼代理合作開發。',
    ),
    description: bi(
      'A full-stack, cross-platform vegetarian restaurant discovery, booking and promotion platform for Hong Kong, built as the Final Year Project by one human developer working with AI coding agents. It supports bilingual diner and restaurant-owner workflows across a web app (also packaged for Android), a Flutter Android app and a native iOS app on one shared backend, including Google sign-in through Firebase, reservation updates through push notifications, AI-assisted questions about restaurant menus, real-time diner–owner chat, QR-code menu scanning in every app (with menu deep links on iOS and in the web app’s Android build) and restaurant advertisements paid through Stripe-hosted checkout, with the post-payment status check built into the iOS app, plus location-based services.',
      '一個全面的全端跨平台素食餐廳搜尋、訂座及推廣平台，為畢業專題，由一位開發者與 AI 編碼代理合作完成。平台為網頁應用程式（另有 Android 版本）、Flutter Android 應用程式及原生 iOS 應用程式提供雙語的食客及餐廳東主流程，三者共用同一後端，包括透過 Firebase 的 Google 登入、以推送通知更新訂座狀態、以 AI 解答餐牌相關問題、食客與東主之間的即時聊天、三個應用程式皆有的 QR 碼餐牌掃描（iOS 及網頁應用程式的 Android 版本另支援餐牌深層連結），以及以 Stripe 託管結帳頁面付款的餐廳廣告（付款後的狀態核實見於 iOS 應用程式），並提供定位服務。',
    ),
    details: [
      bi(
        'Handled architecture, frontend, backend, real-time systems, third-party integrations and deployment across the full development lifecycle.',
        '負責整個開發週期的架構、前端、後端、即時系統、第三方整合及部署。',
      ),
      bi(
        'Backend: Express.js REST API on Vercel; Socket.IO real-time server on Railway; Firebase Authentication, Firestore and Storage; Algolia search; Stripe payments; Google Gemini AI.',
        '後端：部署於 Vercel 的 Express.js REST API；部署於 Railway 的 Socket.IO 即時伺服器；Firebase 驗證、Firestore 及 Storage；Algolia 搜尋；Stripe 付款；Google Gemini AI。',
      ),
      bi(
        'Clients: an Ionic and Angular web app (also packaged for Android with Capacitor), a Flutter Android app and a native SwiftUI iOS app. Maps are Google Maps in the web and Flutter apps and Apple MapKit on iOS.',
        '客戶端：Ionic 及 Angular 網頁應用程式（以 Capacitor 另行打包成 Android 版本）、Flutter Android 應用程式，以及原生 SwiftUI iOS 應用程式。地圖方面，網頁及 Flutter 應用程式使用 Google Maps，iOS 則使用 Apple MapKit。',
      ),
    ],
    courses: ['06CIT4002', '03CIT4044', '03CIT4047', '03CIT4043'],
    tech: ['Flutter / Dart', 'Ionic / Angular', 'TypeScript', 'Swift', 'SwiftUI', 'MapKit', 'Express.js', 'Socket.IO', 'Firebase', 'Google Gemini AI', 'Algolia', 'Stripe', 'Google Maps API'],
    repos: [
      { label: bi('Ionic PWA', 'Ionic PWA'), url: 'https://github.com/Test-Plus-XD/Cross-Platform-Assignment' },
      { label: bi('Flutter Android', 'Flutter Android'), url: 'https://github.com/Test-Plus-XD/Android-Assignment' },
      { label: bi('Swift iOS', 'Swift iOS'), url: 'https://github.com/Test-Plus-XD/iOS-Assignment' },
    ],
    live: { url: 'https://cross-platform-assignment.vercel.app/home', label: bi('Launch the live PWA', '開啟 PWA 網上版') },
    platforms: [
      { name: bi('Ionic / Angular PWA', 'Ionic / Angular 漸進式網頁應用'), stack: 'Ionic · Angular · TypeScript · Google Maps', course: '03CIT4044', primary: true },
      { name: bi('Flutter Android app', 'Flutter Android 應用程式'), stack: 'Flutter · Dart · Google Maps', course: '03CIT4047' },
      { name: bi('Native Swift iOS app', '原生 Swift iOS 應用程式'), stack: 'Swift · SwiftUI · MapKit', course: '03CIT4043' },
      { name: bi('Vercel backend API', 'Vercel 後端 API'), stack: 'Express.js · Firebase · Algolia · Stripe · Gemini' },
      { name: bi('Railway real-time server', 'Railway 即時伺服器'), stack: 'Socket.IO' },
    ],
    milestones: [
      { date: '2025-09-25', title: bi('Ionic web app project set up', 'Ionic 網頁應用程式專案建立') },
      { date: '2025-11-26', title: bi('Real-time chat moved into its own Railway server', '即時聊天獨立成 Railway 伺服器') },
      { date: '2025-11-27', title: bi('Socket.IO chat and the Gemini assistant added to the web app', '網頁應用程式加入 Socket.IO 聊天及 Gemini 助理') },
      { date: '2026-02-10', title: bi('Native Swift iOS app started', '原生 Swift iOS 應用程式開發展開') },
      { date: '2026-03-04', title: bi('Advertisement routes and Stripe-paid placement added to the API and web app', 'API 及網頁應用程式加入廣告路由及 Stripe 付費刊登') },
      { date: '2026-04-10', title: bi('Android build of the web app added through Capacitor', '以 Capacitor 加入網頁應用程式的 Android 版本') },
      { date: '2026-04-15', title: bi('Chat messages broadcast before saving, with repeated writes recognised', '聊天訊息改為先廣播後儲存，並可識別重複寫入') },
      { date: '2026-04-24', title: bi('iOS push notifications and Stripe payment verification added', 'iOS 加入推送通知及 Stripe 付款核實') },
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
    tagline: bi('Group coursework · PHP to Firebase', '小組課業・由 PHP 轉向 Firebase'),
    categories: ['web', 'backend'],
    summary: bi(
      'A group coursework game store, Vapor, run on a local server: Firebase sign-in, Stripe Checkout, a personal library and an admin dashboard. It began on PHP and MySQL and moved to Cloud Firestore behind a PHP REST layer.',
      '小組課業遊戲商店「烝汽坪檯」（Vapor），於本地伺服器運行，設有 Firebase 登入、Stripe Checkout、個人遊戲庫及管理後台。項目由 PHP 及 MySQL 起步，其後在 PHP REST 層背後轉用 Cloud Firestore。',
    ),
    description: bi(
      'A Steam-style game store built for the Technology for Web Development and PHP Application Development courses. Visitors sign in with Firebase, search a catalogue, pay through Stripe Checkout and keep their games in a personal library, while admins manage users, products and purchases from a dashboard with a revenue chart. It started as group work between four students on PHP and MySQL. By the final report, which names two students, the data had moved to Cloud Firestore and Node.js services had been added for Stripe and a Gemini chat assistant; the report declares generative AI involvement at the "Full AI" level, where AI is used to complete most of the areas of the project, and credits ChatGPT and Gemini.',
      '為「網絡開發技術」及「PHP 應用開發」兩科製作的 Steam 風格遊戲商店。用戶以 Firebase 登入、搜尋商品目錄、經 Stripe Checkout 付款，並在個人遊戲庫保存已購遊戲；管理員則可在設有收入圖表的後台管理用戶、商品及購買紀錄。項目最初由四名同學以 PHP 及 MySQL 分工開發；最終報告署名兩人，資料轉移至 Cloud Firestore，並加入處理 Stripe 及 Gemini 聊天助理的 Node.js 服務，報告亦聲明生成式 AI 的參與程度為「Full AI」級別，即以 AI 完成項目大部分範疇，並註明獲 ChatGPT 及 Gemini 協助。',
    ),
    courses: ['03CIT4053', '03CIT4054'],
    tech: ['PHP', 'JavaScript', 'Cloud Firestore', 'Firebase Authentication', 'Stripe', 'Node.js', 'Express.js', 'MySQL', 'Bootstrap 5', 'Google Gemini AI', 'Chart.js', 'Sentry', 'reCAPTCHA', 'webpack', 'Composer', 'HTML5', 'CSS3'],
    repos: [{ label: bi('Web Assignment'), url: 'https://github.com/Test-Plus-XD/Web-Assignment' }],
    milestones: [
      { date: '2025-02-25', title: bi('First upload: PHP store on MySQL with its admin pages', '首次上載：以 MySQL 運行的 PHP 商店及其管理頁面') },
      { date: '2025-03-19', title: bi('Composer added and Sentry error monitoring wired in', '加入 Composer 及 Sentry 錯誤監控') },
      { date: '2025-03-26', title: bi('Firebase sign-in, reCAPTCHA and the Node.js Stripe service uploaded', '上載 Firebase 登入、reCAPTCHA 及 Node.js Stripe 服務') },
      { date: '2025-04-22', title: bi('Firebase Admin SDK added for deleting accounts', '加入 Firebase Admin SDK 以刪除帳戶') },
      { date: '2025-04-22', title: bi('Stripe return check and Hong Kong time handling uploaded', '上載 Stripe 返回核實及香港時間處理') },
      { date: '2025-04-22', title: bi('Firestore trait and purchases collection uploaded', '上載 Firestore trait 及購買紀錄集合') },
      { date: '2025-04-22', title: bi('Gemini service and MySQL-to-Firestore scripts added; PDO classes archived', '加入 Gemini 服務及 MySQL 轉 Firestore 腳本，並封存 PDO 類別') },
      { date: '2025-04-30', title: bi('Final fixes uploaded and project report committed', '上載最後修正並提交專題報告') },
    ],
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
    tagline: bi('Milk Tea Mayhem · Unity physics puzzle', 'Milk Tea Mayhem・Unity 物理解謎'),
    categories: ['mobile', 'game'],
    summary: bi(
      'Milk Tea Mayhem is a 60-second Unity mobile puzzle game: drag chains of matching bubble tea toppings across a live 2D physics board.',
      '《Milk Tea Mayhem》是以 Unity 開發的 60 秒手機解謎遊戲，玩家在即時 2D 物理棋盤上拖曳連線，消除相同的珍珠奶茶配料。',
    ),
    description: bi(
      'Milk Tea Mayhem is a 60-second Unity 6 mobile puzzle game in which players drag chains of matching bubble tea toppings across a live 2D physics board, stirred by a motorised straw and refilled by an animated ladle.',
      '《Milk Tea Mayhem》是一款以 Unity 6 開發的 60 秒手機解謎遊戲。玩家在即時 2D 物理棋盤上拖曳，連起相同的珍珠奶茶配料；馬達飲管不斷攪動杯中配料，消除後的空缺則由動畫湯勺補上。',
    ),
    details: [
      bi('Line of sight: a raycast between links rejects a connection blocked by a different topping.', '視線阻擋：以射線偵測檢查連結之間的路徑，被其他配料擋住便不能相連。'),
      bi('Long chains pay off: ×2 from 6 links, ×3 from 9, a pudding bomb from 7 and 5 extra seconds from 9.', '長連線有獎勵：6 連起分數乘 2，9 連起乘 3，7 連起獲布甸炸彈，9 連起加時 5 秒。'),
      bi('Refills ride a keyframed ladle: toppings leave physics, parent to it and return to physics in the cup.', '補料由關鍵影格湯勺運送：配料暫離物理模擬，隨湯勺移動，到杯口再交還物理引擎。'),
      bi('Bomb clears report through an event, so one clear makes one combined refill request.', '炸彈以事件回報消除數量，每次消除只提出一次合併的補料要求。'),
    ],
    courses: ['03CIT4045'],
    tech: ['Unity', 'C#', 'Unity Physics 2D', 'Animator', 'Coroutines'],
    repos: [{ label: bi('2D Puzzle Game Assignment'), url: 'https://github.com/Test-Plus-XD/2D-Puzzle-Game-Assignment' }],
    milestones: [
      { date: '2025-11-18', title: bi('25-topping floor added; last code commit', '加入 25 件配料下限；最後一次程式碼提交') },
      { date: '2025-11-17', title: bi('Ladle refill: sticky toppings, a new clip and a reworked spawner', '湯勺補料：配料黏附、新動畫及重構 Spawner') },
      { date: '2025-11-17', title: bi('Chain rules rebuilt; event-driven bomb refill; the straw’s wind now switches on buoyancy in the tea', '重建連線規則；以事件驅動炸彈補料；飲管吹風時啟動奶茶浮力') },
      { date: '2025-11-13', title: bi('Assignment 2 features: score, bomb, Dual Connect topping, swap skill and time extension', '作業二功能：計分、炸彈、Dual Connect 配料、交換技能及延長時間') },
      { date: '2025-10-23', title: bi('Game manager, countdown pop-ups and straw wind: a full round of play', '遊戲管理、倒數彈出效果及飲管吹風：可玩完整一局') },
      { date: '2025-10-21', title: bi('Dragging camera added', '加入跟隨拖曳的鏡頭') },
      { date: '2025-10-16', title: bi('Core loop: drag chaining, spawner and removable toppings', '核心循環：拖曳連線、生成器及可消除的配料') },
      { date: '2025-10-15', title: bi('Repository created; the motorised straw is the first script', '建立儲存庫；首個腳本為馬達飲管') },
    ],
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
      bi(
        'Each of four pawn types picks its next tile by weighted random choice over axial distance to the player, with the weights held in a ScriptableObject.',
        '四種棋子各自按與玩家的軸向距離，以加權隨機方式選擇下一格，權重集中存放於 ScriptableObject。',
      ),
      bi(
        'On the board, aim comes from walking the six axial rays and scoring tiles around the player; in the platformer duel, guns track the player and a raycast clips the aim line.',
        '棋盤上沿六條軸線逐格檢查，為玩家周圍的格位評分以決定瞄準方向；平台對決中槍械則直接追蹤玩家，並以射線偵測截短瞄準線。',
      ),
    ],
    courses: ['03CIT4045'],
    tech: ['Unity', 'C#'],
    repos: [{ label: bi('2D Chess Project'), url: 'https://github.com/Test-Plus-XD/2D-Chess-Project' }],
    milestones: [
      { date: '2025-12-23', title: bi('Multi-ray ledge handling added to the platform AI', '平台 AI 加入多射線邊緣偵測') },
      { date: '2025-12-21', title: bi('Five levels tuned', '調校五個關卡') },
      { date: '2025-12-21', title: bi('Axial aim scoring, red tile warnings and fire-move-aim turn order', '加入軸向瞄準評分、紅色格位預告及「開火、移動、瞄準」回合次序') },
      { date: '2025-12-11', title: bi('Standoff arena rewritten with the axial mirror fix', '重寫對決競技場並修正軸向鏡像') },
      { date: '2025-12-11', title: bi('AI values moved into a ScriptableObject', 'AI 數值移入 ScriptableObject') },
      { date: '2025-12-10', title: bi('Five opponent modifiers and per-type firing patterns', '加入五種對手強化效果及各類型射擊模式') },
      { date: '2025-12-10', title: bi('Scripts consolidated from 27 to 15', '腳本由 27 個整合為 15 個') },
      { date: '2025-12-10', title: bi('Standoff stage prototype', '對決階段原型') },
      { date: '2025-09-16', title: bi('First commits: hex grid, swipe movement and four pawn types', '首次提交：六角格、滑動移動及四種棋子') },
    ],
    videos: [
      { url: 'https://youtu.be/Ftt7lIPo0Jc', date: '2025-12-22', kind: 'presentation', title: bi('2D Game Presentation', '2D 遊戲簡報') },
      { url: 'https://youtu.be/oeiCjfTcAOY', date: '2025-12-23', kind: 'operation', title: bi('Chess Game Demo', '棋類遊戲示範') },
    ],
  },
  {
    id: 'ai-annotation',
    title: bi('AI Annotation Tool', 'AI 標註工具'),
    tagline: bi('Next.js · Test-first commits', 'Next.js・測試先行提交'),
    categories: ['web', 'backend'],
    summary: bi(
      'A full-stack web application for uploading images and labelling them for AI datasets, rebuilt from an Express prototype with tests committed ahead of most features.',
      '用於上載圖片並為 AI 數據集標註的全端網頁應用程式，由 Express 原型重建，大部分功能的測試均先於程式碼提交。',
    ),
    description: bi(
      'An AI dataset annotation tool: images are uploaded, tagged with labels and confidence scores, searched and filtered, and exported or imported as CSV. Version 2 rebuilds an Express coursework app in Next.js over three days of commits, with AI coding assistance and tests committed ahead of 25 of its 34 feature commits.',
      '一個 AI 數據集標註工具：用戶可上載圖片、加上標籤及信心分數、搜尋及篩選，並以 CSV 匯出或匯入。第二版以 Next.js 重建原有的 Express 課程作業，提交紀錄橫跨三天，過程使用 AI 編程輔助；34 次功能提交之中，有 25 次先提交測試。',
    ),
    details: [
      bi('Frontend: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4.', '前端：Next.js 16、React 19、TypeScript 5、Tailwind CSS 4。'),
      bi(
        'Backend: Next.js API routes with better-sqlite3 (SQLite) and a custom data-access layer on Node.js.',
        '後端：Next.js API 路由，配合 better-sqlite3（SQLite）及自訂數據存取層，運行於 Node.js。',
      ),
      bi(
        'Firebase Authentication, Firebase Storage and a Google Gemini chatbot, with uploads, email sign-in and chat routed through a shared Vercel API.',
        'Firebase 驗證、Firebase Storage 及 Google Gemini 聊天機械人；上載、電郵登入及聊天均經由共用的 Vercel API 處理。',
      ),
      bi(
        'Features: paginated gallery, drag-and-drop upload, label confidence scores, search and label filtering, CSV export and import, and creator and last-editor display.',
        '功能：分頁圖片庫、拖放上載、標籤信心分數、搜尋及標籤篩選、CSV 匯出及匯入，以及顯示建立者和最後編輯者。',
      ),
      bi(
        'Testing: 451 test cases written with Jest and React Testing Library, Mocha and Chai for the database and API, fast-check property tests and a Playwright suite of 12 scenarios for three browsers.',
        '測試：已編寫 451 個測試案例，使用 Jest 配合 React Testing Library、以 Mocha 及 Chai 測試數據庫及 API，並設有 fast-check 屬性測試，以及針對三種瀏覽器的 12 個 Playwright 情境。',
      ),
    ],
    courses: ['03CIT4042'],
    tech: ['Next.js', 'JavaScript', 'TypeScript', 'SQLite', 'Firebase', 'Jest / Mocha / Playwright', 'fast-check'],
    repos: [
      {
        label: bi('AI Annotation Tool v2'),
        url: 'https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/tree/main/AI%20Annotation%20Tool%20v2',
      },
      {
        label: bi('AI Annotation Tool v1'),
        url: 'https://github.com/Test-Plus-XD/Software-Engineering-Git-Assignment/tree/main/AI%20Annotation%20Tool',
      },
    ],
    milestones: [
      { date: '2025-12-25', title: bi('CSV export and import added', '加入 CSV 匯出及匯入') },
      { date: '2025-12-24', title: bi('End-to-end suite written, then the integration commit', '先編寫端對端測試，再提交整合') },
      { date: '2025-12-24', title: bi('Sign-in and Gemini chat added, tests first', '加入登入及 Gemini 聊天，測試先行') },
      { date: '2025-12-23', title: bi('First property-based tests; React component phase begins', '首批屬性測試；React 元件階段展開') },
      { date: '2025-12-23', title: bi('Hand-written database wrapper replaces the ORM library', '自行編寫的數據庫封裝層取代 ORM 程式庫') },
      { date: '2025-12-23', title: bi('Version 2 begins in Next.js; first failing-test commit', '第二版以 Next.js 展開；首次提交失敗測試') },
      { date: '2025-11-18', title: bi('Version 1 begins: SQLite schema and Express server', '第一版展開：SQLite 資料表結構及 Express 伺服器') },
      { date: '2025-09-16', title: bi('Course repository created', '建立課程程式庫') },
    ],
    videos: [
      { url: 'https://youtu.be/mgE3mYxxpYw', date: '2025-12-26', kind: 'operation', title: bi('Software Engineering Assignment 2 Operation', '軟件工程作業二操作示範') },
    ],
  },
  {
    id: 'yolo-object-detection',
    title: bi('YOLO Object Detection (YOLO26)', 'YOLO 物件偵測（YOLO26）'),
    coauthored: { owner: 'keithku321', visibility: 'public' },
    tagline: bi('Collaboration · Supporting a final-year team of four', '協作項目・協助四人畢業專題團隊'),
    categories: ['ai'],
    summary: bi(
      'Supporting a four-person HKMU final-year team on how well vision models find objects underwater, in adverse weather, at small scale and under camouflage: the shared code, built with Claude Code, and the real-data baselines of all four plans.',
      '協助一支四人香港都會大學畢業專題團隊，研究視覺模型在水底、惡劣天氣、細小物件及偽裝情況下的偵測能力：借助 Claude Code 建立共用程式碼，並完成全部四個方案的真實數據基準模型。',
    ),
    description: bi(
      'A four-person HKMU final-year team is studying how well computer-vision models find objects underwater, in adverse weather, at small scale and under camouflage, in one shared repository with a four-tab demo app. My part, built with Claude Code, was the shared training, evaluation and results code and the first real-data baseline: YOLO26n on Brackish, 20 epochs, one seed, validation mAP50 0.584 and mAP50-95 0.345. Crab AP was 0.000 in that same run, and the cause is still unknown. I then ran the Phase 1 baselines of all four plans through a remote session on a teammate’s faster PC (PR #4, still open), seed 0 only: mAP50 0.635 on DAWN, 0.291 on VisDrone and S-measure 0.853 on COD10K. These are baselines: the team’s attention, distillation and edge methods have not yet been trained on real data.',
      '一支四人香港都會大學畢業專題團隊正研究電腦視覺模型在水底、惡劣天氣、細小物件及偽裝情況下的偵測能力，所有工作集中於同一程式庫，並設有四分頁示範程式。本人借助 Claude Code 負責共用的訓練、評估及結果紀錄程式碼，並完成首個真實數據基準模型：YOLO26n 於 Brackish 訓練 20 個 epoch，單一隨機種子，驗證 mAP50 為 0.584、mAP50-95 為 0.345。同一次訓練中，蟹的 AP 為 0.000，原因至今未明。其後本人透過遙距連線，在隊友效能較佳的電腦上完成全部四個方案的第一階段基準訓練（PR #4，尚未合併），僅使用種子 0：DAWN 的 mAP50 為 0.635、VisDrone 為 0.291，COD10K 的 S-measure 為 0.853。這些只是基準模型：團隊的注意力、知識蒸餾及邊緣方法尚未以真實數據訓練。',
    ),
    courses: [],
    tech: ['Python', 'PyTorch', 'Ultralytics YOLO26', 'OpenCV', 'Gradio', 'Matplotlib', 'timm', 'pycocotools', 'PySODMetrics', 'pytest'],
    repos: [{ label: bi('object-detection (keithku321)'), url: 'https://github.com/keithku321/object-detection' }],
    milestones: [
      { date: '2026-10-23', title: bi('Phase 1 baselines of all four plans recorded (PR #4, open)', '全部四個方案的第一階段基準模型完成紀錄（PR #4，尚未合併）') },
      { date: '2026-10-22', title: bi('Underwater baseline merged into main (PR #2)', '水底基準模型併入 main 分支（PR #2）') },
      { date: '2026-10-22', title: bi('All-plans training driver drafted; PR #3 closed unmerged', '全方案訓練驅動腳本完成初稿；PR #3 未經合併便關閉') },
      { date: '2026-10-18', title: bi('20-epoch underwater baseline: mAP50 0.584, one seed', '20 個 epoch 水底基準模型：mAP50 0.584，單一隨機種子') },
      { date: '2026-10-17', title: bi('Results plots and first real training epoch', '加入結果圖表，完成首個真實訓練 epoch') },
      { date: '2026-10-17', title: bi('Shared code merged into main (PR #1)', '共用程式碼併入 main 分支（PR #1）') },
      { date: '2026-10-17', title: bi('Brackish re-split by video clip', 'Brackish 按影片片段重新切分') },
      { date: '2026-10-11', title: bi('Four-plan code drafted; PR #1 opened', '四個方案的程式碼完成初稿；開啟 PR #1') },
      { date: '2026-10-11', title: bi('Project governance documents added', '加入項目管治文件') },
    ],
    videos: [],
  },
  {
    id: 'gaming-ai-companion',
    title: bi('Gaming AI Companion “Kaguya”', '遊戲 AI 伴侶「かぐや」'),
    coauthored: { owner: 'keithku321', visibility: 'private' },
    tagline: bi('Python · avatar motion for VTube Studio', 'Python・VTube Studio 虛擬形象動作'),
    categories: ['ai'],
    summary: bi(
      'A local-first AI companion that watches gameplay, speaks and chats on Discord with memory and a Live2D avatar, using local models by default, with an optional cloud fallback. Built mainly by keithku321; I contributed the avatar’s motion and Discord picture reading.',
      '一個以本地運行為先的 AI 伴侶，能觀看遊戲畫面、說話，並在 Discord 上以記憶及 Live2D 虛擬形象聊天；預設使用本地模型，並可選用雲端後備。項目主要由 keithku321 開發，本人負責虛擬形象的動作部分及 Discord 圖片理解。',
    ),
    description: bi(
      'A private Windows companion project, built mainly by keithku321, that watches a game on screen, talks about it, chats on Discord with memory and appears as an animated Live2D character, using local models by default, with an optional cloud fallback. My part is the motion layer that makes the character blink, look around and gesture as it talks, picture reading in Discord chats through a local vision model, and an install path for newer Python versions. The stack listed here is the whole project’s; I worked in Python against the VTube Studio API. The repository is private, so this page carries prose and counts only.',
      '一個主要由 keithku321 開發的私人 Windows 伴侶項目，能觀看畫面上的遊戲並加以評論，在 Discord 上以記憶聊天，並以動態 Live2D 角色現身；預設使用本地模型，並可選用雲端後備。本人負責令角色眨眼、環顧及隨說話做出手勢的動作層、透過本地視覺模型理解 Discord 聊天中的圖片，以及較新 Python 版本的安裝路徑。此處列出的技術屬於整個項目；本人的工作以 Python 配合 VTube Studio API 進行。由於程式庫為私人性質，本頁只提供文字說明及統計數字。',
    ),
    courses: [],
    tech: ['Python', 'PyTorch', 'Ollama', 'GPT-SoVITS', 'faster-whisper', 'discord.py', 'VTube Studio API', 'OpenCV', 'pytest'],
    repos: [],
    milestones: [
      { date: '2026-10-19', title: bi('Discord picture reading merged', 'Discord 圖片理解功能合併') },
      { date: '2026-10-17', title: bi('Mouse glances made to give way to speech gestures', '視線跟隨滑鼠改為讓路給語音手勢') },
      { date: '2026-10-17', title: bi('Text-driven mouth for lines nobody speaks aloud', '為無人讀出的台詞加入文字驅動口型') },
      { date: '2026-10-17', title: bi('Motion engine added', '加入動作引擎') },
      { date: '2026-10-16', title: bi('My first commit: install path for Python 3.13 and 3.14', '本人首次提交：Python 3.13 及 3.14 安裝路徑') },
      { date: '2026-10-09', title: bi('keithku321 starts the project', 'keithku321 展開項目') },
    ],
    videos: [],
  },
  {
    id: 'dsh-autoreply',
    title: bi('Discord Auto-Reply for DeepSeek Harness', 'DeepSeek Harness Discord 自動回覆外掛'),
    tagline: bi('Draft replies · Tool guard · Local bridge', '回覆草稿・工具防護・本機橋接'),
    categories: ['ai', 'backend'],
    summary: bi(
      'An AI-assisted TypeScript plugin for the DeepSeek Harness desktop app that drafts replies to Discord messages from a persona prompt and a local style file, and leaves each one in the message box for the user to read and send.',
      '一個在 AI 協助下以 TypeScript 編寫的 DeepSeek Harness 桌面應用程式外掛，按人設提示及本機風格檔草擬 Discord 回覆，並將每則回覆留在訊息輸入框，由用戶閱讀後自行發送。',
    ),
    description: bi(
      "The plugin connects to the Discord desktop client through a debugging port restricted to the same computer, and follows Discord's own message events through a bridge injected into the page. Each chat has its own harness session on a DeepSeek model, with recent chat context, a persona prompt and a local style file. By default each reply is placed in the message box for the user to read, edit and send; sending automatically is opt-in. Automating a user account is against Discord's Terms of Service and can get the account banned: the project's README says so at the top, and draft mode does not change that.",
      '外掛透過僅限本機的除錯連接埠接駁 Discord 桌面用戶端，並以注入頁面的橋接程式接收 Discord 本身的訊息事件。每個聊天室各有一個使用 DeepSeek 模型的 Harness 工作階段，並附上近期對話內容、人設提示及本機風格檔。預設情況下，每則回覆都會放在訊息輸入框，由用戶閱讀、修改後自行發送；自動發送須自行開啟。自動化操作用戶帳戶違反 Discord 服務條款，帳戶亦可能因此被封禁：項目的 README 在開頭已清楚列明，草稿模式亦不會改變這一點。',
    ),
    details: [
      bi(
        "Friends' messages are treated as untrusted input: a guard at harness level refuses every tool call from these sessions, so the model can only answer in text.",
        '朋友的訊息一律視為不可信輸入：工具防護會在 Harness 層面拒絕這些工作階段的所有工具呼叫，模型只能以文字回應。',
      ),
      bi(
        "Messages and images go to DeepSeek through the user's own DeepSeek Harness account, so the model does not run on the local computer. Links are removed first.",
        '訊息及圖片會經用戶本人的 DeepSeek Harness 帳戶傳送至 DeepSeek，模型並非在本機運行。連結會先行移除。',
      ),
      bi(
        'Works inside the logged-in Discord page and reads or stores no Discord token. It needs Windows, Discord PTB and BetterDiscord.',
        '在已登入的 Discord 頁面內運作，不會讀取或儲存 Discord 權杖。須配合 Windows、Discord PTB 及 BetterDiscord 使用。',
      ),
      bi(
        'Chat data stays out of the public repository: the style file and session state live in the user\'s home folder, and the project\'s rules forbid committing them.',
        '聊天資料不會進入公開程式庫：風格檔及工作階段狀態存放於用戶的主資料夾，項目規則亦禁止提交這些內容。',
      ),
      bi(
        'Written with AI assistance: Claude is the credited co-author on 8 of the 9 commits, all of which fall on one day.',
        '在 AI 協助下編寫：9 次提交中有 8 次列明 Claude 為共同作者，全部提交均在同一天完成。',
      ),
    ],
    courses: [],
    tech: ['TypeScript', 'Node.js', 'Chrome DevTools Protocol', 'DeepSeek Harness', 'Cordis', 'BetterDiscord'],
    repos: [{ label: bi('Plugin source', '外掛原始碼'), url: 'https://github.com/Test-Plus-XD/DSH-Discord-AutoReply' }],
    milestones: [
      { date: '2026-10-24', title: bi('READMEs in three languages, with the ban warning at the top', '推出三語 README，並於開頭載明封禁警告') },
      { date: '2026-10-24', title: bi('Packaged as an installable plugin', '封裝為可安裝外掛') },
      { date: '2026-10-24', title: bi('Rewritten in TypeScript', '以 TypeScript 重寫') },
      { date: '2026-10-24', title: bi('First version', '首個版本') },
    ],
    videos: [],
  },
  {
    id: 'zuul-game',
    title: bi('Zuul Text Adventure Game', 'Zuul 文字冒險遊戲'),
    tagline: bi('Java · console text adventure', 'Java・主控台文字冒險'),
    categories: ['game'],
    summary: bi(
      'A Java console adventure extended from World of Zuul: ten rooms, weighted items and an NPC quest for the relic that wins the game.',
      '由 World of Zuul 擴展而成的 Java 主控台冒險遊戲：十個房間、設有重量的物品，以及向 NPC 換取致勝聖物的任務。',
    ),
    description: bi(
      'Quest for the Golden Relic is a console text adventure extended from the World of Zuul teaching project. The player moves through ten rooms, carries items within a weight limit, retraces steps with a back command and trades with an NPC for the relic that wins the game. Most player messages sit in a separate view class, in an MVC-style split.',
      '《Quest for the Golden Relic》是由教學項目 World of Zuul 擴展而成的主控台文字冒險遊戲。玩家穿梭十個房間，在負重上限內攜帶物品，以返回指令沿路折返，並向 NPC 換取致勝聖物。大部分玩家訊息集中於獨立的視圖類別，採用 MVC 式分層。',
    ),
    courses: ['03CIT4052'],
    tech: ['Java 23', 'Maven', 'MVC Pattern'],
    repos: [],
    milestones: [{ date: '2025-04-24', title: bi('Last local source edit and build', '最後一次本機修改及建置'), approximate: true }],
    videos: [],
  },
  {
    id: 'card-game',
    title: bi('Card Matching Game', '翻牌配對遊戲'),
    tagline: bi('Java Swing desktop game', 'Java Swing 桌面遊戲'),
    categories: ['game'],
    summary: bi(
      'A Java Swing memory game: flip numbered cards to find pairs across five levels of growing grids, with flip animations, a timer and background music.',
      '以 Java Swing 編寫的記憶遊戲：翻開數字卡牌尋找配對，共五個關卡，棋盤逐步擴大，設有翻牌動畫、計時及背景音樂。',
    ),
    description: bi(
      'A desktop memory game in Java 17 and Swing with no third-party libraries. Five levels grow the grid from 8 to 28 cards, each card paints and animates its own flip, a mismatch costs a point from level 2 onwards, and three looping tracks chosen by level play behind a flip sound effect.',
      '以 Java 17 及 Swing 編寫的桌面記憶遊戲，未使用第三方程式庫。五個關卡把棋盤由 8 張擴大至 28 張，每張卡牌自行繪製及播放翻牌動畫，第二關起配對失敗扣 1 分，並按關卡循環播放三段背景音樂，配合翻牌音效。',
    ),
    courses: ['03CIT4049'],
    tech: ['Java 17', 'Java Swing', 'Graphics2D', 'Java Sound', 'Maven'],
    repos: [{ label: bi('Card Matching Game'), url: 'https://github.com/Test-Plus-XD/NetBeans-Projects/tree/main/CardMatchingGame' }],
    milestones: [
      { date: '2024-09-01', title: bi('Java programming coursework began', 'Java 程序設計課業展開'), approximate: true },
      { date: '2025-02-25', title: bi('Source and assets published to GitHub', '原始碼及素材發佈至 GitHub') },
    ],
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
