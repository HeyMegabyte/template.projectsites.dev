import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: string;
}

export function AnimatedSection({
  children,
  className,
  animation = 'animate-fadeInUp',
  delay,
}: Props) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        'animate-on-scroll transition-all duration-700',
        isInView && `in-view ${animation}`,
        className
      )}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {children}
    </div>
  );
}
