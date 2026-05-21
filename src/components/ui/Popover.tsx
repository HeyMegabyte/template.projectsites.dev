import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  /** Button label / content. */
  trigger: ReactNode;
  /** Popover body. */
  children: ReactNode;
  /** Where to anchor the popover relative to the trigger. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Popover mode — auto = light-dismissable, manual = explicit close. */
  mode?: 'auto' | 'manual' | 'hint';
  /** Trigger button className. */
  triggerClass?: string;
  /** Popover panel className. */
  panelClass?: string;
}

/**
 * Native Popover API + Anchor Positioning (ideas #101, #102, #103).
 *
 * Uses the browser's top-layer + light-dismiss + Esc handling. Zero JS state.
 * Implicit anchor reference is automatically created by `popovertarget` →
 * `id` pairing, so we just position via `position-anchor: auto` + `position-area`.
 *
 * Browser support: Chrome 114+, Edge 114+, Safari 17+, Firefox 125+. Anchor
 * positioning lags on Firefox until 147 — we wrap the anchor styles in
 * @supports so the popover still works (centered) on older browsers.
 */
export function Popover({
  trigger,
  children,
  placement = 'bottom',
  mode = 'auto',
  triggerClass,
  panelClass,
}: Props) {
  const id = useId().replace(/:/g, '');
  const anchorName = `--pop-anchor-${id}`;
  const placementClass = `pop-place-${placement}`;

  return (
    <>
      <button
        type="button"
        popoverTarget={`pop-${id}`}
        className={cn('inline-flex items-center gap-2', triggerClass)}
        style={{ anchorName } as React.CSSProperties}
      >
        {trigger}
      </button>
      <div
        id={`pop-${id}`}
        popover={mode}
        className={cn(
          'card-tactile bg-surface-elevated text-text p-4 m-0',
          'popover-panel',
          placementClass,
          panelClass,
        )}
        style={{ positionAnchor: anchorName } as React.CSSProperties}
      >
        {children}
      </div>
      <style>{popoverStyle}</style>
    </>
  );
}

/* The styles are kept inline as a module-level constant so consumers don't
   need a separate import. Vite hoists them via React. */
const popoverStyle = `
.popover-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 12rem;
  max-width: min(36rem, calc(100vw - 2rem));
  transition: opacity 200ms var(--ease), transform 200ms var(--ease), overlay 200ms allow-discrete, display 200ms allow-discrete;
}
.popover-panel:not(:popover-open) {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}
@starting-style {
  .popover-panel:popover-open {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}
.popover-panel:popover-open {
  opacity: 1;
  transform: scale(1) translateY(0);
}
@supports (anchor-name: --a) {
  .popover-panel {
    margin: 0;
    inset: unset;
  }
  .pop-place-top    { position-area: top span-all; margin-bottom: 8px; }
  .pop-place-bottom { position-area: bottom span-all; margin-top: 8px; }
  .pop-place-left   { position-area: left span-all; margin-right: 8px; }
  .pop-place-right  { position-area: right span-all; margin-left: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .popover-panel { transition: none; transform: none; }
}
`;

export default Popover;
