'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

// Morse code mapping
const MORSE: Record<string, string> = {
  A: '·−', B: '−···', C: '−·−·', D: '−··', E: '·', F: '··−·',
  G: '−−·', H: '····', I: '··', J: '·−−−', K: '−·−', L: '·−··',
  M: '−−', N: '−·', O: '−−−', P: '·−−·', Q: '−−·−', R: '·−·',
  S: '···', T: '−', U: '··−', V: '···−', W: '·−−', X: '−··−',
  Y: '−·−−', Z: '−−··', ' ': '   ',
};

function toMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((ch) => MORSE[ch] || '')
    .join(' ');
}

// Soviet space-themed messages
const MESSAGES = [
  'SPUTNIK LAUNCH SEQUENCE INITIATED',
  'COSMONAUT TELEMETRY NOMINAL',
  'ORBITAL INSERTION CONFIRMED',
  'VOSTOK CAPSULE SYSTEMS CHECK',
  'BAIKONUR COSMODROME STANDING BY',
  'LONG LIVE THE SPACE PROGRAMME',
  'PROTON ROCKET STAGE SEPARATION',
  'SALYUT STATION DOCKING APPROACH',
];

/**
 * MorseCodeTicker — Animated Morse code strip running horizontally,
 * inspired by Soviet military/space communications.
 * Hidden on the landing CV page and print.
 */
export default function MorseCodeTicker() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const morseStrip = useMemo(() => {
    const combined = MESSAGES.map(toMorse).join('       ');
    // Repeat to fill a wide strip
    return `${combined}       ${combined}`;
  }, []);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="print:hidden fixed top-12 left-0 right-0 pointer-events-none z-[2] overflow-hidden h-5 opacity-0 animate-morse-fade-in" aria-hidden="true">
      {/* Top ticker */}
      <div
        className="whitespace-nowrap font-mono text-[10px] tracking-[0.3em] animate-morse-scroll"
        style={{
          color: isDark ? 'rgba(143, 0, 0, 0.35)' : 'rgba(143, 0, 0, 0.15)',
        }}
      >
        {morseStrip}
      </div>
    </div>
  );
}
