import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  category?: string;
}

interface Props {
  index: SearchResult[];
  placeholder?: string;
  ariaLabel?: string;
}

export default function Search({
  index,
  placeholder = 'Search articles, services, team…',
  ariaLabel = 'Site search',
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? index
        .filter((r) => {
          const hay = `${r.title} ${r.excerpt ?? ''} ${r.category ?? ''}`.toLowerCase();
          return q.split(/\s+/).every((token) => hay.includes(token));
        })
        .slice(0, 8)
    : [];

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(e.target.value.trim().length > 0);
  }

  function clear() {
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-[50ch]">
      <label htmlFor="site-search" className="sr-only">
        {ariaLabel}
      </label>
      <div className="relative">
        <SearchIcon
          size={18}
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none"
        />
        <input
          id="site-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={onChange}
          onFocus={() => query && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          role="combobox"
          aria-expanded={open}
          aria-controls="site-search-results"
          aria-autocomplete="list"
          className="w-full min-w-[20ch] pl-11 pr-11 py-3 rounded-lg bg-surface border border-border text-text placeholder:text-text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:border-transparent transition-colors min-h-[44px]"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md text-text-subtle hover:text-text hover:bg-surface transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {open && (
        <ul
          id="site-search-results"
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-surface backdrop-blur-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-text-subtle">No results for “{query}”.</li>
          ) : (
            results.map((r) => (
              <li key={r.id} role="option">
                <a
                  href={r.url}
                  className="block px-4 py-3 hover:bg-surface transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="block text-sm font-medium text-text">{r.title}</span>
                  {r.category && (
                    <span className="block text-xs text-[var(--color-accent)] mt-0.5">
                      {r.category}
                    </span>
                  )}
                  {r.excerpt && (
                    <span className="block text-xs text-text-subtle mt-1 line-clamp-2">
                      {r.excerpt}
                    </span>
                  )}
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
