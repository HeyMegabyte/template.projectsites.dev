import { Phone, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmergencyBannerProps {
  emergencyPhone: string;
  businessHours: Record<string, string>;
  timezone?: string;
}

function isOutsideBusinessHours(businessHours: Record<string, string>, timezone?: string): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: timezone,
  });

  const parts = formatter.formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  const currentMinutes = hour * 60 + minute;

  const todayHours = businessHours[weekday];
  if (!todayHours || todayHours.toLowerCase() === 'closed') return true;

  const match = todayHours.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (!match) return true;

  const parseTime = (h: string, m: string | undefined, ampm: string | undefined): number => {
    let hours = parseInt(h, 10);
    const mins = parseInt(m ?? '0', 10);
    if (ampm) {
      const lower = ampm.toLowerCase();
      if (lower === 'pm' && hours !== 12) hours += 12;
      if (lower === 'am' && hours === 12) hours = 0;
    }
    return hours * 60 + mins;
  };

  const openMinutes = parseTime(match[1], match[2], match[3]);
  const closeMinutes = parseTime(match[4], match[5], match[6]);

  return currentMinutes < openMinutes || currentMinutes >= closeMinutes;
}

export default function EmergencyBanner({
  emergencyPhone,
  businessHours,
  timezone,
}: EmergencyBannerProps) {
  const [afterHours, setAfterHours] = useState(false);

  useEffect(() => {
    setAfterHours(isOutsideBusinessHours(businessHours, timezone));

    const interval = setInterval(() => {
      setAfterHours(isOutsideBusinessHours(businessHours, timezone));
    }, 60_000);

    return () => clearInterval(interval);
  }, [businessHours, timezone]);

  if (!afterHours) return null;

  const track = (event: string, props?: Record<string, unknown>) => {
    window.gtag?.('event', event, props);
    window.posthog?.capture(event, props);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600/95 backdrop-blur-sm border-b border-red-400/30 motion-safe:animate-[slideDown_300ms_ease-out]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
        <AlertTriangle size={18} className="text-white shrink-0" />
        <span className="text-white text-sm font-medium">
          After Hours?
        </span>
        <a
          href={`tel:${emergencyPhone}`}
          className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-4 py-1.5 rounded-full transition-colors active:scale-95"
          onClick={() => track('phone_click', { phone: emergencyPhone, after_hours: true })}
        >
          <Phone size={14} strokeWidth={2.5} />
          Call {emergencyPhone}
        </a>
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
