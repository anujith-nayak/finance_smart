import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { impulseDialogs, warningMessages, getRandomMessage } from '../data/messages';
import { Button } from './ui/Button';

interface ImpulseDialogProps {
  isOpen: boolean;
  userName: string;
  category: string;
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
  onIgnore: () => void;
}

export function ImpulseDialog({
  isOpen,
  userName,
  category,
  amount,
  onConfirm,
  onCancel,
  onIgnore,
}: ImpulseDialogProps) {
  const [dialog] = useState(() => {
    const d = impulseDialogs[Math.floor(Math.random() * impulseDialogs.length)];
    return {
      title: d.title.replace(/{name}/g, userName),
      message: d.message.replace(/{name}/g, userName),
      buttons: d.buttons,
    };
  });

  const [subtitle] = useState(() =>
    getRandomMessage(warningMessages, userName)
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="relative w-full max-w-md z-10"
          >
            {/* Dramatic glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-orange-500/30 rounded-3xl blur-xl" />

            <div className="relative glass-card p-6 border border-orange-500/20">
              {/* Icon */}
              <motion.div
                animate={{ rotate: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <AlertTriangle className="text-orange-400" size={32} />
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white text-center mb-2">
                {dialog.title}
              </h2>

              {/* Amount */}
              <div className="flex justify-center mb-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2">
                  <span className="text-orange-300 font-semibold text-lg">₹{amount}</span>
                  <span className="text-gray-400 text-sm ml-2">on {category}</span>
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-300 text-center text-sm leading-relaxed mb-2">
                {dialog.message}
              </p>
              <p className="text-gray-500 text-center text-xs italic mb-6">
                {subtitle}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="danger"
                  size="lg"
                  icon={<ShieldCheck size={18} />}
                  onClick={onCancel}
                  className="w-full justify-center bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                >
                  {dialog.buttons.cancel}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Zap size={18} />}
                  onClick={onConfirm}
                  className="w-full justify-center"
                >
                  {dialog.buttons.confirm}
                </Button>
                <button
                  onClick={onIgnore}
                  className="text-gray-500 text-sm hover:text-gray-300 transition-colors py-2"
                >
                  {dialog.buttons.ignore}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
