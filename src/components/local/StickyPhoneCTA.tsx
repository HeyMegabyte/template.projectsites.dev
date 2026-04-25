import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StickyPhoneCTAProps {
  phone: string;
  label?: string;
}

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
    <a
      href={`tel:${phone}`}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[#0a0a1a] font-bold text-base py-4 transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
      onClick={() => {
        if (typeof gtag !== 'undefined') gtag('event', 'phone_click', { phone });
        if (typeof posthog !== 'undefined') posthog.capture('phone_click', { phone });
      }}
      aria-label={`${label} ${phone}`}
    >
      <Phone size={20} strokeWidth={2.5} />
      {label}
    </a>
  );
}
