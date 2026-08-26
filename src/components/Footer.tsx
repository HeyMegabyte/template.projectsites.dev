import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { brand, featureOn } from '@/brand';

interface NavRoute {
  to: string;
  label: string;
}

interface Props {
  routes?: NavRoute[];
  socials?: { label: string; href: string }[];
}

// Footer nav mirrors the header's vertical-aware "offer" entry: quote for
// service businesses, pricing for product/SaaS, neither for the rest.
function defaultRoutes(): NavRoute[] {
  const offer: NavRoute | null = featureOn('quote')
    ? { to: '/quote', label: 'Get a Quote' }
    : featureOn('pricing')
      ? { to: '/pricing', label: 'Pricing' }
      : null;
  return [
    { to: '/',         label: 'Home' },
    { to: '/about',    label: 'About' },
    { to: '/services', label: 'Services' },
    ...(offer ? [offer] : []),
    { to: '/blog',     label: 'Blog' },
    { to: '/faq',      label: 'FAQ' },
    { to: '/contact',  label: 'Contact' },
  ];
}

export default function Footer({ routes, socials = [] }: Props) {
  const navRoutes = routes ?? defaultRoutes();
  const business = brand.business;
  const address = business.address;
  const phone = business.phone;
  const email = business.email;
  // Derive a contact email from the business's own domain when research didn't
  // find one (skip projectsites.dev subdomains — no mailbox there). Never
  // fabricate a phone number.
  const derivedEmail =
    email ||
    (() => {
      try {
        const h = new URL(business.url || '').hostname.replace(/^www\./, '');
        return h && !h.endsWith('.projectsites.dev') ? `info@${h}` : '';
      } catch {
        return '';
      }
    })();
  const mapHref = address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` : '#';
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : '#';
  const emailHref = derivedEmail ? `mailto:${derivedEmail}` : '#';

  return (
    <footer className="relative bg-surface text-text-muted pt-20 pb-8 border-t border-border">
      <div className="max-w-container-wide mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="text-text font-bold text-xl mb-4 font-heading">
              {business.name || 'ProjectSites'}
            </h3>
            <p className="text-sm leading-relaxed">{business.description}</p>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-3 mt-6" aria-label="Social media">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
                      aria-label={s.label}
                    >
                      <span className="text-xs font-mono">{s.label.slice(0, 2).toUpperCase()}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-text font-semibold text-sm uppercase tracking-wider mb-6">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              {navRoutes.map((r) => (
                <li key={r.to}>
                  <Link
                    to={r.to}
                    className="hover:text-accent transition-colors underline-hover"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-text font-semibold text-sm uppercase tracking-wider mb-6">
              Contact
            </h3>
            <address className="not-italic space-y-3 text-sm">
              {address && (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-accent transition-colors underline-hover"
                >
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-text-subtle" aria-hidden="true" />
                  <span>{address}</span>
                </a>
              )}
              {phone && (
                <a
                  href={phoneHref}
                  className="flex items-center gap-2 hover:text-accent transition-colors underline-hover"
                >
                  <Phone size={16} className="flex-shrink-0 text-text-subtle" aria-hidden="true" />
                  <span>{phone}</span>
                </a>
              )}
              {derivedEmail && (
                <a
                  href={emailHref}
                  className="flex items-center gap-2 hover:text-accent transition-colors underline-hover break-all"
                >
                  <Mail size={16} className="flex-shrink-0 text-text-subtle" aria-hidden="true" />
                  <span>{derivedEmail}</span>
                </a>
              )}
              {/* Always-present contact channel — the form works even when phone/email are unknown. */}
              <Link
                to="/contact"
                className="flex items-center gap-2 hover:text-accent transition-colors underline-hover"
              >
                <MessageSquare size={16} className="flex-shrink-0 text-text-subtle" aria-hidden="true" />
                <span>Send us a message</span>
              </Link>
            </address>
          </div>

          <div>
            <h3 className="text-text font-semibold text-sm uppercase tracking-wider mb-6">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy"       className="hover:text-accent transition-colors underline-hover">Privacy Policy</Link></li>
              <li><Link to="/terms"         className="hover:text-accent transition-colors underline-hover">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="hover:text-accent transition-colors underline-hover">Accessibility</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-accent transition-colors underline-hover">Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-subtle">
          <p>© {new Date().getFullYear()} {business.name || 'ProjectSites'}. All rights reserved.</p>
          <p>
            Built with{' '}
            <a
              href="https://projectsites.dev"
              className="text-accent hover:text-accent-hover transition-colors underline-hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              ProjectSites
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
