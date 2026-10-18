'use client';

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import CosmosCanvas from './CosmosCanvas';
import ConstructivistField, { type FieldVariant } from './ConstructivistField';

function variantFor(pathname: string): FieldVariant {
  if (pathname.startsWith('/education')) return 'education';
  if (/^\/projects\/[^/]+/.test(pathname)) return 'detail';
  if (pathname.startsWith('/projects')) return 'projects';
  return 'cv';
}

/**
 * Fixed, decorative layers behind every page: architectural grid (CSS), the canvas star field, the
 * constructivist poster geometry, then grain, scanlines and vignette (CSS). Client-only, so nothing
 * unposed flashes before hydration; hidden from print and assistive technology.
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
      <div className="bg-grain" />
      <div className="bg-scanlines" />
      <div className="bg-vignette" />
    </div>
  );
}
