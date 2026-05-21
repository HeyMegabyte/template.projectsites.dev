# 100 More Upgrades — v3.6 (101-200)

Round-2 catalog. Deduplicated against `docs/UPGRADES-100.md`. Sources at bottom.

## K. Native HTML primitives (101-110)
101. **`<dialog>` modal** wrapper component — top-layer + focus trap + Esc + backdrop
102. **Popover API** primitive — `popovertarget` / `popovertargetaction` / `popover-target`
103. **Anchor positioning** — `anchor-name` / `position-anchor` / `position-area` for tooltips
104. **`<details name="X">`** exclusive accordion (replaces ARIA accordion JS)
105. **Customizable `<select>`** — `appearance: base-select` + `<selectedoption>` shadow part
106. **`<search>` element** — semantic wrapper for the Cmd+K palette + site search
107. **`field-sizing: content`** auto-sizing textarea + select
108. **`accent-color: var(--color-accent)`** — themed checkboxes, radios, progress
109. **`caret-color: var(--color-accent)`** — branded text caret
110. **`@property --brand-hue { syntax: '<number>'; ... }`** — registered custom property animations

## L. Edge runtime + serverless (111-120)
111. **Cloudflare Pages Functions** at `functions/api/contact.ts` — Resend / Slack / Discord webhook
112. **`functions/api/newsletter.ts`** — Listmonk SMTP relay
113. **`functions/api/turnstile.ts`** — Turnstile token verification
114. **`functions/api/reports/csp.ts`** — CSP violation log receiver
115. **Workers AI route** at `functions/api/ai/chat.ts` — Llama 3.3 / Claude via AI Gateway
116. **Hono router** under `/api/*` for typed handlers
117. **D1 stub** schema + migration scaffolding
118. **R2 stub** for image uploads
119. **KV stub** for cache + session
120. **Workers Tracing (OTLP)** — `[observability] enabled = true` in `wrangler.jsonc`

## M. AI-native UX (121-130)
121. **`<AiChat>` component** — Cmd+K-style chat overlay, streams from `/api/ai/chat`
122. **`<AskAnything>` inline search** with model-routed answers (search vs RAG vs chat)
123. **AI-generated FAQ ideas** — script that calls Claude to expand FAQ from a brief
124. **AI image alt-text generator** — script that proposes alt for uploaded images
125. **AI-rewrite suggestions** — slash command in dev for copy improvements
126. **AI summary slot** — `<AiSummary text={postBody} />` renders a 2-sentence TL;DR
127. **Speakable JSON-LD** on the lead paragraph (voice-assistant pickup)
128. **GEO citation tracker** — script that probes Perplexity for citations of the domain
129. **Tone-checker** — Vitest rule that fails build on banned-slop words
130. **`window.__brand` global** exposing the resolved brand for any chat / AI agent in-page

## N. Real-time + collaboration (131-140)
131. **EventSource (SSE)** stub at `functions/api/live/visitors.ts`
132. **`<LiveVisitorCount>`** component that streams active visitors
133. **Web Push** declarative skeleton (Safari 18.4+)
134. **Web Locks API** — coordinate critical actions across tabs
135. **Broadcast Channel API** — same-origin tab sync (theme + cart)
136. **Web Share API** wrapper — share current page
137. **Clipboard API** — copy-link button for blog posts
138. **Media Session API** — bind media controls when a `<VideoEmbed>` plays
139. **Picture-in-Picture toggle** on video embeds
140. **`navigator.scheduling.isInputPending()`** for INP-friendly background work

## O. Auth + payments + forms (141-150)
141. **WebAuthn passkey login** — `<PasskeyLogin>` with `autocomplete="username webauthn"` + conditional UI
142. **Magic-link login stub** — `functions/api/auth/magic.ts`
143. **Stripe Checkout link generator** — `lib/stripe.ts` with brand-aware product builder
144. **Stripe `<PriceTag>`** — server-fetched price with `loading="lazy"`
145. **Multi-step form** primitive with progress bar + back/forward
146. **Form autosave** to `IndexedDB` on each field change
147. **Optimistic likes/reactions** — `useOptimistic` on blog posts
148. **Real-time form validation** with `useDeferredValue`
149. **`requestIdleCallback`** for non-critical analytics events
150. **Newsletter double-opt-in** flow via Resend / Listmonk

## P. Content + search + i18n (151-160)
151. **Pagefind** — static-site search build step + `<SearchPalette>` integration
152. **RSS feed** — `public/rss.xml` auto-built from blog content
153. **Atom feed** — `public/atom.xml` alongside RSS
154. **JSON Feed** — `public/feed.json` (jsonfeed.org v1.1)
155. **MDX-ready blog** content scaffolding
156. **i18n stub** — `src/lib/i18n.ts` with `useTranslation(key)`, locale switch via `?lang=`
157. **`<link rel="alternate" hreflang>`** per supported locale
158. **`lang`-aware date/number formatting** via `Intl.DateTimeFormat` + `Intl.NumberFormat`
159. **RTL support** — `dir="rtl"` opt-in via `brand.locale.dir`
160. **Sitemap with `<xhtml:link rel="alternate">`** per locale

