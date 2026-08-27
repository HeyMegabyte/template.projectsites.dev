import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { FAQ } from './FAQ';
import { Pricing } from './Pricing';
import { BlogList } from './BlogList';

/**
 * Regression for the delivered-site defect surfed 2026-08-27: section-only pages
 * (FAQ / Pricing / Blog) rendered with ZERO <h1> in the hydrated DOM — every
 * section headline is an <h2>, and these pages have no explicit hero, so a real
 * visitor + screen reader + JS-crawler saw no page h1 (SEO + WCAG heading-order
 * defect the shell-only build validator missed). Fix: each lead section takes an
 * `as="h1"` prop so the page has exactly one h1. This guards the mechanism: the
 * lead headline promotes to <h1>, and the default stays <h2> for downstream sections.
 */

const faqItems = [{ question: 'How fast is it?', answer: 'Your site is live in under 15 minutes, start to finish.' }];
const tiers = [
  { id: 'starter', name: 'Starter', description: 'For getting going', monthly: 49, yearly: 470, features: ['One site', 'SSL included'] },
];
const posts = [{ slug: 'first', title: 'A first post', excerpt: 'A real, specific excerpt.', date: '2026-01-01' }];

const renderIn = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('section-only page headings — lead section promotes to <h1> (exactly one per page)', () => {
  it('FAQ: as="h1" renders the headline as the sole <h1>; default is <h2>', () => {
    const { container, unmount } = renderIn(<FAQ items={faqItems} headline="Frequently asked questions" as="h1" />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toContain('Frequently asked questions');
    unmount();

    const { container: c2 } = renderIn(<FAQ items={faqItems} headline="Frequently asked questions" />);
    expect(c2.querySelectorAll('h1')).toHaveLength(0);
    expect(c2.querySelector('h2')?.textContent).toContain('Frequently asked questions');
  });

  it('Pricing: as="h1" renders the headline as the sole <h1>', () => {
    const { container } = renderIn(<Pricing tiers={tiers} headline="Simple, transparent pricing" as="h1" />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toContain('Simple, transparent pricing');
  });

  it('BlogList: as="h1" renders the headline as the sole <h1>', () => {
    const { container } = renderIn(<BlogList posts={posts} headline="Notes from the field" as="h1" />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toContain('Notes from the field');
  });
});
