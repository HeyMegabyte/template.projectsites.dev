import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative bg-[#060610] text-white/60 pt-20 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold text-xl mb-4 font-heading">
              {'{BUSINESS_NAME}'}
            </h3>
            <p className="text-sm leading-relaxed">
              {'{BUSINESS_DESCRIPTION}'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[var(--color-accent)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[var(--color-accent)] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--color-accent)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>{'{BUSINESS_ADDRESS}'}</li>
              <li>{'{BUSINESS_PHONE}'}</li>
              <li>{'{BUSINESS_EMAIL}'}</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-[var(--color-accent)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[var(--color-accent)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-[var(--color-accent)] transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} {'{BUSINESS_NAME}'}. All rights reserved.</p>
          <p>
            Built with{' '}
            <a
              href="https://projectsites.dev"
              className="text-[var(--color-accent)]/60 hover:text-[var(--color-accent)] transition-colors"
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
