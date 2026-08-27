import { useSEO } from '@/hooks/useSEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BlogList, CTASection } from '@/components/sections';
import { brand } from '@/brand';
import { posts } from '@/data/content';

/**
 * Blog index. Reads the real, keyword-focused articles from `src/data/content.ts`
 * — the deterministic scaffold that guarantees the blog ships with full featured
 * "premiere" articles on every generated site (the orchestrator can overwrite
 * `content.ts` with business-specific posts, but it is never empty). Previously
 * this rendered a local `{BLOG_N}` token array that the packs never filled.
 */
export default function Blog() {
  useSEO({
    title: `Blog — ${brand.business.name}`,
    description: `Articles, guides, and stories from ${brand.business.name}.`,
  });

  return (
    <>
      <Breadcrumbs baseUrl={brand.business.url} />
      <BlogList posts={posts} eyebrow="Writing" headline="Notes from the field" as="h1" />
      <CTASection
        eyebrow="Newsletter"
        headline="Get monthly insights — no spam"
        primary={{ label: 'Subscribe', href: '/contact?intent=newsletter' }}
        tone="quiet"
      />
    </>
  );
}
