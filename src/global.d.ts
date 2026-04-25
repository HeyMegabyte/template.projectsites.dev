interface Window {
  gtag?: (...args: unknown[]) => void;
  posthog?: {
    capture: (event: string, properties?: Record<string, unknown>) => void;
  };
}
