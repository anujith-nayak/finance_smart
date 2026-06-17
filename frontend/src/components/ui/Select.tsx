import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm',
            'focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40',
            'transition-all duration-200 cursor-pointer',
            error && 'border-red-500/40',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
