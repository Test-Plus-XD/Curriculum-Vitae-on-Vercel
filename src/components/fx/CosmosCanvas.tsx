'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface Star {
  x: number;
  y: number;
  layer: 0 | 1 | 2;
  r: number;
  phase: number;
  speed: number;
  tint: 0 | 1 | 2;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const DEPTH = [0.25, 0.6, 1.2];
const POINTER_PX = [4, 10, 22];
const SCROLL_FACTOR = [0.03, 0.08, 0.16];
const LINK_RADIUS = 140;

/**
 * Canvas star field in three depth layers. Stars drift with pointer and scroll parallax, twinkle, and the
 * nearest foreground stars link to the pointer like a targeting HUD. Shooting stars cross the sky in dark
 * mode. Drawn on the GSAP ticker; a single still frame is drawn for reduced motion.
 */
export default function CosmosCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let dark = document.documentElement.classList.contains('dark');
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, px: -9999, py: -9999 };
    let nextMeteor = 2 + Math.random() * 4;
    let time = 0;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(240, Math.max(60, (width * height) / 6500)) * (width < 640 ? 0.6 : 1));
      stars = Array.from({ length: count }, () => {
        const layer = (Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2) as Star['layer'];
        return {
          x: Math.random(),
          y: Math.random(),
          layer,
          r: (0.4 + Math.random() * 0.8) * DEPTH[layer] + (layer === 2 ? 0.6 : 0.2),
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          tint: (Math.random() < 0.7 ? 0 : Math.random() < 0.6 ? 1 : 2) as Star['tint'],
        };
      });
    };

    const colour = (tint: Star['tint'], alpha: number) => {
      if (!dark) {
        // Light mode: ink and rust specks on aged paper.
        return tint === 2 ? `rgba(143,0,0,${alpha * 0.5})` : `rgba(60,48,36,${alpha * 0.35})`;
      }
      if (tint === 1) return `rgba(255,190,90,${alpha})`;
      if (tint === 2) return `rgba(255,110,70,${alpha})`;
      return `rgba(255,244,228,${alpha})`;
    };

    const draw = (dt: number) => {
      time += dt;
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
      const scroll = window.scrollY;
      ctx.clearRect(0, 0, width, height);

      const fg: { x: number; y: number }[] = [];
      for (const s of stars) {
        const ox = (pointer.x - 0.5) * -POINTER_PX[s.layer];
        const oy = (pointer.y - 0.5) * -POINTER_PX[s.layer];
        const y = (((s.y * height - scroll * SCROLL_FACTOR[s.layer] + oy) % height) + height) % height;
        const x = s.x * width + ox;
        const twinkle = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(time * s.speed + s.phase);
        ctx.beginPath();
        ctx.fillStyle = colour(s.tint, twinkle * (0.35 + s.layer * 0.25));
        if (s.layer === 2 && dark) {
          // Foreground stars: a small cross glint.
          ctx.fillRect(x - s.r * 2.2, y - 0.35, s.r * 4.4, 0.7);
          ctx.fillRect(x - 0.35, y - s.r * 2.2, 0.7, s.r * 4.4);
          fg.push({ x, y });
        }
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (dark && pointer.px > -999) {
        ctx.lineWidth = 0.6;
        for (const p of fg) {
          const d = Math.hypot(p.x - pointer.px, p.y - pointer.py);
          if (d < LINK_RADIUS) {
            ctx.strokeStyle = `rgba(255,165,0,${(1 - d / LINK_RADIUS) * 0.45})`;
            ctx.beginPath();
            ctx.moveTo(pointer.px, pointer.py);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      if (dark && !reduced) {
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          nextMeteor = 4 + Math.random() * 7;
          const fromLeft = Math.random() < 0.5;
          meteors.push({
            x: fromLeft ? Math.random() * width * 0.5 : width * (0.5 + Math.random() * 0.5),
            y: Math.random() * height * 0.4,
            vx: (fromLeft ? 1 : -1) * (520 + Math.random() * 380),
            vy: 220 + Math.random() * 160,
            life: 1,
          });
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.life -= dt * 1.1;
          if (m.life <= 0) {
            meteors.splice(i, 1);
            continue;
          }
          const tail = 0.16;
          const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
          grad.addColorStop(0, `rgba(255,236,200,${m.life})`);
          grad.addColorStop(0.3, `rgba(255,140,40,${m.life * 0.5})`);
          grad.addColorStop(1, 'rgba(219,91,0,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
          ctx.stroke();
        }
      }
    };

    const tick = (_t: number, deltaMs: number) => draw(Math.min(deltaMs, 50) / 1000);
    const still = () => draw(0);

    build();
    if (reduced) still();
    else gsap.ticker.add(tick);

    const onResize = () => {
      build();
      if (reduced) still();
    };
    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / width;
      pointer.ty = e.clientY / height;
      pointer.px = e.clientX;
      pointer.py = e.clientY;
    };
    const onLeave = () => {
      pointer.px = -9999;
      pointer.py = -9999;
    };
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains('dark');
      if (reduced) still();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      gsap.ticker.remove(tick);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="cosmos-canvas" aria-hidden="true" />;
}
