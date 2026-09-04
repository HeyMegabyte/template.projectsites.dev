import type { Meta, StoryObj } from '@storybook/react';
import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand } from '@/brand';

/**
 * `PWAInstallPrompt` — the floating "Install {name} for offline access" banner
 * shown on every generated site. It only mounts after the browser fires
 * `beforeinstallprompt`, which never happens inside Storybook — so this story
 * renders a faithful **presentational replica** of the banner markup (identical
 * classes + copy) so the cinematic chrome is inspectable in isolation.
 *
 * Cinematic treatment (all presentation-only, defined in `index.css`
 * `.pwa-prompt*`): a glass panel with a glowing OKLCH accent hairline along its
 * top edge, a `@starting-style` slide-up entrance, an app-icon tile with an
 * accent aura + slow shimmer sweep, and an accent-glow Install button with a
 * springy press. All motion is gated behind `prefers-reduced-motion`; the live
 * component keeps its `beforeinstallprompt` handling, focus management, and
 * `aria-*` intact.
 *
 * Hover / focus the **Install** button to see the glow-ring lift; press it for
 * the springy dip. The icon tile's shimmer replays on a slow loop.
 */
function PWAPromptPreview({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div data-theme={theme} className="bg-background" style={{ minHeight: '20rem' }}>
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="pwa-install-title-preview"
        aria-live="polite"
        className={cn(
          'pwa-prompt',
          'absolute z-40 bottom-4 right-4 sm:bottom-6 sm:right-6',
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
              id="pwa-install-title-preview"
              className="font-heading font-bold text-text text-sm leading-tight"
            >
              Install {brand.business.name} for offline access
            </h2>
            <p className="mt-1 text-text-muted text-xs leading-relaxed">
              1-click install — works offline, launches like an app.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
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
    </div>
  );
}

const meta = {
  title: 'Components/PWAInstallPrompt',
  component: PWAPromptPreview,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PWAPromptPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dark vertical — glass panel, accent hairline, shimmering icon, glow button. */
export const Default: Story = {};

/** Light vertical — the glass + accent chrome re-tint from the theme tokens. */
export const OnLightTheme: Story = {
  args: { theme: 'light' },
};
