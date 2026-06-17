import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glow?: boolean;
  accent?: 'gold' | 'green' | 'red' | 'blue' | 'none';
}

export function Card({ children, className, onClick, hover = false, glow = false, accent = 'none' }: CardProps) {
  const accentClass = {
    gold: 'border-l-2 border-l-amber-500/60',
    green: 'border-l-2 border-l-emerald-500/60',
    red: 'border-l-2 border-l-red-500/60',
    blue: 'border-l-2 border-l-blue-500/60',
    none: '',
  }[accent];

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      className={cn(
        'glass-card p-5 card-hover',
        hover && 'cursor-pointer',
        glow && 'glow-gold',
        accentClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
