import { motion } from 'framer-motion';
import { getBudgetBarColor } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  colorMode?: 'budget' | 'goal' | 'custom';
  color?: string;
  height?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  className,
  colorMode = 'budget',
  color,
  height = 'h-2',
  animated = true,
}: ProgressBarProps) {
  const barColor =
    colorMode === 'budget'
      ? getBudgetBarColor(value)
      : colorMode === 'goal'
      ? 'bg-purple-500'
      : color ?? 'bg-purple-500';

  return (
    <div className={cn(`w-full ${height} bg-white/10 rounded-full overflow-hidden`, className)}>
      <motion.div
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn('h-full rounded-full', barColor)}
      />
    </div>
  );
}
