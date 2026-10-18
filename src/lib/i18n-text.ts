/** A string supplied in both site languages. `zh` is Traditional Chinese (Hong Kong). */
export type Bilingual = { en: string; zh: string };

/** Build a bilingual string; omit `zh` for proper nouns and technology names that stay in English. */
export function bi(en: string, zh?: string): Bilingual {
  return { en, zh: zh ?? en };
}

export function pick(text: Bilingual, locale: string): string {
  return locale === 'zh-hk' ? text.zh : text.en;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

/** Format an ISO date (YYYY-MM-DD) as "12 Dec 2025" / "2025年12月12日". */
export function formatDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return locale === 'zh-hk' ? `${y}年${m}月${d}日` : `${d} ${MONTHS_EN[m - 1]} ${y}`;
}

/** Format an ISO date as month and year only: "Dec 2025" / "2025年12月". */
export function formatMonth(iso: string, locale: string): string {
  const [y, m] = iso.split('-').map(Number);
  return locale === 'zh-hk' ? `${y}年${m}月` : `${MONTHS_EN[m - 1]} ${y}`;
}
