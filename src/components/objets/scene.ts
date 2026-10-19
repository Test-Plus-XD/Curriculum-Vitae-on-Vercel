import { Group, Vector3 } from 'three';
import { gsap } from '@/lib/gsap';
import { eachMaterial, loadModel, measure } from '../readymade/assets';
import type { Stage } from '../readymade/stage';
import { FOUND_OBJECTS, type FoundObject } from './objects';

/** Where one object hangs: the string meets the object's top centre at this point, in world units. */
interface Spot {
  x: number;
  y: number;
  z: number;
  /** Scale multiplier on the object's catalogue size. */
  scale: number;
}

/**
 * The wide composition: four objects spread along the wire with staggered heights and depths, so the mobile
 * reads as a mobile rather than a row of specimens.
 */
const WIDE: Spot[] = [
  { x: -3.15, y: 1.15, z: 0.35, scale: 0.95 },
  { x: -1.05, y: 0.35, z: -0.6, scale: 1 },
  { x: 1.15, y: 0.95, z: 0.45, scale: 1 },
  { x: 3.05, y: 0.3, z: -0.3, scale: 1 },
];

/**
 * Phones and zoomed pages: the stage is taller and narrower, so the prints hang deeper — long strings, four
 * different heights — and run a little larger. They fill the mobile stage instead of huddling under the wire.
 */
const NARROW: Spot[] = [
  { x: -1.95, y: 0.75, z: 0.3, scale: 1.02 },
  { x: -0.65, y: -0.35, z: -0.45, scale: 1.08 },
  { x: 0.7, y: 0.55, z: 0.35, scale: 1.04 },
  { x: 2, y: -0.5, z: -0.25, scale: 1 },
];

/** Stage widths below this (CSS px) use the phone composition; wider stages use the spread one. */
const NARROW_STAGE = 640;

function spotsFor(width: number): readonly Spot[] {
  return width < NARROW_STAGE ? NARROW : WIDE;
}

/** Camera distance and focus height that frame the chosen composition in the current stage box. */
interface Framing {
  z: number;
  lookY: number;
}

function frameFor(stage: Stage, spots: readonly Spot[]): Framing {
  const tan = Math.tan((stage.camera.fov * Math.PI) / 360);
  const aspect = Math.max(0.25, stage.width / stage.height);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let nearZ = -Infinity;
  spots.forEach((spot, i) => {
    const half = ((FOUND_OBJECTS[i]?.size ?? 1.8) * spot.scale) / 2;
    minX = Math.min(minX, spot.x - half);
    maxX = Math.max(maxX, spot.x + half);
    minY = Math.min(minY, spot.y - half);
    maxY = Math.max(maxY, spot.y + half);
    nearZ = Math.max(nearZ, spot.z);
  });
  // Fill the width; use most of the height, keeping a little headroom for the wire and its tags.
  const z = Math.max((maxX - minX) / (2 * tan * aspect) + nearZ, (maxY - minY) / (2 * tan * 0.82) + nearZ, 3.4);
  // Aim a touch under the centre, so the prints sit slightly above the middle and the label card can overlap
  // the stage's bottom edge without covering an object.
  const lookY = (minY + maxY) / 2 - 0.1 * (z * tan);
  return { z, lookY };
}

interface Hung {
  spec: FoundObject;
  /** Index in FOUND_OBJECTS, so each composition picks the right spot even if a model failed to load. */
  index: number;
  /** At the string: pendulum swing. */
  hang: Group;
  /** Inside the hang: the idle spin. */
  spin: Group;
  /** The print itself, scaled from the object's measured bounds. */
  body: Group;
  /** Catalogue size divided by the object's longest measured side (scale before the spot multiplier). */
  unit: number;
  /** Offset that puts the measured top centre on the hanging point, before scaling. */
  pivot: { x: number; y: number; z: number };
  spot: Spot;
  phase: number;
  /** World y of the hanging point, before the entrance offset. */
  baseY: number;
  /** Damped-spring state for a tap: an angular offset and its velocity. */
  push: { angle: number; vel: number };
  /** Spin added by the last tap, decaying back to the idle turn. */
  spinKick: number;
  /** Entrance offsets, all additive so the idle animation never fights the entrance tween. */
  fall: { y: number };
  swing: { z: number; x: number };
  twirl: { y: number };
  spinAngle: number;
}

