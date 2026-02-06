'use client';

import Wave from 'react-wavify';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * RetroWave — animated wave overlay for retro-futuristic aesthetic
 * Only visible in dark mode, hidden on print
 */
export default function RetroWave() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch + only show in dark mode
  if (!mounted || resolvedTheme !== 'dark') return null;

  return (
    <div className="print:hidden fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-20">
      <Wave
        fill="url(#wave-gradient)"
        paused={false}
        options={{
          height: 15,
          amplitude: 25,
          speed: 0.15,
          points: 4,
        }}
        style={{ height: '180px' }}
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
          </linearGradient>
        </defs>
      </Wave>
    </div>
  );
}
