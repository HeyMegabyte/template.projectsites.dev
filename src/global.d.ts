interface Window {
  gtag?: (...args: unknown[]) => void;
  posthog?: {
    capture: (event: string, properties?: Record<string, unknown>) => void;
  };
}

/**
 * Bare global declarations so analytics calls (`gtag(...)`, `posthog.capture(...)`)
 * compile without explicit `window.` prefixes. These globals are loaded by GTM /
 * the PostHog snippet at runtime and are intentionally optional.
 */
declare const gtag: ((...args: unknown[]) => void) | undefined;
declare const posthog:
  | {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    }
  | undefined;
