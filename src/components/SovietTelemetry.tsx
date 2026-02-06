'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface TelemetryEntry {
  label: string;
  value: string;
  unit: string;
}

const TELEMETRY_DATA: TelemetryEntry[] = [
  { label: 'ALT', value: '408', unit: 'KM' },
  { label: 'VEL', value: '7660', unit: 'M/S' },
  { label: 'ORB', value: '92.5', unit: 'MIN' },
  { label: 'INC', value: '51.6', unit: 'DEG' },
  { label: 'APO', value: '418', unit: 'KM' },
  { label: 'PER', value: '398', unit: 'KM' },
  { label: 'TEMP', value: '-157', unit: 'C' },
  { label: 'FUEL', value: '78.4', unit: '%' },
  { label: 'O2', value: '96.2', unit: '%' },
  { label: 'PWR', value: '4.8', unit: 'KW' },
  { label: 'COMM', value: '437', unit: 'MHZ' },
  { label: 'SPIN', value: '0.02', unit: 'RPM' },
];

/**
 * SovietTelemetry — Scrolling telemetry readout on the right edge,
 * inspired by Soviet mission control panels and CRT displays.
 * Hidden on the landing CV page and print. Hidden on mobile.
 */
export default function SovietTelemetry() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<string[]>(TELEMETRY_DATA.map((d) => d.value));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    // Randomly fluctuate telemetry values
    intervalRef.current = setInterval(() => {
      setValues((prev) =>
        prev.map((val, i) => {
          const base = parseFloat(TELEMETRY_DATA[i].value);
          const fluctuation = (Math.random() - 0.5) * base * 0.02;
          return (base + fluctuation).toFixed(TELEMETRY_DATA[i].value.includes('.') ? 1 : 0);
        })
      );
    }, 800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!mounted) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isCvPage = segments.length <= 1;
  if (isCvPage) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className="print:hidden fixed right-0 top-1/2 -translate-y-1/2 pointer-events-none z-[3] hidden lg:block"
      aria-hidden="true"
    >
      <div
        className="w-24 py-4 px-2 rounded-l-lg border-l border-y"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(26,26,26,0.95), rgba(15,15,15,0.98))'
            : 'linear-gradient(135deg, rgba(245,239,230,0.95), rgba(227,213,193,0.9))',
          borderColor: isDark ? 'rgba(143, 0, 0, 0.4)' : 'rgba(143, 0, 0, 0.2)',
          boxShadow: isDark
            ? '-4px 0 20px rgba(143, 0, 0, 0.15), inset 0 0 10px rgba(0,0,0,0.3)'
            : '-2px 0 10px rgba(143, 0, 0, 0.08)',
        }}
      >
        {/* Header */}
        <div
          className="text-[8px] font-mono font-bold tracking-widest mb-2 pb-1 border-b text-center"
          style={{
            color: isDark ? '#ffa500' : '#8f0000',
            borderColor: isDark ? 'rgba(219, 91, 0, 0.3)' : 'rgba(143, 0, 0, 0.15)',
          }}
        >
          CCCP ★ MKC
        </div>

        {/* Telemetry entries */}
        <div className="space-y-1.5">
          {TELEMETRY_DATA.map((entry, i) => (
            <div key={entry.label} className="font-mono">
              <div
                className="text-[7px] tracking-wider"
                style={{ color: isDark ? 'rgba(140, 134, 112, 0.7)' : 'rgba(143, 0, 0, 0.4)' }}
              >
                {entry.label}
              </div>
              <div className="flex items-baseline gap-0.5">
                <span
                  className="text-[9px] tabular-nums transition-all duration-300"
                  style={{
                    color: isDark ? '#db5b00' : '#8f0000',
                    textShadow: isDark ? '0 0 6px rgba(219,91,0,0.5), 0 0 12px rgba(143,0,0,0.2)' : 'none',
                  }}
                >
                  {values[i]}
                </span>
                <span
                  className="text-[6px]"
                  style={{ color: isDark ? 'rgba(140, 134, 112, 0.5)' : 'rgba(143, 0, 0, 0.3)' }}
                >
                  {entry.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Blinking status indicator */}
        <div className="mt-3 pt-1 border-t flex items-center gap-1.5"
          style={{ borderColor: isDark ? 'rgba(219, 91, 0, 0.3)' : 'rgba(143, 0, 0, 0.15)' }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-telemetry-blink"
            style={{ backgroundColor: isDark ? '#00ff41' : '#2d8f00' }}
          />
          <span
            className="text-[7px] font-mono tracking-wider"
            style={{ color: isDark ? 'rgba(0, 255, 65, 0.6)' : 'rgba(45, 143, 0, 0.5)' }}
          >
            ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}
