import { Link, useNavigate } from 'react-router-dom';
import { Bell, Plus, LogOut, X, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../ui/Modal';
import { AddExpenseForm } from '../AddExpenseForm';
import { getInitials } from '../../lib/utils';

const mobileNavItems = [
  { to: '/dashboard',     label: 'Dashboard' },
  { to: '/expenses',      label: 'Expenses' },
  { to: '/budget',        label: 'Budget' },
  { to: '/goals',         label: 'Goals' },
  { to: '/debts',         label: 'Debts' },
  { to: '/analytics',     label: 'Analytics' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/settings',      label: 'Settings' },
];

export function TopBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 lg:hidden
        bg-slate-950/90 backdrop-blur-xl border-b border-white/6
        px-4 py-3 flex items-center justify-between">

        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            Pocket<span className="text-amber-400">Guardian</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowAddExpense(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-900/30"
          >
            <Plus size={19} className="text-white" />
          </motion.button>

          <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/6 transition-all">
            <Bell size={19} className="text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
          </Link>

          <button
            onClick={() => setShowMenu(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white text-xs font-bold"
          >
            {user ? getInitials(user.name) : '?'}
          </button>
        </div>
      </header>

      {/* Slide-out menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-64 flex flex-col lg:hidden
                bg-slate-950 border-l border-white/8 p-5"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-white font-semibold text-sm">Menu</p>
                <button onClick={() => setShowMenu(false)} className="text-slate-500 hover:text-white">
                  <X size={19} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.to} to={item.to}
                    onClick={() => setShowMenu(false)}
                    className="px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/6 text-sm font-medium transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-2 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl text-sm"
              >
                <LogOut size={15} /> Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Expense">
        <AddExpenseForm onSuccess={() => setShowAddExpense(false)} />
      </Modal>
    </>
  );
}
