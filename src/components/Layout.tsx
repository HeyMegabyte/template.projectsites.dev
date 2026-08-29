import { lazy, Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import SkipLink from './SkipLink';
import BackToTop from './BackToTop';
import { ScrollProgress } from './ScrollProgress';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { StickyActionBar } from './StickyActionBar';

/*
 * Interaction-triggered chrome — lazy-loaded so their chunks (photoswipe ~60kB behind
 * the Lightbox, plus the Command Palette + dev badge) stay OUT of the initial bundle and
 * the ~6s hydration bootup. They only fire on image-click / Cmd+K, long after first paint,
 * so deferring them cuts bootup cost with no UX loss. PWAInstallPrompt stays eager — it
 * must be listening for `beforeinstallprompt`, which can fire before a lazy chunk mounts.
 */
const Lightbox = lazy(() => import('./Lightbox').then((m) => ({ default: m.Lightbox })));
const CommandPalette = lazy(() =>
  import('./CommandPalette').then((m) => ({ default: m.CommandPalette })),
);
const DevA11yBadge = lazy(() =>
  import('./DevA11yBadge').then((m) => ({ default: m.DevA11yBadge })),
);

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <BackToTop />
      <PWAInstallPrompt />
      <StickyActionBar />
      <Suspense fallback={null}>
        <Lightbox />
        <CommandPalette />
        <DevA11yBadge />
      </Suspense>
    </>
  );
}