export interface ObjetsPiece {
  intro: gsap.core.Timeline;
  /** Number of objects actually hung (a failed model is left out). */
  count: number;
  /** Re-frame the mobile after the stage resizes (browser zoom, rotation); re-hangs on a composition change. */
  layout(): void;
  update(time: number, dt: number): void;
  /** Pointer position over the stage, -1…1 on both axes (mouse and pen only). */
  look(x: number, y: number): void;
  /** Scroll progress of the figure through the viewport (0…1). */
  scroll(progress: number): void;
  /** A tap sets the prints swinging and gives their turn a shove. */
  gust(): void;
  /** Where object `index` hangs, in CSS px inside the stage. */
  anchor(index: number, out: { x: number; y: number }): void;
}

const V = new Vector3();

/**
 * Objets trouvés: four everyday objects hung from a wire, printed through the readymade halftone pass so
 * they arrive as cut-out newspaper photographs rather than as 3D renders. They turn idly, swing on their
 * strings, and settle when the pointer moves across the stage.
 *
 * Two compositions share the same prints: a wide one for the hero's left column, and a deeper phone one for
 * small screens and zoomed pages. The camera frames whichever composition is in use from the measured stage
 * box, and the prints are re-hung when a resize crosses the breakpoint, so browser zoom behaves like a phone.
 */
