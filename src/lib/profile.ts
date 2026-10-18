import { bi } from './i18n-text';

/** Birth month only — used to calculate the age. The birth date itself is never displayed. */
const BIRTH_YEAR = 2005;
const BIRTH_MONTH = 5;

/** Age in whole years, evaluated in Hong Kong time (UTC+8). */
export function getAge(now: Date = new Date()): number {
  const hk = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const year = hk.getUTCFullYear();
  const month = hk.getUTCMonth() + 1;
  return year - BIRTH_YEAR - (month < BIRTH_MONTH ? 1 : 0);
}

export const PROFILE = {
  name: { en: 'NG Yu Ham Baldwin', zh: '吳宇涵' },
  title: bi('Software Developer', '軟件開發人員'),
  descriptor: bi(
    'Computer Studies Graduate (Mobile Applications & Game Development)',
    '電腦學畢業生（流動應用及遊戲開發）',
  ),
  location: bi('Hong Kong SAR', '香港特別行政區'),
  summary: [
    bi(
      'A recent Higher Diploma graduate in Computer Studies (Mobile Applications and Game Development) from the Hong Kong College of Technology, with hands-on, full-stack development experience across web, Android and iOS platforms.',
      '香港專業進修學校電腦學高級文憑（流動應用及遊戲開發）畢業生，具備涵蓋網頁、Android 及 iOS 平台的全端開發實務經驗。',
    ),
    bi(
      'Independently designed, built and deployed PourRice, a full-stack restaurant discovery platform spanning frontend, backend, real-time systems and third-party integrations.',
      '曾獨立設計、開發並部署 PourRice（倒米），一個涵蓋前端、後端、即時系統及第三方服務整合的全端餐廳搜尋平台。',
    ),
    bi(
      'Comfortable moving across languages and frameworks, and eager to bring that adaptability to a professional development team.',
      '能靈活運用多種程式語言及框架，並樂於將此適應力應用於專業開發團隊之中。',
    ),
  ],
} as const;

export type ContactKind = 'email' | 'phone' | 'github' | 'linkedin' | 'youtube' | 'discord';

export interface ContactLink {
  kind: ContactKind;
  label: string;
  /** Short form printed on paper, where links cannot be clicked. */
  print: string;
  href: string;
}

export const CONTACTS: ContactLink[] = [
  { kind: 'email', label: 'baldwon0xd@gmail.com', print: 'baldwon0xd@gmail.com', href: 'mailto:baldwon0xd@gmail.com' },
  { kind: 'phone', label: '+852 6701 6557', print: '+852 6701 6557', href: 'tel:+85267016557' },
  { kind: 'github', label: 'Test-Plus-XD', print: 'github.com/Test-Plus-XD', href: 'https://github.com/Test-Plus-XD' },
  {
    kind: 'linkedin',
    label: 'test-plus-004601285',
    print: 'linkedin.com/in/test-plus-004601285',
    href: 'https://www.linkedin.com/in/test-plus-004601285/',
  },
  {
    kind: 'youtube',
    label: 'Portfolio videos',
    print: 'YouTube: portfolio playlist',
    href: 'https://youtube.com/playlist?list=PLkzUf67y42SM-JlZk4eJEDIYPdb7VKbVo',
  },
  { kind: 'discord', label: 'test_plus', print: 'Discord: test_plus', href: 'https://discord.com/users/589711219162873857' },
];

export const SITE = {
  url: 'https://www.test-plus.work',
  source: 'https://github.com/Test-Plus-XD/Curriculum-Vitae-on-Vercel',
};
