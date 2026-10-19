import {
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  type Bone,
  type Object3D,
} from 'three';
import { gsap } from '@/lib/gsap';
import { eachMaterial, loadModel } from '../readymade/assets';
import type { Stage } from '../readymade/stage';

/**
 * The opening's 3D piece: a sculpted right hand rising out of the collage with Sputnik balanced on its
 * fingertips, two orbit rings turning round the ball. It is printed through the readymade halftone pass, so it
 * arrives as a newspaper cut-out like the readymades. At `launch` the fingers open, the rings collapse and the
 * 3D Sputnik is hidden: the 2D Sputnik takes over from the projected `anchor()` and flies the ribbon.
 *
 * The hand is the WebXR "generic hand" (MIT, see public/models/CREDITS.txt). Its 25 joints are siblings under
 * the armature (WebXR reports every joint in hand space), so they are re-parented into finger chains first;
 * then each joint can be bent about its own x axis and the rest of the finger follows.
 */

const FINGERS = ['index-finger', 'middle-finger', 'ring-finger', 'pinky-finger'] as const;
const PHALANGES = ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'] as const;
const THUMB = ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip'] as const;

/**
 * The cradling pose: per finger, the bend of each joint (radians about its local x, which curls the finger;
 * proximal → distal) and a spread about the proximal joint's local z, which fans it. Tuned by eye against the
 * print: the index fingertip carries the ball, the others curve away under it.
 */
export const POSE: Record<(typeof FINGERS)[number] | 'thumb', { bend: number[]; spread: number }> = {
  'index-finger': { bend: [0, -0.42, -0.5, -0.36], spread: 0.12 },
  'middle-finger': { bend: [0, -0.36, -0.58, -0.42], spread: 0.02 },
  'ring-finger': { bend: [0, -0.56, -0.8, -0.5], spread: -0.1 },
  'pinky-finger': { bend: [0, -0.74, -0.92, -0.56], spread: -0.22 },
  thumb: { bend: [0.12, -0.3, -0.36], spread: 0.24 },
};

/** How far the fingers open as Sputnik leaves them (multiplies the bends). */
const RELEASE = 0.45;
/** Sputnik's ball radius in hand units (metres): a little over half the palm's width across. */
const BALL = 0.024;

/** Model orientation: fingers up, palm turned three-quarters towards the viewer. */
const BODY_TURN: [number, number, number] = [0.18, -1.95, Math.PI];

export interface HandPiece {
  /** Idle motion: the rings turn, the ball spins, the hand sways a little. */
  update(time: number, dt: number): void;
  /** Sputnik's centre in CSS px inside the stage. */
  anchor(out: { x: number; y: number }): void;
}

export interface HandOptions {
  narrow: boolean;
}

function chain(bones: Map<string, Bone>, names: readonly string[], root: Object3D) {
  let parent = root;
  const out: Bone[] = [];
  for (const name of names) {
    const bone = bones.get(name);
    if (!bone) throw new Error(`opening: hand joint ${name} missing`);
    parent.attach(bone);
    out.push(bone);
    parent = bone;
  }
  return out;
}

