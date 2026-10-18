export interface YouTubeRef {
  id: string;
  /** YouTube Shorts are vertical (9:16). */
  isShort: boolean;
}

/** Parse youtu.be/{id}, youtube.com/shorts/{id} and youtube.com/watch?v={id} URLs. */
export function parseYouTube(url: string): YouTubeRef | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return id ? { id, isShort: false } : null;
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const shorts = u.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shorts) return { id: shorts[1], isShort: true };
      const v = u.searchParams.get('v');
      if (v) return { id: v, isShort: false };
      const embed = u.pathname.match(/^\/embed\/([^/?#]+)/);
      if (embed) return { id: embed[1], isShort: false };
    }
    return null;
  } catch {
    return null;
  }
}

export function thumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}
