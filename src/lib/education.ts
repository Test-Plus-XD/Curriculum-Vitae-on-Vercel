import { bi, type Bilingual } from './i18n-text';

export interface Course {
  code: string;
  name: Bilingual;
  grade?: string;
  credits?: number;
}

export interface Semester {
  id: string;
  label: Bilingual;
  courses: Course[];
}

export const PROGRAMME = {
  institution: bi('Hong Kong College of Technology (HKCT)', '香港專業進修學校（港專）'),
  title: bi(
    'Higher Diploma in Computer Studies (Mobile Applications and Game Development)',
    '電腦學高級文憑（流動應用及遊戲開發）',
  ),
  shortTitle: bi('HD in Computer Studies (Mobile Apps & Game Dev)', '電腦學高級文憑（流動應用及遊戲開發）'),
  code: 'HDPMAGDF',
  qfLevel: 4,
  mode: bi('Two years, full-time', '兩年全日制'),
  period: bi('Sept 2024 – May 2026', '2024年9月 – 2026年5月'),
  graduated: bi('Graduated: May 2026', '畢業：2026年5月'),
  cgpa: 3.8,
  finalTermGpa: 4.1,
} as const;

export const SEMESTERS: Semester[] = [
  {
    id: '2024-t1',
    label: bi('2024–2025 Term 1', '2024–2025 第一學期'),
    courses: [
      { code: '03CIT3042', name: bi('Discrete Mathematics and Statistics', '離散數學與統計') },
      { code: '03CIT4041', name: bi('Game Asset Development', '遊戲資產開發') },
      { code: '03CIT4049', name: bi('Java Programming', 'Java 程序設計') },
      { code: '03CIT4053', name: bi('Technology for Web Development', '網絡開發技術') },
      { code: '03ENG4004', name: bi('Academic English Skills', '學術英語技能') },
    ],
  },
  {
    id: '2024-t2',
    label: bi('2024–2025 Term 2', '2024–2025 第二學期'),
    courses: [
      { code: '03CIT4046', name: bi('3D Mobile Game Development', '3D 手機遊戲開發') },
      { code: '03CIT4048', name: bi('Introduction to Database Systems', '數據庫系統導論') },
      { code: '03CIT4052', name: bi('Object-Oriented Analysis and Design', '物件導向分析與設計') },
      { code: '03CIT4054', name: bi('PHP Application Development', 'PHP 應用開發') },
      { code: '03CIT4055', name: bi('Open System Administration', '開放系統管理') },
    ],
  },
  {
    id: '2025-t1',
    label: bi('2025–2026 Term 1', '2025–2026 第一學期'),
    courses: [
      { code: '03CIT4042', name: bi('Software Engineering and Professional Practice', '軟件工程與專業實踐') },
      { code: '03CIT4044', name: bi('Cross-Platform Mobile Application Development', '跨平台手機應用開發') },
      { code: '03CIT4045', name: bi('2D Mobile Game Development', '2D 手機遊戲開發') },
      { code: '03CIT4047', name: bi('Open Mobile Software Design', '開放手機軟件設計') },
    ],
  },
  {
    id: '2025-t2',
    label: bi('2025–2026 Term 2 · Final semester', '2025–2026 第二學期・最後學期'),
    courses: [
      { code: '03CIT4010', name: bi('Computer Ethics', '計算機倫理'), grade: 'B', credits: 3 },
      { code: '03CIT4043', name: bi('Proprietary Mobile Software Design (iOS)', '專有手機軟件設計 (iOS)'), grade: 'A+', credits: 3 },
      { code: '03CIT4050', name: bi('Data Communication and Networking', '數據通信與網絡'), grade: 'A+', credits: 3 },
      { code: '03ENG4005', name: bi('Professional English Communication', '專業英語溝通'), grade: 'A+', credits: 3 },
      { code: '06CIT4002', name: bi('Final Year Project', '畢業專題'), grade: 'A+', credits: 6 },
    ],
  },
];

export const ALL_COURSES: Course[] = SEMESTERS.flatMap((s) => s.courses);

export function getCourse(code: string): Course | undefined {
  return ALL_COURSES.find((c) => c.code === code);
}
