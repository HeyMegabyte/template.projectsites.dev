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
const SCOPED_CSS = `
.psa-band { --psa-accent: oklch(0.82 0.16 205); --psa-accent-2: oklch(0.72 0.19 285); }
.psa-shell {
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(0.9rem, 2.4vw, 1.75rem);
  flex-wrap: wrap;
  max-width: 44rem;
  margin: 0 auto;
  padding: clamp(1rem, 2.4vw, 1.5rem) clamp(1.1rem, 3vw, 1.9rem);
  border-radius: 22px;
  border: 1px solid oklch(1 0 0 / 0.1);
  background: linear-gradient(180deg, oklch(1 0 0 / 0.05), oklch(1 0 0 / 0.015));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 oklch(1 0 0 / 0.06) inset, 0 20px 50px -34px oklch(0 0 0 / 0.85);
  overflow: hidden;
}
/* Accent hairline lighting the top edge of the shell. */
.psa-shell::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--psa-accent), transparent);
  opacity: 0.7;
}
/* Soft accent aura behind the controls — breathes while playing (gated below). */
.psa-aura {
  content: '';
  position: absolute;
  inset: -55% -10% auto -10%;
  height: 90%;
  background: radial-gradient(50% 60% at 22% 0%, oklch(0.82 0.16 205 / 0.16), transparent 70%);
  pointer-events: none;
  opacity: 0.55;
}

.psa-controls { position: relative; display: inline-flex; align-items: center; gap: 0.6rem; }

.psa-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: clamp(2.75rem, 6vw, 3.25rem);
  width: clamp(2.75rem, 6vw, 3.25rem);
  border-radius: 9999px;
  border: 1px solid color-mix(in oklch, var(--psa-accent) 45%, transparent);
  color: var(--psa-accent);
  background: color-mix(in oklch, var(--psa-accent) 10%, transparent);
  cursor: pointer;
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease, color 0.2s ease;
}
.psa-btn:hover { background: color-mix(in oklch, var(--psa-accent) 18%, transparent); }
.psa-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--psa-bg, transparent), 0 0 0 4px color-mix(in oklch, var(--psa-accent) 70%, transparent);
}
.psa-btn[data-primary='true'] {
  height: clamp(3rem, 7vw, 3.6rem);
  width: clamp(3rem, 7vw, 3.6rem);
  color: oklch(0.14 0.02 260);
  background: linear-gradient(135deg, var(--psa-accent), var(--psa-accent-2));
  border-color: transparent;
  box-shadow: 0 10px 28px -14px color-mix(in oklch, var(--psa-accent) 60%, transparent);
}
.psa-btn[data-primary='true']:hover { filter: brightness(1.05); }
.psa-btn svg { width: 42%; height: 42%; }

.psa-copy { position: relative; display: flex; flex-direction: column; gap: 0.15rem; min-width: 10rem; flex: 1 1 12rem; }
.psa-label {
  font-family: var(--font-heading, inherit);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.15;
  font-size: clamp(1.05rem, 0.9rem + 0.9vw, 1.35rem);
  text-wrap: balance;
  color: inherit;
}
.psa-hint { font-size: 0.85rem; opacity: 0.72; text-wrap: balance; }

/* Equalizer — bars are STATIC ticks by default; they only dance under the gate. */
.psa-eq { position: relative; display: inline-flex; align-items: flex-end; gap: 0.28rem; height: clamp(1.75rem, 4.5vw, 2.4rem); }
.psa-eq span {
  display: block;
  width: 0.28rem;
  height: 38%;
  border-radius: 9999px;
  background: linear-gradient(180deg, var(--psa-accent), var(--psa-accent-2));
  opacity: 0.85;
}

/* Screen-reader-only helper (label text also visible; this backs the status region). */
.psa-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* --- Motion: enabled ONLY when BOTH media features are "no-preference". --- */
@media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
  .psa-band[data-playing='true'] .psa-aura { animation: psa-breathe 3.2s ease-in-out infinite; }
  .psa-band[data-playing='true'] .psa-eq span { animation: psa-bounce 1.05s ease-in-out infinite; }
  .psa-eq span:nth-child(1) { animation-delay: -0.9s; }
  .psa-eq span:nth-child(2) { animation-delay: -0.5s; }
  .psa-eq span:nth-child(3) { animation-delay: -0.15s; }
  .psa-eq span:nth-child(4) { animation-delay: -0.7s; }
  .psa-eq span:nth-child(5) { animation-delay: -0.35s; }
  .psa-btn:hover { transform: translateY(-2px); }
  .psa-btn[data-primary='true']:active { transform: translateY(0) scale(0.97); }
  @keyframes psa-bounce { 0%, 100% { height: 30%; } 50% { height: 100%; } }
  @keyframes psa-breathe { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.04); } }
}

/* --- Reduced motion OR reduced data: bars frozen, aura still, audio unaffected. --- */
@media (prefers-reduced-motion: reduce), (prefers-reduced-data: reduce) {
  .psa-aura { animation: none !important; }
  .psa-eq span { animation: none !important; height: 55% !important; }
  .psa-btn { transition: none !important; }
}
`;

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
      <style>{SCOPED_CSS}</style>
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
