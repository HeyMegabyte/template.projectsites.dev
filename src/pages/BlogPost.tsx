import { useParams, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSEO } from '@/hooks/useSEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { CTASection } from '@/components/sections';
import { brand } from '@/brand';
import { posts } from '@/data/content';

/**
 * BlogPost detail. Looks the post up by `:slug` in `src/data/content.ts` and
 * renders its Markdown `body` (headings, bullet lists, bold). This is the
 * deterministic path — the article always has a full body — replacing the old
 * single hardcoded `{POST_PARAGRAPH_N}` token map that ignored the slug.
 */

/** Split a line into text + **bold** runs (no external markdown dep). */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="text-text font-semibold">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** Render a Markdown body string into headings / lists / paragraphs. */
function renderBody(body: string): ReactNode[] {
  return body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith('### ')) return <h3 key={i} className="text-xl font-bold font-heading text-text mt-8 mb-3">{inline(block.slice(4))}</h3>;
      if (block.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold font-heading text-text mt-10 mb-4">{inline(block.slice(3))}</h2>;
      if (/^[-*] /.test(block)) {
        const items = block.split(/\n/).map((l) => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
        return (
          <ul key={i} className="list-disc pl-6 space-y-2 marker:text-accent">
            {items.map((it, j) => <li key={j}>{inline(it)}</li>)}
          </ul>
        );
      }
      return <p key={i}>{inline(block)}</p>;
    });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug) ?? posts[0];

  useSEO({
    title: `${post.title} — ${brand.business.name}`,
    description: post.excerpt,
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          ...(post.cover ? { image: post.cover } : {}),
          datePublished: post.date,
          author: { '@type': 'Person', name: post.author ?? brand.business.name },
          publisher: { '@type': 'Organization', name: brand.business.name, url: brand.business.url },
          mainEntityOfPage: `${brand.business.url}/blog/${post.slug}`,
        }}
      />

      <Breadcrumbs
        baseUrl={brand.business.url}
        trail={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]}
      />

      <article className="max-w-container-prose mx-auto px-6 pt-8 pb-24">
        <header className="mb-12 reveal-on-view">
          {post.category && (
            <Link to="/blog" className="text-accent font-mono text-sm uppercase tracking-widest hover:underline">
              ← {post.category}
            </Link>
          )}
          <h1 className="mt-4 text-4xl md:text-6xl font-bold font-heading tracking-tight leading-tight gradient-text">
            {post.title}
          </h1>
          <p className="mt-4 text-text-muted text-lg leading-relaxed">{post.excerpt}</p>
          <p className="mt-6 text-sm text-text-subtle">
            {post.author ? `By ${post.author} · ` : ''}
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            {post.readMinutes ? ` · ${post.readMinutes} min read` : ''}
          </p>
        </header>

        {post.cover && (
          <div className="mb-12 card-tactile overflow-hidden rounded-2xl aspect-[16/9]">
            <img
              src={post.cover}
              alt={`Cover image for ${post.title}`}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="max-w-none space-y-6 text-text-muted text-lg leading-[1.75]">
          {renderBody(post.body)}
        </div>
      </article>

      <CTASection
        eyebrow="Liked this?"
        headline="Read more from us"
        primary={{ label: 'All posts', href: '/blog' }}
        secondary={{ label: 'Subscribe', href: '/contact?intent=newsletter' }}
        tone="quiet"
      />
    </>
  );
}
