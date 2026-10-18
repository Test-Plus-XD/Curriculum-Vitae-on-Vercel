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
  /** Scale multiplier on the object's catalogue size (smaller on phones). */
  scale: number;
}

// Wide composition: four objects spread along the wire with staggered heights and depths, so the
// mobile reads as a mobile rather than a row of specimens.
const WIDE: Spot[] = [
  { x: -3.15, y: 1.15, z: 0.35, scale: 0.95 },
  { x: -1.05, y: 0.35, z: -0.6, scale: 1 },
  { x: 1.15, y: 0.95, z: 0.45, scale: 1 },
  { x: 3.05, y: 0.3, z: -0.3, scale: 1 },
];

// Phones and narrow columns: a tighter, smaller arrangement of the same objects.
const NARROW: Spot[] = [
  { x: -2.1, y: 1.15, z: 0.2, scale: 0.82 },
  { x: -0.7, y: 0.25, z: -0.5, scale: 0.86 },
  { x: 0.75, y: 0.95, z: 0.3, scale: 0.86 },
  { x: 2.1, y: 0.15, z: -0.2, scale: 0.82 },
];

interface Hung {
  spec: FoundObject;
  /** At the string: pendulum swing. */
  hang: Group;
  /** Inside the hang: the idle spin. */
  spin: Group;
  phase: number;
  /** World y of the hanging point, before the entrance offset. */
  baseY: number;
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
  update(time: number, dt: number): void;
  /** Pointer position over the stage, -1…1 on both axes (mouse and pen only). */
  look(x: number, y: number): void;
  /** Scroll progress of the figure through the viewport (0…1). */
  scroll(progress: number): void;
  /** Where object `index` hangs, in CSS px inside the stage. */
  anchor(index: number, out: { x: number; y: number }): void;
}

const V = new Vector3();

/**
 * Objets trouvés: four everyday objects hung from a wire, printed through the readymade halftone pass so
 * they arrive as cut-out newspaper photographs rather than as 3D renders. They turn idly, swing on their
 * strings, and settle when the pointer moves across the stage.
 */
export async function buildObjets(stage: Stage, { narrow }: { narrow: boolean }): Promise<() => ObjetsPiece> {
  const spots = narrow ? NARROW : WIDE;
  const settled = await Promise.allSettled(
    FOUND_OBJECTS.map(async (spec, i) => ({ spec, spot: spots[i] ?? spots[spots.length - 1], object: await loadModel(spec.model) })),
  );
  const loaded = settled.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  // One missing asset is survivable (its string is hidden); an empty mobile is not.
  if (loaded.length < 2) throw new Error('objets: no models could be loaded');

  const hung: Hung[] = [];
  for (const [i, { spec, spot, object }] of loaded.entries()) {
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
    const s = (spec.size * spot.scale) / Math.max(size.x, size.y, size.z, 0.001);
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
      hang,
      spin,
      phase: i * 1.73,
      baseY: spot.y,
      fall: { y: 0 },
      swing: { z: 0, x: 0 },
      twirl: { y: 0 },
      spinAngle: i * 0.6,
    });
  }

  // On phones the frame is smaller, so the camera comes in close instead of shrinking the objects again.
  stage.camera.fov = narrow ? 36 : 32;
  stage.camera.position.set(0, 0.1, narrow ? 6.4 : 8.6);
  stage.camera.updateProjectionMatrix();
  stage.camera.lookAt(0, -0.05, 0);

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
      update(time, dt) {
        const sway = (scrolled.p - 0.5) * 0.5;
        stage.camera.position.x = look.x * 0.55 + sway;
        stage.camera.position.y = 0.1 + look.y * 0.3;
        stage.camera.lookAt(0, -0.05, 0);
        stage.camera.updateMatrixWorld();
        for (const h of hung) {
          h.spinAngle += h.spec.spin * dt;
          // Compose: idle motion + the entrance offset (so the entrance tween never fights the idle loop).
          h.hang.position.y = h.baseY + h.fall.y;
          h.hang.rotation.z = h.swing.z + Math.sin(time * 0.42 + h.phase) * 0.045 + sway * 0.06;
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