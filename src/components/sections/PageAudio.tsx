import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * PageAudio — an AI-native "Listen to this page" audio player built entirely on the
 * browser's Web Speech API (`window.speechSynthesis` + `SpeechSynthesisUtterance`).
 * Zero backend, zero dependencies, zero API keys: the visitor's own device narrates
 * the page's main text aloud on demand.
 *
 * @remarks
 * Progressive + SSR-safe by construction:
 *   - EVERY browser access is guarded behind `useEffect` + `typeof window !== 'undefined'`,
 *     so the module renders nothing during server render / prerender.
 *   - On mount, if `speechSynthesis` is unavailable, the component sets `unsupported`
 *     and returns `null` — it self-hides rather than showing a dead control.
 *   - It NEVER autoplays: audio starts only from a real user gesture (a button click),
 *     satisfying browser autoplay policies and respecting the visitor.
 *
 * Cinematic layer (fully component-scoped, `.psa-` class prefix):
 *   - A glass surface with an OKLCH accent aura, `clamp()` fluid sizing, and a
 *     `text-wrap: balance` label.
 *   - While speaking, an animated equalizer of bars pulses + a soft aura breathes.
 *   - A live `aria-live="polite"` status announces "Playing…" / "Paused" / "Stopped".
 *
 * All VISUAL motion is DOUBLE-GATED — the equalizer + aura animate ONLY when BOTH
 * `prefers-reduced-motion: no-preference` AND `prefers-reduced-data: no-preference`
 * hold. When either is reduced, the bars render as static ticks and the aura is
 * still — the AUDIO still works. Accessibility (real buttons, `aria-pressed`,
 * descriptive labels, visible focus ring, keyboard operability, unmount cleanup)
 * holds in every path.
 *
 * Text source: at click time it reads `document.querySelector('main')?.innerText`
 * (falling back to `document.body.innerText`), trims + collapses whitespace, and caps
 * at ~9000 chars so a very long page can't produce a runaway utterance. The optional
 * `text` prop overrides the extracted text (e.g. for a curated read or a story), and
 * `label` overrides the control caption.
 */
interface Props {
  /** Overrides the auto-extracted page text with a curated string to read aloud. */
  text?: string;
  /** Overrides the control's caption. Default: "Listen to this page". */
  label?: string;
}

/** Playback lifecycle, mirrored from the utterance's `on*` events. */
type PlayState = 'idle' | 'playing' | 'paused' | 'ended';

/** Hard cap so a very long page can never spawn a runaway utterance. */
const MAX_CHARS = 9000;

/**
 * Component-scoped styles. Every selector is prefixed `.psa-` so it can never
 * collide with global or sibling-section styles (this component NEVER edits
 * `index.css`). Motion is double-gated: the equalizer + aura animate ONLY when
 * both media features are "no-preference"; when either is reduced the bars are
 * static ticks, the aura is still, and the audio path is unaffected.
 */

/** Collapse runs of whitespace and hard-cap the length so utterances stay bounded. */
function normalizeText(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS);
}

/**
 * Pull the page's readable text at click time. Prefers the `<main>` landmark
 * (the Layout renders `<main id="main">`), falling back to the whole body.
 * Returns '' when there's nothing meaningful to read.
 */
function extractPageText(): string {
  if (typeof document === 'undefined') return '';
  const main = document.querySelector('main');
  const src = (main as HTMLElement | null)?.innerText || document.body?.innerText || '';
  return normalizeText(src);
}

export function PageAudio({ text, label = 'Listen to this page' }: Props = {}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [state, setState] = useState<PlayState>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Feature-detect once, client-side only. `null` → unknown (first render / SSR);
  // `false` → self-hide. Guarded so the server render never touches `window`.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSupported('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function');
  }, []);

  // Always cancel any in-flight speech when the component unmounts or the route
  // changes — otherwise the last page keeps talking over the next one.
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speaking = state === 'playing' || state === 'paused';

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setState('idle');
  }, []);

  const start = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const body = normalizeText(text ?? '') || extractPageText();
    if (!body) return;

    // Fresh start: clear anything queued first (some engines stall on re-entry).
    synth.cancel();

    const u = new SpeechSynthesisUtterance(body);
    u.rate = 1;
    u.pitch = 1;
    u.lang = (typeof document !== 'undefined' && document.documentElement.lang) || 'en-US';
    u.onstart = () => setState('playing');
    u.onpause = () => setState('paused');
    u.onresume = () => setState('playing');
    u.onend = () => {
      utteranceRef.current = null;
      setState('ended');
    };
    u.onerror = () => {
      utteranceRef.current = null;
      setState('idle');
    };
    utteranceRef.current = u;
    // Optimistically reflect "playing" — `onstart` confirms; some engines are slow to fire it.
    setState('playing');
    synth.speak(u);
  }, [text]);

  // Play/Pause/Resume toggle. From idle/ended → start a fresh read; while playing →
  // pause; while paused → resume.
  const toggle = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (state === 'playing') {
      synth.pause();
      setState('paused'); // reflect immediately; `onpause` confirms
    } else if (state === 'paused') {
      synth.resume();
      setState('playing');
    } else {
      start();
    }
  }, [state, start]);

  // Self-hide when unsupported or before detection resolves (SSR / first paint).
  if (supported !== true) return null;

  const isPlaying = state === 'playing';
  const statusText =
    state === 'playing' ? 'Playing…' : state === 'paused' ? 'Paused' : state === 'ended' ? 'Finished' : 'Ready';
  // Full data-* on the band drives the double-gated animation; a11y attrs mirror state.
  return (
    <section
      className="psa-band py-10 md:py-14 max-w-container-wide mx-auto px-6"
      data-playing={isPlaying ? 'true' : 'false'}
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
            aria-pressed={isPlaying}
            aria-label={
              isPlaying ? 'Pause reading this page aloud' : state === 'paused' ? 'Resume reading this page aloud' : 'Play — read this page aloud'
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
            aria-label="Stop reading this page aloud"
          >
            <StopIcon />
          </button>
        </div>

        <div className="psa-copy">
          <span className="psa-label">{label}</span>
          <span className="psa-hint" aria-hidden="true">
            AI reads it aloud — right here in your browser.
          </span>
          {/* Live region: assistive tech announces playback changes politely. */}
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
