import type { CSSProperties } from 'react';

/**
 * Canonical brand colors for common social/contact platforms.
 * Source: each platform's brand guidelines page (verified Apr 2026).
 * `email` and `phone` use `currentColor` so they inherit the surrounding text color.
 */
export const SOCIAL_BRAND_HEX: Record<string, string> = {
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  twitter: '#000000',
  x: '#000000',
  youtube: '#FF0000',
  instagram: '#E1306C',
  pinterest: '#BD081C',
  github: '#181717',
  discord: '#5865F2',
  bluesky: '#0085FF',
  mastodon: '#6364FF',
  reddit: '#FF4500',
  threads: '#000000',
  tiktok: '#25F4EE',
  email: 'currentColor',
  phone: 'currentColor',
};

export type SocialPlatform = keyof typeof SOCIAL_BRAND_HEX | (string & {});

interface SocialLinkProps {
  platform: SocialPlatform;
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Single social link that exposes `--brand-hex` on the anchor so any nested
 * SVG/text can reference the platform brand color via `var(--brand-hex)`.
 * Hover/focus/active all light up the brand color via CSS in this file.
 */
export function SocialLink({ platform, href, label, className, children }: SocialLinkProps) {
  const brand = SOCIAL_BRAND_HEX[platform.toLowerCase()] ?? 'currentColor';
  const style: CSSProperties = { ['--brand-hex' as string]: brand };
  const isExternal = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      aria-label={label ?? platform}
      className={`social-link interactive-4 ${className ?? ''}`.trim()}
      style={style}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

interface SocialLinksProps {
  links: { platform: SocialPlatform; href: string; label?: string; icon: React.ReactNode }[];
  className?: string;
}

/** Brand-hex aware row of social links. Pass `icon` (an SVG) per entry. */
export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <ul className={`social-links flex flex-wrap items-center gap-3 ${className ?? ''}`.trim()}>
      {links.map((l) => (
        <li key={l.platform + l.href}>
          <SocialLink platform={l.platform} href={l.href} label={l.label}>
            {l.icon}
          </SocialLink>
        </li>
      ))}
    </ul>
  );
}

/* Inline style block so consumers don't need to wire up CSS separately.
   Scoped via the `.social-link` class — safe to render multiple times. */
const STYLE_ID = 'social-links-style';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  color: currentColor;
  transition: color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.social-link:hover,
.social-link:focus-visible,
.social-link:active {
  color: var(--brand-hex);
}
`;
  document.head.appendChild(el);
}

export default SocialLinks;
