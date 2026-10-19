import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DodecahedronGeometry,
  EdgesGeometry,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PMREMGenerator,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  SRGBColorSpace,
  TetrahedronGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from '@/lib/gsap';
import { makeSolids, type SolidShape } from './solids';

/**
 * The opening's low-poly layer: one full-screen, transparent Three.js canvas over the printed poster. It holds
 * three to five flat-shaded solids — Platonic bodies and a five-sided wedge, cut from the poster's own papers and
 * outlined in ink — that tumble at different depths while the virtual camera moves, so the flat poster gains
 * parallax; and the low-poly Sputnik that flies the ribbon once it leaves the hand. Which bodies turn up, where
 * they hang and how large they are is thrown fresh for every visit (see solids.ts).
 *
 * No halftone pass here (it would cost too much full-screen): lightly reflective poster colours and brushed-metal
 * linework echo the printed SVG art. Built from primitives, so there is nothing to load.
 */

/** Poster colours in sRGB; ink stays reserved for fine linework and Sputnik's antennae. */
const PAPER = {
  red: '#c8231a',
  ink: '#2a221d',
  kraft: '#c8963e',
  paper: '#efe5d3',
  steel: '#d4cdc1',
};

interface Solid {
  mesh: Group;
  base: Vector3;
  spin: Vector3;
  phase: number;
}

/** The virtual camera shared with the poster: pan in px, roll in degrees, zoom as a scale. */
export interface Camera2D {
  x: number;
  y: number;
  r: number;
  z: number;
}

export interface PolyPiece {
  /** How many solids this visit's arrangement threw (three to five). */
  count: number;
  /** Advance the solids and follow the virtual camera. */
  update(time: number, dt: number): void;
  /** Place the flying Sputnik at a screen point (px) heading along `angle` (radians, screen space). */
  fly(x: number, y: number, angle: number): void;
  render(): void;
  resize(): void;
  dispose(): void;
}

// Add a soft enamel sheen while keeping the paper colours and sharp facets legible.
function outlined(geometry: BufferGeometry, color: string, edges: LineBasicMaterial) {
  const group = new Group();
  group.add(new Mesh(geometry, new MeshStandardMaterial({ color, flatShading: true, roughness: 0.42, metalness: 0.24, envMapIntensity: 0.75 })));
  group.add(new LineSegments(new EdgesGeometry(geometry, 1), edges));
  return group;
}

/** The body for one spec: the same primitives as before, sized from the spec's radius. */
function solidGeometry(shape: SolidShape, radius: number): BufferGeometry {
  switch (shape) {
    case 'icosahedron':
      return new IcosahedronGeometry(radius, 0);
    case 'tetrahedron':
      return new TetrahedronGeometry(radius * 1.1, 0);
    case 'octahedron':
      return new OctahedronGeometry(radius * 1.1, 0);
    case 'box':
      return new BoxGeometry(radius * 1.5, radius * 1.5, radius * 1.5);
    case 'dodecahedron':
      return new DodecahedronGeometry(radius * 0.85, 0);
    case 'wedge':
      // A five-sided wedge, like a folded paper cone.
      return new ConeGeometry(radius * 0.62, radius * 2.4, 5);
  }
}

