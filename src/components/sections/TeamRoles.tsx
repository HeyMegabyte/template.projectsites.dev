import { Users, Sparkles, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A single team ROLE (not a named individual). Role-based by design so a generated
 * site can present a credible "meet the people behind us" section WITHOUT fabricating
 * named staff — the one thing we never invent.
 */
export interface TeamRole {
  title: string;
  description: string;
}

interface Props {
  roles: TeamRole[];
  eyebrow?: string;
  headline?: string;
  intro?: string;
  className?: string;
}

/** Position-based accent icons — generic enough to fit any vertical's 3 roles. */
const ROLE_ICONS = [Users, Sparkles, HeartHandshake] as const;

/**
 * TeamRoles — a role-based "meet the team / providers" credibility section. Renders
 * accent-iconed glass cards for each role (title + description), a motion-gated accent
 * glow, and reveal-on-view. Emits NO Person JSON-LD (these are roles, not people, so we
 * never claim named individuals). Self-hides when no real roles are supplied.
 */
export function TeamRoles({
  roles,
  eyebrow = 'Our team',
  headline = 'The people behind the work',
  intro,
  className,
}: Props) {
  const shown = roles.filter((r) => r.title && r.description && !r.title.startsWith('{'));
  if (shown.length === 0) return null;
  return (
    <section
      className={cn('relative py-24 md:py-32 border-t border-border overflow-hidden', className)}
      aria-labelledby="team-roles-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 0%, color-mix(in oklch, var(--color-accent) 12%, transparent), transparent 70%)',
        }}
      />
      <div className="max-w-container-wide mx-auto px-6">
        <div className="text-center mb-14 reveal-on-view">
          <span className="text-accent text-sm font-mono tracking-widest uppercase">{eyebrow}</span>
          <h2
            id="team-roles-heading"
            className="mt-4 text-3xl md:text-5xl font-bold font-heading tracking-[-0.02em] text-text text-balance"
          >
            {headline}
          </h2>
          {intro && (
            <p className="mt-4 text-text-muted max-w-2xl mx-auto text-lg text-pretty">{intro}</p>
          )}
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shown.map((r, i) => {
            const Icon = ROLE_ICONS[i % ROLE_ICONS.length];
            return (
              <li
                key={i}
                className="card-tactile p-8 reveal-on-view group transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={26} strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="font-heading text-xl font-bold text-text">{r.title}</h3>
                <p className="mt-3 leading-relaxed text-text-muted">{r.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TeamRoles;
