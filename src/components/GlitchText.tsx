'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * GlitchText — Soviet-style text scramble/glitch effect inspired by
 * CRT displays and analogue telemetry readouts from Atomic Heart and Arknights.
 * Text scrambles through Cyrillic/symbol characters before resolving.
 *
 * Supports hover trigger, mount trigger, and viewport-entry trigger.
 * Extended duration for Traditional Chinese content to account for character complexity.
 */

const GLITCH_CHARS =
  'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ' +
  'ЁЂЄЅІЇЉЊЋЏ' +
  '★☭✶✪●◆▲■△◇' +
  '⌬⌖⊕⊗⊙⏣⎕' +
  'ΩΣΔΞΨΛЖФЩ' +
  'КОСМОССПУТНИКМИР';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
  glitchOnHover?: boolean;
  glitchOnMount?: boolean;
  /** Trigger scramble when element first enters the viewport */
  glitchOnView?: boolean;
  speed?: number;
}

export default function GlitchText({
  text,
  className = '',
  as: Tag = 'span',
  glitchOnHover = true,
  glitchOnMount = false,
  glitchOnView = false,
  speed: basespeed,
}: GlitchTextProps) {
  const pathname = usePathname();
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameRef = useRef(0);
  const viewRef = useRef<HTMLDivElement>(null);
  const hasGlitchedOnView = useRef(false);
  const isInView = useInView(viewRef, { once: true, margin: '-30px' });

  /// Locale detection — zh-hk path segments indicate Traditional Chinese mode
  const isChineseMode = pathname.includes('/zh-hk');

  /// Speed adjustment — slower animation for Traditional Chinese (7ms vs 10ms)
  /// This gives users more time to appreciate the complex character transitions
  const speed = basespeed ?? (isChineseMode ? 7 : 10);

  const runGlitch = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true);
    frameRef.current = 0;

    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current;

      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            /// Preserve spaces in the glitch animation
            if (char === ' ') return ' ';
            /// Characters before the progress point are resolved to final text
            if (i < progress) return text[i];
            /// Characters after progress point show random Cyrillic glitch characters
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      /// Animation completes when all characters have been resolved
      if (progress >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, speed);
  }, [text, speed, isGlitching]);

  /// Mount effect — trigger glitch animation on component mount if enabled
  useEffect(() => {
    if (glitchOnMount) {
      const timer = setTimeout(runGlitch, 200);
      return () => clearTimeout(timer);
    }
  }, [glitchOnMount, runGlitch]);

  /// Viewport entry effect — trigger glitch when element scrolls into view
  useEffect(() => {
    if (glitchOnView && isInView && !hasGlitchedOnView.current) {
      hasGlitchedOnView.current = true;
      const timer = setTimeout(runGlitch, 100);
      return () => clearTimeout(timer);
    }
  }, [glitchOnView, isInView, runGlitch]);

  /// Text synchronisation — update display text when prop changes
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  /// Cleanup effect — clear interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      ref={viewRef}
      className={`${className} ${isGlitching ? 'soviet-rgb-split' : ''}`}
      data-text={text}
      onMouseEnter={glitchOnHover ? runGlitch : undefined}
      whileHover={glitchOnHover ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {displayText}
    </MotionTag>
  );
}
