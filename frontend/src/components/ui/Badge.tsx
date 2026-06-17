import { cn } from '../../lib/utils';

type BadgeVariant = 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  purple: 'badge-gold',
  blue:   'badge-blue',
  green:  'badge-green',
  orange: 'badge-gold',
  red:    'badge-red',
  gray:   'badge-gray',
};

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
