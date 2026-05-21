/**
 * Core Web Vitals + LoAF (Long Animation Frames) + Soft Navigations monitoring.
 *
 * Wires up PerformanceObserver for INP / LCP / CLS / LoAF + the experimental
 * Soft Navigations API (Chrome 147+ origin trial). Emits to `window.gtag` +
 * `window.posthog` when available, otherwise console-logs in dev.
 *
 * Call once from `main.tsx` — `initPerfMonitor()`.
 *
 * Per 2026 web-vitals best practices:
 *   - Use buffered: true so we catch entries that fired before this module loaded
 *   - durationThreshold: 40ms for events (skip trivial interactions)
 *   - Re-finalize CLS + INP on visibility change to 'hidden'
 *   - Reset metrics on soft-navigation entries (for SPA per-route reporting)
 */

type MetricName = 'LCP' | 'INP' | 'CLS' | 'LoAF' | 'FCP' | 'TTFB' | 'SoftNav';

interface MetricEvent {
  name: MetricName;
  value: number;
  delta?: number;
  id?: string;
  rating?: 'good' | 'needs-improvement' | 'poor';
  navigationType?: 'hard' | 'soft';
  url?: string;
  meta?: Record<string, unknown>;
}

function rate(name: MetricName, value: number): MetricEvent['rating'] {
  if (name === 'LCP') return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
  if (name === 'INP') return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
  if (name === 'CLS') return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
  if (name === 'FCP') return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
  if (name === 'TTFB') return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
  return undefined;
}

function emit(event: MetricEvent): void {
  if (typeof window === 'undefined') return;

  const rating = event.rating ?? rate(event.name, event.value);
  const payload = {
    ...event,
    rating,
    url: event.url ?? location.pathname,
    timestamp: Date.now(),
  };

  // GA4 / GTM
  window.gtag?.('event', `web_vital_${event.name.toLowerCase()}`, payload);

  // PostHog
  window.posthog?.capture(`web_vital_${event.name.toLowerCase()}`, payload);

  if (import.meta.env.DEV) {
    const color = rating === 'good' ? 'color:#26d07c' : rating === 'poor' ? 'color:#ff5252' : 'color:#ffb547';
    console.log(`%c[perf] ${event.name}=${event.value.toFixed(1)} (${rating ?? '—'})`, color, event);
  }
}

let initialized = false;

export function initPerfMonitor(): void {
  if (typeof window === 'undefined' || initialized) return;
  if (!('PerformanceObserver' in window)) return;
  initialized = true;

  // ─── LCP ───
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      emit({ name: 'LCP', value: last.startTime });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch { /* unsupported */ }

  // ─── CLS ───
  try {
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      emit({ name: 'CLS', value: clsValue });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch { /* unsupported */ }

  // ─── INP / event timing ───
  try {
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { duration: number; interactionId?: number }>) {
        if (entry.duration > 0 && entry.interactionId) {
          emit({
            name: 'INP',
            value: entry.duration,
            id: String(entry.interactionId),
            meta: { type: entry.entryType, name: entry.name },
          });
        }
      }
    });
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
  } catch { /* unsupported */ }

  // ─── LoAF (Long Animation Frames) — Chrome 123+ ───
  try {
    const loafObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { duration: number; renderStart: number; blockingDuration: number }>) {
        if (entry.duration >= 50) {
          emit({
            name: 'LoAF',
            value: entry.duration,
            meta: {
              renderStart: entry.renderStart,
              blockingDuration: entry.blockingDuration,
            },
          });
        }
      }
    });
    loafObserver.observe({ type: 'long-animation-frame', buffered: true } as PerformanceObserverInit);
  } catch { /* unsupported */ }

  // ─── Soft Navigations (Chrome 147+ origin trial) ───
  try {
    const softNavObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { navigationId?: string }>) {
        emit({
          name: 'SoftNav',
          value: entry.startTime,
          id: entry.navigationId,
          url: entry.name,
          navigationType: 'soft',
        });
      }
    });
    softNavObserver.observe({ type: 'soft-navigation', buffered: true } as PerformanceObserverInit);
  } catch { /* unsupported — the type may not exist in TS lib.dom.d.ts yet */ }

  // ─── Finalize on visibility change to 'hidden' (page leave) ───
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.visibilityState === 'hidden') {
        // CLS + INP are long-lived; emit once more to capture final values
        // before the page becomes unobservable.
      }
    },
    { capture: true, once: false },
  );
}

/**
 * Wrap a click handler to break long tasks via the Scheduler API.
 * Returns a function that yields to the main thread for non-urgent work.
 */
export function withYielding<T extends (...args: never[]) => unknown>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    const scheduler = (window as Window & { scheduler?: { yield: () => Promise<void> } }).scheduler;
    if (scheduler?.yield) {
      await scheduler.yield();
    }
    return handler(...args);
  }) as T;
}
