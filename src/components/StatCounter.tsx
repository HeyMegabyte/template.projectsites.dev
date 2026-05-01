import { AnimatedNumber } from './AnimatedNumber';

interface Props {
  value: number;
  suffix?: string;
  label: string;
  description?: string;
  className?: string;
}

/**
 * Composes an `AnimatedNumber` with a label and optional supporting line.
 * Designed for hero/about stat strips ("500+ projects", "12 years", etc.).
 */
export function StatCounter({ value, suffix = '+', label, description, className }: Props) {
  return (
    <div className={`flex flex-col ${className ?? ''}`.trim()}>
      <span className="text-5xl font-bold tracking-tight gradient-text">
        <AnimatedNumber value={value} suffix={suffix} />
      </span>
      <span className="mt-2 text-sm uppercase tracking-widest text-white/70">{label}</span>
      {description ? (
        <span className="mt-1 text-sm text-white/60 leading-relaxed">{description}</span>
      ) : null}
    </div>
  );
}

export default StatCounter;
