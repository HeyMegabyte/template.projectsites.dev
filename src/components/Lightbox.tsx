import { useEffect, useState, useCallback } from 'react';
import YARL, { type SlideImage } from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Download from 'yet-another-react-lightbox/plugins/download';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Share from 'yet-another-react-lightbox/plugins/share';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const SHARE_TARGETS = {
  twitter: (u: string, t: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  facebook: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  linkedin: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
  pinterest: (u: string, t: string, img: string) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&description=${encodeURIComponent(t)}&media=${encodeURIComponent(img)}`,
  whatsapp: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  email: (u: string, t: string) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`,
};

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

function openSocialPicker(slide: SlideImage & { description?: string }) {
  const pageUrl = window.location.href;
  const title = slide.description || slide.alt || document.title;
  const imgUrl = new URL(slide.src, window.location.href).toString();

  const sheet = document.createElement('div');
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-label', 'Share image');
  sheet.className = 'lb-share-sheet';
  sheet.innerHTML = `
    <div class="lb-share-card" role="document">
      <h2 class="lb-share-title">Share this image</h2>
      <div class="lb-share-grid">
        <button data-share="twitter" type="button">X / Twitter</button>
        <button data-share="facebook" type="button">Facebook</button>
        <button data-share="linkedin" type="button">LinkedIn</button>
        <button data-share="pinterest" type="button">Pinterest</button>
        <button data-share="whatsapp" type="button">WhatsApp</button>
        <button data-share="email" type="button">Email</button>
        <button data-share="copy" type="button">Copy link</button>
      </div>
      <button data-share="close" type="button" class="lb-share-close" aria-label="Close share menu">Close</button>
    </div>
  `;

  function close() {
    sheet.remove();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  sheet.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === sheet) return close();
    const action = target.dataset?.share;
    if (!action) return;
    if (action === 'close') return close();
    if (action === 'copy') {
      navigator.clipboard?.writeText(pageUrl).catch(() => {});
      return close();
    }
    const builder = SHARE_TARGETS[action as keyof typeof SHARE_TARGETS];
    if (builder) {
      const url = builder(pageUrl, title, imgUrl);
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
    }
    close();
  });

  document.addEventListener('keydown', onKey);
  document.body.appendChild(sheet);
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
      plugins={[Captions, Counter, Download, Fullscreen, Share, Slideshow, Thumbnails, Zoom]}
      captions={{ descriptionTextAlign: 'center', showToggle: false }}
      counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
      thumbnails={{ position: 'bottom', width: 96, height: 64, border: 0, gap: 8 }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      slideshow={{ delay: 4000 }}
      share={{
        share: ({ slide }) => {
          const url = window.location.href;
          const text = (slide as SlideImage & { description?: string }).description || slide.alt || document.title;
          if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            navigator.share({ url, text, title: text }).catch(() => openSocialPicker(slide as SlideImage & { description?: string }));
          } else {
            openSocialPicker(slide as SlideImage & { description?: string });
          }
        },
      }}
      animation={{ fade: 300, swipe: 250 }}
      portal={{ root: typeof document !== 'undefined' ? document.body : undefined }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      carousel={{ finite: false, preload: 2, padding: '16px', spacing: '24px' }}
      styles={{ root: { '--yarl__color_backdrop': 'rgba(8, 0, 12, 0.94)' } }}
    />
  );
}
