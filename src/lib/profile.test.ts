import { describe, expect, it } from 'vitest';
import { getAge, CONTACTS } from './profile';

// Hong Kong is UTC+8, so midnight HKT on 1 May is 16:00 UTC on 30 April.
const hkt = (iso: string) => new Date(`${iso}+08:00`);

describe('getAge', () => {
  it('is 21 on 18 October 2026', () => {
    expect(getAge(hkt('2026-10-18T12:00:00'))).toBe(21);
  });

  it('turns over at the start of May (Hong Kong time)', () => {
    expect(getAge(hkt('2026-04-30T23:59:59'))).toBe(20);
    expect(getAge(hkt('2026-05-01T00:00:00'))).toBe(21);
  });

  it('uses Hong Kong time rather than UTC', () => {
    // 30 April 2026 17:00 UTC is already 1 May in Hong Kong.
    expect(getAge(new Date('2026-04-30T17:00:00Z'))).toBe(21);
  });
});

describe('CONTACTS', () => {
  it('has a usable link and a print form for every entry', () => {
    for (const c of CONTACTS) {
      expect(c.href).toMatch(/^(mailto:|tel:\+|https:\/\/)/);
      expect(c.print.length).toBeGreaterThan(0);
    }
  });
});
