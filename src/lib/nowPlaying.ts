import { festival, type Set } from '../data/festival';

export type SetStatus = 'upcoming' | 'live' | 'done';

/** Full-datetime comparison — safe across the midnight crossover. */
export function statusOf(set: Set, now: Date): SetStatus {
  const t = now.getTime();
  if (t < new Date(set.start).getTime()) return 'upcoming';
  if (t <= new Date(set.end).getTime()) return 'live';
  return 'done';
}

export function liveSets(all: Set[], now: Date): Set[] {
  return all.filter((s) => statusOf(s, now) === 'live');
}

export function nextSet(all: Set[], now: Date): Set | undefined {
  const t = now.getTime();
  return all
    .filter((s) => new Date(s.start).getTime() > t)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))[0];
}

/** Doors → close window: the app "wakes up" inside it. */
export function isEventWindow(now: Date): boolean {
  const t = now.getTime();
  return t >= new Date(festival.doorsISO).getTime() && t <= new Date(festival.closeISO).getTime();
}

/** True when two sets overlap (for the My-Schedule conflict hint). */
export function overlaps(a: Set, b: Set): boolean {
  return new Date(a.start) < new Date(b.end) && new Date(b.start) < new Date(a.end);
}
