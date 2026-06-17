import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  colorMode?: 'budget' | 'goal' | 'custom';
  color?: string;
  height?: string;
  animated?: boolean;
}

function getBudgetColor(pct: number) {
  if (pct < 50) return 'bg-gradient-to-r from-emerald-600 to-emerald-400';
  if (pct < 75) return 'bg-gradient-to-r from-amber-600 to-amber-400';
  if (pct < 90) return 'bg-gradient-to-r from-orange-600 to-orange-400';
  return 'bg-gradient-to-r from-red-600 to-red-400';
}

export function ProgressBar({ value, className, colorMode = 'budget', color, height = 'h-2', animated = true }: ProgressBarProps) {
  const barColor =
    colorMode === 'budget' ? getBudgetColor(value) :
    colorMode === 'goal'   ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
    color ?? 'bg-amber-500';

  return (
    <div className={cn(`w-full ${height} bg-white/8 rounded-full overflow-hidden`, className)}>
      <motion.div
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className={cn('h-full rounded-full', barColor)}
      />
    </div>
  );
}
