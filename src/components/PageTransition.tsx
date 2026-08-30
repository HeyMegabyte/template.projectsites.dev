import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

/**
 * Route-change wrapper powered by the **View Transitions API**, scoped so ONLY
 * the main content fades.
 *
 * On every SPA navigation this holds the *currently displayed* subtree in state
 * and swaps in the new route's subtree **inside** `document.startViewTransition()`.
 * The browser snapshots the old + new DOM; the CSS in `src/index.css` names the
 * `<main>` element (`view-transition-name: ps-main`) and cross-fades ONLY that
 * group (~300ms, pure opacity) while pinning the `root` snapshot — the fixed
 * navbar, footer, and page background — to no animation. So the chrome stays
 * perfectly static and just the page body cross-fades.
 *
 * Feature-detected end-to-end: if `document.startViewTransition` is missing
 * (older browsers), we fall back to a plain synchronous render — no jank, no
 * animation, identical behavior to before. Reduced-motion / reduced-data users
 * get an instant, flash-free swap (the CSS clamps the VT animation to none).
 *
 * The separate `<ScrollToTop>` component (keyed on `useLocation().pathname`)
 * still owns scroll restoration — this wrapper never touches scroll, so
 * scroll-to-top-on-nav is preserved exactly.
 */
export default function PageTransition({ children }: Props) {
  const location = useLocation();
  // The subtree actually painted. Starts as the initial children; updated on
  // navigation, wrapped in a view transition when the API is available.
  const [rendered, setRendered] = useState<React.ReactNode>(children);
  // Track the location key we've already committed so we transition once per nav.
  const lastKeyRef = useRef(location.key);

  useEffect(() => {
    // First mount (same key) — nothing to transition; keep children fresh so
    // lazy Suspense fallbacks that resolve after mount still update.
    if (location.key === lastKeyRef.current) {
      setRendered(children);
      return;
    }
    lastKeyRef.current = location.key;

    const doc = typeof document !== 'undefined' ? document : undefined;

    // Feature-detect + honor reduced motion: plain render, no transition.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc || typeof doc.startViewTransition !== 'function' || prefersReducedMotion) {
      setRendered(children);
      return;
    }

    // Commit the new subtree inside a view transition. `flushSync` forces React
    // to paint the new DOM synchronously so the browser captures the *new*
    // snapshot for the cross-fade.
    doc.startViewTransition(() => {
      flushSync(() => {
        setRendered(children);
      });
    });
    // We intentionally depend on `location.key` (unique per navigation) rather
    // than `children` so a transition fires exactly once per route change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, children]);

  return <>{rendered}</>;
}
