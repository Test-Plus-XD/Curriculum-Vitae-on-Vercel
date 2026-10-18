/**
 * Shared SVG filters and patterns for the collage, rendered once per document.
 * - fx-ink: rubber-stamp ink — rough edges plus blotchy coverage.
 * - fx-duotone: photomontage print — luminance mapped to ink black → poster red → paper.
 * - fx-dots: halftone dot pattern for printed fills.
 */
export default function CollageDefs() {
  return (
    <svg width="0" height="0" className="collage-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="fx-ink" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="3" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="11" result="blotch" />
          <feColorMatrix in="blotch" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.15" result="coverage" />
          <feComposite in="rough" in2="coverage" operator="in" />
        </filter>

        <filter id="fx-ink-soft" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="2" seed="21" result="blotch" />
          <feColorMatrix in="blotch" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.9" result="coverage" />
          <feComposite in="rough" in2="coverage" operator="in" />
        </filter>

        <filter id="fx-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.35" intercept="-0.12" />
            <feFuncG type="linear" slope="1.35" intercept="-0.12" />
            <feFuncB type="linear" slope="1.35" intercept="-0.12" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.09 0.74 0.97" />
            <feFuncG type="table" tableValues="0.07 0.11 0.93" />
            <feFuncB type="table" tableValues="0.06 0.09 0.87" />
          </feComponentTransfer>
        </filter>

        {/* A lighter print for video thumbnails: about a third of the duotone blended over the original. */}
        <filter id="fx-duotone-soft" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" result="grey" />
          <feComponentTransfer in="grey" result="tone">
            <feFuncR type="table" tableValues="0.09 0.74 0.97" />
            <feFuncG type="table" tableValues="0.07 0.11 0.93" />
            <feFuncB type="table" tableValues="0.06 0.09 0.87" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="tone" operator="arithmetic" k1="0" k2="0.66" k3="0.34" k4="0" />
        </filter>

        <pattern id="fx-dots" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <circle cx="3.5" cy="3.5" r="1.6" fill="currentColor" />
        </pattern>
      </defs>
    </svg>
  );
}
