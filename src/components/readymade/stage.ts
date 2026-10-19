import {
  DirectionalLight,
  Group,
  HemisphereLight,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type Material,
  type Mesh,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createPrintPass, type PrintOptions } from './print';

export interface StageOptions {
  fov?: number;
  print?: Partial<PrintOptions>;
  /** Highest device pixel ratio to render at (default 2, or 1.5 on touch devices). */
  maxPixelRatio?: number;
}

export interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  /** Everything the work adds goes in here (so the stage can dispose it). */
  root: Group;
  width: number;
  height: number;
  /** Render one frame through the print pass. */
  render(): void;
  /** Measure the host again; returns true if the size changed. */
  resize(): boolean;
  dispose(): void;
}

/**
 * A small Three.js stage for one readymade: transparent canvas, studio lighting with a soft room reflection
 * (so metal reads as metal), and the photomontage print pass. Throws if WebGL is unavailable.
 */
export function createStage(canvas: HTMLCanvasElement, host: HTMLElement, options: StageOptions = {}): Stage {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  // Shader compiler chatter (e.g. Direct3D precision notes) only matters while developing.
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, options.maxPixelRatio ?? (coarse ? 1.5 : 2));
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.autoClear = true;

  const scene = new Scene();
  const camera = new PerspectiveCamera(options.fov ?? 32, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // Key from the upper left, a cool rim from behind, warm sky / dark floor: strong modelling for the halftone.
  const hemi = new HemisphereLight(0xfff1dc, 0x2a1d16, 1.1);
  const key = new DirectionalLight(0xffffff, 2.6);
  key.position.set(-4, 6, 6);
  const rim = new DirectionalLight(0xdfe8ff, 1.4);
  rim.position.set(5, 3, -6);
  scene.add(hemi, key, rim);

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment: Texture = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.55;
  room.traverse((o) => {
    const mesh = o as Mesh;
    mesh.geometry?.dispose();
    (mesh.material as Material | undefined)?.dispose?.();
  });
  pmrem.dispose();

  const root = new Group();
  scene.add(root);

  const print = createPrintPass(renderer, options.print);
  const stage: Stage = {
    renderer,
    scene,
    camera,
    root,
    width: 0,
    height: 0,
    render() {
      print.render(scene, camera);
    },
    resize() {
      const w = Math.max(1, Math.round(host.clientWidth));
      const h = Math.max(1, Math.round(host.clientHeight));
      if (w === stage.width && h === stage.height) return false;
      stage.width = w;
      stage.height = h;
      renderer.setSize(w, h, false);
      print.setSize(w, h, pixelRatio);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      return true;
    },
    dispose() {
      root.traverse((o) => {
        const mesh = o as Mesh;
        mesh.geometry?.dispose();
        const materials = ([] as (Material | undefined)[]).concat(mesh.material as Material | Material[] | undefined);
        for (const m of materials) {
          if (!m) continue;
          for (const value of Object.values(m)) if ((value as Texture | null)?.isTexture) (value as Texture).dispose();
          m.dispose();
        }
      });
      environment.dispose();
      print.dispose();
      renderer.dispose();
    },
  };
  stage.resize();
  return stage;
}
