import {
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Shape,
  TubeGeometry,
  Vector3,
} from 'three';
import { gsap } from '@/lib/gsap';
import type { Work } from './types';

const TACKS = 14;
/** Seen from slightly below, three-quarters on, so the tacks read as spikes rather than dots. */
const BASE_PITCH = -0.52;
const BASE_YAW = 0.55;

/** Outline of a flat-iron soleplate (pointed nose at +x), `k` scales it. */
function soleplate(k: number) {
  const s = new Shape();
  s.moveTo(-0.75 * k, -0.42 * k);
  s.lineTo(0.12 * k, -0.42 * k);
  s.quadraticCurveTo(0.6 * k, -0.37 * k, 0.88 * k, 0);
  s.quadraticCurveTo(0.6 * k, 0.37 * k, 0.12 * k, 0.42 * k);
  s.lineTo(-0.75 * k, 0.42 * k);
  s.quadraticCurveTo(-0.84 * k, 0.42 * k, -0.84 * k, 0.3 * k);
  s.lineTo(-0.84 * k, -0.3 * k);
  s.quadraticCurveTo(-0.84 * k, -0.42 * k, -0.75 * k, -0.42 * k);
  return s;
}

/**
 * After Man Ray, "Cadeau" (Gift, 1921): a flat-iron with a row of tacks glued to its sole — a useful object
 * made useless, which suits a page that does not exist. Built from primitives; the tacks are hammered in one
 * by one when it arrives.
 */
export const manRay: Work = async (stage) => {
  // Cast iron a little lighter than life, so its form prints as halftone instead of a solid black shape.
  const iron = new MeshStandardMaterial({ color: '#6b625b', metalness: 0.45, roughness: 0.5 });
  const copper = new MeshStandardMaterial({ color: '#c0602e', metalness: 0.7, roughness: 0.32 });

  const turn = new Group();
  const rig = new Group();
  turn.add(rig);
  stage.root.add(turn);

  const object = new Group();
  object.position.y = -0.1;
  rig.add(object);

  const sole = new Mesh(
    new ExtrudeGeometry(soleplate(1), { depth: 0.11, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3, curveSegments: 28 }),
    iron,
  );
  sole.rotation.x = -Math.PI / 2;
  object.add(sole);
  const housing = new Mesh(
    new ExtrudeGeometry(soleplate(0.84), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 5, curveSegments: 28 }),
    iron,
  );
  housing.rotation.x = -Math.PI / 2;
  housing.position.set(-0.04, 0.13, 0);
  object.add(housing);
  const handle = new CatmullRomCurve3([
    new Vector3(-0.5, 0.3, 0),
    new Vector3(-0.44, 0.66, 0),
    new Vector3(-0.1, 0.76, 0),
    new Vector3(0.3, 0.7, 0),
    new Vector3(0.46, 0.3, 0),
  ]);
  object.add(new Mesh(new TubeGeometry(handle, 48, 0.06, 12), iron));

  // Fourteen tacks down the middle of the sole, points out.
  const tacks: Group[] = [];
  const headGeometry = new CylinderGeometry(0.05, 0.05, 0.014, 20);
  const pinGeometry = new ConeGeometry(0.019, 0.27, 10);
  for (let i = 0; i < TACKS; i++) {
    const tack = new Group();
    const head = new Mesh(headGeometry, copper);
    const pin = new Mesh(pinGeometry, copper);
    pin.rotation.x = Math.PI;
    pin.position.y = -0.142;
    tack.add(head, pin);
    tack.position.set(-0.62 + (i / (TACKS - 1)) * 1.32, -0.032, 0);
    object.add(tack);
    tacks.push(tack);
  }

  stage.camera.position.set(0, 0, 3.75);
  stage.camera.lookAt(0, 0, 0);

  return () => {
    const look = { x: 0, y: 0 };
    const lookX = gsap.quickTo(look, 'x', { duration: 1, ease: 'power3' });
    const lookY = gsap.quickTo(look, 'y', { duration: 1, ease: 'power3' });

    const intro = gsap.timeline({ paused: true, defaults: { duration: 0.8, ease: 'soviet' } });
    intro
      .addLabel('iron')
      .from(rig.position, { y: 2.6, duration: 1.1, ease: 'expo.out' }, 'iron')
      .from(rig.rotation, { x: '+=3.3', z: 0.8, duration: 1.4, ease: 'expo.out' }, 'iron')
      .addLabel('tacks', 'iron+=0.85');
    // Hammered through the sole one by one, each blow jolting the iron.
    tacks.forEach((tack, i) => {
      const at = `tacks+=${i * 0.085}`;
      intro
        .from(tack.position, { y: '+=0.29', duration: 0.15, ease: 'power4.in' }, at)
        .to(object.position, { y: -0.115, duration: 0.04, yoyo: true, repeat: 1, ease: 'power1.out' }, `${at}+=0.15`);
    });
    intro.addLabel('settled');

    return {
      intro,
      update(time) {
        turn.rotation.x = BASE_PITCH + Math.sin(time * 0.4) * 0.16 - look.y * 0.25;
        turn.rotation.y = BASE_YAW + Math.sin(time * 0.29) * 0.45 + look.x * 0.5;
        turn.rotation.z = 0.12 + Math.sin(time * 0.23) * 0.05;
      },
      look(x, y) {
        lookX(x);
        lookY(y);
      },
      // Pull the tacks and hammer them in again.
      act() {
        if (intro.progress() < 1) {
          intro.play();
          return;
        }
        intro.tweenTo('tacks', { duration: 0.45, ease: 'power2.in', onComplete: () => void intro.play('tacks') });
      },
    };
  };
};
