import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Share2 } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { JsonLd } from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { brand } from '@/brand';
import { cn } from '@/lib/utils';

/**
 * /share — share_target + protocol_handler + file_handler receiver.
 *
 * Reads `?title=`, `?text=`, `?url=` (per the webmanifest `share_target.params`)
 * plus `?type=md` from the file_handler and renders a thank-you UI with:
 *   - Pretty-formatted preview of the shared content
 *   - "Save to my list" stub → localStorage `projectsites:shared-items`
 *   - "Share back" via navigator.share() when supported
 *   - JSON-LD WebPage type so the route is still SEO-clean
 */

interface SharedItem {
  id: string;
  title: string;
  text: string;
  url: string;
  type?: string;
  savedAt: number;
}

const STORAGE_KEY = 'projectsites:shared-items';

function readSavedItems(): SharedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SharedItem[]) : [];
  } catch {
    return [];
  }
}

function writeSavedItems(items: SharedItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota / private mode — ignore */
  }
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function Share() {
  const [params] = useSearchParams();

  const shared = useMemo(() => {
    const title = params.get('title') ?? '';
    const text = params.get('text') ?? '';
    const url = params.get('url') ?? '';
    const type = params.get('type') ?? undefined;
    return { title, text, url, type };
  }, [params]);

  const hasPayload = Boolean(shared.title || shared.text || shared.url);

  useSEO({
    title: `Shared with ${brand.business.name}`,
    description: `Review and save content shared to ${brand.business.name} from your device.`,
  });

  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [shareError, setShareError] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setSavedCount(readSavedItems().length);
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  function onSave() {
    if (!hasPayload) return;
    const items = readSavedItems();
    const next: SharedItem = {
      id: makeId(),
      title: shared.title,
      text: shared.text,
      url: shared.url,
      type: shared.type,
      savedAt: Date.now(),
    };
    items.unshift(next);
    writeSavedItems(items);
    setSavedCount(items.length);
    setSaved(true);
  }

  async function onShareBack() {
    setShareError(null);
    if (!canNativeShare) {
      setShareError('Your browser does not support native sharing.');
      return;
    }
    try {
      await navigator.share({
        title: shared.title || brand.business.name,
        text: shared.text,
        url: shared.url || window.location.origin,
      });
    } catch (err) {
      // AbortError = user cancelled — not an error worth surfacing
      if (err instanceof Error && err.name !== 'AbortError') {
        setShareError(err.message);
      }
    }
  }

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `Shared with ${brand.business.name}`,
          description: `Receiver page for content shared into ${brand.business.name} via the Web Share Target API.`,
          isPartOf: {
            '@type': 'WebSite',
            name: brand.business.name,
            url: brand.business.url,
          },
        }}
      />

      <section className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            to="/"
            className={cn(
              'inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded',
              'transition-colors',
            )}
          >
            <ArrowLeft size={14} /> Back home
          </Link>

          <header className="mt-6">
            <span className="text-accent text-sm font-mono tracking-widest uppercase">
              Shared with us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mt-3 mb-4 gradient-text">
              Thanks for sharing
            </h1>
            <p className="text-text-muted text-lg leading-relaxed max-w-2xl">
              {hasPayload
                ? `We received the content you sent to ${brand.business.name}. Save it for later, share it on, or open the link.`
                : `This page receives content shared from your device into ${brand.business.name}. Open it from your phone's Share menu to send a link, page, or note here.`}
            </p>
          </header>

          {hasPayload && (
            <article className="mt-10 card-tactile bg-surface-elevated border border-border rounded-2xl p-6 sm:p-8">
              {shared.type && (
                <span className="inline-block text-xs font-mono tracking-widest uppercase text-accent mb-3">
                  {shared.type === 'md' ? 'Markdown file' : shared.type}
                </span>
              )}
              {shared.title && (
                <h2 className="text-2xl font-bold font-heading text-text leading-tight">
                  {shared.title}
                </h2>
              )}
              {shared.text && (
                <p className="mt-4 text-text-muted whitespace-pre-wrap leading-relaxed">
                  {shared.text}
                </p>
              )}
              {shared.url && (
                <a
                  href={shared.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'mt-5 inline-flex items-center gap-1.5',
                    'text-accent hover:text-accent-hover underline underline-offset-2',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded',
                    'break-all text-sm',
                  )}
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  {shared.url}
                </a>
              )}

              <div
                className="mt-6 flex flex-col sm:flex-row gap-3"
                role="group"
                aria-label="Shared content actions"
              >
                <Button
                  type="button"
                  size="lg"
                  onClick={onSave}
                  disabled={saved}
                  aria-live="polite"
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="mr-2 h-4 w-4" /> Saved to your list
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" /> Save to my list
                    </>
                  )}
                </Button>
                {canNativeShare && (
                  <Button type="button" size="lg" variant="outline" onClick={onShareBack}>
                    <Share2 className="mr-2 h-4 w-4" /> Share back
                  </Button>
                )}
              </div>

              {shareError && (
                <p role="alert" className="mt-3 text-sm text-danger">
                  {shareError}
                </p>
              )}
            </article>
          )}

          <aside className="mt-12 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="card-tactile bg-surface border border-border rounded-lg p-5">
              <h3 className="font-bold text-text mb-1">Your saved items</h3>
              <p className="text-text-muted">
                {savedCount === 0
                  ? 'Nothing saved yet. Use Save to start your list.'
                  : `${savedCount} item${savedCount === 1 ? '' : 's'} saved on this device.`}
              </p>
            </div>
            <div className="card-tactile bg-surface border border-border rounded-lg p-5">
              <h3 className="font-bold text-text mb-1">Private to you</h3>
              <p className="text-text-muted">
                Saved items live in your browser's local storage. Nothing is sent to our servers.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
