import { useEffect, useRef, useState, useMemo, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Hash, Sparkles } from 'lucide-react';
import { featureOn } from '@/brand';

export interface PaletteAction {
  id: string;
  label: string;
  description?: string;
  group?: string;
  href?: string;
  /** Run instead of navigating. */
  onSelect?: () => void;
  keywords?: string[];
}

interface Props {
  /** Extra actions to inject beyond the default route list. */
  extra?: PaletteAction[];
}

/**
 * The catalog only advertises routes that actually resolve for this vertical:
 * quote OR pricing (never a dead-end to a page the nav hid). Keeps ⌘K honest.
 */
function defaultActions(): PaletteAction[] {
  const offer: PaletteAction | null = featureOn('quote')
    ? { id: 'quote', label: 'Get a Quote', group: 'Pages', href: '/quote', keywords: ['estimate', 'price'] }
    : featureOn('pricing')
      ? { id: 'pricing', label: 'Pricing', group: 'Pages', href: '/pricing', keywords: ['cost', 'plans'] }
      : null;
  return [
    { id: 'home',     label: 'Home',          group: 'Pages', href: '/' },
    { id: 'about',    label: 'About',         group: 'Pages', href: '/about' },
    { id: 'services', label: 'Services',      group: 'Pages', href: '/services' },
    ...(offer ? [offer] : []),
    { id: 'blog',     label: 'Blog',          group: 'Pages', href: '/blog' },
    { id: 'faq',      label: 'FAQ',           group: 'Pages', href: '/faq' },
    { id: 'contact',  label: 'Contact',       group: 'Pages', href: '/contact' },
    { id: 'theme',    label: 'Toggle theme',  group: 'Settings', keywords: ['dark', 'light'],
      onSelect: () => {
        const root = document.documentElement;
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      }
    },
  ];
}

/**
 * Universal Cmd+K / Ctrl+K command palette.
 *
 * Behavior contract (mandated by always.md):
 *   - ⌘+K / Ctrl+K opens the palette AND focuses the input on first frame.
 *   - Esc closes and returns focus to the element that opened it.
 *   - Open + ⌘+K again = re-focus + select existing query (toggle-friendly).
 *   - Arrow keys move selection; Enter activates; navigates via react-router.
 */
export function CommandPalette({ extra = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const allActions = useMemo(() => [...defaultActions(), ...extra], [extra]);

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      const isModK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
      if (isModK) {
        e.preventDefault();
        if (!open) {
          triggerRef.current = document.activeElement as HTMLElement;
          setOpen(true);
        } else {
          requestAnimationFrame(() => {
            inputRef.current?.focus({ preventScroll: true });
            inputRef.current?.select();
          });
        }
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) {
      // Return focus to the element that opened the palette.
      triggerRef.current?.focus?.();
      setQuery('');
      setSelected(0);
      return;
    }
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allActions;
    return allActions.filter((a) => {
      const hay = [a.label, a.description, ...(a.keywords ?? []), a.group ?? '']
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [allActions, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, PaletteAction[]>();
    for (const a of filtered) {
      const k = a.group ?? 'Actions';
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(a);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function activate(a: PaletteAction) {
    setOpen(false);
    if (a.onSelect) a.onSelect();
    else if (a.href) navigate(a.href);
  }

  function onInputKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(filtered.length - 1, s + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(0, s - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const action = filtered[selected];
      if (action) activate(action);
    }
  }

  if (!open) return null;

  let flatIdx = -1;
  return (
    <div
      className="cmdk-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="cmdk-panel">
        <label htmlFor="cmdk-input" className="sr-only">
          Type a command or search
        </label>
        <div className="relative">
          <Search size={18} aria-hidden="true" className="absolute left-5 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none" />
          <input
            id="cmdk-input"
            ref={inputRef}
            type="text"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search pages, run actions…"
            className="cmdk-input pl-12"
          />
        </div>
        <ul role="listbox" className="max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-5 py-6 text-center text-text-muted text-sm">No matches for "{query}"</li>
          ) : (
            grouped.map(([group, actions]) => (
              <li key={group}>
                <div className="px-5 pt-4 pb-1 text-xs uppercase tracking-widest text-text-subtle font-mono">
                  {group}
                </div>
                <ul>
                  {actions.map((a) => {
                    flatIdx += 1;
                    const isSelected = flatIdx === selected;
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => activate(a)}
                          onMouseEnter={() => setSelected(flatIdx)}
                          className="cmdk-item w-full text-left"
                        >
                          {a.group === 'Pages' ? (
                            <Hash size={16} className="text-text-subtle" />
                          ) : (
                            <Sparkles size={16} className="text-accent" />
                          )}
                          <span>{a.label}</span>
                          {a.description && (
                            <span className="text-text-subtle text-sm ml-2">— {a.description}</span>
                          )}
                          {a.href && <ArrowRight size={14} className="ml-auto opacity-50" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>
        <div className="px-5 py-3 border-t border-border text-xs text-text-subtle flex items-center gap-4">
          <span className="cmdk-kbd">↑↓</span><span>navigate</span>
          <span className="cmdk-kbd">↵</span><span>open</span>
          <span className="cmdk-kbd">esc</span><span>close</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
