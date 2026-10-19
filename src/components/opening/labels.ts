/**
 * The opening's beats, in seconds on the master timeline (six seconds in all). Kept apart from the timeline
 * so tests can read them without loading GSAP.
 */
export const LABELS = {
  dark: 0,
  lamp: 0.1,
  morph: 1.25,
  build: 1.75,
  breathe: 1.95,
  scatter: 2.75,
  tilt: 3.25,
  whip: 3.6,
  collage: 3.88,
  hand: 3.95,
  launch: 4.75,
  window: 5.35,
  end: 6,
} as const;
