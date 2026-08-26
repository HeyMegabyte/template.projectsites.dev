import Header from './Header';
import Footer from './Footer';
import { Lightbox } from './Lightbox';
import SkipLink from './SkipLink';
import BackToTop from './BackToTop';
import { CommandPalette } from './CommandPalette';
import { DevA11yBadge } from './DevA11yBadge';
import { ScrollProgress } from './ScrollProgress';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { StickyActionBar } from './StickyActionBar';

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
      <Lightbox />
      <CommandPalette />
      <PWAInstallPrompt />
      <StickyActionBar />
      <DevA11yBadge />
    </>
  );
}
