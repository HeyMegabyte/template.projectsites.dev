import { useState, type ChangeEvent, type FocusEvent } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send, Check, AlertCircle, X } from 'lucide-react';
import { z } from 'zod';

/**
 * Contact form using React 19's `useActionState` + `useFormStatus` (ideas #51-58),
 * upgraded to a **cinematic, live-validating** surface.
 *
 *   - useActionState consolidates pending / error / success state in one hook
 *   - useFormStatus inside the submit button gets `pending` without prop drilling
 *   - <form action={async fn}> auto-resets on success
 *   - Zod validates input before POST (BE parity — same shape as the server guard)
 *   - LIVE per-field validity: as the visitor types/blurs, each field shows an
 *     inline green check (valid) / red × (invalid) + `aria-invalid`, so the error
 *     is reachable WITHOUT waiting for a submit (WCAG 3.3.1). Submit is gated on
 *     overall validity, but the affordance is live, never submit-only.
 *
 * Cinematic layer (fully component-scoped, `.pst-` class prefix so it never
 * collides): the card translates + fades in via `@starting-style`, wears a glass
 * hairline that warms to an OKLCH accent glow, and inputs get an accent
 * focus-glow ring on `:focus-visible`. Every transition is DOUBLE-gated behind
 * `prefers-reduced-motion: no-preference` AND `prefers-reduced-data: no-preference`
 * — reduced-motion / Save-Data users get the fully-legible static base state.
 * Colors are theme tokens + `--color-accent` only (light + dark safe).
 *
 * The submission contract is UNCHANGED: the native `<form>` + its field `name`
 * attributes + the `__slug` / `__endpoint` hidden inputs are exactly as before,
 * so the edge-injected app.js form-hijack that POSTs to `/api/contact-form/{slug}`
 * still works. The live affordances only wrap the existing fields.
 *
 * Drop into any `Contact.tsx`-style page. Posts to `/api/contact/{slug}` by
 * default; override via the `endpoint` prop.
 */

const ContactSchema = z.object({
  name:    z.string().trim().min(2, 'Name must be at least 2 characters'),
  email:   z.string().trim().email('Please enter a valid email'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

type FieldName = keyof z.infer<typeof ContactSchema>;

/* ── Pure validity helpers (BE-parity thresholds mirror ContactSchema). ──────
   Each returns `true` when the trimmed value satisfies the field rule. Kept
   pure (same input → same output, no side-effects) so they're trivially
   unit-testable and reusable. */

/** True when `v` trimmed is at least `min` characters. */
export function isMinLength(v: string, min: number): boolean {
  return v.trim().length >= min;
}

/** True when `v` is a plausible email (trimmed, RFC-ish, no whitespace). */
export function isValidEmail(v: string): boolean {
  const t = v.trim();
  // Pragmatic single-@ check: local + domain + TLD, no spaces. Matches Zod's
  // `.email()` intent for the live affordance; the server re-validates on POST.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

/** Live validity for a single field, mirroring the Zod thresholds above. */
export function isFieldValid(name: FieldName, value: string): boolean {
  switch (name) {
    case 'name':
      return isMinLength(value, 2);
    case 'email':
      return isValidEmail(value);
    case 'subject':
      return isMinLength(value, 3);
    case 'message':
      return isMinLength(value, 10);
    default:
      return false;
  }
}

/** The inline hint shown while a touched field is still invalid. */
const HINTS: Record<FieldName, string> = {
  name:    'Name must be at least 2 characters',
  email:   'Please enter a valid email',
  subject: 'Subject must be at least 3 characters',
  message: 'Message must be at least 10 characters',
};

type ContactState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; fieldErrors?: Partial<Record<FieldName, string>>; message: string };

interface Props {
  endpoint?: string;
  slug?: string;
}

async function submit(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const endpoint =
    (formData.get('__endpoint') as string) ?? `/api/contact/${formData.get('__slug') ?? 'default'}`;

  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { status: 'error', fieldErrors, message: 'Please fix the highlighted fields.' };
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Server error' }));
      return { status: 'error', message: data.error ?? 'Could not send. Please try again.' };
    }
    return { status: 'success', message: "Thanks. We'll reply within 24 hours." };
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Network error. Please retry.',
    };
  }
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="pst-cf-submit inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-accent text-[color:var(--color-on-accent)] font-bold min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
          </svg>
          Sending…
        </>
      ) : (
        <>
          <Send size={16} aria-hidden="true" />
          Send message
        </>
      )}
    </button>
  );
}

