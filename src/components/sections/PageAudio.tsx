import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * PageAudio — an AI-native "Listen to this page" player.
 *
 * PRIMARY path (AI audio): on play it POSTs the page's readable text to the site's
 * own worker (`POST /api/page-audio/:slug`), which AI-SUMMARIZES the page (a warm
 * spoken overview — NOT a verbatim read of everything) and speaks the summary with
 * an open-source TTS (MeloTTS on Cloudflare Workers AI). The returned WAV — cached
 * in R2 so it's generated once per page version — plays through an `<audio>` element.
 *
 * FALLBACK path (on-device): if the endpoint is unavailable (custom-domain sites,
 * an older worker, an offline visitor, or any model fault → `audioUrl: null`), it
 * degrades to the browser's own `speechSynthesis` reading the page text. A broken
 * model must never break the button.
 *
 * @remarks
 * Progressive + SSR-safe: every browser access is guarded behind `useEffect` +
 * `typeof window !== 'undefined'`, so nothing renders during prerender. It NEVER
 * autoplays — audio starts only from a real user gesture. On unmount / route change
 * both engines are stopped so the previous page never talks over the next one.
 *
 * Cinematic layer (component-scoped `.psa-` classes in index.css): a glass surface
 * with an OKLCH accent aura + an animated equalizer while speaking, double-gated on
 * `prefers-reduced-motion` AND `prefers-reduced-data`. A11y (real buttons,
 * `aria-pressed`, descriptive labels, visible focus ring, an `aria-live` status that
 * also announces "Summarizing…") holds in every path.
 */
interface Props {
  /** Overrides the auto-extracted page text (e.g. a curated read). */
  text?: string;
  /** Overrides the control caption. Default: "Listen to this page". */
  label?: string;
}

/** Playback lifecycle. `loading` = summarizing + synthesizing the audio. */
type PlayState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';

/** Which engine is currently driving playback. */
type Engine = 'audio' | 'speech' | null;

/** Hard cap on page text sent for summarization / spoken as a fallback. */
const MAX_CHARS = 12000;

/** Collapse runs of whitespace + hard-cap length so requests + utterances stay bounded. */
function normalizeText(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS);
}

/** Pull the page's readable text at click time (prefer the `<main>` landmark). */
function extractPageText(): string {
  if (typeof document === 'undefined') return '';
  const main = document.querySelector('main');
  const src = (main as HTMLElement | null)?.innerText || document.body?.innerText || '';
  return normalizeText(src);
}

/**
 * Derive the site slug from a `*.projectsites.dev` host. Returns null for the
 * marketing apex + custom domains, where the widget falls back to on-device speech.
 */
function deriveSlug(): string | null {
  if (typeof location === 'undefined') return null;
  const suffix = '.projectsites.dev';
  const host = location.hostname;
  if (!host.endsWith(suffix)) return null;
  const label = host.slice(0, -suffix.length).split('.').pop() || '';
  return label && label !== 'www' && label !== 'projectsites' ? label : null;
}

