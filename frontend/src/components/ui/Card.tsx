import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, onClick, hover = false, glow = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'glass-card p-5 transition-all duration-300',
        hover && 'cursor-pointer hover:border-white/20',
        glow && 'glow-purple',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
