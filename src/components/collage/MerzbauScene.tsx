'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  Curve,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { rng } from '@/lib/collage';

export interface MerzbauContent {
  /** Typewritten lines for newsprint scraps (course codes, project names…). */
  snippets: string[];
  /** Big figures: grades, GPA, years. */
  numerals: { value: string; caption: string }[];
  /** Short Cyrillic / Latin slogans for red word blocks. */
  words: string[];
  /** Chinese characters for ink-on-paper scraps. */
  cjk: string[];
  /** Serial numbers for ticket stubs. */
  tickets: string[];
}

interface Props {
  content: MerzbauContent;
  /** Hero scroll progress (0 → 1), written by the hero's ScrollTrigger. */
  progressRef: MutableRefObject<number>;
  onFail?: () => void;
}

type Kind = 'news' | 'numeral' | 'halftone' | 'word' | 'cjk' | 'stripes' | 'ticket';
const KINDS: Kind[] = ['news', 'numeral', 'halftone', 'word', 'cjk', 'stripes', 'ticket', 'news', 'numeral', 'word'];

const PAPER = { scrap: '#f6efe2', news: '#e7ddc8', kraft: '#c39a63', red: '#c8231a', ink: '#17120f' };

interface Fonts {
  display: string;
  type: string;
  title: string;
  zh: string;
}