export async function buildObjets(stage: Stage): Promise<() => ObjetsPiece> {
  let currentSpots = spotsFor(stage.width);
  const settled = await Promise.allSettled(
    FOUND_OBJECTS.map(async (spec, index) => ({
      spec,
      index,
      spot: currentSpots[index] ?? currentSpots[currentSpots.length - 1],
      object: await loadModel(spec.model),
    })),
  );
  const loaded = settled.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  // One missing asset is survivable (its string is hidden); an empty mobile is not.
  if (loaded.length < 2) throw new Error('objets: no models could be loaded');

  const hung: Hung[] = [];
  for (const { spec, index, spot, object } of loaded) {
    eachMaterial(object, (m) => {
      m.envMapIntensity = 0.62;
      // Pull the warm cast of old wood and brass towards newsprint: less of the red plate, more of the
      // black screen, so the silhouettes stay legible at this size.
      m.color.setRGB(0.9, 0.96, 1.02);
    });
    // Turn the scan to its hanging pose first, so the measured top is the point the string holds.
    object.rotation.set(...spec.turn);
    object.updateMatrixWorld(true);
    const { box, size, centre } = measure(object);
    const unit = spec.size / Math.max(size.x, size.y, size.z, 0.001);
    const s = unit * spot.scale;
    const hang = new Group();
    hang.position.set(spot.x, spot.y, spot.z);
    const spin = new Group();
    const body = new Group();
    body.scale.setScalar(s);
    // The object's top centre becomes the hanging point, so the pendulum pivots where the string meets it.
    body.position.set(-centre.x * s, -box.max.y * s, -centre.z * s);
    body.add(object);
    spin.add(body);
    hang.add(spin);
    stage.root.add(hang);
    hung.push({
      spec,
      index,
      hang,
      spin,
      body,
      unit,
      pivot: { x: centre.x, y: box.max.y, z: centre.z },
      spot,
      phase: index * 1.73,
      baseY: spot.y,
      push: { angle: 0, vel: 0 },
      spinKick: 0,
      fall: { y: 0 },
      swing: { z: 0, x: 0 },
      twirl: { y: 0 },
      spinAngle: index * 0.6,
    });
  }

  let framing = frameFor(stage, currentSpots);

  const applyCamera = () => {
    stage.camera.position.set(0, framing.lookY + 0.15, framing.z);
    stage.camera.lookAt(0, framing.lookY, 0);
    stage.camera.updateMatrixWorld();
  };
  applyCamera();

  /** Re-hang one print on a spot: position, scale and the offset the string holds it by. */
  const place = (h: Hung, spot: Spot) => {
    h.spot = spot;
    h.baseY = spot.y;
    h.hang.position.set(spot.x, spot.y, spot.z);
    const s = h.unit * spot.scale;
    h.body.scale.setScalar(s);
    h.body.position.set(-h.pivot.x * s, -h.pivot.y * s, -h.pivot.z * s);
  };

  // Everything animated is created inside this factory, which the canvas calls inside its useGSAP
  // context: reverting that context clears every tween without leaving the scene mid-gesture.
  return () => {
    const look = { x: 0, y: 0 };
    const scrolled = { p: 0.5 };
    const lookX = gsap.quickTo(look, 'x', { duration: 1.1, ease: 'power3' });
    const lookY = gsap.quickTo(look, 'y', { duration: 1.1, ease: 'power3' });
    const intro = gsap.timeline({ paused: true, defaults: { duration: 1, ease: 'soviet' } });

    // Drop in from above the wire, one after another, and spin up to their idle turn.
    hung.forEach((h, i) => {
      intro.from(h.fall, { y: 2.9, duration: 1.4, ease: 'bounce.out' }, i * 0.09);
      intro.from(h.swing, { z: (i % 2 ? -1 : 1) * 0.32, duration: 1.2, ease: 'power2.out' }, i * 0.09);
      intro.from(h.twirl, { y: (i % 2 ? -1 : 1) * Math.PI * 1.4, duration: 1.7, ease: 'power3.out' }, i * 0.09);
    });

    const piece: ObjetsPiece = {
      intro,
      count: hung.length,
      layout() {
        // The stage has already been resized: re-frame, and re-hang only if the composition itself changed.
        const next = spotsFor(stage.width);
        if (next !== currentSpots) {
          currentSpots = next;
          hung.forEach((h) => place(h, next[h.index] ?? next[next.length - 1]));
        }
        framing = frameFor(stage, currentSpots);
        applyCamera();
      },
      update(time, dt) {
        const sway = (scrolled.p - 0.5) * 0.5;
        // Keep the pointer parallax and scroll sway feeling the same at every camera distance.
        const depth = framing.z / 8.6;
        stage.camera.position.x = look.x * 0.55 * depth + sway;
        stage.camera.position.y = framing.lookY + 0.15 + look.y * 0.3 * depth;
        stage.camera.lookAt(0, framing.lookY, 0);
        stage.camera.updateMatrixWorld();
        for (const h of hung) {
          // A tap arrives as a damped spring: the print swings, and its turn gets a shove that decays.
          h.push.vel += (-28 * h.push.angle - 3.4 * h.push.vel) * dt;
          h.push.angle += h.push.vel * dt;
          h.spinKick *= Math.exp(-dt * 1.7);
          h.spinAngle += (h.spec.spin + h.spinKick) * dt;
          // Compose: idle motion + the entrance offset (so the entrance tween never fights the idle loop).
          h.hang.position.y = h.baseY + h.fall.y;
          h.hang.rotation.z = h.swing.z + h.push.angle + Math.sin(time * 0.42 + h.phase) * 0.045 + sway * 0.06;
          h.hang.rotation.x = Math.sin(time * 0.33 + h.phase * 1.7) * 0.02 + h.swing.x;
          h.spin.rotation.y = h.spinAngle + h.twirl.y;
        }
      },
      look(x, y) {
        lookX(x);
        lookY(y);
      },
      scroll(progress) {
        scrolled.p = progress;
      },
      gust() {
        hung.forEach((h, i) => {
          const dir = i % 2 ? -1 : 1;
          h.push.vel += dir * (1.5 + (i % 3) * 0.35);
          h.spinKick += dir * 2.4;
        });
      },
      anchor(index, out) {
        const h = hung[index];
        if (!h) return;
        h.hang.updateWorldMatrix(true, false);
        h.hang.getWorldPosition(V);
        V.project(stage.camera);
        out.x = (V.x * 0.5 + 0.5) * stage.width;
        out.y = (-V.y * 0.5 + 0.5) * stage.height;
      },
    };
    return piece;
  };
}
