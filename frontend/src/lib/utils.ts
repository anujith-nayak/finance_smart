import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getPercentage(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((used / total) * 100), 100);
}

export function getBudgetColor(percentage: number): string {
  if (percentage < 50) return 'text-emerald-400';
  if (percentage < 75) return 'text-yellow-400';
  if (percentage < 90) return 'text-orange-400';
  return 'text-red-400';
}

export function getBudgetBarColor(percentage: number): string {
  if (percentage < 50) return 'bg-emerald-500';
  if (percentage < 75) return 'bg-yellow-500';
  if (percentage < 90) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
