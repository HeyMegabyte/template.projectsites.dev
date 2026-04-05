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