export function PageAudio({ text, label = 'Listen to this page' }: Props = {}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [state, setState] = useState<PlayState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null); // AI-audio engine
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // fallback engine
  const audioUrlRef = useRef<string | null>(null); // cached generated URL → instant replay
  const engineRef = useRef<Engine>(null);

  // Supported when EITHER engine is available (both are near-universal).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSpeech =
      'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
    const hasAudio = typeof window.Audio === 'function' && typeof fetch === 'function';
    setSupported(hasSpeech || hasAudio);
  }, []);

  // Stop both engines on unmount / route change.
  useEffect(() => {
    return () => {
      try {
        audioRef.current?.pause();
      } catch {
        /* ignore */
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speaking = state === 'playing' || state === 'paused';

  const stop = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch {
      /* ignore */
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    engineRef.current = null;
    setState('idle');
  }, []);

  // Fallback engine: on-device speechSynthesis of the page text.
  const startSpeech = useCallback((body: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setState('idle');
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(body);
    u.rate = 1;
    u.pitch = 1;
    u.lang = (typeof document !== 'undefined' && document.documentElement.lang) || 'en-US';
    u.onend = () => {
      utteranceRef.current = null;
      setState('ended');
    };
    u.onerror = () => {
      utteranceRef.current = null;
      setState('idle');
    };
    utteranceRef.current = u;
    engineRef.current = 'speech';
    setState('playing');
    synth.speak(u);
  }, []);

  // Primary engine: play a generated WAV URL through <audio>.
  const startAudioUrl = useCallback((url: string) => {
    try {
      let a = audioRef.current;
      if (!a) {
        a = new Audio();
        audioRef.current = a;
      }
      a.src = url;
      a.onended = () => setState('ended');
      a.onerror = () => {
        engineRef.current = null;
        setState('idle');
      };
      engineRef.current = 'audio';
      setState('playing');
      void a.play().catch(() => {
        engineRef.current = null;
        setState('idle');
      });
    } catch {
      setState('idle');
    }
  }, []);

  // Kick off a read: AI-summary audio when possible, else on-device speech.
  const start = useCallback(async () => {
    // Instant replay of an already-generated URL.
    if (audioUrlRef.current) {
      startAudioUrl(audioUrlRef.current);
      return;
    }
    const body = normalizeText(text ?? '') || extractPageText();
    if (!body) return;

    const slug = deriveSlug();
    // Custom domain / no fetch → straight to on-device speech.
    if (!slug || typeof fetch !== 'function') {
      startSpeech(body);
      return;
    }

    setState('loading');
    try {
      const res = await fetch(`/api/page-audio/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ route: location.pathname, text: body }),
        mode: 'same-origin',
        credentials: 'omit',
      });
      const json = (await res.json().catch(() => null)) as {
        data?: { audioUrl?: string | null };
      } | null;
      const url = json?.data?.audioUrl || null;
      if (url) {
        audioUrlRef.current = url;
        startAudioUrl(url);
      } else {
        startSpeech(body); // model unavailable → graceful on-device read
      }
    } catch {
      startSpeech(body); // network fault → graceful on-device read
    }
  }, [text, startAudioUrl, startSpeech]);

  // Play / Pause / Resume — operate on whichever engine is active.
  const toggle = useCallback(() => {
    if (state === 'loading') return; // ignore taps while summarizing
    if (state === 'playing') {
      if (engineRef.current === 'audio') {
        try {
          audioRef.current?.pause();
        } catch {
          /* ignore */
        }
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setState('paused');
    } else if (state === 'paused') {
      if (engineRef.current === 'audio') {
        void audioRef.current?.play().catch(() => setState('idle'));
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      setState('playing');
    } else {
      void start();
    }
  }, [state, start]);

  // Self-hide when neither engine is available or before detection resolves.
  if (supported !== true) return null;

  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';
  const statusText = isLoading
    ? 'Summarizing…'
    : state === 'playing'
      ? 'Playing…'
      : state === 'paused'
        ? 'Paused'
        : state === 'ended'
          ? 'Finished'
          : 'Ready';

  return (
    <section
      className="psa-band py-10 md:py-14 max-w-container-wide mx-auto px-6"
      data-playing={isPlaying ? 'true' : 'false'}
      data-loading={isLoading ? 'true' : 'false'}
      aria-label="Listen to this page"
    >
      <div className="psa-shell text-text">
        <span className="psa-aura" aria-hidden="true" />

        <div className="psa-controls">
          <button
            type="button"
            className="psa-btn"
            data-primary="true"
            onClick={toggle}
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-pressed={isPlaying}
            aria-label={
              isLoading
                ? 'Summarizing this page…'
                : isPlaying
                  ? 'Pause listening'
                  : state === 'paused'
                    ? 'Resume listening'
                    : 'Play — AI summary of this page, read aloud'
            }
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            type="button"
            className="psa-btn"
            onClick={stop}
            disabled={!speaking}
            aria-disabled={!speaking}
            aria-label="Stop listening"
          >
            <StopIcon />
          </button>
        </div>

        <div className="psa-copy">
          <span className="psa-label">{label}</span>
          <span className="psa-hint" aria-hidden="true">
            An AI summary of this page, read aloud.
          </span>
          {/* Live region: assistive tech announces "Summarizing…" / playback changes. */}
          <span className="psa-sr" aria-live="polite" role="status">
            {statusText}
          </span>
        </div>

        {/* Decorative equalizer — static ticks unless motion+data both allow. */}
        <div className="psa-eq" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

/* Inline SVG glyphs — no icon-library dependency, `currentColor`-driven so they
   inherit the button's accent/ink treatment. */
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.79-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export default PageAudio;