/** Load and pose the hand, build Sputnik; returns a factory that adds the hand's tweens to the master timeline. */
export async function buildHand(stage: Stage, { narrow }: HandOptions): Promise<(master: gsap.core.Timeline) => HandPiece> {
  const model = await loadModel('generic_hand');
  model.updateMatrixWorld(true);

  const bones = new Map<string, Bone>();
  model.traverse((o) => {
    if ((o as Bone).isBone) bones.set(o.name, o as Bone);
  });
  const wrist = bones.get('wrist');
  if (!wrist) throw new Error('opening: hand has no wrist');

  // Re-parent the joints into chains (keeping their world transforms), so bending a joint moves the rest.
  const fingers = FINGERS.map((f) => ({ name: f, joints: chain(bones, PHALANGES.map((p) => `${f}-${p}`), wrist) }));
  const thumb = chain(bones, THUMB, wrist);
  const rest = new Map<Bone, { x: number; y: number; z: number }>();
  for (const b of bones.values()) rest.set(b, { x: b.rotation.x, y: b.rotation.y, z: b.rotation.z });

  // Pale cast stone with a little metal: it prints as modelled halftone, not a flat silhouette.
  eachMaterial(model, (_m, mesh) => {
    mesh.material = new MeshStandardMaterial({ color: '#e4ded3', metalness: 0.5, roughness: 0.34, envMapIntensity: 1.1 });
    mesh.frustumCulled = false;
  });

  // The forearm, from the wrist down and out of frame (a lathe, slightly flattened like a real wrist).
  const forearm = new Mesh(
    new LatheGeometry([new Vector2(0.024, 0), new Vector2(0.027, 0.06), new Vector2(0.033, 0.2), new Vector2(0.037, 0.46)], 28),
    new MeshStandardMaterial({ color: '#e4ded3', metalness: 0.5, roughness: 0.36, envMapIntensity: 1.1 }),
  );
  forearm.rotation.x = Math.PI / 2;
  forearm.scale.set(1.25, 1, 0.82);
  forearm.position.set(0, 0, 0.012);
  wrist.add(forearm);

  // Sputnik: a polished ball with four swept-back antennas, and two orbit rings with satellites.
  const metal = new MeshStandardMaterial({ color: '#d9d4cb', metalness: 0.9, roughness: 0.16, envMapIntensity: 1.3 });
  const sputnik = new Group();
  const ball = new Mesh(new SphereGeometry(BALL, 40, 24), metal);
  sputnik.add(ball);
  const antennaGeometry = new CylinderGeometry(0.0008, 0.0012, 0.1, 8);
  antennaGeometry.translate(0, -0.05, 0);
  for (let i = 0; i < 4; i++) {
    const antenna = new Mesh(antennaGeometry, metal);
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    antenna.position.set(Math.cos(a) * BALL * 0.66, -BALL * 0.2, Math.sin(a) * BALL * 0.66);
    antenna.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    sputnik.add(antenna);
  }
  const rings = new Group();
  const ringGeometry = new TorusGeometry(BALL * 2.1, 0.0011, 8, 96);
  const satelliteGeometry = new SphereGeometry(0.0042, 16, 10);
  const ringTilts: [number, number, number][] = [
    [1.15, 0.2, 0.35],
    [0.4, -0.5, -0.9],
  ];
  const ringGroups = ringTilts.map((tilt, i) => {
    const holder = new Group();
    holder.rotation.set(...tilt);
    const ring = new Group();
    ring.add(new Mesh(ringGeometry, metal));
    for (let k = 0; k < 2; k++) {
      const s = new Mesh(satelliteGeometry, metal);
      const a = k * Math.PI + i;
      s.position.set(Math.cos(a) * BALL * 2.1, Math.sin(a) * BALL * 2.1, 0);
      ring.add(s);
    }
    holder.add(ring);
    rings.add(holder);
    return ring;
  });
  sputnik.add(rings);

  // Groups: rig (entrance) → turn (idle sway) → body (orientation and scale) → model.
  const rig = new Group();
  const turn = new Group();
  const body = new Group();
  body.rotation.set(...BODY_TURN);
  body.scale.setScalar(narrow ? 6.2 : 6.8);
  body.add(model);
  turn.add(body);
  turn.add(sputnik);
  rig.add(turn);
  stage.root.add(rig);

  const pose = (open: number) => {
    const k = 1 - open * RELEASE;
    for (const f of fingers) {
      const p = POSE[f.name];
      f.joints.forEach((joint, i) => {
        const r = rest.get(joint)!;
        joint.rotation.set(r.x, r.y, r.z);
        if (i === 1) joint.rotateZ(p.spread * (1 + open * 0.5));
        if (i >= 1 && i <= 3) joint.rotateX((p.bend[i] ?? 0) * k);
      });
    }
    thumb.forEach((joint, i) => {
      const r = rest.get(joint)!;
      joint.rotation.set(r.x, r.y, r.z);
      if (i === 0) joint.rotateZ(POSE.thumb.spread * (1 + open * 0.4));
      if (i <= 2) joint.rotateX((POSE.thumb.bend[i] ?? 0) * k);
    });
  };
  pose(0);

  // Sputnik rests on the index and middle fingertips.
  const tipA = new Vector3();
  const tipB = new Vector3();
  const seat = new Vector3();
  const seatSputnik = () => {
    turn.updateMatrixWorld(true);
    bones.get('index-finger-tip')!.getWorldPosition(tipA);
    bones.get('middle-finger-tip')!.getWorldPosition(tipB);
    seat.copy(tipA).add(tipB).multiplyScalar(0.5);
    turn.worldToLocal(seat);
    sputnik.position.set(seat.x, seat.y + BALL * body.scale.x * 0.95, seat.z);
    sputnik.scale.setScalar(body.scale.x);
  };
  seatSputnik();

  // Frame the hand: wrist low in the box, Sputnik near the top.
  stage.camera.fov = narrow ? 30 : 28;
  stage.camera.position.set(0.05, narrow ? 0.55 : 0.5, narrow ? 4.1 : 4.6);
  stage.camera.lookAt(0, narrow ? 0.62 : 0.58, 0);
  stage.camera.updateProjectionMatrix();

  const V = new Vector3();

  return (master) => {
    const lift = { y: 0 };
    const sway = { z: 0 };
    const release = { open: 0, rings: 1, ball: 1 };

    // The hand rises out of the collage, then lets Sputnik go.
    master
      .from(lift, { y: -2.6, duration: 0.62, ease: 'expo.out' }, 'hand')
      .from(sway, { z: 0.32, duration: 0.9, ease: 'power3.out' }, 'hand')
      .to(release, { open: 1, duration: 0.35, ease: 'power2.out' }, 'launch')
      .to(release, { rings: 0, duration: 0.22, ease: 'power2.in' }, 'launch')
      .set(release, { ball: 0 }, 'launch+=0.02');

    return {
      update(time) {
        rig.position.y = lift.y;
        turn.rotation.set(Math.sin(time * 0.7) * 0.03, Math.sin(time * 0.5) * 0.12 - 0.08, sway.z + Math.sin(time * 0.9) * 0.02);
        pose(release.open);
        seatSputnik();
        rings.scale.setScalar(Math.max(0.0001, release.rings));
        ringGroups.forEach((ring, i) => (ring.rotation.z = time * (i ? -1.6 : 2.1)));
        ball.rotation.y = time * 0.8;
        sputnik.visible = release.ball > 0;
      },
      anchor(out) {
        sputnik.getWorldPosition(V);
        V.project(stage.camera);
        out.x = (V.x * 0.5 + 0.5) * stage.width;
        out.y = (-V.y * 0.5 + 0.5) * stage.height;
      },
    };
  };
}
