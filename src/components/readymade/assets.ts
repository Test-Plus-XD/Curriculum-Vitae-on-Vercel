import { Box3, CanvasTexture, SRGBColorSpace, Vector3, type Material, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let loader: GLTFLoader | null = null;

/** Load one of the CC0 models in /public/models (see CREDITS.txt there). */
export async function loadModel(name: string): Promise<Object3D> {
  loader ??= new GLTFLoader();
  const gltf = await loader.loadAsync(`/models/${name}/${name}.gltf`);
  return gltf.scene;
}

/** Bounding box of an object in its parent's space. */
export function measure(object: Object3D) {
  object.updateMatrixWorld(true);
  const box = new Box3().setFromObject(object);
  return { box, size: box.getSize(new Vector3()), centre: box.getCenter(new Vector3()) };
}

/** Run `fn` on every mesh material of an object. */
export function eachMaterial(object: Object3D, fn: (material: MeshStandardMaterial, mesh: Mesh) => void) {
  object.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    for (const m of ([] as Material[]).concat(mesh.material)) fn(m as MeshStandardMaterial, mesh);
  });
}

/** The value of a font-family custom property set by next/font (e.g. --ff-display). */
export function cssFont(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

/** Wait for the given fonts (CSS font shorthands), but never longer than `timeout` ms. */
export async function fontsReady(specs: string[], timeout = 1500) {
  await Promise.race([
    Promise.all(specs.map((s) => document.fonts.load(s))).catch(() => undefined),
    new Promise((r) => setTimeout(r, timeout)),
  ]);
}

/** Draw on a canvas and return it as an sRGB texture. */
export function paint(width: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
