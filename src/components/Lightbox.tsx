import { useEffect, useState, useCallback, useMemo } from 'react';
import YARL, { type SlideImage } from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Download from 'yet-another-react-lightbox/plugins/download';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

/* -------------------------------------------------------------------------- */
/*  Eligibility classifier (shared between programmatic + DOM-event modes)    */
/* -------------------------------------------------------------------------- */

export interface LightboxImage {
  src: string;
  alt?: string;
  /** `logo` images are excluded from lightboxes regardless of dimensions. */
  kind?: 'logo' | 'photo' | string;
  width?: number;
  height?: number;
  /** Subjective quality rating 0–10 from inspection pipeline. */
  quality?: number;
}

const MIN_W = 1024;
const MIN_H = 768;
const MIN_QUALITY = 7;

/**
 * Returns `true` when an image meets the lightbox eligibility floor:
 * not a logo, dims ≥ 1024×768, quality ≥ 7.
 */
export function inferLightboxEligibility(image: LightboxImage): boolean {
  if (image.kind === 'logo') return false;
  if (typeof image.width === 'number' && typeof image.height === 'number') {
    if (image.width < MIN_W || image.height < MIN_H) return false;
  }
  if (typeof image.quality === 'number' && image.quality < MIN_QUALITY) return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/*  Programmatic gallery component (preferred for new generation)             */
/* -------------------------------------------------------------------------- */

interface GalleryProps {
  images: LightboxImage[];
  className?: string;
  imageClassName?: string;
  /** Render each non-eligible image as static (no zoom). Default: true. */
  filterIneligible?: boolean;
}

/**
 * Renders an image strip; eligible images become a synced lightbox group,
 * non-eligible images render as static `<img>` (no zoom handler attached).
 */
export function LightboxGallery({
  images,
  className,
  imageClassName,
  filterIneligible = true,
}: GalleryProps) {
  const eligible = useMemo(
    () => (filterIneligible ? images.filter(inferLightboxEligibility) : images),
    [images, filterIneligible],
  );
  const slides = useMemo<SlideImage[]>(
    () => eligible.map((i) => ({ src: i.src, alt: i.alt ?? '', description: i.alt })),
    [eligible],
  );
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const close = useCallback(() => setOpen(false), []);

  const eligibleSrcs = useMemo(() => new Set(eligible.map((e) => e.src)), [eligible]);

  return (
    <>
      <div className={`grid gap-4 ${className ?? ''}`.trim()}>
        {images.map((img, i) => {
          const isEligible = eligibleSrcs.has(img.src);
          const slideIndex = eligible.findIndex((e) => e.src === img.src);
          if (isEligible) {
            return (
              <button
                key={img.src + i}
                type="button"
                aria-label={`Open ${img.alt ?? 'image'} in lightbox`}
                onClick={() => {
                  setIndex(Math.max(0, slideIndex));
                  setOpen(true);
                }}
                className="group block w-full overflow-hidden rounded-lg interactive-4"
                style={{ cursor: 'zoom-in' }}
              >
                <img
                  src={img.src}
                  alt={img.alt ?? ''}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  className={`h-auto w-full transition-transform duration-500 group-hover:scale-105 ${imageClassName ?? ''}`.trim()}
                  data-zoomable="true"
                />
              </button>
            );
          }
          return (
            <img
              key={img.src + i}
              src={img.src}
              alt={img.alt ?? ''}
              width={img.width}
              height={img.height}
              loading="lazy"
              className={`h-auto w-full ${imageClassName ?? ''}`.trim()}
              data-no-zoom="true"
            />
          );
        })}
      </div>
      <YARL
        open={open}
        close={close}
        slides={slides}
        index={index}
        on={{ view: ({ index: i }) => setIndex(i) }}
        plugins={[Captions, Counter, Download, Fullscreen, Slideshow, Thumbnails, Zoom]}
        captions={{ descriptionTextAlign: 'center', showToggle: false }}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
        thumbnails={{ position: 'bottom', width: 96, height: 64, border: 0, gap: 8 }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        slideshow={{ delay: 4000 }}
        animation={{ fade: 300, swipe: 250 }}
        portal={{ root: typeof document !== 'undefined' ? document.body : undefined }}
        controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
        carousel={{ finite: false, preload: 2, padding: '16px', spacing: '24px' }}
        styles={{ root: { '--yarl__color_backdrop': 'rgba(8, 0, 12, 0.94)' } }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Legacy DOM-event lightbox (auto-detects all eligible <img> on the page)   */
/* -------------------------------------------------------------------------- */

function isDomEligible(img: HTMLImageElement): boolean {
  if (img.closest('header, footer, a, [data-no-zoom], button')) return false;
  if (img.dataset.kind === 'logo') return false;
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (w < MIN_W || h < MIN_H) return false;
  const quality = img.dataset.quality ? Number(img.dataset.quality) : undefined;
  if (typeof quality === 'number' && quality < MIN_QUALITY) return false;
  return true;
}

function findGallery(img: HTMLImageElement): HTMLImageElement[] {
  const explicit = img.closest('[data-gallery]');
  if (explicit) {
    const id = (explicit as HTMLElement).dataset.gallery;
    const scope = document.querySelectorAll<HTMLElement>(`[data-gallery="${id}"]`);
    const imgs: HTMLImageElement[] = [];
    scope.forEach((el) =>
      el.querySelectorAll<HTMLImageElement>('img').forEach((i) => isDomEligible(i) && imgs.push(i)),
    );
    if (imgs.length) return imgs;
  }
  let node: HTMLElement | null = img.parentElement;
  while (node) {
    const candidates = Array.from(node.querySelectorAll<HTMLImageElement>('img')).filter(isDomEligible);
    if (candidates.length >= 2) return candidates;
    node = node.parentElement;
  }
  return [img];
}

function toSlide(img: HTMLImageElement): SlideImage & { description?: string } {
  const src = img.currentSrc || img.src;
  return { src, alt: img.alt || '', description: img.alt || undefined };
}

export function Lightbox() {
  const [slides, setSlides] = useState<(SlideImage & { description?: string })[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLImageElement)) return;
      if (!isDomEligible(target)) return;

      e.preventDefault();
      const siblings = findGallery(target);
      const startIndex = Math.max(
        0,
        siblings.findIndex((s) => (s.currentSrc || s.src) === (target.currentSrc || target.src)),
      );
      setSlides(siblings.map(toSlide));
      setIndex(startIndex);
      setOpen(true);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    function markZoomable() {
      const imgs = document.querySelectorAll<HTMLImageElement>('main img');
      imgs.forEach((img) => {
        if (img.closest('a, [data-no-zoom], button')) return;
        if (img.dataset.kind === 'logo') return;
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (w < MIN_W || h < MIN_H) return;
        if (img.dataset.zoomable === 'true') return;
        img.dataset.zoomable = 'true';
        img.style.cursor = 'zoom-in';
      });
    }
    markZoomable();
    const interval = window.setInterval(markZoomable, 1500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <YARL
      open={open}
      close={close}
      slides={slides}
      index={index}
      on={{ view: ({ index: i }) => setIndex(i) }}
      plugins={[Captions, Counter, Download, Fullscreen, Slideshow, Thumbnails, Zoom]}
      captions={{ descriptionTextAlign: 'center', showToggle: false }}
      counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
      thumbnails={{ position: 'bottom', width: 96, height: 64, border: 0, gap: 8 }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      slideshow={{ delay: 4000 }}
      animation={{ fade: 300, swipe: 250 }}
      portal={{ root: typeof document !== 'undefined' ? document.body : undefined }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      carousel={{ finite: false, preload: 2, padding: '16px', spacing: '24px' }}
      styles={{ root: { '--yarl__color_backdrop': 'rgba(8, 0, 12, 0.94)' } }}
    />
  );
}
