import { useState, type FormEvent } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';

interface Props {
  endpoint?: string;
  headline?: string;
  description?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Newsletter({
  endpoint = '/api/newsletter',
  headline = 'Stay in the loop',
  description = 'Monthly insights. No spam. Unsubscribe anytime.',
}: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Subscription failed');
      setStatus('success');
      setMessage('Subscribed. Check your inbox to confirm.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <section className="glass rounded-2xl p-8 md:p-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="md:max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text mb-2">
            {headline}
          </h2>
          <p className="text-text-muted text-sm md:text-base">{description}</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 md:flex-1 md:max-w-md" noValidate>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="relative flex-1">
            <Mail
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"
            />
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={status === 'submitting'}
              aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface border border-border text-text placeholder:text-text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:border-transparent transition-colors min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'submitting' || !email}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[#0a0a1a] font-bold px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 min-h-[44px]"
          >
            {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      </div>
      {status === 'success' && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-accent)]" role="status">
          <Check size={16} aria-hidden="true" /> {message}
        </p>
      )}
      {status === 'error' && (
        <p id="newsletter-error" className="mt-4 flex items-center gap-2 text-sm text-red-400" role="alert">
          <AlertCircle size={16} aria-hidden="true" /> {message}
        </p>
      )}
    </section>
  );
}
