import {
  BoxGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { gsap } from '@/lib/gsap';
import { eachMaterial, loadModel, measure } from '../assets';
import type { Work } from './types';

/** World height of the whole readymade, stool foot to rim top. */
const HEIGHT = 2.95;
/** Turned so the wheel reads as an ellipse and the stool in three-quarter view. */
const BASE_YAW = 0.62;
const SPOKES = 32;
/** The idle speed the wheel settles back to (rad/s). */
const IDLE_SPIN = 0.45;

/**
 * After Marcel Duchamp, "Bicycle Wheel" (1913), the first readymade: a front wheel and fork mounted upside
 * down in a kitchen stool. The stool is a scanned, white-painted one; the wheel is built here, with a red rim.
 * It turns slowly on its own, and can be spun by dragging across it, by scrolling, or with the button.
 */
export const duchamp: Work = async (stage) => {
  const stool = await loadModel('painted_wooden_stool');
  eachMaterial(stool, (m) => {
    m.envMapIntensity = 0.5;
  });

  // Metres: Duchamp's wheel is about 64 cm across on a stool about 60 cm high.
  const { box, centre } = measure(stool);
  const seatTop = box.max.y;
  const R = 0.31;
  const hubY = seatTop + R + 0.075;
  const top = hubY + R + 0.012;
  const s = HEIGHT / (top - box.min.y);

  const turn = new Group();
  const rig = new Group();
  const body = new Group();
  body.scale.setScalar(s);
  body.position.set(-centre.x * s, -((top + box.min.y) / 2) * s, -centre.z * s);
  turn.add(rig);
  rig.add(body);
  body.add(stool);
  stage.root.add(turn);

  const ink = new MeshStandardMaterial({ color: '#211c19', metalness: 0.75, roughness: 0.32 });
  const red = new MeshStandardMaterial({ color: '#c8231a', metalness: 0.3, roughness: 0.38 });

  // Fork and wheel drop into the seat together; the wheel spins inside the assembly around its axle (x).
  const assembly = new Group();
  assembly.position.set(centre.x, hubY, centre.z);
  body.add(assembly);
  const wheel = new Group();
  assembly.add(wheel);

  // A photograph's backdrop inside the rim, so the cut-out reads as a disc rather than a cobweb of spokes.
  const backdrop = new Mesh(
    new CircleGeometry(R - 0.004, 96),
    new MeshBasicMaterial({ color: '#e3dccf', side: DoubleSide, depthWrite: false }),
  );
  backdrop.rotation.y = Math.PI / 2;
  backdrop.renderOrder = -1;
  assembly.add(backdrop);

  const rim = new Mesh(new TorusGeometry(R, 0.0095, 10, 140), red);
  rim.rotation.y = Math.PI / 2;
  rim.scale.z = 1.7;
  wheel.add(rim);
  const hub = new Mesh(new CylinderGeometry(0.017, 0.017, 0.1, 18), ink);
  hub.rotation.z = Math.PI / 2;
  wheel.add(hub);
  for (const side of [-1, 1]) {
    const flange = new Mesh(new CylinderGeometry(0.03, 0.03, 0.004, 24), ink);
    flange.rotation.z = Math.PI / 2;
    flange.position.x = side * 0.034;
    wheel.add(flange);
  }

  // Tangentially laced spokes, alternating flanges.
  const spokes = new InstancedMesh(new CylinderGeometry(0.0024, 0.0024, 1, 5), ink, SPOKES);
  const up = new Vector3(0, 1, 0);
  const m = new Matrix4();
  const q = new Quaternion();
  for (let i = 0; i < SPOKES; i++) {
    const a = (i / SPOKES) * Math.PI * 2;
    const side = i % 2 ? 1 : -1;
    const lace = (i % 4 < 2 ? 1 : -1) * 0.38;
    const rimPoint = new Vector3(0, Math.cos(a) * (R - 0.007), Math.sin(a) * (R - 0.007));
    const hubPoint = new Vector3(side * 0.034, Math.cos(a + lace) * 0.027, Math.sin(a + lace) * 0.027);
    const dir = rimPoint.clone().sub(hubPoint);
    const length = dir.length();
    q.setFromUnitVectors(up, dir.normalize());
    m.compose(hubPoint.clone().add(rimPoint).multiplyScalar(0.5), q, new Vector3(1, length, 1));
    spokes.setMatrixAt(i, m);
  }
  wheel.add(spokes);

  // The fork, upside down: blades from the axle ends down to the crown sitting on the seat.
  const crownY = -(R + 0.045);
  for (const side of [-1, 1]) {
    const blade = new CatmullRomCurve3([
      new Vector3(side * 0.052, 0, 0),
      new Vector3(side * 0.05, -R * 0.45, 0.012),
      new Vector3(side * 0.042, crownY + 0.01, 0.004),
    ]);
    assembly.add(new Mesh(new TubeGeometry(blade, 24, 0.0085, 8), ink));
  }
  const crown = new Mesh(new BoxGeometry(0.11, 0.026, 0.038), ink);
  crown.position.y = crownY;
  assembly.add(crown);
  const steerer = new Mesh(new CylinderGeometry(0.013, 0.013, 0.09, 14), ink);
  steerer.position.y = crownY - 0.045;
  assembly.add(steerer);

  stage.camera.position.set(0, 0.3, 6.6);
  stage.camera.lookAt(0, 0.05, 0);

  return () => {
    const spin = { a: 0, v: 0 };
    const look = { x: 0, y: 0 };
    const lookX = gsap.quickTo(look, 'x', { duration: 1, ease: 'power3' });
    const lookY = gsap.quickTo(look, 'y', { duration: 1, ease: 'power3' });
    const scrolled = { p: 0.5 };
    const clampSpin = () => (spin.v = gsap.utils.clamp(-32, 32, spin.v));

    const intro = gsap.timeline({ paused: true, defaults: { duration: 0.8, ease: 'soviet' } });
    intro
      .addLabel('stool')
      .from(stool.position, { y: 1.4, duration: 1.05, ease: 'bounce.out' }, 'stool')
      .from(stool.rotation, { z: 0.3, y: -0.6, duration: 1.05, ease: 'power2.out' }, 'stool')
      .addLabel('wheel', 'stool+=0.75')
      .from(assembly.position, { y: '+=1.5', duration: 0.6, ease: 'power3.in' }, 'wheel')
      .from(assembly.rotation, { y: 1.4, x: 0.4, duration: 0.6, ease: 'power2.out' }, 'wheel')
      // Thunk: the fork bites into the seat.
      .to(body.scale, { y: s * 0.97, duration: 0.07, yoyo: true, repeat: 1, ease: 'power2.out' }, 'wheel+=0.6')
      .addLabel('spin', 'wheel+=0.7')
      .to(spin, { v: 7, duration: 1.2, ease: 'power2.out' }, 'spin');

    return {
      intro,
      update(time, dt) {
        // Free-wheeling: the spin decays towards a slow idle turn.
        if (!intro.isActive()) spin.v = IDLE_SPIN + (spin.v - IDLE_SPIN) * Math.exp(-dt * 0.32);
        spin.a += spin.v * dt;
        wheel.rotation.x = spin.a;
        turn.rotation.y = BASE_YAW + Math.sin(time * 0.27) * 0.22 + look.x * 0.45 + (scrolled.p - 0.5) * 0.5;
        turn.rotation.x = -look.y * 0.1;
      },
      look(x, y) {
        lookX(x);
        lookY(y);
      },
      drag(dx) {
        spin.v += dx * 0.05;
        clampSpin();
      },
      scroll(p, velocity) {
        scrolled.p = p;
        spin.v += velocity / 5000;
        clampSpin();
      },
      act() {
        if (intro.progress() < 1) {
          intro.play();
          return;
        }
        gsap.to(spin, { v: (spin.v >= 0 ? 1 : -1) * 18, duration: 0.35, ease: 'power2.out', overwrite: true });
      },
    };
  };
};
