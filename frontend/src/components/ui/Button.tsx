import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'gradient-purple text-white shadow-lg shadow-purple-900/30 hover:opacity-90',
  secondary: 'bg-white/10 text-white border border-white/10 hover:bg-white/15',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
