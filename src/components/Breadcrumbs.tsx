import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd } from './JsonLd';

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  trail?: Crumb[];
  baseUrl?: string;
}

function titleize(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveTrail(pathname: string): Crumb[] {
  const parts = pathname.split('/').filter(Boolean);
  const trail: Crumb[] = [{ label: 'Home', to: '/' }];
  let acc = '';
  parts.forEach((p, i) => {
    acc += `/${p}`;
    trail.push({ label: titleize(p), to: i < parts.length - 1 ? acc : undefined });
  });
  return trail;
}

/**
 * The breadcrumb trail on sub-pages. Cinematic: the whole trail fades in from
 * just below on first paint via `@starting-style`, each crumb link carries an
 * accent underline that grows from the centre, the chevron separators tint to
 * accent (and nudge toward the crumb they precede on hover), the leading Home
 * icon warms to accent on hover, and the current page reads with an accent dot
 * marker + emphasised ink. All motion is gated behind `prefers-reduced-motion`
 * with a fully-visible fallback.
 *
 * Contract preserved: the JSON-LD `BreadcrumbList`, `aria-current="page"` on the
 * final crumb, and the `trail` / `baseUrl` props are all intact.
 */
export default function Breadcrumbs({ trail, baseUrl = '' }: Props) {
  const { pathname } = useLocation();
  const crumbs = trail ?? deriveTrail(pathname);
  if (crumbs.length <= 1) return null;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.to ? { item: `${baseUrl}${c.to}` } : {}),
    })),
  };
  return (
    <>
      <JsonLd data={itemList} />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 pt-24 pb-2">
        <ol className="breadcrumbs-trail flex flex-wrap items-center gap-2 text-sm text-text-subtle">
          {crumbs.map((c, i) => {
            const isCurrent = i === crumbs.length - 1;
            return (
              <li key={i} className="crumb-item flex items-center gap-2">
                {c.to ? (
                  <Link
                    to={c.to}
                    className="crumb-link inline-flex items-center gap-1.5 text-text-muted hover:text-accent focus-visible:text-accent transition-colors"
                  >
                    {i === 0 && <Home size={14} className="crumb-home text-text-subtle" aria-hidden="true" />}
                    <span>{c.label}</span>
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="inline-flex items-center gap-1.5 font-medium text-text"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    {c.label}
                  </span>
                )}
                {!isCurrent && (
                  <ChevronRight
                    size={14}
                    className="crumb-sep text-accent/60"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
