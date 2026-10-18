import type { CSSProperties, ElementType, ReactNode } from 'react';
import { hashSeed, tornClipPath, type Side } from '@/lib/collage';

/** A strip of semi-transparent tape, as if holding a scrap to the wall. Decorative. */
export function Tape({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span className={`tape ${className ?? ''}`} style={style} aria-hidden="true" />;
}

interface TornProps {
  children: ReactNode;
  /** Any stable string; the tear pattern is derived from it. */
  seed: string;
  sides?: Side[];
  depth?: number;
  as?: ElementType;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
}

/**
 * Wraps content in a hand-torn scrap: the inner box is clipped to a jagged polygon and the outer box casts
 * the paper's shadow (box-shadow would be clipped away, so it uses a drop-shadow filter instead).
 */
export function Torn({
  children,
  seed,
  sides = ['top', 'bottom'],
  depth = 6,
  as: Tag = 'div',
  className,
  innerClassName,
  style,
}: TornProps) {
  return (
    <Tag className={`torn ${className ?? ''}`} style={style}>
      <div className={`torn-inner ${innerClassName ?? ''}`} style={{ clipPath: tornClipPath(hashSeed(seed), { sides, depth }) }}>
        {children}
      </div>
    </Tag>
  );
}

/** Newsprint scrap: a headline and typewritten lines cut from the CV itself. Decorative. */
export function NewsScrap({
  seed,
  headline,
  lines,
  className,
  style,
}: {
  seed: string;
  headline?: string;
  lines: string[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Torn
      seed={seed}
      sides={['top', 'right', 'bottom', 'left']}
      depth={5}
      className={`news-scrap ${className ?? ''}`}
      style={style}
    >
      <div aria-hidden="true">
        {headline && <p className="news-headline">{headline}</p>}
        {lines.map((line, i) => (
          <p key={i} className="news-line">
            {line}
          </p>
        ))}
      </div>
    </Torn>
  );
}

/**
 * Chinese name chop (白文印): carved cream characters on vermilion, read top-to-bottom, right-to-left —
 * the right column holds the surname, the left column the given name.
 */
export function Seal({ chars, className }: { chars: [string, string, string]; className?: string }) {
  const [surname, first, second] = chars;
  return (
    <span className={`seal ${className ?? ''}`} lang="zh-HK" aria-hidden="true">
      <span className="seal-inner">
        <span className="seal-a">{surname}</span>
        <span className="seal-b">{first}</span>
        <span className="seal-c">{second}</span>
      </span>
    </span>
  );
}

/** Embossed label-maker tape. */
export function LabelTape({
  children,
  className,
  as: Tag = 'span',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={`label-tape ${className ?? ''}`}>{children}</Tag>;
}
