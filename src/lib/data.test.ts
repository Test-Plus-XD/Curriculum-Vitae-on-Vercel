import { describe, expect, it } from 'vitest';
import en from '../messages/en.json';
import zh from '../messages/zh-hk.json';
import { PROJECTS, PROJECT_IDS, COLLABORATIONS, FEATURED_IDS, buildTimeline, getProject } from './projects';
import { ALL_COURSES, SEMESTERS, PROGRAMME, getCourse } from './education';
import { SKILL_GROUPS, EXPERIENCE, ACHIEVEMENTS } from './cv';
import { parseYouTube } from './youtube';
import type { Bilingual } from './i18n-text';

/** Walk any value and collect every { en, zh } pair inside it. */
function bilinguals(value: unknown, out: Bilingual[] = []): Bilingual[] {
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if (typeof o.en === 'string' && typeof o.zh === 'string') out.push(o as unknown as Bilingual);
    else Object.values(o).forEach((v) => bilinguals(v, out));
  }
  return out;
}

describe('projects', () => {
  it('has twelve projects with unique ids', () => {
    expect(PROJECTS).toHaveLength(12);
    expect(new Set(PROJECT_IDS).size).toBe(PROJECT_IDS.length);
  });

  it('has 30 distinct, parseable videos', () => {
    const ids = PROJECTS.flatMap((p) => p.videos).map((v) => parseYouTube(v.url)?.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(30);
  });

  it('only references courses that exist', () => {
    for (const p of PROJECTS) for (const code of p.courses) expect(getCourse(code), `${p.id} → ${code}`).toBeDefined();
    for (const p of PROJECTS) for (const pl of p.platforms ?? []) if (pl.course) expect(getCourse(pl.course)).toBeDefined();
  });

  it('links related and featured projects that exist', () => {
    for (const p of PROJECTS) if (p.related) expect(getProject(p.related)).toBeDefined();
    for (const id of FEATURED_IDS) expect(getProject(id)).toBeDefined();
  });

  it('uses valid ISO dates and https repository links', () => {
    for (const p of PROJECTS) {
      for (const e of buildTimeline(p)) expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const r of p.repos) expect(r.url).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it('builds timelines newest first, with a same-day milestone after that day’s videos', () => {
    for (const p of PROJECTS) {
      const entries = buildTimeline(p);
      const dates = entries.map((e) => e.date);
      expect([...dates].sort().reverse()).toEqual(dates);
      entries.forEach((e, i) => {
        const next = entries[i + 1];
        if (next && next.date === e.date) expect(e.type === 'milestone' && next.type === 'video').toBe(false);
      });
    }
    // Pour Rice: the latest video leads, the October 2025 start milestone closes the list.
    const pourRice = buildTimeline(getProject('pourrice')!);
    expect(pourRice[0].date).toBe('2026-05-07');
    expect(pourRice.at(-1)?.type).toBe('milestone');
  });

  it('never links a private collaboration', () => {
    expect(COLLABORATIONS.filter((c) => c.visibility === 'private').every((c) => !c.url)).toBe(true);
  });
});

describe('education', () => {
  it('lists 19 courses over four semesters', () => {
    expect(SEMESTERS).toHaveLength(4);
    expect(ALL_COURSES).toHaveLength(19);
    expect(new Set(ALL_COURSES.map((c) => c.code)).size).toBe(19);
  });

  it('records the final results', () => {
    expect(PROGRAMME.cgpa).toBe(3.8);
    expect(PROGRAMME.finalTermGpa).toBe(4.1);
    expect(SEMESTERS[3].courses.every((c) => c.grade && c.credits)).toBe(true);
  });
});

describe('bilingual content', () => {
  it('fills both languages everywhere', () => {
    const all = bilinguals([PROJECTS, COLLABORATIONS, SEMESTERS, PROGRAMME, SKILL_GROUPS, EXPERIENCE, ACHIEVEMENTS]);
    expect(all.length).toBeGreaterThan(100);
    for (const b of all) {
      expect(b.en.trim(), JSON.stringify(b)).not.toBe('');
      expect(b.zh.trim(), JSON.stringify(b)).not.toBe('');
    }
  });

  it('has the same message keys in both locales', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(zh).sort()).toEqual(keys(en).sort());
  });

  it('uses British spelling in English copy', () => {
    const english = [JSON.stringify(en), ...bilinguals([PROJECTS, COLLABORATIONS, SKILL_GROUPS, EXPERIENCE, ACHIEVEMENTS]).map((b) => b.en)].join(' ');
    expect(english).not.toMatch(/\b(color|center|organization|organize|program\b|behavior|labeled|labeling|modeled|enrollment|optimize|analyze)\b/i);
  });
});
