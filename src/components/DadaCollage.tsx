'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

/**
 * DadaCollage — Atmospheric Dada/Deconstructivist decorative layer.
 * Renders floating collage fragments: torn paper snippets, scattered
 * typographic fragments, ink stamps, diagonal slashes, and redaction bars.
 * Inspired by Reverse:1999 Cosmic Overture, Tristan Tzara, John Heartfield,
 * and deconstructivist graphic design (David Carson, Emigre).
 *
 * Hidden on the CV landing page and print.
 */

/* ── Dada text fragments — absurdist, typographic, multilingual ──── */
const DADA_FRAGMENTS = [
  { text: 'ДАДА', rotate: -7, size: 'text-lg' },
  { text: '§ 1916 §', rotate: 3, size: 'text-xs' },
  { text: 'MERZ', rotate: -4, size: 'text-sm' },
  { text: 'anti', rotate: 12, size: 'text-xs' },
  { text: '反藝術', rotate: -2, size: 'text-sm' },
  { text: 'TRISTAN', rotate: 5, size: 'text-xs' },
  { text: '№ 391', rotate: -9, size: 'text-xs' },
  { text: 'CABARET', rotate: 7, size: 'text-xs' },
  { text: 'VOLTAIRE', rotate: -3, size: 'text-xs' },
  { text: '解構', rotate: 8, size: 'text-sm' },
  { text: 'OBJET', rotate: -6, size: 'text-xs' },
  { text: 'TROUVÉ', rotate: 4, size: 'text-xs' },
];

/* ── Stamp texts — bureaucratic/absurdist seals ──────────────────── */
const STAMPS = [
  { text: 'ОДОБРЕНО', rotate: -15 },   // APPROVED in Russian
  { text: '機密', rotate: 8 },          // CLASSIFIED in Chinese
  { text: 'DADA', rotate: -22 },
  { text: '№ 1916', rotate: 12 },
];

/* ── Geometric fragment shapes for SVG collage ───────────────────── */
interface CollageFragment {
  id: number;
  x: number;         // % position
  y: number;         // % position
  rotate: number;
  width: number;
  height: number;
  type: 'paper' | 'stripe' | 'redact' | 'diagonal' | 'circle';
  opacity: number;
  drift: number;     // animation delay offset
}

function generateFragments(count: number, seed: number): CollageFragment[] {
  // Deterministic pseudo-random for SSR consistency
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };

  const types: CollageFragment['type'][] = ['paper', 'stripe', 'redact', 'diagonal', 'circle'];
  const fragments: CollageFragment[] = [];

  for (let i = 0; i < count; i++) {
    fragments.push({
      id: i,
      x: rand() * 90 + 5,
      y: rand() * 85 + 5,
      rotate: (rand() - 0.5) * 30,
      width: rand() * 60 + 20,
      height: rand() * 8 + 2,
      type: types[Math.floor(rand() * types.length)],
      opacity: rand() * 0.15 + 0.05,
      drift: rand() * 10,
    });
  }

  return fragments;
}

