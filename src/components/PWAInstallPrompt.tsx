import { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand } from '@/brand';

/**
 * Floating PWA install banner.
 *
 *   - Listens for `beforeinstallprompt` and stashes the event
 *   - Renders a dismissible bottom-right glass card with a 1-click install CTA
 *   - Cinematic chrome (presentation-only, in index.css `.pwa-prompt*`): glass
 *     panel + OKLCH accent hairline, `@starting-style` slide-up entrance,
 *     app-icon shimmer, accent-glow install button with a springy press
 *   - Dismissal persists in localStorage for 30 days
 *   - Hidden on iOS Safari (no beforeinstallprompt) — relies on
 *     `apple-mobile-web-app-capable` + Share→Add to Home Screen flow instead
 *   - WCAG 2.2 AA: 44px target, focus rings, aria-live announcement,
 *     Esc dismiss returns focus to the document body
 *   - Respects prefers-reduced-motion (entrance + shimmer disabled via index.css)
 */

const STORAGE_KEY = 'projectsites:pwa-prompt-dismissed';
const DISMISS_DAYS = 30;
const DISMISS_MS = DISMISS_DAYS * 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  // iPadOS 13+ reports MacIntel; combine with touch capability
  const ua = navigator.userAgent;
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || iPadOs;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari "Add to Home Screen"
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function recentlyDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
}

export function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const installBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isIos()) return; // iOS Safari handles install via Share menu
    if (isStandalone()) return; // Already installed
    if (recentlyDismissed()) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      triggerRef.current = (document.activeElement as HTMLElement) ?? null;
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function onInstalled() {
      setDeferred(null);
      setVisible(false);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // Focus the install button when the banner appears (a11y)
  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => installBtnRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  // Esc to dismiss
  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        dismiss();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* private mode / quota — ignore */
    }
    setVisible(false);
    setDeferred(null);
    // Return focus to whatever element opened the banner (or body)
    if (triggerRef.current && document.body.contains(triggerRef.current)) {
      triggerRef.current.focus({ preventScroll: true });
    }
  }

  async function install() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      } else {
        // User declined the native prompt — count as a dismiss
        try {
          window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
      }
    } finally {
      setDeferred(null);
      setVisible(false);
    }
  }

  if (!visible || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="pwa-install-title"
      aria-live="polite"
      className={cn(
        'pwa-prompt',
        'fixed z-40 bottom-4 right-4 sm:bottom-6 sm:right-6',
        'w-[min(92vw,22rem)]',
        'glass-strong rounded-xl shadow-lg',
        'p-4 sm:p-5',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="pwa-prompt__icon h-10 w-10 shrink-0 rounded-lg text-accent flex items-center justify-center"
        >
          <Download size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            id="pwa-install-title"
            className="font-heading font-bold text-text text-sm leading-tight"
          >
            Install {brand.business.name} for offline access
          </h2>
          <p className="mt-1 text-text-muted text-xs leading-relaxed">
            1-click install — works offline, launches like an app.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              ref={installBtnRef}
              type="button"
              onClick={install}
              className={cn(
                'pwa-prompt__install',
                'inline-flex items-center justify-center gap-1.5',
                'min-h-[44px] px-4 rounded-md text-sm font-bold',
                'bg-accent text-[var(--color-on-accent)] hover:bg-accent-hover',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <Download size={14} />
              Install
            </button>
            <button
              type="button"
              onClick={dismiss}
              className={cn(
                'inline-flex items-center justify-center',
                'min-h-[44px] px-3 rounded-md text-sm font-medium',
                'text-text-muted hover:text-text hover:bg-surface',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'transition-colors',
              )}
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className={cn(
            'shrink-0 h-11 w-11 -mt-1 -mr-1 rounded-md',
            'flex items-center justify-center',
            'text-text-subtle hover:text-text hover:bg-surface',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'transition-colors',
          )}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
