import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { regretMessages, getRandomMessage } from '../data/messages';

interface RegretToastProps {
  isVisible: boolean;
  userName: string;
  onClose: () => void;
}

export function RegretToast({ isVisible, userName, onClose }: RegretToastProps) {
  const [message] = useState(() => getRandomMessage(regretMessages, userName));

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="glass-card border border-red-500/20 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-red-400" size={18} />
            </div>
            <p className="text-sm text-gray-300 flex-1 leading-relaxed">{message}</p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 mt-0.5"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
