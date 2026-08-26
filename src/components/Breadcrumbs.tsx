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
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-subtle">
          {crumbs.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              {i === 0 && <Home size={14} className="text-text-subtle" aria-hidden="true" />}
              {c.to ? (
                <Link
                  to={c.to}
                  className="hover:text-[var(--color-accent)] transition-colors underline-offset-4 hover:underline"
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-text-muted">
                  {c.label}
                </span>
              )}
              {i < crumbs.length - 1 && (
                <ChevronRight size={14} className="text-text-subtle" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
