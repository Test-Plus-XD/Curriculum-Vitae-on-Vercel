import {
  BufferGeometry,
  Float32BufferAttribute,
  LinearFilter,
  Mesh,
  NoBlending,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Camera,
  type Object3D,
  type WebGLRenderer,
} from 'three';

/**
 * The "photomontage print" pass. The 3D scene is rendered off-screen, then redrawn as if it had been cut out
 * of a two-colour newspaper photograph and pasted on the page:
 *
 * - tones become a 45° black halftone screen; red surfaces print on a second, 15° red screen (slightly
 *   misregistered, as cheap presses do); very dark line work prints solid;
 * - a paper margin follows the silhouette with a wandering, hand-cut edge;
 * - a red halftone "shadow" sits under the cut-out, offset like a misregistered plate.
 *
 * Colours are plain sRGB (the pass writes straight to the canvas) and stay paper-coloured in both themes.
 */

export interface PrintOptions {
  /** Halftone cell, CSS px. */
  cell: number;
  /** Width of the paper margin around the cut-out, CSS px. */
  margin: number;
  /** Offset of the red shadow plate, CSS px (x right, y down). */
  shadow: [number, number];
  /** Strength of the red shadow plate (0–1). */
  shadowStrength: number;
  /** Tone curve: values below `black` print solid, above `white` print paper. */
  black: number;
  white: number;
  /** >1 darkens the mid-tones (more ink), <1 lightens them. */
  gamma: number;
  /** Seed for the hand-cut edge. */
  seed: number;
}

const DEFAULTS: PrintOptions = {
  cell: 4.2,
  margin: 7,
  shadow: [9, 11],
  shadowStrength: 0.55,
  black: 0.06,
  white: 0.94,
  gamma: 1.15,
  seed: 1.7,
};

/** Hex colour to raw sRGB components (no colour management: the pass writes display values). */
function rgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D tScene;
  uniform vec2 uTexel;
  uniform float uPx;
  uniform float uCell;
  uniform float uMargin;
  uniform vec2 uShadow;
  uniform float uShadowStrength;
  uniform vec2 uTone;
  uniform float uGamma;
  uniform float uSeed;
  uniform vec3 uPaper;
  uniform vec3 uBorder;
  uniform vec3 uInk;
  uniform vec3 uRed;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Largest coverage within radius r (device px): the paper left around the subject by the scissors.
  float reach(vec2 uv, float r) {
    float m = texture2D(tScene, uv).a;
    for (int i = 0; i < 12; i++) {
      float a = float(i) * 0.5235988;
      vec2 d = vec2(cos(a), sin(a)) * uTexel;
      m = max(m, texture2D(tScene, uv + d * r).a);
      m = max(m, texture2D(tScene, uv + d * r * 0.5).a);
    }
    return m;
  }

  // One halftone screen: the dot for this cell, sized by ink amount (0 = paper, 1 = solid).
  float screen(vec2 p, float angle, float amount) {
    float s = sin(angle);
    float c = cos(angle);
    vec2 q = mat2(c, s, -s, c) * p / uCell;
    float d = length(fract(q) - 0.5);
    float radius = sqrt(clamp(amount, 0.0, 1.0)) * 0.7071;
    float aa = 0.75 / (uCell * uPx);
    // No ink, no dot: without the step, anti-aliasing leaves a half-strength dot in every empty cell.
    return (1.0 - smoothstep(radius - aa, radius + aa, d)) * step(0.0001, amount);
  }

  vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  }

  void main() {
    vec4 src = texture2D(tScene, vUv);
    vec2 css = gl_FragCoord.xy / uPx;

    // The scissors wander: the margin swells and narrows along the outline.
    float wobble = noise(css * 0.045 + uSeed) * 0.62 + noise(css * 0.14 - uSeed) * 0.22;
    float r = uMargin * (0.62 + wobble) * uPx;
    float margin = smoothstep(0.32, 0.6, reach(vUv, r));
    vec2 shadowUv = vUv - vec2(uShadow.x, -uShadow.y) * uPx * uTexel;
    float shadow = smoothstep(0.25, 0.6, reach(shadowUv, r * 1.2)) * uShadowStrength;
    float inside = smoothstep(0.42, 0.62, src.a);

    vec3 c = src.a > 0.002 ? src.rgb / src.a : vec3(0.0);
    c = pow(aces(c * 1.05), vec3(1.0 / 2.2));
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    float redness = clamp((c.r - max(c.g, c.b)) * 2.6, 0.0, 1.0);
    float tone = pow(clamp((lum - uTone.x) / (uTone.y - uTone.x), 0.0, 1.0), uGamma);

    // Two plates on paper: red where the subject is red, black for the tones.
    vec3 col = uPaper;
    float red = screen(css + vec2(0.9, -0.6), 0.2618, redness * (0.6 + 0.4 * (1.0 - tone)));
    col = mix(col, uRed, red * 0.95);
    float ink = (1.0 - tone) * (1.0 - redness * 0.7);
    col = mix(col, uInk, screen(css, 0.7854, ink));
    col = mix(col, uInk, smoothstep(0.12, 0.035, lum));
    col *= 1.0 - noise(css * 0.9) * 0.05;

    vec3 border = uBorder * (1.0 - noise(css * 0.7 + 3.1) * 0.05);
    float shadowDots = screen(css + vec2(2.0, 1.0), 0.2618, shadow);

    // Premultiplied output: subject over margin over shadow plate.
    vec4 outColor = vec4(uRed * shadowDots, shadowDots);
    outColor = mix(outColor, vec4(border, 1.0), margin);
    outColor = mix(outColor, vec4(col, 1.0), inside);
    gl_FragColor = outColor;
  }
