import { MapPin, Clock, Phone as PhoneIcon } from 'lucide-react';

interface HoursEntry {
  day: string;
  hours: string;
}

interface MapEmbedProps {
  lat: number;
  lng: number;
  address: string;
  directionsUrl: string;
  phone?: string;
  hours?: HoursEntry[];
  mapsApiKey?: string;
}

export default function MapEmbed({ lat, lng, address, directionsUrl, phone, hours, mapsApiKey }: MapEmbedProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const mapSrc = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${lat},${lng}&maptype=roadmap`
    : `https://www.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <section className="py-20 bg-[var(--color-bg-secondary,#0a0a1a)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Map */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-white/10">
            <iframe
              src={mapSrc}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Business location"
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-white/80 hover:text-[var(--color-accent)] transition-colors group"
              onClick={() => {
                if (typeof gtag !== 'undefined') gtag('event', 'direction_click');
                if (typeof posthog !== 'undefined') posthog.capture('direction_click');
              }}
            >
              <MapPin size={20} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-white group-hover:text-[var(--color-accent)]">Get Directions</p>
                <p className="text-sm">{address}</p>
              </div>
            </a>

            {/* Phone */}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-white/80 hover:text-[var(--color-accent)] transition-colors"
                onClick={() => {
                  if (typeof gtag !== 'undefined') gtag('event', 'phone_click', { phone });
                  if (typeof posthog !== 'undefined') posthog.capture('phone_click', { phone });
                }}
              >
                <PhoneIcon size={20} className="text-[var(--color-accent)] shrink-0" />
                <span className="font-semibold">{phone}</span>
              </a>
            )}

            {/* Hours */}
            {hours && hours.length > 0 && (
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                <div className="space-y-1 text-sm">
                  {hours.map(({ day, hours: h }) => (
                    <div
                      key={day}
                      className={`flex justify-between gap-6 ${day === today ? 'text-[var(--color-accent)] font-semibold' : 'text-white/60'}`}
                    >
                      <span>{day}</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
