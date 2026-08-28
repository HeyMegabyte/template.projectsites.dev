import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StickyPhoneCTAProps {
  phone: string;
  label?: string;
}

/**
 * `StickyPhoneCTA` — a mobile sticky call bar that appears once the hero scrolls away and hides
 * over the footer. Cinematic: it slides up on reveal, the phone icon gives a gentle periodic "ring"
 * wiggle, and a soft accent glow lifts it off the page. Ink via `--color-on-accent` (theme-correct,
 * was a hardcoded `#0a0a1a`). All motion is `prefers-reduced-motion` gated.
 */
export default function StickyPhoneCTA({ phone, label = 'Call Now' }: StickyPhoneCTAProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <>
      <a
        href={`tel:${phone}`}
        className="sticky-phone-cta md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-on-accent)] font-bold text-base py-4 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-on-accent)]/50 motion-reduce:transition-none"
        onClick={() => {
          if (typeof gtag !== 'undefined') gtag('event', 'phone_click', { phone });
          if (typeof posthog !== 'undefined') posthog.capture('phone_click', { phone });
        }}
        aria-label={`${label} ${phone}`}
      >
        <Phone size={20} strokeWidth={2.5} className="sticky-phone-icon" />
        {label}
      </a>

      <style>{`
        .sticky-phone-cta { box-shadow: 0 -8px 26px -12px color-mix(in oklch, var(--color-accent) 65%, transparent); }
        @media (prefers-reduced-motion: no-preference) {
          .sticky-phone-cta { animation: stickyUp 0.34s cubic-bezier(0.22,1,0.36,1) both; }
          @keyframes stickyUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          .sticky-phone-icon { animation: stickyRing 2.6s ease-in-out infinite; transform-origin: center; }
          @keyframes stickyRing {
            0%, 86%, 100% { transform: rotate(0); }
            89% { transform: rotate(-14deg); }
            93% { transform: rotate(12deg); }
            97% { transform: rotate(-6deg); }
          }
        }
      `}</style>
    </>
  );
}