`;

export interface PrintPass {
  setSize(width: number, height: number, pixelRatio: number): void;
  render(scene: Object3D, camera: Camera): void;
  dispose(): void;
}

export function createPrintPass(renderer: WebGLRenderer, options: Partial<PrintOptions> = {}): PrintPass {
  const o = { ...DEFAULTS, ...options };
  const target = new WebGLRenderTarget(2, 2, { samples: 4, minFilter: LinearFilter, magFilter: LinearFilter });

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      tScene: { value: target.texture },
      uTexel: { value: new Vector2(0.5, 0.5) },
      uPx: { value: 1 },
      uCell: { value: o.cell },
      uMargin: { value: o.margin },
      uShadow: { value: new Vector2(o.shadow[0], o.shadow[1]) },
      uShadowStrength: { value: o.shadowStrength },
      uTone: { value: new Vector2(o.black, o.white) },
      uGamma: { value: o.gamma },
      uSeed: { value: o.seed },
      uPaper: { value: rgb('#f6efe2') },
      uBorder: { value: rgb('#fbf7ee') },
      uInk: { value: rgb('#17120f') },
      uRed: { value: rgb('#c8231a') },
    },
    blending: NoBlending,
    depthTest: false,
    depthWrite: false,
  });

  // One triangle that covers the viewport.
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const quad = new Mesh(geometry, material);
  quad.frustumCulled = false;
  const quadScene = new Scene();
  quadScene.add(quad);
  const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  return {
    setSize(width, height, pixelRatio) {
      const w = Math.max(2, Math.round(width * pixelRatio));
      const h = Math.max(2, Math.round(height * pixelRatio));
      target.setSize(w, h);
      material.uniforms.uTexel.value.set(1 / w, 1 / h);
      material.uniforms.uPx.value = pixelRatio;
    },
    render(scene, camera) {
      renderer.setRenderTarget(target);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(quadScene, quadCamera);
    },
    dispose() {
      target.dispose();
      material.dispose();
      geometry.dispose();
    },
  };
}
