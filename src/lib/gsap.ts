'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Flip } from 'gsap/Flip';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// The one place plugins are registered; every client component imports gsap from here.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, Flip, DrawSVGPlugin, CustomEase, MotionPathPlugin);

// "soviet": a hard, mechanical snap — fast out, firm landing.
CustomEase.create('soviet', 'M0,0 C0.08,0.72 0.18,0.98 0.42,1 0.66,1.01 0.8,1 1,1');
// "rewind": slow start, sharp middle, long settle — used by page transitions.
CustomEase.create('rewind', 'M0,0 C0.6,0 0.25,1 1,1');

gsap.defaults({ ease: 'soviet', duration: 0.8 });

// Entrance animations reveal real content, so they must finish on time even on a starved device or a
// throttled tab. Lag smoothing would count each very slow frame as ~33 ms and stretch them out for seconds.
gsap.ticker.lagSmoothing(0);

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const FULL_MOTION = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(pointer: fine)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;
}

export { gsap, useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, Flip, DrawSVGPlugin, MotionPathPlugin };
