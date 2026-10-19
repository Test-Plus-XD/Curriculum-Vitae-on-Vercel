import type { ReactNode } from 'react';
import { hashSeed, ransomGlyphs } from '@/lib/collage';
import { COLLAGE, MORPH, N, NIB, POSTER, WIDE_VIEWBOX, WHIP_SLAB, cogPath, ellipse, shukhovLines } from './art';

export interface OpeningCopy {
  caption: string;
  slugTop: string;
  slugBottom: string;
  strip: string;
}

/** Decorative Cyrillic, like the hero's pasted-up words: Merz, and the year. */
const BIG_TYPE = 'МЕРЦ·2026';

const NUCLEUS = `translate(${N.x} ${N.y})`;
const TOWER = shukhovLines(COLLAGE.tower.cx, COLLAGE.tower.top, COLLAGE.tower.bottom, COLLAGE.tower.rTop, COLLAGE.tower.rBottom);
const COG = cogPath(COLLAGE.cog.r, 11, 34);
const GEAR = cogPath(120, 9, 30);

/** A scrap of torn paper with its shadow: the shadow is an offset ink copy, so no filter is needed. */
function Scrap({ d, className, shadow = true, ...data }: { d: string; className: string; shadow?: boolean; 'data-op'?: string; 'data-hide'?: string }) {
  return (
    <g {...data}>
      {shadow && <path d={d} className="op-shadow" transform="translate(3 4)" />}
      <path d={d} className={className} />
    </g>
  );
}

