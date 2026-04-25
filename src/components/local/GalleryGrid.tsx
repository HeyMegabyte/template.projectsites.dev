import { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  heading?: string;
}

export default function GalleryGrid({ images, heading = 'Gallery' }: GalleryGridProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-12 text-center text-balance">
          {heading}
        </h2>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setSelected(i)}
              className="block w-full rounded-xl overflow-hidden border border-white/5 hover:border-[var(--color-accent)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-accent)]/5 break-inside-avoid"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <img
            src={images[selected].src}
            alt={images[selected].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {images[selected].caption && (
            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg">
              {images[selected].caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
