import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send, Check, AlertCircle } from 'lucide-react';
import { z } from 'zod';

/**
 * Contact form using React 19's `useActionState` + `useFormStatus` (ideas #51-58).
 *
 *   - useActionState consolidates pending / error / success state in one hook
 *   - useFormStatus inside the submit button gets `pending` without prop drilling
 *   - <form action={async fn}> auto-resets on success
 *   - Zod validates input before POST
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

type ContactState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; fieldErrors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string>>; message: string };

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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-accent text-background font-bold hover:bg-accent-hover transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-wait"
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

  return (
    <form action={formAction} className="glass rounded-2xl p-8 space-y-6" noValidate aria-busy={state.status === 'idle' ? undefined : false}>
      <input type="hidden" name="__slug" value={slug} />
      {endpoint && <input type="hidden" name="__endpoint" value={endpoint} />}

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Name" name="name" type="text" autoComplete="name" required state={state} />
        <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" required state={state} />
      </div>
      <Field label="Subject" name="subject" type="text" autoComplete="off" required state={state} />
      <Field label="Message" name="message" type="textarea" rows={5} required state={state} />

      <SubmitButton />

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
    </form>
  );
}

interface FieldProps {
  label: string;
  name: keyof z.infer<typeof ContactSchema>;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  rows?: number;
  required?: boolean;
  state: ContactState;
}

function Field({ label, name, type = 'text', autoComplete, inputMode, rows, required, state }: FieldProps) {
  const id = `cf-${name}`;
  const fieldError = state.status === 'error' ? state.fieldErrors?.[name] : undefined;
  const baseClass =
    'w-full bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-subtle focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors min-h-[44px]';
  const errorClass = fieldError ? 'border-danger/60 ring-1 ring-danger/30' : '';
  const className = `${baseClass} ${errorClass}`.trim();

  return (
    <div>
      <label htmlFor={id} className="block text-text/80 text-sm font-medium mb-2">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger ml-1">
            *
          </span>
        )}
        {required && <span className="sr-only">required</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows ?? 4}
          required={required}
          aria-invalid={fieldError ? 'true' : undefined}
          aria-describedby={fieldError ? `${id}-error` : undefined}
          className={`${className} resize-none`}
          placeholder={fieldError ? '' : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          aria-invalid={fieldError ? 'true' : undefined}
          aria-describedby={fieldError ? `${id}-error` : undefined}
          className={className}
        />
      )}
      {fieldError && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {fieldError}
        </p>
      )}
    </div>
  );
}

export default ContactForm;
