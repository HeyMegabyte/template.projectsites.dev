import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll to top on every route change, then smooth-scrolls
 * to a #hash anchor if one is present in the URL.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Scroll to anchor after a short delay (let the page render first)
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}