/** Creates the layer; returns a factory that adds its tweens to the master timeline. Throws without WebGL. */
export function buildPoly(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  { tall, coarse }: { tall: boolean; coarse: boolean },
): (master: gsap.core.Timeline, cam: Camera2D, labels: { lamp: number; whip: number; collage: number; launch: number }) => PolyPiece {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 0, 10);
  const hemi = new HemisphereLight(0xfff1dc, 0x4a3828, 1.5);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 6, 5);
  const rim = new DirectionalLight(0xdfe8ff, 1.1);
  rim.position.set(5, 3, -6);
  scene.add(hemi, key, rim);

  // Borrow the readymade stage's small studio reflection so enamel and steel catch light instead of falling black.
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.55;
  room.traverse((object) => {
    const mesh = object as Mesh;
    mesh.geometry?.dispose();
    const materials = ([] as (Material | undefined)[]).concat(mesh.material as Material | Material[] | undefined);
    for (const material of materials) material?.dispose();
  });
  pmrem.dispose();

  const edges = new LineBasicMaterial({ color: '#17120f', transparent: true, opacity: 0.85 });
  const spread = tall ? 0.5 : 1;
  const solidsGroup = new Group();
  scene.add(solidsGroup);
  // A fresh throw of three to five bodies for every visit: seeded from the moment the overlay is built.
  const solids: Solid[] = makeSolids((Math.random() * 0xffffffff) >>> 0).map((spec, i) => {
    const mesh = outlined(solidGeometry(spec.shape, spec.radius), PAPER[spec.paper], edges);
    mesh.position.set(spec.at[0] * spread, spec.at[1] * (tall ? 1.5 : 1), spec.at[2]);
    mesh.rotation.set(i * 0.7, i * 1.3, i * 0.4);
    solidsGroup.add(mesh);
    return { mesh, base: mesh.position.clone(), spin: new Vector3(...spec.spin), phase: spec.phase };
  });

  // Sputnik: a low-poly ball with four swept-back antennas, pointing along +x (its direction of travel).
  const sputnik = new Group();
  const ballGeometry = new IcosahedronGeometry(0.17, 1);
  sputnik.add(outlined(ballGeometry, PAPER.steel, edges));
  const antennaGeometry = new CylinderGeometry(0.008, 0.014, 0.72, 3);
  antennaGeometry.rotateZ(Math.PI / 2);
  antennaGeometry.translate(-0.36, 0, 0);
  const antennaMaterial = new MeshStandardMaterial({ color: PAPER.ink, flatShading: true, roughness: 0.8 });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const antenna = new Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(-0.08, Math.cos(a) * 0.1, Math.sin(a) * 0.1);
    antenna.rotation.set(0, -Math.sin(a) * 0.3, Math.cos(a) * 0.3);
    sputnik.add(antenna);
  }
  // Roll about its own axis first, then turn to its heading.
  sputnik.rotation.order = 'ZYX';
  sputnik.visible = false;
  scene.add(sputnik);

  const size = { w: 1, h: 1 };
  const resize = () => {
    size.w = Math.max(1, host.clientWidth);
    size.h = Math.max(1, host.clientHeight);
    renderer.setSize(size.w, size.h, false);
    camera.aspect = size.w / size.h;
    camera.updateProjectionMatrix();
  };
  resize();

  const ray = new Raycaster();
  const ground = new Plane(new Vector3(0, 0, 1), 0);
  const ndc = new Vector2();
  const hit = new Vector3();

  return (master, cam, labels) => {
    const state = { solids: 0, away: 0, sputnik: 0 };
    // The solids drift in as the lamp comes up, are swept off with the poster, then Sputnik takes the stage.
    master
      .to(state, { solids: 1, duration: 1.1, ease: 'expo.out' }, labels.lamp + 0.45)
      .to(state, { away: 1, duration: 0.34, ease: 'power3.in' }, labels.whip)
      .set(state, { solids: 0 }, labels.collage + 0.1)
      .set(state, { sputnik: 1 }, labels.launch);

    const piece: PolyPiece = {
      count: solids.length,
      update(time, dt) {
        // Follow the poster's virtual camera: pan (px → world at the poster's depth), roll and zoom.
        const unit = (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z) / size.h;
        camera.position.x = -cam.x * unit * 0.6;
        camera.position.y = cam.y * unit * 0.6;
        camera.position.z = 10 / Math.max(0.2, cam.z);
        camera.rotation.z = (-cam.r * Math.PI) / 180;
        camera.updateMatrixWorld();

        solidsGroup.visible = state.solids > 0.001;
        solids.forEach((s, i) => {
          const pop = gsap.utils.clamp(0, 1, state.solids * 1.6 - i * 0.09);
          s.mesh.scale.setScalar(Math.max(0.0001, pop));
          s.mesh.rotation.x += s.spin.x * dt;
          s.mesh.rotation.y += s.spin.y * dt;
          s.mesh.rotation.z += s.spin.z * dt;
          s.mesh.position.y = s.base.y + Math.sin(time * 0.9 + s.phase) * 0.12;
          // Swept off to the left with the whip, nearer bodies further.
          s.mesh.position.x = s.base.x - state.away * (9 + s.base.z * 1.6);
        });
        sputnik.visible = state.sputnik > 0;
        if (sputnik.visible) sputnik.rotation.x += dt * 5;
      },
      fly(x, y, angle) {
        ndc.set((x / size.w) * 2 - 1, -(y / size.h) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        if (!ray.ray.intersectPlane(ground, hit)) return;
        sputnik.position.copy(hit);
        sputnik.rotation.z = -angle - camera.rotation.z;
      },
      render() {
        renderer.render(scene, camera);
      },
      resize,
      dispose() {
        scene.traverse((o) => {
          const m = o as Mesh;
          m.geometry?.dispose();
          for (const mat of ([] as (Material | undefined)[]).concat(m.material as Material | Material[] | undefined)) mat?.dispose();
        });
        environment.dispose();
        renderer.dispose();
      },
    };
    return piece;
  };
}
