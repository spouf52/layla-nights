import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Single time source for the whole app (PLAN.md §6).
 * - 'live': device clock (production default on event day)
 * - 'demo': fixed test timestamp so the Playing-Now engine, LIVE pills
 *   and banners can be felt and QA'd before Nov 7.
 * Module state resets on reload — persistence comes with the CMS pass.
 */

let demoISO: string | null = null;
let version = 0;
const listeners = new Set<() => void>();

function notify() {
  version += 1;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getVersion() {
  return version;
}

export const DEMO_PRESETS: { label: string; iso: string }[] = [
  { label: 'Pre-doors', iso: '2026-11-07T17:25:00+01:00' },
  { label: 'Mid-set', iso: '2026-11-07T22:35:00+01:00' },
  { label: 'Headliner', iso: '2026-11-08T00:35:00+01:00' },
  { label: 'After close', iso: '2026-11-08T03:05:00+01:00' },
];

export function setDemoTime(iso: string | null) {
  demoISO = iso;
  notify();
}

export function isDemoMode() {
  return demoISO !== null;
}

export function getDemoISO() {
  return demoISO;
}

/** The "now" every time-dependent UI must read. */
export function getNow(): Date {
  return demoISO ? new Date(demoISO) : new Date();
}

/**
 * Re-rendering hook around getNow(): ticks on an interval and
 * re-renders immediately whenever the demo clock changes.
 */
export function useNow(intervalMs = 15000): Date {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return getNow();
}
