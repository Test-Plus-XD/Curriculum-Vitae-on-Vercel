import type { Stage } from '../stage';

export interface WorkEnv {
  locale: string;
}

/** A readymade once its assets are loaded and its scene graph built (in its finished, assembled state). */
export interface Piece {
  /**
   * Paused entrance timeline (built from `from` tweens, so reverting it leaves the piece assembled). Played
   * once the page is revealed and the figure is in view.
   */
  intro: gsap.core.Timeline;
  /** Every frame while visible: elapsed seconds and the frame's delta in seconds. */
  update(time: number, dt: number): void;
  /** Pointer over the stage, -1…1 on both axes (mouse and pen only); 0, 0 when it leaves. */
  look?(x: number, y: number): void;
  /** Horizontal drag across the stage, in CSS px (any pointer). */
  drag?(dx: number): void;
  /** Scroll progress of the figure through the viewport (0…1) and the scroll velocity in px/s. */
  scroll?(progress: number, velocity: number): void;
  /** The figure's action: refit, spin, hammer… */
  act(): void;
}

/**
 * Loads assets and builds the scene graph (async, outside any GSAP context), then returns a factory that
 * creates the animations. The factory runs inside the figure's GSAP context, so everything it makes is
 * reverted when the figure unmounts.
 */
export type Work = (stage: Stage, env: WorkEnv) => Promise<() => Piece>;
