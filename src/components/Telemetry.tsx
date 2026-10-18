'use client';

import { useEffect, useState } from 'react';

function hongKongTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Hong_Kong',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

/** Mission-control readout: live Hong Kong time and coordinates. Wide screens only; decorative. */
export default function Telemetry() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(hongKongTime(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="telemetry" aria-hidden="true" data-header-item="">
      <span className="telemetry-dot" />
      <span>HKT {time ?? '--:--:--'}</span>
      <span className="telemetry-sep">/</span>
      <span>22.31°N 114.22°E</span>
    </span>
  );
}
