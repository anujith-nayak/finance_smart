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
          <label className="text-sm font-medium text-gray-300">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50',
            'transition-all duration-200 cursor-pointer',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
