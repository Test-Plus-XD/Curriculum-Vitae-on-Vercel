'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

type Work = ComponentType<{ locale: string }>;

// One entry per project id (tested). Each work loads as its own chunk, so a page ships only its own drawing,
// and it is still rendered on the server, so the finished frame arrives with the HTML.
const WORKS: Record<string, Work> = {
  pourrice: dynamic(() => import('./works/pourrice')),
  'steam-platform': dynamic(() => import('./works/steam-platform')),
  '3d-game': dynamic(() => import('./works/3d-game')),
  '2d-puzzle': dynamic(() => import('./works/2d-puzzle')),
  '2d-chess': dynamic(() => import('./works/2d-chess')),
  'ai-annotation': dynamic(() => import('./works/ai-annotation')),
  'yolo-object-detection': dynamic(() => import('./works/yolo-object-detection')),
  'gaming-ai-companion': dynamic(() => import('./works/gaming-ai-companion')),
  'dsh-autoreply': dynamic(() => import('./works/dsh-autoreply')),
  'zuul-game': dynamic(() => import('./works/zuul-game')),
  'card-game': dynamic(() => import('./works/card-game')),
  'linux-server': dynamic(() => import('./works/linux-server')),
  'data-comm-networking': dynamic(() => import('./works/data-comm-networking')),
  'computer-ethics': dynamic(() => import('./works/computer-ethics')),
};

// The animated abstract of one project, or nothing if the project has none.
export default function ProjectAbstract({ id, locale }: { id: string; locale: string }) {
  const Abstract = WORKS[id];
  return Abstract ? <Abstract locale={locale} /> : null;
}