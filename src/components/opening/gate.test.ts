import { describe, expect, it } from 'vitest';
import { OPENING_GATE, OPENING_GATE_BODY } from './gate';

interface Visit {
  type?: 'navigate' | 'reload' | 'back_forward' | 'prerender';
  referrer?: string;
  search?: string;
  reduced?: boolean;
}

/** Run the gate against a fresh <html> and stubbed browser globals; returns the attributes it set. */
function visit({ type = 'navigate', referrer = '', search = '', reduced = false }: Visit) {
  const html = document.implementation.createHTMLDocument('gate');
  const doc = { documentElement: html.documentElement, head: html.head, referrer, createElement: (t: string) => html.createElement(t) };
  const location = { search, origin: 'https://cv.example' };
  const performance = { getEntriesByType: () => (type ? [{ type }] : []) };
  const matchMedia = () => ({ matches: reduced });
  new Function('document', 'location', 'performance', 'matchMedia', OPENING_GATE_BODY)(doc, location, performance, matchMedia);
  return {
    opening: html.documentElement.getAttribute('data-opening'),
    cover: html.documentElement.getAttribute('data-cover'),
    preloads: html.head.querySelectorAll('link[rel="preload"]').length,
  };
}

describe('opening gate', () => {
  it('plays on a fresh visit from outside the site', () => {
    expect(visit({})).toEqual({ opening: 'on', cover: 'on', preloads: 2 });
    expect(visit({ referrer: 'https://www.google.com/' }).opening).toBe('on');
  });

  it('plays on every reload, whatever the referrer', () => {
    expect(visit({ type: 'reload', referrer: 'https://cv.example/en/projects' }).opening).toBe('on');
  });

  it('skips navigations from the site itself (language switch, new tab) and back/forward', () => {
    expect(visit({ referrer: 'https://cv.example/en' })).toEqual({ opening: null, cover: null, preloads: 0 });
    expect(visit({ type: 'back_forward' }).opening).toBeNull();
    expect(visit({ type: 'prerender' }).opening).toBeNull();
  });

  it('never plays under reduced motion, even when forced', () => {
    expect(visit({ reduced: true }).opening).toBeNull();
    expect(visit({ reduced: true, search: '?intro=1' }).opening).toBeNull();
  });

  it('can be forced or skipped with ?intro', () => {
    expect(visit({ referrer: 'https://cv.example/en', search: '?intro=1' }).opening).toBe('on');
    expect(visit({ type: 'reload', search: '?a=b&intro=0' }).opening).toBeNull();
    expect(visit({ search: '?intro=10' }).opening).toBe('on');
  });

  it('is wrapped so a failure can never break the page', () => {
    expect(OPENING_GATE.startsWith('(function(){try{')).toBe(true);
    expect(OPENING_GATE.endsWith('}catch(e){}})();')).toBe(true);
    expect(OPENING_GATE).not.toContain('\n');
  });
});
