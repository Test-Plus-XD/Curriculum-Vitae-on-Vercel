import type { ReactNode } from 'react';

/** A titled block of the CV sheet. Plain server markup so it prints exactly as written. */
export default function CvSection({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`cv-section ${className ?? ''}`}>
      <h2 className="cv-h2 font-title">
        <span className="cv-h2-mark" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}
