import type { ComponentType } from 'react';
import DshAutoReply from './dsh-autoreply';
import GamingAiCompanion from './gaming-ai-companion';
import YoloObjectDetection from './yolo-object-detection';
import ZuulGame from './zuul-game';

// The repository posters, keyed by project id. Every project with no video needs one (tested), since the
// poster stands in for the missing reel in the gazette and the page hero.
export const REPO_POSTERS: Record<string, ComponentType<{ locale: string }>> = {
  'dsh-autoreply': DshAutoReply,
  'gaming-ai-companion': GamingAiCompanion,
  'yolo-object-detection': YoloObjectDetection,
  'zuul-game': ZuulGame,
};
