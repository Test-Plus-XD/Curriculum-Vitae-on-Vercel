import { describe, expect, it } from 'vitest';
import { embedUrl, parseYouTube, thumbnailUrl } from './youtube';

describe('parseYouTube', () => {
  it('reads youtu.be links', () => {
    expect(parseYouTube('https://youtu.be/WB2t-f88AME')).toEqual({ id: 'WB2t-f88AME', isShort: false });
  });

  it('marks Shorts as vertical', () => {
    expect(parseYouTube('https://youtube.com/shorts/422JoEHT4SE')).toEqual({ id: '422JoEHT4SE', isShort: true });
  });

  it('reads watch and embed links', () => {
    expect(parseYouTube('https://www.youtube.com/watch?v=abc123&t=4')).toEqual({ id: 'abc123', isShort: false });
    expect(parseYouTube('https://www.youtube-nocookie.com/embed/xyz')).toEqual({ id: 'xyz', isShort: false });
  });

  it('rejects anything else', () => {
    expect(parseYouTube('https://example.com/watch?v=abc')).toBeNull();
    expect(parseYouTube('not a url')).toBeNull();
  });
});

describe('URLs', () => {
  it('builds thumbnail and privacy-enhanced embed URLs', () => {
    expect(thumbnailUrl('abc')).toBe('https://img.youtube.com/vi/abc/hqdefault.jpg');
    expect(embedUrl('abc')).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/abc\?/);
  });
});
