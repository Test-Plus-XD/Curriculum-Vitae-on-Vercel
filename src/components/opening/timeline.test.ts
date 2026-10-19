import { describe, expect, it } from 'vitest';
import { LABELS } from './labels';

describe('opening timeline', () => {
  it('runs its beats in order and lasts six seconds', () => {
    const times = Object.values(LABELS);
    expect(times[0]).toBe(0);
    times.slice(1).forEach((t, i) => expect(t, Object.keys(LABELS)[i + 1]).toBeGreaterThan(times[i]));
    expect(LABELS.end).toBe(6);
  });

  it('opens the window onto the page before the end, with time to see it', () => {
    expect(LABELS.end - LABELS.window).toBeGreaterThanOrEqual(0.5);
    expect(LABELS.window - LABELS.launch).toBeGreaterThanOrEqual(0.4);
  });
});
