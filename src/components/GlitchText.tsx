'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * GlitchText — Soviet-style text scramble/glitch effect inspired by
 * CRT displays and analog telemetry readouts from Atomic Heart and Arknights.
 * Text scrambles through Cyrillic/symbol characters before resolving.
 *
 * Supports hover trigger, mount trigger, and viewport-entry trigger.
 */

const GLITCH_CHARS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ★●◆▲▼◀▶□■△▽◇◈';

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
  speed = 30,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameRef = useRef(0);
  const viewRef = useRef<HTMLDivElement>(null);
  const hasGlitchedOnView = useRef(false);
  const isInView = useInView(viewRef, { once: true, margin: '-30px' });

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
            if (char === ' ') return ' ';
            if (i < progress) return text[i];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      if (progress >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, speed);
  }, [text, speed, isGlitching]);

  useEffect(() => {
    if (glitchOnMount) {
      const timer = setTimeout(runGlitch, 200);
      return () => clearTimeout(timer);
    }
  }, [glitchOnMount, runGlitch]);

  /* Trigger glitch on viewport entry */
  useEffect(() => {
    if (glitchOnView && isInView && !hasGlitchedOnView.current) {
      hasGlitchedOnView.current = true;
      const timer = setTimeout(runGlitch, 100);
      return () => clearTimeout(timer);
    }
  }, [glitchOnView, isInView, runGlitch]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

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
