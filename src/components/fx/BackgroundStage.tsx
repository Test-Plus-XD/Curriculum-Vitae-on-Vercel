'use client';

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import CosmosCanvas from './CosmosCanvas';
import ConstructivistField, { type FieldVariant } from './ConstructivistField';
import InkMisregistration from './InkMisregistration';
import PressLamp from './PressLamp';

function variantFor(pathname: string): FieldVariant {
  if (pathname.startsWith('/education')) return 'education';
  if (/^\/projects\/[^/]+/.test(pathname)) return 'detail';
  if (pathname.startsWith('/projects')) return 'projects';
  return 'cv';
}

/** One corner of the press sheet: a registration cross and its ring. */
function RegistrationMark({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <svg className={`bg-reg bg-reg-${corner}`} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="9.5" />
      <path d="M20 1v11M20 28v11M1 20h11M28 20h11" />
    </svg>
  );
}

/**
 * Fixed, decorative layers behind every page: architectural grid (CSS), a faint halftone screen with its
 * red plate just out of register, the canvas star field, the constructivist poster geometry, then the
 * press-sheet furniture (registration marks, colour bar, marginalia), grain, scanlines and vignette.
 * Client-only, so nothing unposed flashes before hydration; hidden from print and assistive technology.
 */
export default function BackgroundStage() {
  const pathname = usePathname();
  const variant = variantFor(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-stage no-print" data-variant={variant} aria-hidden="true">
      <div className="bg-grid" />
      {mounted && (
        <>
          <CosmosCanvas />
          <ConstructivistField variant={variant} />
        </>
      )}
      <InkMisregistration />
      <div className="bg-dressing">
        <RegistrationMark corner="tl" />
        <RegistrationMark corner="tr" />
        <RegistrationMark corner="bl" />
        <RegistrationMark corner="br" />
        <div className="bg-bar">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="bg-slug bg-slug-left">Merz · Hannover · 1926</span>
        <span className="bg-slug bg-slug-right">HKCT · CGPA 3.8 · 2026</span>
      </div>
      <PressLamp />
      <div className="bg-grain" />
      <div className="bg-scanlines" />
      <div className="bg-vignette" />
    </div>
  );
}
