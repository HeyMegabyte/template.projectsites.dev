import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback. Receives the error + a retry callback. */
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches React render errors anywhere in the tree below.
 *
 * Default fallback: a tactile-brutalism error card with "Try again" + "Home"
 * actions. Error message is shown only in development; production users see
 * a generic message but the error is still logged to console + window.gtag /
 * posthog if available.
 *
 * Wrap the whole app in main.tsx, or wrap individual high-risk subtrees.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'exception', { description: error.message, fatal: false });
      window.posthog?.capture('frontend_error', { message: error.message });
    }
  }

  retry = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.state.error, this.retry);

    const isDev = import.meta.env.DEV;
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div className="card-tactile p-10 max-w-md w-full text-center">
          <div className="h-14 w-14 mx-auto rounded-full bg-danger/15 flex items-center justify-center mb-6">
            <AlertCircle className="text-danger" size={28} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-text mb-3">Something went wrong</h1>
          <p className="text-text-muted mb-6 leading-relaxed">
            {isDev ? this.state.error.message : "We've logged the issue. Please try again."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.retry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-[var(--color-on-accent)] font-bold hover:bg-accent-hover transition-colors min-h-[44px]"
            >
              <RefreshCw size={16} /> Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-muted hover:text-text hover:bg-surface transition-colors min-h-[44px]"
            >
              <Home size={16} /> Home
            </a>
          </div>
          {isDev && this.state.error.stack && (
            <pre className="mt-8 p-4 rounded-md bg-surface text-text-subtle text-xs text-left overflow-x-auto whitespace-pre-wrap break-words">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      </section>
    );
  }
}

export default ErrorBoundary;
