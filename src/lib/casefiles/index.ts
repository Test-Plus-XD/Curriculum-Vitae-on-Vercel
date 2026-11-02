import type { CaseFile } from '../casefile';
import aiAnnotation from './ai-annotation';
import cardGame from './card-game';
import chess from './2d-chess';
import dshAutoReply from './dsh-autoreply';
import gamingAiCompanion from './gaming-ai-companion';
import pourRice from './pourrice';
import puzzle from './2d-puzzle';
import steamPlatform from './steam-platform';
import yoloObjectDetection from './yolo-object-detection';
import zuulGame from './zuul-game';

// Every project's evidence, keyed by route id. Exported whole so the tests can walk all of it.
export const CASE_FILES: Record<string, CaseFile> = {
  'ai-annotation': aiAnnotation,
  'card-game': cardGame,
  '2d-chess': chess,
  'dsh-autoreply': dshAutoReply,
  'gaming-ai-companion': gamingAiCompanion,
  '2d-puzzle': puzzle,
  pourrice: pourRice,
  'steam-platform': steamPlatform,
  'yolo-object-detection': yoloObjectDetection,
  'zuul-game': zuulGame,
};

// Look up a project's case file; projects with no public trail of evidence simply have none.
export function getCaseFile(id: string): CaseFile | undefined {
  return CASE_FILES[id];
}