/** One full-screen SVG layer of scene A; all layers share the view box so they line up exactly. */
function Layer({ name, children }: { name: string; children: ReactNode }) {
  return (
    <svg className="op-layer" data-op={name} viewBox={WIDE_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g transform={NUCLEUS}>{children}</g>
    </svg>
  );
}

/**
 * The opening's printed art, server-rendered so the first paint already holds the black sheet: the paper
 * plate, scene A (the constructivist poster the morph builds), the whip band, scene B (the collage the hand
 * rises into), the 2D Sputnik and the ribbon's rim. Everything starts hidden (`data-hide`) or under the ink
 * veil; the timeline reveals it. Decorative throughout: the caller wraps it in an aria-hidden stage.
 */
export default function OpeningStage({ copy, zh }: { copy: OpeningCopy; zh: boolean }) {
  const letters = ransomGlyphs(copy.caption, hashSeed(copy.caption));
  return (
    <>
      <svg className="op-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="op-dots" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="3.5" cy="3.5" r="1.7" className="op-dot-ink" />
          </pattern>
          <pattern id="op-dots-big" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="7.5" cy="7.5" r="4.3" className="op-dot-ink" />
          </pattern>
          <pattern id="op-dots-red" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <circle cx="4" cy="4" r="2" className="op-dot-red" />
          </pattern>
          <radialGradient id="op-sphere" cx="34%" cy="30%" r="76%">
            <stop offset="0%" stopColor="#fff8ea" stopOpacity="0.9" />
            <stop offset="38%" stopColor="#fff8ea" stopOpacity="0" />
            <stop offset="72%" stopColor="#17120f" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#17120f" stopOpacity="0.7" />
          </radialGradient>
          <linearGradient id="op-steel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffdf7" />
            <stop offset="12%" stopColor="#77736c" />
            <stop offset="26%" stopColor="#f5f1e8" />
            <stop offset="42%" stopColor="#89857e" />
            <stop offset="56%" stopColor="#fffefa" />
            <stop offset="72%" stopColor="#aaa49a" />
            <stop offset="86%" stopColor="#625e58" />
            <stop offset="100%" stopColor="#e5dfd3" />
          </linearGradient>
          <pattern id="op-metal-brush" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
            <path d="M0 0.5H10 M0 4.5H10 M0 8.5H10" stroke="#fffaf0" strokeOpacity="0.34" strokeWidth="0.6" />
            <path d="M0 2.5H10 M0 6.5H10" stroke="#17120f" strokeOpacity="0.16" strokeWidth="0.45" />
          </pattern>
          <filter id="op-grey" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0.04  0.3 0.59 0.11 0 0.03  0.3 0.59 0.11 0 0.02  0 0 0 1 0" />
          </filter>
          <clipPath id="op-cloud-clip">
            <path d={COLLAGE.cloud} />
          </clipPath>
          <clipPath id="op-print-clip">
            <path d={COLLAGE.printPanel} />
          </clipPath>
          <clipPath id="op-tower-clip">
            <path d={COLLAGE.towerStrip} />
          </clipPath>
        </defs>
      </svg>

      {/* The press sheet: paper, grid, creases, two dot screens, the lamp; an ink veil until the lamp comes up. */}
      <div className="op-plate" data-op="plate">
        <div className="op-paper" />
        <div className="op-screen op-screen-ink" />
        <div className="op-screen op-screen-red" />
        <div className="op-lamp" data-op="lamp" />
      </div>

      {/* Scene A: the poster, inside the virtual camera. Layers are separate SVGs so the ring and orbits can tilt in 3D. */}
      <div className="op-scene op-cam" data-op="cam">
      <div className="op-scene op-a" data-op="a">
        <Layer name="a-back">
          <g data-op="stripes" data-hide="">
            {POSTER.stripes.map((s, i) => (
              <line key={i} {...s} className="op-stripe" />
            ))}
          </g>
          <Scrap d={POSTER.triangle} className="op-ink" data-op="triangle" data-hide="" />
          <g transform={`translate(${POSTER.goldDiscAt.x} ${POSTER.goldDiscAt.y})`}>
            <g data-op="gold-disc" data-hide="">
              <Scrap d={POSTER.goldDisc} className="op-gold" />
              <path d={POSTER.goldDisc} fill="url(#op-dots-red)" />
            </g>
            <Scrap d={POSTER.goldSquare} className="op-gold" data-op="gold-square" data-hide="" />
          </g>
          <g data-op="dials" data-hide="">
            {POSTER.dials.map((d, i) => (
              <g key={i} transform={`translate(${d.x} ${d.y})`} data-op="dial">
                <circle r="21" className="op-dial" />
                {d.hand !== null && <line x1="0" y1="0" x2="30" y2="0" className="op-dial" transform={`rotate(${d.hand})`} />}
              </g>
            ))}
          </g>
          <g data-op="bars" data-hide="">
            <Scrap d={POSTER.bar} className="op-ink" />
            <Scrap d={POSTER.barStep} className="op-ink" shadow={false} />
          </g>
          <Scrap d={POSTER.redBar} className="op-red" data-op="red-bar" data-hide="" />
          <g transform={`translate(${POSTER.redSquareAt.x} ${POSTER.redSquareAt.y})`}>
            <Scrap d={POSTER.redSquare} className="op-red" data-op="red-square" data-hide="" />
          </g>
          <text className="op-slug" data-op="slug" data-hide="" x={POSTER.slugAt.x} y={POSTER.slugAt.y}>
            <tspan data-op="slug-top" x={POSTER.slugAt.x}>
              {copy.slugTop}
            </tspan>
            <tspan data-op="slug-bottom" x={POSTER.slugAt.x} dy="20">
              {copy.slugBottom}
            </tspan>
          </text>
          <g data-op="riser" data-hide="">
            <Scrap d={POSTER.riser} className="op-ink" />
            <path d={POSTER.riserStrip} className="op-concrete" />
            <text className="op-strip-text" transform="translate(-196 548) rotate(-64)">
              {copy.strip}
            </text>
          </g>
        </Layer>

        <Layer name="a-slabs">
          {POSTER.slabs.map((s, i) => (
            <g key={i} data-op="slab" data-hide="">
              <path d={s.d} className={s.cls} />
              {s.cls === 'op-gold' && <path d={s.d} fill="url(#op-dots)" opacity="0.5" />}
            </g>
          ))}
        </Layer>

        <Layer name="a-orbits">
          {POSTER.orbits.map((orbit, index) => {
            const orbitPath = ellipse(orbit.rx, orbit.ry);
            return (
              <g key={index} data-op="orbit" data-draw={orbit.draw} data-hide="" transform={`rotate(${orbit.rotate})`}>
                <path d={orbitPath} className="op-orbit-offset" transform="translate(3 4)" />
                <path d={orbitPath} className="op-orbit-rail" />
                <path d={orbitPath} className="op-orbit" />
                <path d={orbitPath} className="op-orbit-highlight" />
              </g>
            );
          })}
        </Layer>

        <Layer name="a-ring">
          <g data-op="ring" data-hide="">
            <path d={POSTER.ring} className="op-ring-offset" transform="translate(4 5)" />
            <path d={POSTER.ring} className="op-ring-edge" transform="translate(1 1)" />
            <path d={POSTER.ring} className="op-ring-metal" />
            <path d={POSTER.ring} className="op-ring-grain" />
          </g>
        </Layer>

        <Layer name="a-core">
          {/* The morph: one shape after another, hard cuts. */}
          <Scrap d={MORPH.inkDisc} className="op-ink" data-op="m-ink" data-hide="" />
          <Scrap d={MORPH.redDot} className="op-red" data-op="m-red" data-hide="" />
          <Scrap d={MORPH.bolt} className="op-red" data-op="m-bolt" data-hide="" />
          <Scrap d={MORPH.sliver} className="op-red" data-op="m-sliver" data-hide="" />
          <Scrap d={MORPH.triangle} className="op-red" data-op="m-triangle" data-hide="" />
          <Scrap d={MORPH.goldSliver} className="op-gold" data-op="m-gold-sliver" data-hide="" />
          <Scrap d={MORPH.square} className="op-red" data-op="m-square" data-hide="" />
          <Scrap d={MORPH.goldTriangle} className="op-gold" data-op="m-gold-triangle" data-hide="" />
          <Scrap d={MORPH.spike} className="op-ink" data-op="m-spike" data-hide="" />
          <g data-op="nucleus" data-hide="">
            <Scrap d={POSTER.nucleus} className="op-red" />
            <g data-op="sphere-shade" data-hide="">
              <circle r={POSTER.nucleusR - 2} fill="url(#op-sphere)" />
              <circle r={POSTER.nucleusR - 2} fill="url(#op-dots)" opacity="0.35" />
            </g>
          </g>
        </Layer>

        <Layer name="a-front">
          <g data-op="wedge" data-hide="">
            <Scrap d={POSTER.wedge} className="op-ink" />
            <path d={POSTER.wedge} fill="url(#op-dots-red)" opacity="0.55" />
            <path d={POSTER.wedgeStrip} className="op-gold" />
            <path d={POSTER.wedgeStrip} fill="url(#op-dots)" opacity="0.6" />
            <g transform={`translate(-8 -10) rotate(${NIB.angle})`} data-op="nib">
              <path d={NIB.body} fill="url(#op-steel)" className="op-nib" />
              <path d={NIB.body} fill="url(#op-metal-brush)" opacity="0.22" />
              <path d={NIB.slit} className="op-nib-slit" />
              <circle {...NIB.hole} className="op-nib-hole" />
            </g>
          </g>
        </Layer>

        <div className={`op-caption${zh ? ' is-zh' : ''}`} data-op="caption" aria-hidden="true">
          {letters.map((g, i) =>
            g.space ? (
              <span key={i} className="op-gap" />
            ) : (
              <span key={i} className="op-letter" data-op="letter" data-paper={g.paper} data-r={g.rotate}>
                {g.char}
              </span>
            ),
          )}
        </div>
        <div className="op-sidebar" data-op="sidebar" data-hide="" />
      </div>
      </div>

      {/* The whip pan: a slab of giant outlined type and a grey print strip sweeping past. */}
      <div className="op-scene op-band" data-op="band" data-hide="">
        <div className="op-band-slab" style={{ clipPath: WHIP_SLAB }}>
          <span className="op-band-type">{BIG_TYPE}</span>
        </div>
        <div className="op-band-print" />
      </div>

      {/* Scene B: the collage. The hand canvas and its fallback print sit above the art. */}
      <div className="op-scene op-b" data-op="b" data-hide="">
        <svg className="op-layer" viewBox={WIDE_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <g data-op="b-art">
            <path d={COG} transform={`translate(${COLLAGE.cog.x} ${COLLAGE.cog.y})`} className="op-ghost" />
            <path d={COLLAGE.labelStrip} className="op-concrete" />
            <text className="op-strip-text op-strip-long" transform="translate(338 960) rotate(-90)">
              {`${copy.caption} · ${copy.strip} · ${copy.caption} · ${copy.strip}`}
            </text>
            <path d={COLLAGE.thinStrip} className="op-concrete-light" />
            <Scrap d={COLLAGE.kraftTop} className="op-gold" />
            <Scrap d={COLLAGE.printPanel} className="op-newsprint" />
            <image data-href="/images/press/hausmann.webp" x="470" y="70" width="290" height="300" clipPath="url(#op-print-clip)" filter="url(#op-grey)" preserveAspectRatio="xMidYMid slice" />
            <Scrap d={COLLAGE.kraftFrame} className="op-gold" />
            <path d={COLLAGE.redPanel} className="op-red" />
            <path d={COLLAGE.redPanel} fill="url(#op-dots-big)" opacity="0.5" />
            <g transform={`translate(${COLLAGE.sunAt.x} ${COLLAGE.sunAt.y})`}>
              <path d={COLLAGE.sun} className="op-gold" />
            </g>
            <path d={COLLAGE.band} className="op-ink" />
            <path d={COLLAGE.swoosh} className="op-gold" />
            <g>
              <path d={COLLAGE.cloud} className="op-gold" />
              <g clipPath="url(#op-cloud-clip)">
                <rect x="470" y="520" width="290" height="190" fill="url(#op-dots)" opacity="0.35" />
                {COLLAGE.skyline.map((d, i) => (
                  <path key={i} d={d} className="op-skyline" />
                ))}
              </g>
            </g>
            <path d={COLLAGE.inkEdgeL} className="op-ink" />
            <path d={COLLAGE.towerStrip} className="op-concrete" />
            <image data-href="/images/press/clock.webp" x="1204" y="150" width="150" height="420" clipPath="url(#op-tower-clip)" filter="url(#op-grey)" preserveAspectRatio="xMidYMid meet" />
            <path d={COLLAGE.inkEdgeR} className="op-ink" />
            <path d={COLLAGE.cogPanel} className="op-ink" />
            <path d={GEAR} transform="translate(1520 150)" className="op-gear" />
            <text className="op-big-type" transform={`translate(${COLLAGE.bigType.x} ${COLLAGE.bigType.y}) rotate(90)`}>
              {BIG_TYPE}
            </text>
            <g data-op="tower">
              {TOWER.map((l, i) => (
                <line key={i} {...l} className="op-tower" />
              ))}
            </g>
            <g transform={`translate(${COLLAGE.moon.x} ${COLLAGE.moon.y})`}>
              <circle r={COLLAGE.moon.r} className="op-moon-orbit" />
              <circle cx="-34" cy="-10" r="30" className="op-moon" />
              <circle cx="-34" cy="-10" r="30" fill="url(#op-dots)" opacity="0.4" />
              <circle cx="46" cy="-38" r="7" className="op-moon" />
            </g>
          </g>
        </svg>
        <div className="op-hand" data-op="hand-host" />
        {/* eslint-disable-next-line @next/next/no-img-element -- a baked print, used only if WebGL is not ready */}
        <img className="op-hand-print" data-op="hand-print" data-hide="" data-src="/images/opening/hand.webp" alt="" draggable={false} decoding="async" />
      </div>

      {/* The ribbon's paper rim (the window itself is the overlay's clip-path). */}
      <svg className="op-rim" data-op="rim" aria-hidden="true" focusable="false">
        <path data-op="rim-a" className="op-rim-a" />
        <path data-op="rim-b" className="op-rim-b" />
      </svg>

      {/* The low-poly layer: solids around the poster, and Sputnik in flight (three.js, added when loaded). */}
      <div className="op-poly" data-op="poly-host" />

      {/* Sputnik in flight without WebGL: a printed ball with four swept-back antennas. */}
      <div className="op-sputnik" data-op="sputnik" data-hide="">
        <svg viewBox="-60 -30 90 60" aria-hidden="true" focusable="false">
          <g className="op-antennas">
            <line x1="-4" y1="-6" x2="-56" y2="-22" />
            <line x1="-4" y1="-2" x2="-58" y2="-8" />
            <line x1="-4" y1="2" x2="-58" y2="8" />
            <line x1="-4" y1="6" x2="-56" y2="22" />
          </g>
          <circle r="13" className="op-sputnik-ball" />
          <circle r="13" fill="url(#op-sphere)" />
          <circle r="13" fill="url(#op-dots)" opacity="0.4" />
        </svg>
      </div>
    </>
  );
}
