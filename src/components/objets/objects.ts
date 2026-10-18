/**
 * The found objects on the mobile: everyday things, scanned and released CC0 on Poly Haven (see
 * ../../public/models/CREDITS.txt). Each one hangs from a string and turns slowly.
 */
export type ObjetKey = 'hammer' | 'spoon' | 'stapler' | 'clock';

export interface FoundObject {
  /** Message key under `objets.names`. */
  key: ObjetKey;
  /** Model folder in /public/models. */
  model: string;
  /** Longest side, in world units, before the spot's scale. */
  size: number;
  /** Idle spin, radians per second (the sign sets the direction). */
  spin: number;
  /** Turn applied before the object is measured and hung, so it reads well from the camera. */
  turn: [number, number, number];
}

/** Catalogue order, left to right. The layouts in scene.ts are indexed by this array. */
export const FOUND_OBJECTS: FoundObject[] = [
  // The hammer scans upright, head up: it hangs like a plumb bob, cocked a little off the vertical.
  { key: 'hammer', model: 'cross_pein_hammer', size: 2.0, spin: 0.12, turn: [0, 0, 0.14] },
  // The spoon scans lying along Z; turned upright it hangs from the end of its handle.
  { key: 'spoon', model: 'wooden_spoon', size: 2.25, spin: -0.09, turn: [Math.PI / 2, 0, 0] },
  // The stapler lies flat; tilt it up so the three-quarter view reads, and give it enough width to read.
  { key: 'stapler', model: 'vintage_stapler', size: 1.95, spin: 0.16, turn: [-1.02, 0, 0.2] },
  // The clock scans facing -Z: turn it round to face the camera, dial and handset out.
  { key: 'clock', model: 'vintage_telephone_wall_clock', size: 1.8, spin: 0.1, turn: [0, Math.PI - 0.3, 0] },
];
