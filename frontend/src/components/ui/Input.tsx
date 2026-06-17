import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50',
              'transition-all duration-200',
              icon && 'pl-10',
              suffix && 'pr-10',
              error && 'border-red-500/50 focus:ring-red-500/30',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
