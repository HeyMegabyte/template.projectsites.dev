import { useEffect } from 'react';
import { brand } from '@/brand';
import { scrubText } from '@/lib/placeholders';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

export function useSEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    // Scrub before writing: an unresolved `{TOKEN}` or leaked generation-plan
    // string (e.g. "…Sections: Hero, About, Services…") must never become the
    // page title or meta description. That same head text is what the edge
    // app-shell reads for its static hero, so a leak here would poison the LCP
    // too. Fall back to real brand copy so the tags are always meaningful.
    const safeTitle = scrubText(title, brand.business.name);
    const safeDescription = scrubText(
      description,
      scrubText(brand.business.tagline, brand.business.name),
    );

    document.title = safeTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', safeDescription);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical]);
}
