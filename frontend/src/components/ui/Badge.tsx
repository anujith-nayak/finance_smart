import { cn } from '../../lib/utils';

type BadgeVariant = 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/20',
  blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/20',
  green: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20',
  orange: 'bg-orange-500/20 text-orange-300 border border-orange-500/20',
  red: 'bg-red-500/20 text-red-300 border border-red-500/20',
  gray: 'bg-white/10 text-gray-300 border border-white/10',
};

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
