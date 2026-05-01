import { useEffect, useState, useCallback } from 'react';
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

function isEligible(img: HTMLImageElement): boolean {
  if (img.closest('header, footer, a, [data-no-zoom], button')) return false;
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  return w >= 200 && h >= 200;
}

function findGallery(img: HTMLImageElement): HTMLImageElement[] {
  const explicit = img.closest('[data-gallery]');
  if (explicit) {
    const id = (explicit as HTMLElement).dataset.gallery;
    const scope = document.querySelectorAll<HTMLElement>(`[data-gallery="${id}"]`);
    const imgs: HTMLImageElement[] = [];
    scope.forEach((el) => el.querySelectorAll<HTMLImageElement>('img').forEach((i) => isEligible(i) && imgs.push(i)));
    if (imgs.length) return imgs;
  }
  let node: HTMLElement | null = img.parentElement;
  while (node) {
    const candidates = Array.from(node.querySelectorAll<HTMLImageElement>('img')).filter(isEligible);
    if (candidates.length >= 2) return candidates;
    node = node.parentElement;
  }
  return [img];
}

function toSlide(img: HTMLImageElement): SlideImage & { description?: string } {
  const src = img.currentSrc || img.src;
  return {
    src,
    alt: img.alt || '',
    description: img.alt || undefined,
  };
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
      if (!isEligible(target)) return;

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
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (w < 200 || h < 200) return;
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