export function ContactForm({ endpoint, slug = 'default' }: Props) {
  const [state, formAction] = useActionState<ContactState, FormData>(submit, { status: 'idle' });

  // Live-validation state: the current value + whether the visitor has interacted.
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const onFieldChange = (name: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));
  const onFieldBlur = (name: FieldName) => (_e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setTouched((t) => ({ ...t, [name]: true }));

  const allValid = (Object.keys(values) as FieldName[]).every((n) => isFieldValid(n, values[n]));

  return (
    <form
      action={formAction}
      className="pst-cf glass rounded-2xl p-8 space-y-6"
      noValidate
      aria-busy={state.status === 'idle' ? undefined : false}
    >
      {/* Contract-critical hidden inputs — DO NOT rename/remove: app.js reads these. */}
      <input type="hidden" name="__slug" value={slug} />
      {endpoint && <input type="hidden" name="__endpoint" value={endpoint} />}

      <div className="grid sm:grid-cols-2 gap-6">
        <Field
          label="Name" name="name" type="text" autoComplete="name" required
          state={state} value={values.name} touched={touched.name}
          onChange={onFieldChange('name')} onBlur={onFieldBlur('name')}
        />
        <Field
          label="Email" name="email" type="email" autoComplete="email" inputMode="email" required
          state={state} value={values.email} touched={touched.email}
          onChange={onFieldChange('email')} onBlur={onFieldBlur('email')}
        />
      </div>
      <Field
        label="Subject" name="subject" type="text" autoComplete="off" required
        state={state} value={values.subject} touched={touched.subject}
        onChange={onFieldChange('subject')} onBlur={onFieldBlur('subject')}
      />
      <Field
        label="Message" name="message" type="textarea" rows={5} required
        state={state} value={values.message} touched={touched.message}
        onChange={onFieldChange('message')} onBlur={onFieldBlur('message')}
      />

      <SubmitButton disabled={!allValid} />

      {state.status === 'success' && (
        <p role="status" className="flex items-center gap-2 text-sm text-success">
          <Check size={16} aria-hidden="true" /> {state.message}
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle size={16} aria-hidden="true" /> {state.message}
        </p>
      )}

      <style>{`
        /* ── Cinematic entrance — the card fades + rises in on first paint.
           Base state (below / reduced-motion / Save-Data) is fully visible, so
           SSR / no-JS / reduced-motion renders never hide the form. Only plays
           where allow-discrete + motion + data are all available. ─────────── */
        @supports (transition-behavior: allow-discrete) {
          @media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
            .pst-cf {
              transition:
                opacity var(--duration-slow, 450ms) var(--ease),
                transform var(--duration-slow, 450ms) var(--ease),
                border-color var(--duration-base, 250ms) var(--ease),
                box-shadow var(--duration-base, 250ms) var(--ease);
            }
            @starting-style {
              .pst-cf {
                opacity: 0;
                transform: translateY(16px) scale(0.985);
              }
            }
          }
        }

        /* Glass hairline warms to a soft OKLCH accent glow when a field inside is
           focused — the whole card subtly "lights up" as the visitor engages. */
        @media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
          .pst-cf:focus-within {
            border-color: color-mix(in oklch, var(--color-accent) 45%, var(--color-border));
            box-shadow:
              0 22px 60px -30px color-mix(in oklch, var(--color-accent) 45%, transparent),
              0 0 0 1px color-mix(in oklch, var(--color-accent) 22%, transparent);
          }
        }

        /* Fluid label sizing + balanced wrap. */
        .pst-cf-label {
          font-size: clamp(0.8125rem, 0.72rem + 0.35vw, 0.9375rem);
          text-wrap: balance;
        }

        /* Input focus-glow ring — accent OKLCH halo on keyboard/click focus.
           Layered as a box-shadow (not the global 3px outline) for a soft, on-
           brand glow. Motion-gated for the transition; the glow itself still
           appears instantly for reduced-motion users (accessibility affordance
           must not depend on motion). */
        .pst-cf-input {
          transition:
            border-color var(--duration-fast, 150ms) var(--ease),
            box-shadow var(--duration-fast, 150ms) var(--ease),
            background-color var(--duration-fast, 150ms) var(--ease);
        }
        @media (prefers-reduced-motion: reduce) {
          .pst-cf-input { transition: none; }
        }
        .pst-cf-input:focus-visible {
          outline: none;
          border-color: color-mix(in oklch, var(--color-accent) 60%, var(--color-border));
          box-shadow:
            0 0 0 3px color-mix(in oklch, var(--color-accent) 30%, transparent),
            0 0 18px -4px color-mix(in oklch, var(--color-accent) 45%, transparent);
        }
        /* Valid / invalid tint the ring green / red so the state reads at a glance. */
        .pst-cf-input[data-valid='true']:focus-visible {
          border-color: color-mix(in oklch, var(--color-success) 55%, var(--color-border));
          box-shadow:
            0 0 0 3px color-mix(in oklch, var(--color-success) 26%, transparent),
            0 0 16px -4px color-mix(in oklch, var(--color-success) 38%, transparent);
        }
        .pst-cf-input[data-valid='false'] {
          border-color: color-mix(in oklch, var(--color-danger) 55%, var(--color-border));
        }
        .pst-cf-input[data-valid='false']:focus-visible {
          box-shadow:
            0 0 0 3px color-mix(in oklch, var(--color-danger) 26%, transparent),
            0 0 16px -4px color-mix(in oklch, var(--color-danger) 40%, transparent);
        }

        /* The live validity icon pops in with a springy overshoot when a field
           first becomes valid/invalid. Static swap under reduced-motion / Save-Data. */
        @media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
          .pst-cf-mark {
            animation: pst-cf-mark-in 260ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          @keyframes pst-cf-mark-in {
            from { opacity: 0; transform: scale(0.6); }
            to   { opacity: 1; transform: scale(1); }
          }
        }

        /* Submit button — accent lift + glow on hover/focus, springy press dip. */
        @media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
          .pst-cf-submit {
            transition:
              transform var(--duration-base, 250ms) var(--ease),
              box-shadow var(--duration-base, 250ms) var(--ease),
              background-color var(--duration-base, 250ms) var(--ease);
          }
          .pst-cf-submit:not(:disabled):hover,
          .pst-cf-submit:not(:disabled):focus-visible {
            transform: translateY(-2px);
            box-shadow: 0 16px 34px -12px color-mix(in oklch, var(--color-accent) 60%, transparent);
          }
          .pst-cf-submit:not(:disabled):active {
            transform: translateY(0) scale(0.98);
            transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        }
        /* Save-Data: no card entrance, focus glow, or button lift — pure static. */
        @media (prefers-reduced-data: reduce) {
          .pst-cf,
          .pst-cf-submit { transition: none !important; }
          .pst-cf-mark { animation: none !important; }
        }
      `}</style>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: FieldName;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  rows?: number;
  required?: boolean;
  state: ContactState;
  value: string;
  touched: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function Field({
  label, name, type = 'text', autoComplete, inputMode, rows, required,
  state, value, touched, onChange, onBlur,
}: FieldProps) {
  const id = `cf-${name}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  // Server-side error from the last submit (persists until the field is edited).
  const serverError = state.status === 'error' ? state.fieldErrors?.[name] : undefined;

  // Live validity — only "graded" once the visitor has typed something OR blurred.
  const hasInput = value.length > 0;
  const graded = touched || hasInput;
  const valid = isFieldValid(name, value);
  const showValid = graded && valid;
  const showInvalid = graded && !valid;
  const liveHint = showInvalid ? HINTS[name] : undefined;

  // `aria-invalid` reflects the current live/last-submit state.
  const ariaInvalid = showInvalid || Boolean(serverError);
  // Point `aria-describedby` at whichever message is currently rendered.
  const describedBy =
    [liveHint ? hintId : null, serverError ? errorId : null].filter(Boolean).join(' ') || undefined;

  const baseClass =
    'pst-cf-input w-full bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-subtle min-h-[48px]';
  // A little right padding so the ✓ / × mark never overlaps the caret/text.
  const withMarkPad = graded ? ' pr-11' : '';
  const dataValid = graded ? String(valid) : undefined;

  const commonProps = {
    id,
    name,
    value,
    onChange,
    onBlur,
    required,
    'aria-invalid': ariaInvalid ? ('true' as const) : undefined,
    'aria-describedby': describedBy,
    'data-valid': dataValid,
  };

  return (
    <div>
      <label htmlFor={id} className="pst-cf-label flex items-center gap-1 text-text/80 font-medium mb-2">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            *
          </span>
        )}
        {required && <span className="sr-only">required</span>}
      </label>

      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            {...commonProps}
            rows={rows ?? 4}
            className={`${baseClass}${withMarkPad} resize-none`}
          />
        ) : (
          <input
            {...commonProps}
            type={type}
            autoComplete={autoComplete}
            inputMode={inputMode}
            className={`${baseClass}${withMarkPad}`}
          />
        )}

        {/* Live validity mark — green ✓ / red ×. `aria-hidden` because the text
            hint below (role=alert) already announces the state to AT. Positioned
            top for textarea (so it hugs the first line), centered for inputs. */}
        {showValid && (
          <span
            aria-hidden="true"
            className={`pst-cf-mark absolute right-3.5 text-success ${type === 'textarea' ? 'top-3.5' : 'top-1/2 -translate-y-1/2'}`}
          >
            <Check size={18} strokeWidth={2.5} />
          </span>
        )}
        {showInvalid && (
          <span
            aria-hidden="true"
            className={`pst-cf-mark absolute right-3.5 text-danger ${type === 'textarea' ? 'top-3.5' : 'top-1/2 -translate-y-1/2'}`}
          >
            <X size={18} strokeWidth={2.5} />
          </span>
        )}
      </div>

      {/* Live hint (while touched + invalid) — reachable without a submit. */}
      {liveHint && (
        <p id={hintId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle size={13} aria-hidden="true" /> {liveHint}
        </p>
      )}
      {/* Server error from the last submit attempt. */}
      {serverError && !liveHint && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {serverError}
        </p>
      )}
    </div>
  );
}

export default ContactForm;