export default function DadaCollage() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fragments = useMemo(() => generateFragments(14, 42), []);

  if (!mounted) return null;

  // Hidden on CV landing page
  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';

  const paperColor = isDark ? 'rgba(227, 213, 193, 0.04)' : 'rgba(143, 0, 0, 0.03)';
  const strokeColor = isDark ? 'rgba(143, 0, 0, 0.3)' : 'rgba(143, 0, 0, 0.15)';
  const accentColor = isDark ? 'rgba(219, 91, 0, 0.25)' : 'rgba(219, 91, 0, 0.12)';

  return (
    <div
      className="print:hidden fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Floating torn paper fragments ────────────────────────── */}
      {fragments.map((frag) => (
        <div
          key={frag.id}
          className="absolute animate-dada-drift"
          style={{
            left: `${frag.x}%`,
            top: `${frag.y}%`,
            '--dada-rotate': `${frag.rotate}deg`,
            animationDelay: `${frag.drift}s`,
            animationDuration: `${12 + frag.drift}s`,
          } as React.CSSProperties}
        >
          {frag.type === 'paper' && (
            <div
              className="dada-torn-edge dada-noise"
              style={{
                width: `${frag.width}px`,
                height: `${frag.height + 12}px`,
                background: `linear-gradient(${frag.rotate + 90}deg, ${paperColor}, transparent)`,
                border: `0.5px solid ${strokeColor}`,
                opacity: frag.opacity,
              }}
            />
          )}

          {frag.type === 'stripe' && (
            <div
              style={{
                width: `${frag.width + 30}px`,
                height: '1.5px',
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                opacity: frag.opacity * 2,
                transform: `rotate(${frag.rotate}deg)`,
              }}
            />
          )}

          {frag.type === 'redact' && (
            <div
              style={{
                width: `${frag.width}px`,
                height: '4px',
                background: isDark ? 'rgba(143, 0, 0, 0.2)' : 'rgba(143, 0, 0, 0.08)',
                opacity: frag.opacity * 3,
                transform: `rotate(${frag.rotate * 0.3}deg)`,
              }}
            />
          )}

          {frag.type === 'diagonal' && (
            <svg
              width={frag.width}
              height={frag.width}
              viewBox={`0 0 ${frag.width} ${frag.width}`}
              style={{ opacity: frag.opacity * 1.5 }}
            >
              <line
                x1="0"
                y1={frag.width}
                x2={frag.width}
                y2="0"
                stroke={isDark ? '#8f0000' : '#8f0000'}
                strokeWidth="0.5"
                opacity={isDark ? 0.4 : 0.2}
              />
              <line
                x1={frag.width * 0.2}
                y1={frag.width}
                x2={frag.width}
                y2={frag.width * 0.2}
                stroke={isDark ? '#db5b00' : '#a04000'}
                strokeWidth="0.3"
                opacity={isDark ? 0.3 : 0.15}
              />
            </svg>
          )}

          {frag.type === 'circle' && (
            <svg
              width={frag.height + 14}
              height={frag.height + 14}
              viewBox="0 0 20 20"
              style={{ opacity: frag.opacity * 2 }}
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke={isDark ? '#8f0000' : '#8f0000'}
                strokeWidth="0.5"
                strokeDasharray="2 3"
                opacity={isDark ? 0.4 : 0.2}
              />
              <circle
                cx="10"
                cy="10"
                r="4"
                fill="none"
                stroke={isDark ? '#db5b00' : '#a04000'}
                strokeWidth="0.3"
                opacity={isDark ? 0.3 : 0.12}
              />
            </svg>
          )}
        </div>
      ))}

      {/* ── Scattered typographic fragments ──────────────────────── */}
      {DADA_FRAGMENTS.map((frag, i) => (
        <div
          key={`text-${i}`}
          className={`dada-scatter ${frag.size} font-title animate-dada-flicker`}
          style={{
            left: `${8 + (i * 7.2) % 85}%`,
            top: `${12 + ((i * 13.7 + 5) % 75)}%`,
            transform: `rotate(${frag.rotate}deg)`,
            color: isDark
              ? i % 3 === 0 ? 'rgba(143, 0, 0, 0.2)' : 'rgba(219, 91, 0, 0.15)'
              : i % 3 === 0 ? 'rgba(143, 0, 0, 0.08)' : 'rgba(219, 91, 0, 0.06)',
            '--dada-opacity': isDark ? '0.2' : '0.08',
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + (i % 4)}s`,
          } as React.CSSProperties}
        >
          {frag.text}
        </div>
      ))}

      {/* ── Dada ink stamps — bureaucratic absurdist seals ────────── */}
      {STAMPS.map((stamp, i) => {
        const positions = [
          { left: '15%', top: '25%' },
          { right: '12%', top: '45%' },
          { left: '70%', bottom: '35%' },
          { right: '25%', bottom: '22%' },
        ];
        return (
          <div
            key={`stamp-${i}`}
            className="absolute hidden lg:block"
            style={{
              ...positions[i],
              opacity: isDark ? 0.12 : 0.06,
            }}
          >
            <div
              className="border-2 rounded-full px-3 py-1.5 font-title italic text-xs font-bold tracking-widest"
              style={{
                borderColor: isDark ? '#8f0000' : '#8f0000',
                color: isDark ? '#8f0000' : '#8f0000',
                transform: `rotate(${stamp.rotate}deg)`,
                borderStyle: i % 2 === 0 ? 'solid' : 'double',
                boxShadow: isDark
                  ? 'inset 0 0 8px rgba(143, 0, 0, 0.1)'
                  : 'inset 0 0 4px rgba(143, 0, 0, 0.05)',
              }}
            >
              {stamp.text}
            </div>
          </div>
        );
      })}

      {/* ── Deconstructivist diagonal slash marks ─────────────────── */}
      <svg
        className="absolute top-[15%] right-[8%] w-32 h-32 hidden lg:block"
        viewBox="0 0 120 120"
        style={{ opacity: isDark ? 0.15 : 0.07 }}
      >
        <line x1="10" y1="110" x2="110" y2="10" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="1.5" />
        <line x1="20" y1="110" x2="110" y2="20" stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="0.8" />
        <line x1="30" y1="110" x2="110" y2="30" stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.4" />
        {/* Cross-slash for X tension */}
        <line x1="10" y1="10" x2="50" y2="50" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="0.5" strokeDasharray="4 6" />
      </svg>

      {/* ── Bottom-left collage corner — overlapping shapes ───────── */}
      <svg
        className="absolute bottom-[460px] left-[5%] w-24 h-20 hidden lg:block"
        viewBox="0 0 90 70"
        style={{ opacity: isDark ? 0.18 : 0.08 }}
      >
        {/* Overlapping rectangles — deconstructed grid */}
        <rect x="5" y="10" width="35" height="25" fill="none" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="0.8" transform="rotate(-5 22 22)" />
        <rect x="20" y="20" width="30" height="20" fill={paperColor} stroke={isDark ? '#db5b00' : '#a04000'} strokeWidth="0.5" transform="rotate(3 35 30)" />
        <rect x="40" y="5" width="25" height="35" fill="none" stroke={isDark ? '#ffa500' : '#db5b00'} strokeWidth="0.3" transform="rotate(-8 52 22)" strokeDasharray="3 4" />
        {/* Diagonal tension line */}
        <line x1="0" y1="60" x2="85" y2="5" stroke={isDark ? '#8f0000' : '#8f0000'} strokeWidth="0.4" opacity="0.5" />
      </svg>

      {/* ── Vertical typographic strip (right edge) ───────────────── */}
      <div
        className="absolute right-3 top-[20%] hidden xl:block"
        style={{
          writingMode: 'vertical-rl',
          fontSize: '9px',
          letterSpacing: '0.4em',
          fontFamily: 'var(--font-title)',
          fontStyle: 'italic',
          color: isDark ? 'rgba(143, 0, 0, 0.15)' : 'rgba(143, 0, 0, 0.06)',
          transform: 'rotate(180deg)',
        }}
      >
        DADA·ZÜRICH·1916·CABARET·VOLTAIRE
      </div>

      {/* ── Horizontal collage strip — torn edge divider ──────────── */}
      <div
        className="absolute left-[10%] right-[10%] top-[60%] h-px dada-torn-edge hidden lg:block"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, ${strokeColor}, ${accentColor}, transparent)`,
          opacity: isDark ? 0.35 : 0.15,
          transform: 'rotate(-0.8deg)',
        }}
      />
    </div>
  );
}
