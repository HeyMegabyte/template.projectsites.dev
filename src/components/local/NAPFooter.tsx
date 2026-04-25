import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface NAPFooterProps {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  hours: Record<string, string>;
  socialLinks: SocialLink[];
  logoSrc?: string;
}

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function getTodayDay(): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
}

export default function NAPFooter({
  businessName,
  address,
  phone,
  email,
  hours,
  socialLinks,
  logoSrc,
}: NAPFooterProps) {
  const today = getTodayDay();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const track = (event: string, props?: Record<string, unknown>) => {
    window.gtag?.('event', event, props);
    window.posthog?.capture(event, props);
  };

  return (
    <footer
      className="bg-white/5 backdrop-blur-md border-t border-white/10 py-16"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Business identity */}
          <div>
            {logoSrc && (
              <img
                src={logoSrc}
                alt={`${businessName} logo`}
                className="h-12 w-auto mb-4"
                loading="lazy"
                decoding="async"
                itemProp="logo"
              />
            )}
            <h2 className="text-xl font-heading font-bold text-white mb-4" itemProp="name">
              {businessName}
            </h2>

            <div className="space-y-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-white/70 hover:text-[var(--color-accent)] transition-colors text-sm"
                onClick={() => track('direction_click', { address })}
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span itemProp="streetAddress">{address}</span>
              </a>

              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-white/70 hover:text-[var(--color-accent)] transition-colors text-sm"
                onClick={() => track('phone_click', { phone })}
              >
                <Phone size={18} className="shrink-0" />
                <span itemProp="telephone">{phone}</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-white/70 hover:text-[var(--color-accent)] transition-colors text-sm"
                onClick={() => track('email_click', { email })}
              >
                <Mail size={18} className="shrink-0" />
                <span itemProp="email">{email}</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-[var(--color-accent)]" />
              Hours
            </h3>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(hours).map(([day, time]) => (
                  <tr
                    key={day}
                    className={day === today ? 'text-[var(--color-accent)] font-semibold' : 'text-white/60'}
                  >
                    <td className="py-1.5 pr-4">{day}</td>
                    <td className="py-1.5 text-right">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ platform, url }) => {
                const key = platform.toLowerCase();
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 border border-white/10 text-white/70 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all"
                    aria-label={`Follow us on ${platform}`}
                    itemProp="sameAs"
                    onClick={() => track('social_click', { platform })}
                  >
                    {key === 'tiktok' ? (
                      <TikTokIcon size={18} />
                    ) : Icon ? (
                      <Icon size={18} />
                    ) : (
                      <span className="text-xs font-bold">{platform.charAt(0).toUpperCase()}</span>
                    )}
                  </a>
                );
              })}
            </div>

            <p className="text-white/30 text-xs mt-8">
              &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
