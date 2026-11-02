import { bi, pick } from '@/lib/i18n-text';
import { HalftoneField, PosterSheet, PRESS } from './press';

/// Poster for DSH-Discord-AutoReply. Reads left to right as the plugin's own path: the wedge is the pipeline fed by
/// `MESSAGE_CREATE`, the speech block is the reply it drives into the message box, and the hand is the owner.

const LABEL = bi(
  'Constructivist poster: a red wedge drives a reply into a message box and stops there, while a hand with an open eye on its back reaches for the Enter key, because by default the plugin only drafts and a person reads and sends.',
  '構成主義海報：紅色楔形將一則回覆推入訊息輸入框後便停下，手背睜着一隻眼的手伸向 Enter 鍵；外掛預設只負責草擬，由人閱讀後親自發送。',
);

// The owner's hand, drawn from primitives with its fingertip at the origin and its wrist up the negative y axis, so
// the caller can place the fingertip exactly on the key. The eye on its back nods to Lissitzky's Constructor.
function Hand() {
  return (
    <g>
      <polygon points="-19,-13 -10,0 10,0 19,-13 19,-92 -19,-92" fill={PRESS.ink} />
      <polygon points="-30,-168 -30,-90 19,-84 19,-74 40,-74 40,-68 62,-68 62,-76 78,-76 84,-100 84,-168 66,-200 -6,-200" fill={PRESS.ink} />
      <polygon points="-26,-160 -72,-122 -72,-84 -52,-82 -24,-110" fill={PRESS.ink} />
      <rect x={-12} y={-226} width={84} height={20} fill={PRESS.red} />
      <rect x={-2} y={-470} width={64} height={238} fill={PRESS.ink} />
      <path d="M -20 -132 Q 27 -176 74 -132 Q 27 -88 -20 -132 Z" fill={PRESS.paper} />
      <circle cx={27} cy={-127} r={20} fill={PRESS.ink} />
      <circle cx={27} cy={-123} r={8} fill={PRESS.red} />
    </g>
  );
}

// The reply as a block of ink, with bars for lines of text, since a real message must never appear on the page.
function SpeechBlock() {
  return (
    <g>
      <polygon points="0,0 112,0 112,62 34,62 12,82 16,62 0,62" fill={PRESS.ink} />
      <rect x={12} y={12} width={88} height={9} fill={PRESS.paper} />
      <rect x={12} y={27} width={66} height={9} fill={PRESS.paper} />
      <rect x={12} y={42} width={40} height={9} fill={PRESS.paper} />
    </g>
  );
}

// Draws the draft's whole journey as the picture. Real structure from the source: `MESSAGE_CREATE` is the event the
// page bridge listens to (`page-bridge.ts`), `delivery: draft` is the default in `cordis.patch.yml`, whose comment
// says "you press Enter", and in that mode the plugin stops at the message box (sending is opt-in). So the wedge
// halts in the box and only the hand reaches the key. The box and bubble are plain shapes: no Discord logo, colour or wordmark.
export default function DshAutoreplyPoster({ locale }: { locale: string }) {
  return (
    <PosterSheet label={pick(LABEL, locale)}>
      <HalftoneField x={118} y={14} columns={20} rows={7} step={14} />
      <g transform="rotate(-5 320 270)">
        <rect x={36} y={236} width={424} height={80} fill={PRESS.paper} stroke={PRESS.ink} strokeWidth={8} />
        <rect x={478} y={236} width={90} height={90} fill={PRESS.ink} />
        <rect x={470} y={228} width={90} height={90} fill={PRESS.red} />
        <path d="M 540 250 V 280 H 498" fill="none" stroke={PRESS.paper} strokeWidth={10} />
        <polygon points="482,280 504,262 504,298" fill={PRESS.paper} />
        <text x={318} y={265} className="poster-type" fontSize={16} fill={PRESS.ink}>delivery:</text>
        <text x={318} y={298} className="poster-type" fontSize={32} fill={PRESS.ink}>draft</text>
        <rect x={420} y={271} width={7} height={32} fill={PRESS.red} />
      </g>
      <polygon points="-40,-40 30,-40 300,296 -40,228" fill={PRESS.red} />
      <text transform="translate(20 92) rotate(36)" className="poster-display" fontSize={18} fill={PRESS.paper}>MESSAGE_CREATE</text>
      <g transform="translate(146 232) rotate(-5)">
        <SpeechBlock />
      </g>
      <g transform="translate(512 216) rotate(20) scale(0.86)">
        <Hand />
      </g>
    </PosterSheet>
  );
}
