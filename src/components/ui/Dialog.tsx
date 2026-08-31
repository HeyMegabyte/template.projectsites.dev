import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  /** Show the dismiss X button. Default true. */
  dismissible?: boolean;
  /** Lock body scroll when open. Default true. */
  lockScroll?: boolean;
  /** Max width. Default 32rem (~512px). */
  maxWidth?: string;
  className?: string;
}

/**
 * Native `<dialog>` modal (idea #101).
 *
 *   - Top-layer rendering — no z-index wars
 *   - Backdrop styled via ::backdrop pseudo-element
 *   - Focus trap built into the platform (showModal())
 *   - Esc dismiss handled natively
 *   - @starting-style + transition-behavior animate in/out without JS timers
 *
 * Accepts a fully controlled `open` state from React, but uses the native
 * `dialog.showModal()` / `dialog.close()` API. Browser support: Chrome 37+,
 * Edge 79+, Safari 15.4+, Firefox 98+. ::backdrop animation requires 2024+.
 */
export function Dialog({
  open,
  onClose,
  children,
  title,
  dismissible = true,
  lockScroll = true,
  maxWidth = '32rem',
  className,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      dlg.showModal();
      if (lockScroll) document.body.style.overflow = 'hidden';
    } else if (!open && dlg.open) {
      dlg.close();
      if (lockScroll) document.body.style.overflow = '';
    }
  }, [open, lockScroll]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const handler = () => onClose();
    dlg.addEventListener('close', handler);
    return () => dlg.removeEventListener('close', handler);
  }, [onClose]);

  // Click-outside dismiss
  function onBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (!dismissible) return;
    const rect = (e.target as HTMLDialogElement).getBoundingClientRect();
    const clickedInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!clickedInDialog) onClose();
  }

  return (
    <dialog
      ref={ref}
      onClick={onBackdropClick}
      aria-labelledby="dialog-title"
      className={cn(
        'modal-dialog',
        'p-0 bg-transparent border-0 m-0 max-h-full max-w-full',
        className,
      )}
      style={{ maxWidth }}
    >
      <div className="card-tactile p-6 md:p-8 bg-surface-elevated max-h-[85vh] overflow-y-auto">
        <header className="flex items-start justify-between gap-4 mb-4">
          <h2 id="dialog-title" className="text-xl md:text-2xl font-heading font-bold text-text">
            {title}
          </h2>
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="h-10 w-10 rounded-md flex items-center justify-center text-text-subtle hover:text-text hover:bg-surface transition-colors -mt-2 -mr-2 shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </header>
        {children}
      </div>
    </dialog>
  );
}


export default Dialog;
