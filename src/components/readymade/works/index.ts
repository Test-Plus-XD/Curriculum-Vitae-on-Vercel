import type { StageOptions } from '../stage';
import { duchamp } from './duchamp';
import { hausmann } from './hausmann';
import { manRay } from './manray';
import type { Work } from './types';

export type WorkName = 'hausmann' | 'duchamp' | 'manray';

export interface WorkEntry {
  build: Work;
  stage?: StageOptions;
  /** Horizontal drags act on the piece (a click still triggers its action). */
  drag?: boolean;
}

export const WORKS: Record<WorkName, WorkEntry> = {
  // Marble is pale: darker mid-tones so the face prints.
  hausmann: { build: hausmann, stage: { print: { gamma: 1.55, black: 0.1, white: 0.97, seed: 2.3 } } },
  duchamp: { build: duchamp, drag: true, stage: { print: { gamma: 1.3, seed: 5.1 } } },
  manray: { build: manRay, stage: { print: { gamma: 0.9, black: 0.03, white: 0.82, seed: 8.4 } } },
};