function cssFont(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

/** Paint one torn paper scrap on a canvas and return it as a texture. */
function paintScrap(kind: Kind, i: number, content: MerzbauContent, fonts: Fonts, rand: () => number): CanvasTexture {
  const w = 512;
  const h = kind === 'ticket' ? 256 : 384;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];

  // Torn outline, eaten 4–18px into the canvas on every side.
  const tear = (len: number, n: number, side: (t: number, d: number) => [number, number]) => {
    for (let k = 0; k <= n; k++) {
      const d = 4 + rand() * (k % 3 === 0 ? 14 : 6);
      const [x, y] = side((k / n) * len, d);
      ctx.lineTo(x, y);
    }
  };
  ctx.beginPath();
  ctx.moveTo(10, 10);
  tear(w, 26, (t, d) => [t, d]);
  tear(h, 18, (t, d) => [w - d, t]);
  tear(w, 26, (t, d) => [w - t, h - d]);
  tear(h, 18, (t, d) => [d, h - t]);
  ctx.closePath();
  ctx.save();
  ctx.clip();

  const base =
    kind === 'word'
      ? PAPER.red
      : kind === 'ticket'
        ? PAPER.kraft
        : kind === 'news'
          ? PAPER.news
          : kind === 'stripes'
            ? PAPER.scrap
            : rand() < 0.2
              ? PAPER.kraft
              : PAPER.scrap;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  // Paper fibres.
  for (let k = 0; k < 900; k++) {
    ctx.fillStyle = `rgba(${rand() < 0.5 ? '40,25,15' : '255,255,255'},${0.03 + rand() * 0.05})`;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2);
  }

  const inkOn = (red: boolean) => (red ? PAPER.red : PAPER.ink);
  ctx.textBaseline = 'alphabetic';

  if (kind === 'news') {
    ctx.fillStyle = PAPER.ink;
    ctx.font = `900 46px ${fonts.display}`;
    ctx.fillText(pick(content.words).toUpperCase(), 34, 78);
    ctx.fillRect(34, 92, w - 68, 4);
    ctx.font = `22px ${fonts.type}`;
    for (let line = 0; line < 9; line++) {
      ctx.fillStyle = `rgba(23,18,15,${0.72 + rand() * 0.25})`;
      ctx.fillText(content.snippets[(i * 3 + line) % content.snippets.length], 34, 132 + line * 27, w - 68);
    }
  } else if (kind === 'numeral') {
    const n = content.numerals[i % content.numerals.length];
    ctx.fillStyle = inkOn(rand() < 0.6);
    ctx.font = `italic 300 190px ${fonts.title}`;
    ctx.fillText(n.value, 34, 230);
    ctx.fillStyle = PAPER.ink;
    ctx.font = `24px ${fonts.type}`;
    ctx.fillText(n.caption.toUpperCase(), 40, 300);
  } else if (kind === 'halftone') {
    const red = rand() < 0.55;
    ctx.fillStyle = inkOn(red);
    const cx = w * (0.35 + rand() * 0.3);
    const cy = h * (0.4 + rand() * 0.2);
    const R = h * 0.42;
    for (let y = 8; y < h; y += 13) {
      for (let x = 8 + ((y / 13) % 2) * 6; x < w; x += 13) {
        const dist = Math.hypot(x - cx, y - cy) / R;
        const r = Math.max(0, 6.2 * (1 - dist * dist));
        if (r > 0.4) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else if (kind === 'word') {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.08);
    ctx.fillStyle = PAPER.scrap;
    ctx.font = `900 92px ${fonts.display}`;
    ctx.textAlign = 'center';
    ctx.fillText(pick(content.words).toUpperCase(), 0, 30, w - 40);
    ctx.restore();
    ctx.fillStyle = PAPER.ink;
    ctx.fillRect(0, h - 58, w, 24);
  } else if (kind === 'cjk') {
    ctx.fillStyle = PAPER.ink;
    ctx.font = `210px ${fonts.zh}`;
    ctx.fillText(pick(content.cjk), 40, 270);
    ctx.fillStyle = PAPER.red;
    ctx.fillRect(w - 128, h - 128, 84, 84);
    ctx.fillStyle = PAPER.scrap;
    ctx.font = `52px ${fonts.zh}`;
    ctx.fillText('吳', w - 112, h - 66);
  } else if (kind === 'stripes') {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 5);
    for (let s = -8; s < 8; s++) {
      ctx.fillStyle = s % 2 === 0 ? PAPER.red : s % 3 === 0 ? PAPER.ink : base;
      ctx.fillRect(-w, s * 34, w * 2, 26);
    }
    ctx.restore();
  } else if (kind === 'ticket') {
    ctx.fillStyle = PAPER.ink;
    ctx.font = `800 40px ${fonts.display}`;
    ctx.fillText('ADMIT ONE', 60, 92);
    ctx.font = `26px ${fonts.type}`;
    ctx.fillText(`No. ${content.tickets[i % content.tickets.length]}`, 60, 140);
    ctx.fillStyle = PAPER.red;
    ctx.font = `900 64px ${fonts.display}`;
    ctx.fillText('★', w - 130, 160);
    ctx.fillStyle = 'rgba(0,0,0,0.0)';
    ctx.globalCompositeOperation = 'destination-out';
    for (let y = 18; y < h; y += 26) {
      ctx.beginPath();
      ctx.arc(28, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  ctx.restore();
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Plane bent along its width so the scrap curls like real paper. */
function curledPlane(width: number, height: number, curl: number) {
  const geometry = new PlaneGeometry(width, height, 14, 1);
  const pos = geometry.attributes.position;
  for (let v = 0; v < pos.count; v++) {
    const x = pos.getX(v) / width;
    pos.setZ(v, curl * x * x * width);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Conical helix for the Tatlin tower. */
class Helix extends Curve<Vector3> {
  constructor(
    private turns: number,
    private height: number,
    private r0: number,
    private r1: number,
    private phase: number,
  ) {
    super();
  }
  getPoint(t: number, target = new Vector3()) {
    const a = t * this.turns * Math.PI * 2 + this.phase;
    const r = this.r0 + (this.r1 - this.r0) * t;
    return target.set(Math.cos(a) * r, t * this.height, Math.sin(a) * r);
  }
}

interface Scrap {
  mesh: Mesh;
  base: Vector3;
  rot: Vector3;
  out: Vector3;
  speed: number;
  phase: number;
  flip: { v: number };
}

/**
 * MERZBAU — a walk-in Dada collage after Kurt Schwitters, in Soviet poster colours. Torn scraps of the CV
 * float in depth (hover one and it flips over), a Lissitzky red wedge pierces a white disc, and a Tatlin
 * tower spirals in the background. Scrolling the hero flies the camera into the collage.
 */
export default function MerzbauScene({ content, progressRef, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
      });
    } catch {
      onFail?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = SRGBColorSpace;

    const reduced = prefersReducedMotion();
    const narrow = window.matchMedia('(max-width: 700px)').matches;
    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 80);
    camera.position.set(0, 0, 14);
    const fog = new Fog(new Color('#f5efe6'), 13, 34);
    scene.fog = fog;

    const hemi = new HemisphereLight(0xfff4e2, 0x3a2418, 1.15);
    const sun = new DirectionalLight(0xffffff, 1.7);
    sun.position.set(6, 9, 12);
    scene.add(hemi, sun);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(thing: T) => {
      disposables.push(thing);
      return thing;
    };

    // Lissitzky: "Beat the Whites with the Red Wedge" as a slowly turning sculpture.
    const lissitzky = new Group();
    const disc = new Mesh(
      track(new CylinderGeometry(2.1, 2.1, 0.3, 72)),
      track(new MeshStandardMaterial({ color: '#efe6d6', roughness: 0.92 })),
    );
    disc.rotation.x = Math.PI / 2;
    disc.position.set(1.1, 0.25, 0);
    const wedgeShape = new Shape();
    wedgeShape.moveTo(-3.6, -0.75);
    wedgeShape.lineTo(3.4, 0);
    wedgeShape.lineTo(-3.6, 0.75);
    wedgeShape.closePath();
    const wedgeGeometry = track(
      new ExtrudeGeometry(wedgeShape, {
        depth: 0.55,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 1,
      }),
    );
    wedgeGeometry.center();
    const wedge = new Mesh(wedgeGeometry, track(new MeshStandardMaterial({ color: '#c8231a', roughness: 0.6 })));
    wedge.position.set(-1.6, 0.05, 0.2);
    wedge.rotation.z = -0.12;
    const block = new Mesh(
      track(new BoxGeometry(1.25, 1.25, 0.25)),
      track(new MeshStandardMaterial({ color: '#17120f', roughness: 0.8 })),
    );
    block.position.set(2.9, -1.9, -0.6);
    block.rotation.z = 0.32;
    const ring = new Mesh(
      track(new TorusGeometry(2.75, 0.035, 8, 120)),
      track(new MeshStandardMaterial({ color: '#17120f', roughness: 0.7 })),
    );
    ring.position.copy(disc.position);
    lissitzky.add(disc, wedge, block, ring);
    scene.add(lissitzky);

    // Tatlin: Monument to the Third International, a leaning double spiral.
    const tatlin = new Group();
    const red = track(new MeshStandardMaterial({ color: '#c8231a', roughness: 0.55 }));
    const ink = track(new MeshStandardMaterial({ color: '#17120f', roughness: 0.7 }));
    tatlin.add(new Mesh(track(new TubeGeometry(new Helix(4.5, 9, 2.4, 0.5, 0), 260, 0.05, 5)), red));
    tatlin.add(new Mesh(track(new TubeGeometry(new Helix(4.5, 9, 2.4, 0.5, Math.PI), 260, 0.05, 5)), ink));
    const spine = new Mesh(track(new CylinderGeometry(0.05, 0.05, 10.5, 6)), ink);
    spine.position.set(0.9, 4.8, 0);
    spine.rotation.z = -0.32;
    tatlin.add(spine);
    for (const [y, r] of [
      [2, 1.95],
      [4.6, 1.45],
      [7, 0.95],
    ]) {
      const hoop = new Mesh(track(new TorusGeometry(r, 0.03, 6, 64)), ink);
      hoop.position.y = y;
      hoop.rotation.x = Math.PI / 2;
      tatlin.add(hoop);
    }
    tatlin.rotation.z = 0.22;
    scene.add(tatlin);

    const scraps: Scrap[] = [];
    const scrapGroup = new Group();
    scene.add(scrapGroup);
    const raycaster = new Raycaster();
    const pointer = new Vector2(10, 10);
    const camTarget = new Vector2(0, 0);
    let pointerMoved = false;
    let hovered: Object3D | null = null;
    let disposed = false;
    let visible = true;
    let time = 0;

    const layout = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      const portrait = camera.aspect < 1;
      lissitzky.position.set(portrait ? 0.6 : 4.3, portrait ? 3.4 : 0.1, portrait ? -5 : -2.5);
      lissitzky.scale.setScalar(portrait ? 0.55 : 0.72);
      tatlin.position.set(portrait ? -4 : -13, portrait ? -10 : -7, -17);
      tatlin.scale.setScalar(portrait ? 0.8 : 1.15);
    };

    const setTheme = () => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#f5efe6';
      fog.color.set(bg);
      const dark = document.documentElement.classList.contains('dark');
      hemi.intensity = dark ? 0.85 : 1.15;
      sun.intensity = dark ? 1.4 : 1.7;
    };

    const render = () => renderer.render(scene, camera);

    const frame = (_t: number, deltaMs: number) => {
      if (!visible || disposed) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      time += dt;
      const p = progressRef.current;
      camera.position.x += (camTarget.x * 1.3 - camera.position.x) * Math.min(1, dt * 2.5);
      camera.position.y += (camTarget.y * 0.9 - camera.position.y) * Math.min(1, dt * 2.5);
      camera.position.z = 14 - p * 4.5;
      camera.lookAt(0, -p * 1.5, -3);

      lissitzky.rotation.y = Math.sin(time * 0.28) * 0.38 + p * 1.4;
      lissitzky.rotation.x = Math.sin(time * 0.21) * 0.1;
      lissitzky.position.y += Math.sin(time * 0.9) * 0.0015;
      tatlin.rotation.y = time * 0.12;

      for (const s of scraps) {
        const bob = Math.sin(time * s.speed + s.phase);
        s.mesh.position.set(s.base.x + s.out.x * p * 5, s.base.y + bob * 0.35 + s.out.y * p * 5, s.base.z + s.out.z * p * 3);
        s.mesh.rotation.set(
          s.rot.x + bob * 0.08,
          s.rot.y + Math.sin(time * s.speed * 0.6 + s.phase) * 0.25 + s.flip.v,
          s.rot.z + bob * 0.05,
        );
      }

      if (pointerMoved) {
        pointerMoved = false;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(scrapGroup.children, false)[0]?.object ?? null;
        if (hit && hit !== hovered) {
          const scrap = scraps.find((s) => s.mesh === hit);
          if (scrap && !gsap.isTweening(scrap.flip))
            gsap.to(scrap.flip, { v: scrap.flip.v + Math.PI, duration: 1.1, ease: 'back.out(1.3)' });
        }
        hovered = hit;
      }
      render();
    };

    const onPointer = (e: PointerEvent) => {
      // Mouse and pen only: on a phone a finger is scrolling or tapping, and the camera should hold still.
      if (e.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      camTarget.set(pointer.x, pointer.y);
      pointerMoved = true;
    };

    const build = async () => {
      const fonts: Fonts = {
        display: cssFont('--ff-display', 'sans-serif'),
        type: cssFont('--ff-type', 'monospace'),
        title: cssFont('--ff-title', 'serif'),
        zh: cssFont('--ff-zh', 'sans-serif'),
      };
      // Paint with the real faces once they have loaded (but never wait more than 1.5 s).
      await Promise.race([
        Promise.all([
          document.fonts.load(`900 64px ${fonts.display}`),
          document.fonts.load(`22px ${fonts.type}`),
          document.fonts.load(`italic 300 64px ${fonts.title}`),
          document.fonts.load(`64px ${fonts.zh}`, '吳宇涵倒米港'),
        ]).catch(() => undefined),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      if (disposed) return;

      const rand = rng(1916);
      const count = narrow ? 10 : 17;
      for (let i = 0; i < count; i++) {
        const kind = KINDS[i % KINDS.length];
        const texture = track(paintScrap(kind, i, content, fonts, rand));
        const width = kind === 'ticket' ? 2.6 : 1.7 + rand() * 1.7;
        const height = width * (kind === 'ticket' ? 0.5 : 0.75);
        const geometry = track(curledPlane(width, height, (rand() - 0.5) * 0.18));
        const material = track(new MeshLambertMaterial({ map: texture, alphaTest: 0.5, side: DoubleSide }));
        const mesh = new Mesh(geometry, material);
        // Keep the text column (left) and the sculpture (centre-right) clear: anything placed there is
        // pushed deep into the fog.
        let base: Vector3;
        let guard = 0;
        do {
          base = new Vector3((rand() * 2 - 1) * 12.5, (rand() * 2 - 1) * 6.6, -16 + rand() * 17);
          guard++;
        } while (
          guard < 60 &&
          ((base.z > -10 && base.x < 1.2 && base.x > -11 && Math.abs(base.y) < 5.2) || (base.z > -5 && base.x > 2 && base.x < 7.5 && Math.abs(base.y) < 2.6))
        );
        const scrap: Scrap = {
          mesh,
          base,
          rot: new Vector3((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.9, (rand() - 0.5) * 0.9),
          out: base.clone().setZ(0).normalize(),
          speed: 0.35 + rand() * 0.5,
          phase: rand() * Math.PI * 2,
          flip: { v: 0 },
        };
        mesh.position.copy(base);
        scrapGroup.add(mesh);
        scraps.push(scrap);
      }
      layout();
      setTheme();
      frame(0, 16);
      if (!reduced) {
        gsap.ticker.add(frame);
        // Arrive: scraps drift in from the depths.
        scraps.forEach((s, k) => gsap.from(s.base, { z: s.base.z - 22, duration: 2.4, delay: 0.05 * k, ease: 'expo.out' }));
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) render();
    });
    ro.observe(host);
    const mo = new MutationObserver(() => {
      setTheme();
      if (reduced) render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('pointermove', onPointer, { passive: true });

    build();

    return () => {
      disposed = true;
      gsap.ticker.remove(frame);
      scraps.forEach((s) => {
        gsap.killTweensOf(s.flip);
        gsap.killTweensOf(s.base);
      });
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('pointermove', onPointer);
      disposables.forEach((d) => d.dispose());
      scene.traverse((o) => {
        const m = (o as Mesh).material as Material | undefined;
        m?.dispose?.();
      });
      renderer.dispose();
    };
  }, [content, progressRef, onFail]);

  return <canvas ref={canvasRef} className="merzbau-canvas" aria-hidden="true" />;
}
