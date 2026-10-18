import {
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  type Object3D,
} from 'three';
import { gsap } from '@/lib/gsap';
import { cssFont, eachMaterial, fontsReady, loadModel, measure, paint } from '../assets';
import type { Work } from './types';

/** World height of the bust. */
const HEIGHT = 2.5;
const BASE_YAW = 0.12;

interface Part {
  group: Group;
  /** Where it is thrown in from (bust units, relative to its place) and how much it spins on the way. */
  from: { x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number };
}

function part(child: Object3D, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0, scale = 1) {
  const group = new Group();
  group.add(child);
  group.position.set(x, y, z);
  group.rotation.set(rx, ry, rz);
  group.scale.setScalar(scale);
  return group;
}

/** A strip that hugs the head along an arc, for the measuring tape pulled across the forehead. */
function tapeRibbon(segments: number) {
  const cx = -0.004;
  const cz = 0.008;
  const width = 0.028;
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  for (let k = 0; k <= segments; k++) {
    const t = k / segments;
    const a = 0.12 + t * 2.75;
    // Around the brow: slightly wider than the skull, rising to the forehead and dropping again.
    const x = cx + Math.cos(a) * 0.109;
    const z = cz + Math.sin(a) * 0.121;
    const y = 0.418 + Math.sin(t * Math.PI) * 0.022;
    positions.push(x, y - width / 2, z, x, y + width / 2, z);
    uvs.push(t, 0, t, 1);
    if (k < segments) {
      const i = k * 2;
      index.push(i, i + 2, i + 1, i + 1, i + 2, i + 3);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * After Raoul Hausmann, "Der Geist unserer Zeit — Mechanischer Kopf" (1920): a head with no thoughts of its
 * own, only the instruments fixed to it. Here a scanned marble bust is fitted with the tools of a programme
 * of study — a pocket watch, a measuring tape pulled across the brow, spectacles, a collapsible cup and a
 * grade card reading 3.8 (Hausmann's read 22).
 */
export const hausmann: Work = async (stage) => {
  const display = cssFont('--ff-display', 'sans-serif');
  const [bust, watch, tape, specs] = await Promise.all([
    loadModel('marble_bust_01'),
    loadModel('vintage_pocket_watch'),
    loadModel('measuring_tape_01'),
    loadModel('round_spectacles'),
    fontsReady([`800 40px ${display}`]),
  ]);

  // Bust units are metres (the scan is life-size): `body` scales them to the stage and centres the bust.
  const { size, centre } = measure(bust);
  const s = HEIGHT / size.y;
  const turn = new Group(); // idle sway, pointer and scroll
  const rig = new Group(); // the entrance
  const body = new Group();
  body.scale.setScalar(s);
  body.position.set(-centre.x * s, -centre.y * s, -centre.z * s);
  turn.add(rig);
  rig.add(body);
  body.add(bust);
  stage.root.add(turn);

  eachMaterial(bust, (m) => {
    m.roughness = 0.75;
    m.envMapIntensity = 0.6;
  });
  // Glass barely there, so the watch dial and the eyes behind the lenses print clearly.
  for (const object of [specs, watch]) {
    eachMaterial(object, (m) => {
      if (m.transparent) {
        m.opacity = 0.06;
        m.depthWrite = false;
      }
    });
  }

  // A grade card pinned to the forehead.
  const cardTexture = paint(384, 256, (ctx, w, h) => {
    ctx.fillStyle = '#efe5d2';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#17120f';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    // Heavy red numerals: thin strokes would vanish in the halftone.
    ctx.fillStyle = '#c8231a';
    ctx.font = `800 150px ${display}`;
    ctx.textAlign = 'center';
    ctx.fillText('3.8', w / 2, 186);
    ctx.fillStyle = '#17120f';
    ctx.font = `800 26px ${display}`;
    ctx.fillText('CGPA', w / 2, 238);
  });
  const card = new Mesh(new PlaneGeometry(0.09, 0.06), new MeshStandardMaterial({ map: cardTexture, roughness: 0.9, side: DoubleSide }));

  // The tape pulled out of its case and across the brow, with real centimetre marks.
  // Pale enough that the halftone leaves it nearly paper, so the solid-printed marks stand out.
  const tapeTexture = paint(1024, 64, (ctx, w, h) => {
    ctx.fillStyle = '#f7e6a6';
    ctx.fillRect(0, 0, w, h);
    const cm = w / 31;
    ctx.fillStyle = '#17120f';
    for (let mm = 0; mm < 310; mm++) {
      const x = (mm / 10) * cm;
      const long = mm % 10 === 0;
      ctx.fillRect(x, 0, long ? 4 : 2, long ? h * 0.5 : mm % 5 === 0 ? h * 0.34 : h * 0.2);
    }
    ctx.font = `800 26px ${display}`;
    for (let c = 1; c < 31; c++) {
      ctx.fillStyle = c % 10 === 0 ? '#c8231a' : '#17120f';
      ctx.fillText(String(c), c * cm - 9, h - 6);
    }
  });
  const RIBBON_SEGMENTS = 64;
  const ribbon = new Mesh(
    tapeRibbon(RIBBON_SEGMENTS),
    new MeshStandardMaterial({ map: tapeTexture, roughness: 0.5, metalness: 0.15, side: DoubleSide }),
  );
  body.add(ribbon);

  // A collapsible enamel cup on the crown.
  const cup = new Group();
  const enamel = new MeshStandardMaterial({ color: '#c8231a', roughness: 0.4, metalness: 0.15, side: DoubleSide });
  [
    [0.034, 0.031],
    [0.031, 0.028],
    [0.028, 0.025],
  ].forEach(([r0, r1], i) => {
    const ring = new Mesh(new CylinderGeometry(r1, r0, 0.022, 36, 1, true), enamel);
    ring.position.y = 0.011 + i * 0.016;
    cup.add(ring);
  });
  const cupBase = new Mesh(new CylinderGeometry(0.034, 0.034, 0.003, 36), enamel);
  cup.add(cupBase);

  const secondHand = watch.getObjectByName('vintage_pocket_watch_second_hand');
  const minuteHand = watch.getObjectByName('vintage_pocket_watch_minute_hand');

  const parts: Part[] = [
    { group: part(cup, -0.008, 0.507, 0.004, 0.05, 0, 0.1), from: { y: 0.55, ry: 4 } },
    { group: part(watch, -0.112, 0.402, 0.04, 0, -0.55, 0.2, 1.5), from: { x: -0.7, y: 0.12, rz: 3 } },
    { group: part(tape, 0.116, 0.39, 0.02, 0, -0.45, -0.18, 1.05), from: { x: 0.75, y: -0.08, rx: 2.4 } },
    { group: part(specs, -0.012, 0.384, 0.14, 0.06, -0.22, 0.11), from: { z: 0.6, y: 0.1, ry: 2.6 } },
    { group: part(card, 0.014, 0.488, 0.124, -0.5, 0.06, 0.16), from: { y: 0.45, z: 0.3, rz: -2.2 } },
  ];
  parts.forEach((p) => body.add(p.group));

  stage.camera.position.set(0, 0.15, 6.2);
  stage.camera.lookAt(0, 0.1, 0);

  return () => {
    const look = { x: 0, y: 0 };
    const lookX = gsap.quickTo(look, 'x', { duration: 0.9, ease: 'power3' });
    const lookY = gsap.quickTo(look, 'y', { duration: 0.9, ease: 'power3' });
    const scrolled = { p: 0.5 };
    const drawn = { v: 1 };
    const showRibbon = () => ribbon.geometry.setDrawRange(0, Math.round(drawn.v * RIBBON_SEGMENTS) * 6);

    const intro = gsap.timeline({ paused: true, defaults: { duration: 0.75, ease: 'soviet' } });
    intro
      .addLabel('arrive')
      .from(rig.position, { y: -3.4, duration: 1.3, ease: 'expo.out' }, 'arrive')
      .from(rig.rotation, { y: -1.5, duration: 1.6, ease: 'expo.out' }, 'arrive')
      .addLabel('parts', 'arrive+=0.8');
    // Each instrument is thrown at the head and sticks with a knock.
    parts.forEach(({ group, from }, i) => {
      const at = `parts+=${i * 0.3}`;
      intro
        .from(
          group.position,
          { x: `+=${from.x ?? 0}`, y: `+=${from.y ?? 0}`, z: `+=${from.z ?? 0}`, ease: 'power3.in' },
          at,
        )
        .from(
          group.rotation,
          { x: `+=${from.rx ?? 0}`, y: `+=${from.ry ?? 0}`, z: `+=${from.rz ?? 0}`, ease: 'power2.out' },
          at,
        )
        .to(body.rotation, { z: i % 2 ? 0.04 : -0.04, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.inOut' }, `${at}+=0.75`);
    });
    // Once the tape case has landed (the third part), the tape is pulled across the brow.
    intro
      .addLabel('tape', 'parts+=1.4')
      .from(drawn, { v: 0, duration: 1.1, ease: 'power2.inOut', onUpdate: showRibbon }, 'tape')
      .addLabel('settled');
    showRibbon();

    return {
      intro,
      update(time) {
        showRibbon();
        turn.rotation.y = BASE_YAW + Math.sin(time * 0.33) * 0.3 + look.x * 0.55 + (scrolled.p - 0.5) * 0.7;
        turn.rotation.x = -look.y * 0.12 + Math.sin(time * 0.21) * 0.02;
        // The watch keeps time: the second hand ticks once a second.
        if (secondHand) secondHand.rotation.z = -Math.floor(time) * (Math.PI / 30);
        if (minuteHand) minuteHand.rotation.z = -time * (Math.PI / 1800);
      },
      look(x, y) {
        lookX(x);
        lookY(y);
      },
      scroll(p) {
        scrolled.p = p;
      },
      // Knock the instruments off and fit them again.
      act() {
        if (intro.progress() < 1) {
          intro.play();
          return;
        }
        intro.tweenTo('parts', { duration: 0.6, ease: 'power2.in', onComplete: () => void intro.play('parts') });
      },
    };
  };
};
