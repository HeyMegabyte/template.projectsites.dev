# template.projectsites.dev — Claude Code Website Template

## Purpose
Starting template for AI-generated websites on projectsites.dev.
Claude Code clones this, runs `npm install`, then customizes for each business.

## Tech Stack
- **Vite** — fast dev server + build
- **React 18** — component-based UI
- **Tailwind CSS 3** — utility-first styling
- **React Router** — multi-page navigation
- **Lucide React** — SVG icons
- **clsx + tailwind-merge** — conditional class utilities
- **yet-another-react-lightbox** — image lightbox (auto-mounted in Layout)

## File Structure
```
├── index.html              # Vite entry point
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind theme (brand colors, fonts)
├── postcss.config.js       # PostCSS + Tailwind
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Router with all pages
│   ├── styles/globals.css  # Tailwind directives + CSS variables
│   ├── components/
│   │   ├── Layout.jsx      # Nav + Footer wrapper
│   │   ├── Nav.jsx         # Sticky nav with mobile hamburger
│   │   └── Footer.jsx      # 4-column footer
│   └── pages/
│       ├── Home.jsx        # Homepage with all sections
│       ├── About.jsx       # About page
│       ├── Services.jsx    # Services/menu/portfolio page
│       ├── Contact.jsx     # Contact form + info
│       ├── Privacy.jsx     # Privacy policy
│       └── Terms.jsx       # Terms of service
├── robots.txt
├── sitemap.xml
└── CLAUDE.md
```

## Claude Code Instructions
1. Run `npm install` first
2. Customize `tailwind.config.js` with brand colors and fonts
3. Update `src/styles/globals.css` CSS variables
4. Replace ALL placeholder content in pages with real business content
5. Update Nav.jsx and Footer.jsx with business name + links
6. Add industry-specific pages (menu.html for restaurants, etc.)
7. Run `npm run build` to generate production files in /dist
8. Upload /dist contents to R2

## Quality Standards
- Every page: 500+ words of real content
- All text: proper contrast (readable)
- Contact form: POSTs to projectsites.dev/api/contact-form/{slug}
- JSON-LD schema in Home.jsx
- Mobile responsive at 375px
- Lighthouse target: 90+

## Lightbox (Lightbox.tsx)
Auto-detects every `<main>` image >= 200×200 not inside `<a>`/`<button>`/
`[data-no-zoom]`. Marks them `data-zoomable="true"` + `cursor: zoom-in`.
Click → YARL opens with Captions, Counter, Download, Fullscreen, Share,
Slideshow, Thumbnails, Zoom plugins. Captions toggle is hidden
(`showToggle: false`) — captions show automatically from `alt` text.

**Galleries:** wrap groups with `<div data-gallery="services">…</div>` —
clicking any image opens the gallery scoped to that container, not just
the single image. Without `data-gallery`, the component walks up the DOM
to find the nearest ancestor with 2+ eligible images.

**Sharing:** uses `navigator.share()` on mobile (native share sheet),
falls back to a custom social picker (X/Twitter, Facebook, LinkedIn,
Pinterest, WhatsApp, Email, Copy link) on desktop.

**CSS overrides in index.css are mandatory.** YARL's portal uses
`position: fixed; top:0; bottom:0` — but any ancestor with `transform`,
`filter`, `will-change: transform`, `contain`, or `backdrop-filter`
becomes the containing block, breaking viewport sizing. The `100vw/100dvh`
overrides force the portal to ignore the containing-block trap. Do not
remove them.
