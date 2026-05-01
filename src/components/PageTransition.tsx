import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

/**
 * No-flash route wrapper.
 *
 * Defers visual transitions to the View Transitions API (configured in
 * `src/index.css` via `@view-transition { navigation: auto; }`). The wrapper
 * itself does not opacity-fade content — that caused a brief flash of the
 * page bg between routes. Instead, it guarantees `<html>` keeps the dark
 * brand bg during navigation so the cross-fade reads as a single smooth shot.
 */
export default function PageTransition({ children }: Props) {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.backgroundColor = '#0a0a1a';
  }, [location.pathname]);

  return <>{children}</>;
}