## Q. Animation + interaction polish (161-170)
161. **Scroll-driven progress bar** — top-of-page using `animation-timeline: scroll(root)`
162. **Magnetic button** hover — small JS that nudges the button toward the cursor
163. **Marquee on hover-pause** improved with `animation-play-state: paused`
164. **Parallax image** via `animation-timeline: view()`
165. **Cursor spotlight** — pointer-tracked radial gradient (decorative, no JS animation)
166. **Page-corner crests** — rotating badges
167. **Numbered list reveal** — staggered count-up
168. **Confetti on conversion** via canvas-confetti (lazy)
169. **`@starting-style` toast** entry animation
170. **`prefers-reduced-motion`** double-pass — every new animation respects it

## R. Brand customizer + DX (171-180)
171. **`/studio`** route — live brand picker (hue, chroma, mode, fonts) that mutates `_brand.json` in-memory
172. **`<input type="color">`** for primary / accent (with OKLCH conversion)
173. **`<input type="range">`** for brandHue with `accent-color`
174. **Export `_brand.json`** download button on the studio
175. **Apply preset** dropdown reading `examples/_brand.*.json`
176. **`npm run brand:preview`** runs `vite preview` on the brand at a temp port
177. **`npm run new:section`** scaffolds a section component matching AGENTS.md conventions
178. **`npm run new:page`** scaffolds a route + sitemap entry + Cmd+K action
179. **Vite plugin** that inlines critical CSS at build time
180. **Vite plugin** that emits a per-route preload manifest

## S. Privacy + security + accessibility deep cuts (181-190)
181. **Trusted Types policies** at runtime — `trustedTypes.createPolicy('default', ...)`
182. **CSP report-only** initially, then enforced — `Content-Security-Policy-Report-Only` header
183. **`<iframe sandbox>`** locked-down for `<Demo>` embeds
184. **`<iframe credentialless>`** for cross-origin iframes
185. **Subresource Integrity (SRI)** on external CDN scripts (none currently — preempt future)
186. **`aria-keyshortcuts`** on Cmd+K + theme toggle + skip-link
187. **Focus-trap utility** — small lib for new dialog/popover wrappers
188. **`role="status"` + `aria-live="polite"`** on the live counter / brand-swap announcer
189. **`prefers-reduced-data: reduce`** — skip the gallery card images, show 4-cell wireframes
190. **`@scope`** isolation for the `/studio` route so its experimental CSS doesn't leak

## T. Analytics + observability + RUM (191-200)
191. **Cloudflare Web Analytics beacon** — auto-injected via `_headers` snippet
192. **PostHog snippet** with `persistence: 'memory'` (cookie-free)
193. **Sentry init** with `withSentry` wrapper on Pages Functions
194. **GA4 via GTM** — 14-step automation per skill 13
195. **Plausible / Fathom / Umami** opt-in via `brand.analytics.provider`
196. **Real User Monitoring**: `web-vitals` library + soft-nav (replaces hand-rolled perfMonitor)
197. **Error boundary breadcrumb** posts to `/api/reports/error`
198. **`navigation.timing`** parsed + emitted as `navigation_*` events
199. **Resource Timing** events for slow asset loads (>500ms)
200. **Lighthouse CI** GitHub Action that comments on PRs with deltas

## Sources

- [Popover API + Anchor Positioning — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)
- [Native Dialog + Popover — web.dev](https://web.dev/learn/css/popover-and-dialog)
- [Cloudflare Pages vs Workers 2026](https://www.morphllm.com/comparisons/cloudflare-pages-vs-workers)
- [Workers AI](https://www.cloudflare.com/products/workers-ai/) · [AI Gateway](https://www.cloudflare.com/products/ai-gateway/)
- [WebAuthn Conditional UI — Corbado](https://www.corbado.com/blog/webauthn-conditional-ui-passkeys-autofill)
- [WebAuthn passwordless sign-in — Chrome](https://developer.chrome.com/docs/identity/webauthn-conditional-ui)
- [`field-sizing` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing)
- [`interpolate-size` — CSS-Tricks](https://css-tricks.com/almanac/properties/i/interpolate-size/)
- [`text-wrap: pretty` — Chrome](https://developer.chrome.com/blog/css-text-wrap-pretty)
- [`text-box-trim` — Chrome](https://developer.chrome.com/blog/css-text-box-trim)
- [Pagefind static-site search](https://pagefind.app/)
