interface Service {
  name: string;
  description: string;
  image?: string;
  price?: string;
  bookingUrl?: string;
}

interface ServiceCardsProps {
  services: Service[];
  heading?: string;
}

export default function ServiceCards({ services, heading = 'Our Services' }: ServiceCardsProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-12 text-center text-balance">
          {heading}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.name}
              className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
            >
              {service.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-heading font-bold text-white">{service.name}</h3>
                  {service.price && (
                    <span className="text-[var(--color-accent)] font-semibold text-sm whitespace-nowrap">
                      {service.price}
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{service.description}</p>
                {service.bookingUrl && (
                  <a
                    href={service.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 text-sm font-semibold transition-colors"
                    onClick={() => {
                      if (typeof gtag !== 'undefined') gtag('event', 'booking_click', { service: service.name });
                      if (typeof posthog !== 'undefined') posthog.capture('booking_click', { service: service.name });
                    }}
                  >
                    Book Now →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
