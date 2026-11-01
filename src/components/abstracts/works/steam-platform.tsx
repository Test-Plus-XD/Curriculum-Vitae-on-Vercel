'use client';

import { gsap } from '@/lib/gsap';
import { bi, pick } from '@/lib/i18n-text';
import AbstractStage, { type AbstractSelector } from '../stage';
import { PRESS } from '../../posters/press';

const LABEL = bi(
  'A game card travels from a shelf into a cart, through Stripe Checkout and into the library, then the storage behind the PHP REST layer is swapped from MySQL to Cloud Firestore.',
  '遊戲卡由貨架移入購物車，經 Stripe Checkout 進入遊戲庫；其後 PHP REST 層背後的儲存由 MySQL 換成 Cloud Firestore。',
);
const CAPTION = bi(
  'A purchase passes the shelf, cart, Stripe and library while the storage behind the PHP layer changes from MySQL to Firestore.',
  '一次購買依次經過貨架、購物車、Stripe 及遊戲庫，PHP 層背後的儲存則由 MySQL 轉為 Firestore。',
);
const CART_TEXT = bi('CART', '購物車');
const LIBRARY_TEXT = bi('LIBRARY', '遊戲庫');

// The loop, in five beats on one timeline. The shelf reads through the PHP layer, the card hops to the cart, then
// into Stripe where the tick is drawn once the payment is confirmed, then lands in the library, which writes a record
// through the PHP layer into MySQL. The plug then slides across from MySQL to Firestore, the three collections stack
// up, and the same write is made again to show that the front of the store did not change. Every start value is a
// fixed number; later tweens use immediateRender: false so they do not overwrite earlier ones at build time.
function build(q: AbstractSelector) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  const hero = q('.hero');
  const plug = q('.plug');
  const draw = { drawSVG: '0% 100%' };
  const later = { immediateRender: false };
  // Assemble the stations and the PHP layer first.
  timeline.fromTo(q('.shelf, .cart, .stripe, .library, .band, .mysql'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0);
  timeline.fromTo(hero, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.3);
  timeline.fromTo(plug, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.5);
  // The catalogue is read through the PHP layer.
  timeline.fromTo(q('.readlink'), { drawSVG: '0% 0%' }, { ...draw, duration: 0.5 }, 0.9);
  // Leg one: shelf to cart, a hop from the shelf into the basket.
  timeline.fromTo(hero, { x: -396 }, { x: -316, duration: 0.9, ease: 'power2.inOut' }, 1.4);
  timeline.fromTo(hero, { y: 0 }, { y: -34, duration: 0.45 }, 1.4);
  timeline.fromTo(hero, { y: -34 }, { y: 10, duration: 0.45, ease: 'power2.in', ...later }, 1.85);
  // Leg two: cart to Stripe Checkout, then the payment tick is drawn.
  timeline.fromTo(hero, { x: -316 }, { x: -204, duration: 0.9, ease: 'power2.inOut', ...later }, 2.5);
  timeline.fromTo(hero, { y: 10 }, { y: -34, duration: 0.45, ...later }, 2.5);
  timeline.fromTo(hero, { y: -34 }, { y: 0, duration: 0.45, ease: 'power2.in', ...later }, 2.95);
  timeline.fromTo(q('.arrow-one'), { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 2.5);
  timeline.fromTo(q('.paid'), { drawSVG: '0% 0%' }, { ...draw, duration: 0.5 }, 3.5);
  // Leg three: Stripe to the library, a free landing in the third slot.
  timeline.fromTo(hero, { x: -204 }, { x: 0, duration: 0.9, ease: 'power2.inOut', ...later }, 4.2);
  timeline.fromTo(hero, { y: 0 }, { y: -34, duration: 0.45, ...later }, 4.2);
  timeline.fromTo(hero, { y: -34 }, { y: 0, duration: 0.45, ease: 'power2.in', ...later }, 4.65);
  timeline.fromTo(q('.arrow-two'), { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 4.2);
  // The purchase is recorded through the PHP layer into the storage that is plugged in.
  timeline.fromTo(q('.writelink'), { drawSVG: '0% 0%' }, { ...draw, duration: 0.4 }, 5.1);
  // The swap: the plug slides from MySQL to Firestore, whose three collections then stack up.
  timeline.fromTo(plug, { x: -300 }, { x: 0, duration: 1.2, ease: 'power2.inOut' }, 6);
  timeline.fromTo(q('.slab'), { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.12 }, 7.2);
  // The same write once more: the front of the store is unchanged.
  timeline.fromTo(q('.writelink'), { drawSVG: '0% 0%' }, { ...draw, duration: 0.4, ...later }, 7.7);
  return timeline;
}

// The drawing is a 640 by 360 poster in three rows: the stations of a purchase (shelf, cart, Stripe panel, library),
// the ink band of the PHP REST layer that the shelf and library both talk to, and the two storage options beneath it
// with the red plug seated in Firestore. The finished frame shows the card in the library's third slot, an empty
// dashed slot on the shelf, the payment tick on the Stripe panel and the plug in Firestore with its three
// collections (the repository's count); MySQL stays on the page as the earlier store.
export default function Abstract({ locale }: { locale: string }) {
  return (
    <AbstractStage label={pick(LABEL, locale)} caption={pick(CAPTION, locale)} build={build}>
      <rect width="640" height="360" fill={PRESS.paper} />
      <polygon points="420,10 630,10 630,46" fill={PRESS.red} />
      <rect x="16" y="16" width="120" height="8" fill={PRESS.ink} />
      <g className="shelf">
        <rect x="16" y="132" width="142" height="8" fill={PRESS.ink} />
        <rect x="24" y="78" width="38" height="54" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
        <polygon points="24,132 62,132 24,104" fill={PRESS.red} />
        <rect x="68" y="78" width="38" height="54" fill={PRESS.kraft} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="76" y="90" width="22" height="10" fill={PRESS.ink} />
        <rect x="112" y="78" width="38" height="54" fill="none" stroke={PRESS.ink} strokeWidth="3" strokeDasharray="6 5" />
      </g>
      <path className="readlink" d="M84 140 V200" stroke={PRESS.red} strokeWidth="6" fill="none" />
      <g className="cart">
        <polyline points="162,60 176,60 182,76" fill="none" stroke={PRESS.ink} strokeWidth="5" />
        <polygon points="178,76 244,76 234,120 190,120" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="4" />
        <circle cx="198" cy="134" r="6" fill={PRESS.ink} />
        <circle cx="228" cy="134" r="6" fill={PRESS.ink} />
      </g>
      <g className="stripe">
        <rect x="276" y="62" width="94" height="78" fill={PRESS.ink} />
        <polygon points="276,62 310,62 276,92" fill={PRESS.red} />
      </g>
      <path className="paid" d="M348 108 L355 118 L366 96" stroke={PRESS.paper} strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <polygon className="arrow-one" points="256,162 276,170 256,178" fill={PRESS.red} />
      <polygon className="arrow-two" points="387,162 407,170 387,178" fill={PRESS.red} />
      <g className="library">
        <rect x="410" y="132" width="146" height="8" fill={PRESS.ink} />
        <rect x="420" y="78" width="38" height="54" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="3" />
        <rect x="428" y="90" width="22" height="10" fill={PRESS.ink} />
        <rect x="464" y="78" width="38" height="54" fill={PRESS.kraft} stroke={PRESS.ink} strokeWidth="3" />
        <polygon points="464,132 502,132 502,104" fill={PRESS.deep} />
      </g>
      <path className="writelink" d="M548 140 V200" stroke={PRESS.red} strokeWidth="6" fill="none" />
      <g className="hero">
        <rect x="508" y="78" width="38" height="54" fill={PRESS.red} stroke={PRESS.ink} strokeWidth="3" />
        <polygon points="508,132 546,132 546,100" fill={PRESS.ink} />
        <rect x="516" y="88" width="22" height="10" fill={PRESS.paper} />
      </g>
      <text className="poster-display" x="211" y="176" fontSize="20" textAnchor="middle" fill={PRESS.ink}>{pick(CART_TEXT, locale)}</text>
      <text className="poster-display" x="323" y="176" fontSize="20" textAnchor="middle" fill={PRESS.ink}>STRIPE</text>
      <text className="poster-display" x="483" y="176" fontSize="20" textAnchor="middle" fill={PRESS.ink}>{pick(LIBRARY_TEXT, locale)}</text>
      <g className="band">
        <rect x="20" y="200" width="600" height="36" fill={PRESS.ink} />
        <text className="poster-display" x="36" y="225" fontSize="20" fill={PRESS.paper}>PHP REST</text>
      </g>
      <g className="mysql">
        <path d="M60 270 V316 A40 10 0 0 0 140 316 V270" fill={PRESS.newsprint} stroke={PRESS.ink} strokeWidth="4" />
        <path d="M60 292 A40 10 0 0 0 140 292" fill="none" stroke={PRESS.ink} strokeWidth="4" />
        <ellipse cx="100" cy="270" rx="40" ry="10" fill={PRESS.paper} stroke={PRESS.ink} strokeWidth="4" />
        <text className="poster-display" x="152" y="300" fontSize="18" fill={PRESS.ink}>MySQL</text>
      </g>
      <g className="plug">
        <rect x="397" y="236" width="6" height="14" fill={PRESS.red} />
        <rect x="391" y="250" width="18" height="8" fill={PRESS.red} />
      </g>
      <g className="slab">
        <rect x="350" y="264" width="100" height="18" fill={PRESS.red} />
        <rect x="360" y="271" width="56" height="4" fill={PRESS.paper} />
      </g>
      <g className="slab">
        <rect x="350" y="286" width="100" height="18" fill={PRESS.red} />
        <rect x="360" y="293" width="40" height="4" fill={PRESS.paper} />
      </g>
      <g className="slab">
        <rect x="350" y="308" width="100" height="18" fill={PRESS.red} />
        <rect x="360" y="315" width="68" height="4" fill={PRESS.paper} />
      </g>
      <text className="poster-display" x="462" y="300" fontSize="18" fill={PRESS.ink}>Firestore</text>
    </AbstractStage>
  );
}
