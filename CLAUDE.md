# template.projectsites.dev — Claude Code Website Template

## Purpose
This is the starting template for all AI-generated websites on projectsites.dev.
Claude Code clones this repo, then customizes it for each business.

## Architecture
- **Self-contained HTML** — every page works standalone with Tailwind CSS CDN
- **Multi-page** — index.html + about.html + services.html + contact.html + privacy.html + terms.html
- **Industry-specific pages** — menu.html (restaurants), portfolio.html (creatives), listings.html (real estate), etc.
- **Shared components** — nav and footer are consistent across all pages

## File Structure
```
├── index.html          # Homepage — hero, about preview, services preview, CTA, testimonials
├── about.html          # About page — full story, team, mission, values
├── services.html       # Services/menu/offerings page
├── contact.html        # Contact form + map + hours + directions
├── privacy.html        # Privacy policy (auto-generated from business data)
├── terms.html          # Terms of service (auto-generated)
├── robots.txt          # SEO crawl directives
├── sitemap.xml         # All page URLs for search engines
└── CLAUDE.md           # This file
```

## Design System
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Custom Tailwind config block with brand colors + fonts
- Google Fonts CDN for heading + body fonts
- Inline SVG icons (heroicons-style)
- CSS gradients for all visual backgrounds (NO external image hotlinks)
- IntersectionObserver scroll animations
- Glassmorphism cards (backdrop-blur, semi-transparent borders)
- Mobile-first responsive with hamburger menu

## Customization Points
Claude Code should modify these for each business:
1. Brand colors in tailwind.config
2. Font families in Google Fonts link + tailwind.config
3. Business name, address, phone, email throughout
4. Service descriptions and pricing
5. History/timeline content
6. Contact form action URL (`https://projectsites.dev/api/contact-form/{slug}`)
7. JSON-LD LocalBusiness schema
8. Social media links in footer
9. Privacy policy business name and contact info
10. Terms of service business name and details

## Quality Standards
- Every page must have 500+ words of real content
- All text must be readable (proper contrast)
- Contact form must POST to the correct API endpoint
- JSON-LD schema must include real business data
- All pages must be mobile responsive (test at 375px)
- All pages must have proper <title>, <meta description>, Open Graph tags
- Lighthouse score target: 90+

## Maintenance
This template should be updated whenever:
- New design patterns are proven to work well
- New industry-specific pages are needed
- The Tailwind CDN version changes
- New SEO best practices emerge
- New accessibility requirements are identified
