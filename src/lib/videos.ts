import { projects } from './projects';
import type { Video } from './projects';

export interface VideoWithProject extends Video {
  projectId: string;
  projectTitle: { en: string; zh: string };
}

/**
 * Flat list of all 22 videos across all projects, sorted newest-first by date.
 */
export const allVideos: VideoWithProject[] = projects
  .flatMap((project) =>
    project.videos.map((video) => ({
      ...video,
      projectId: project.id,
      projectTitle: project.title,
    }))
  )
  .sort((a, b) => {
    // Parse DD/MM/YYYY
    const [dA, mA, yA] = a.date.split('/').map(Number);
    const [dB, mB, yB] = b.date.split('/').map(Number);
    return new Date(yB, mB - 1, dB).getTime() - new Date(yA, mA - 1, dA).getTime();
  });

export const presentations = allVideos.filter((v) => v.type === 'presentation');
export const operations   = allVideos.filter((v) => v.type === 'operation' || v.type === 'demo');
