import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Human label for the section, used only in the dev fallback + telemetry
   * (e.g. "hero", "pricing", "services"). Keep it short + lowercase.
   */
  name?: string;
  /**
   * Optional custom fallback rendered when the section crashes. Receives the
   * error. If omitted, production renders `null` (the section vanishes) and dev
   * renders a compact inline notice so the crash is obvious while iterating.
   */
  fallback?: (error: Error) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Section-scoped error boundary — the fail-soft primitive that keeps ONE
 * crashing section from blanking the entire page.
 *
 * @remarks
 * The whole app is already wrapped in a single top-level {@link ErrorBoundary}
 * (see `main.tsx`). That top-level boundary is a blunt instrument: if any child
 * throws during render — a classic `Cannot read properties of undefined
 * (reading 'primary')` from AI-customized data access, an empty `services[0]`
 * lookup, a missing brand token — React unwinds the ENTIRE tree below the
 * boundary and swaps in the error card. Header, footer, hero, NAP, every other
 * section, and every SEO landmark disappear with it.
 *
 * `SafeSection` contains the blast radius to a single section. Wrap each
 * top-level section of a page (especially AI-customized ones) in it: a throw
 * inside one section is caught locally, that section fails soft (renders
 * nothing in production), and every SIBLING section — plus the header, footer,
 * `<main>` landmark, and the pre-rendered SEO head — keeps painting.
 *
 * This is why a single generation defect drops a site's score from "blank page
 * below the hero" to "one missing section" — the difference between a 3/10 and
 * a shippable page.
 *
 * @example
 * ```tsx
 * <SafeSection name="pricing">
 *   <Pricing tiers={tiers} headline="Plans" />
 * </SafeSection>
 * ```
 *
 * @example Custom fallback (rare — prefer silent fail-soft):
 * ```tsx
 * <SafeSection name="map" fallback={() => <StaticMapImage />}>
 *   <GoogleMapEmbed lat={lat} lng={lng} />
 * </SafeSection>
 * ```
 */
export class SafeSection extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const label = this.props.name ? `[SafeSection:${this.props.name}]` : '[SafeSection]';
    if (import.meta.env.DEV) {
      console.error(label, error, info.componentStack);
    }
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'exception', {
        description: `${label} ${error.message}`,
        fatal: false,
      });
      window.posthog?.capture('section_error', {
        section: this.props.name ?? 'unknown',
        message: error.message,
      });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.state.error);

    // Production: fail soft — the section simply vanishes so the rest of the
    // page (hero, NAP, other sections, header, footer, SEO landmarks) survives.
    if (!import.meta.env.DEV) return null;

    // Dev: a compact, obvious inline notice so crashes surface while iterating.
    return (
      <section
        aria-hidden="true"
        style={{
          margin: '1rem auto',
          maxWidth: '48rem',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px dashed var(--color-danger, #ef4444)',
          background: 'color-mix(in srgb, var(--color-danger, #ef4444) 8%, transparent)',
          color: 'var(--color-text-muted, #94a3b8)',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: 'var(--color-danger, #ef4444)' }}>
          Section &ldquo;{this.props.name ?? 'unknown'}&rdquo; failed to render.
        </strong>{' '}
        {this.state.error.message}
      </section>
    );
  }
}

export default SafeSection;
