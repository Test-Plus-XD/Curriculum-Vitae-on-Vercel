import { bi, type Bilingual } from './i18n-text';

export interface SkillGroup {
  id: string;
  label: Bilingual;
  items: Bilingual[];
}

const same = (names: string[]) => names.map((n) => bi(n));

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    label: bi('Languages & markup', '程式語言及標記語言'),
    items: same(['TypeScript / JavaScript', 'HTML5', 'CSS3', 'Dart', 'Swift', 'C# (Unity)', 'Python', 'PHP', 'Java', 'XML']),
  },
  {
    id: 'frameworks',
    label: bi('Frameworks & platforms', '框架及平台'),
    items: same(['Ionic / Angular', 'Flutter', 'Node.js', 'Express.js', 'Next.js', 'Unity 6', 'Gradio', 'discord.py']),
  },
  {
    id: 'ai',
    label: bi('AI & computer vision', '人工智能及電腦視覺'),
    items: [
      bi('PyTorch'),
      bi('Ultralytics YOLO'),
      bi('OpenCV'),
      bi('ONNX Runtime'),
      bi('Ollama (local LLM / vision)', 'Ollama（本地 LLM／視覺模型）'),
      bi('GPT-SoVITS'),
      bi('faster-whisper'),
    ],
  },
  {
    id: 'backend',
    label: bi('Backend & real-time', '後端及即時系統'),
    items: [bi('Firebase (Auth, Firestore, Storage)'), bi('Socket.IO'), bi('REST APIs', 'REST API'), bi('MySQL')],
  },
  {
    id: 'cloud',
    label: bi('Cloud & integrations', '雲端及第三方整合'),
    items: same(['Vercel', 'Railway', 'Google Cloud (Maps, Gemini AI, Search)', 'Stripe', 'Algolia', 'Cloudflare', 'VTube Studio API']),
  },
  {
    id: 'systems',
    label: bi('Game dev & systems', '遊戲開發及系統'),
    items: [
      bi('ScriptableObjects'),
      bi('NavMesh'),
      bi('Docker'),
      bi('NGINX'),
      bi('WireGuard VPN'),
      bi('Linux server administration', 'Linux 伺服器管理'),
      bi('Shell / Bash'),
      bi('Client-server architecture', '客戶端－伺服器架構'),
      bi('Networking protocols', '網絡協定'),
    ],
  },
  {
    id: 'tools',
    label: bi('Tools', '開發及創作工具'),
    items: same(['Claude Code / Codex', 'Visual Studio', 'Android Studio', 'Xcode', 'Git', 'pytest', 'Google Colab', 'Autodesk 3ds Max', 'Photoshop']),
  },
  {
    id: 'practices',
    label: bi('Practices & architecture', '開發實踐及架構'),
    items: [
      bi('Full-stack development', '全端開發'),
      bi('Progressive Web Apps', '漸進式網頁應用程式 (PWA)'),
      bi('Test-Driven Development', '測試驅動開發 (TDD)'),
      bi('MVC architecture', 'MVC 架構'),
      bi('Cross-platform apps', '跨平台應用開發'),
      bi('Real-time communication', '即時通訊'),
      bi('AI-assisted features', 'AI 輔助功能'),
      bi('Location-based services', '定位服務'),
      bi('Containerisation', '容器化及服務隔離'),
    ],
  },
];

export interface Experience {
  id: string;
  role: Bilingual;
  organisation: Bilingual;
  period: Bilingual;
  points: Bilingual[];
  /** Work agreed for a later phase of the contract, shown apart from current duties. */
  upcoming?: Bilingual;
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'field-project-engineer',
    role: bi('Field Project Engineer', '現場項目工程師'),
    organisation: bi('Primetech (intermediary) · end user HKT (PCCW)', 'Primetech（中介）・最終客戶：香港電訊（電訊盈科）'),
    period: bi('Sept 2026 – Present', '2026年9月 – 至今'),
    points: [
      bi(
        'Record IT device information (brand, model, serial number and related details) across the project.',
        '記錄 IT 項目中的設備資料（品牌、型號、序號等）。',
      ),
      bi('Track and record co-workers’ progress within the IT project.', '記錄 IT 項目團隊成員的工作進度。'),
      bi('Prepare documentation and reports in Microsoft Excel and Word.', '以 Microsoft Excel 及 Word 編製文件及報告。'),
      bi('Answer user enquiries by telephone.', '透過電話解答用戶查詢。'),
    ],
    upcoming: bi(
      'Next phase: installing and debugging Wi-Fi access points, Windows upgrades and computer data migration.',
      '下一階段：安裝及調試 Wi-Fi 無線接入點、Windows 系統升級及電腦數據遷移。',
    ),
  },
  {
    id: 'hotel-icon',
    role: bi('Casual Waiter, F&B Banqueting', '炒散侍應（薈宴部）'),
    organisation: bi('Hotel ICON', '唯港薈'),
    period: bi('Feb 2024 – Present', '2024年2月 – 至今'),
    points: [
      bi(
        'Food and beverage service in the Banquet Department of a Forbes Four-Star, MICHELIN Key-awarded hotel owned by The Hong Kong Polytechnic University.',
        '於香港理工大學擁有、獲福布斯四星及米芝蓮一鑰匙評級的酒店薈宴部提供餐飲服務。',
      ),
      bi(
        'Guest service in a fast-paced environment, building teamwork, communication and composure under pressure.',
        '於快節奏環境中接待賓客，培養團隊合作、溝通及臨危不亂的能力。',
      ),
    ],
  },
];

export const LANGUAGES: { name: Bilingual; level: Bilingual }[] = [
  { name: bi('Cantonese', '廣東話'), level: bi('Fluent (native)', '流利（母語）') },
  { name: bi('English', '英語'), level: bi('Proficient reading; conversational speaking', '閱讀能力佳，能作基本會話') },
  { name: bi('Mandarin', '普通話'), level: bi('Basic conversation', '基本會話') },
];

export const CERTIFICATION = {
  name: bi('IELTS Academic', 'IELTS 學術類'),
  result: bi('Overall Band 6.5', '總分 6.5'),
};

export interface Achievement {
  id: string;
  title: Bilingual;
  year: string;
  award: Bilingual;
  detail: Bilingual;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'smart-economy',
    title: bi(
      'Smart Economy in AI, Cyber Security & Robotics Contest (TECH Singularity 2026)',
      '智慧經濟比賽：人工智能、網絡安全及機械人技術（TECH Singularity 2026）',
    ),
    year: '2026',
    award: bi('Semi-finalist · College Student Group', '準決賽入圍・大專學生組'),
    detail: bi('Organised by HKITJS.', '由 HKITJS 主辦。'),
  },
  {
    id: 'scmp-journalist',
    title: bi('South China Morning Post “Experience as a Journalist” Course', '南華早報《記者體驗》課程'),
    year: '2021–2022',
    award: bi('Certificate of Participation', '參與證書'),
    detail: bi('Learned foundational English newspaper writing and interview techniques.', '學習英文編寫報章及採訪的基本技巧。'),
  },
  {
    id: 'skh-robot',
    title: bi('The 3rd S.K.H. Secondary Schools Robot Competition', '第三屆聖公會中學機械人比賽'),
    year: '2020–2021',
    award: bi('Certificate of Participation', '參與證書'),
    detail: bi(
      'Designed robots and control programmes for a team-based competition, with an early attempt at AI road-sign recognition for navigation.',
      '以團隊對抗形式設計機械人及其控制程式，並嘗試運用人工智能辨識路標以指揮機械人。',
    ),
  },
];
