import { Phone, MapPin, Calendar, UtensilsCrossed, Clock, MessageCircle } from 'lucide-react';

interface QuickActionsProps {
  phone?: string;
  directionsUrl?: string;
  bookingUrl?: string;
  menuUrl?: string;
  hoursOpen?: boolean;
}

interface ActionItem {
  label: string;
  icon: typeof Phone;
  href: string;
  event: string;
  color: string;
}

export default function QuickActions({
  phone,
  directionsUrl,
  bookingUrl,
  menuUrl,
  hoursOpen,
}: QuickActionsProps) {
  const track = (event: string, props?: Record<string, unknown>) => {
    window.gtag?.('event', event, props);
    window.posthog?.capture(event, props);
  };

  const actions: ActionItem[] = [];

  if (phone) {
    actions.push({
      label: 'Call',
      icon: Phone,
      href: `tel:${phone}`,
      event: 'phone_click',
      color: 'bg-green-500/20 text-green-400',
    });
  }

  if (directionsUrl) {
    actions.push({
      label: 'Directions',
      icon: MapPin,
      href: directionsUrl,
      event: 'direction_click',
      color: 'bg-blue-500/20 text-blue-400',
    });
  }

  if (bookingUrl) {
    actions.push({
      label: 'Book',
      icon: Calendar,
      href: bookingUrl,
      event: 'booking_click',
      color: 'bg-purple-500/20 text-purple-400',
    });
  }

  if (menuUrl) {
    actions.push({
      label: 'Menu',
      icon: UtensilsCrossed,
      href: menuUrl,
      event: 'menu_click',
      color: 'bg-orange-500/20 text-orange-400',
    });
  }

  if (phone) {
    actions.push({
      label: 'Text',
      icon: MessageCircle,
      href: `sms:${phone}`,
      event: 'sms_click',
      color: 'bg-cyan-500/20 text-cyan-400',
    });
  }

  if (hoursOpen !== undefined) {
    actions.push({
      label: hoursOpen ? 'Open Now' : 'Closed',
      icon: Clock,
      href: '#hours',
      event: 'hours_click',
      color: hoursOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400',
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
      <div
        className={`grid gap-2 ${actions.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}
      >
        {actions.map(({ label, icon: Icon, href, event, color }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`flex flex-col items-center justify-center gap-1.5 min-h-[48px] py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all active:scale-95 ${href === '#hours' ? 'pointer-events-none' : ''}`}
            onClick={(e) => {
              if (href === '#hours') {
                e.preventDefault();
                return;
              }
              track(event, { phone, label });
            }}
            aria-label={label}
          >
            <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
              <Icon size={16} />
            </div>
            <span className="text-white/80 text-[11px] font-medium">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
