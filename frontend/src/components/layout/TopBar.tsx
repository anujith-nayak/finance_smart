import { Link, useNavigate } from 'react-router-dom';
import { Bell, Plus, Shield, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../ui/Modal';
import { AddExpenseForm } from '../AddExpenseForm';
import { getInitials } from '../../lib/utils';

const mobileNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/budget', label: 'Budget' },
  { to: '/goals', label: 'Goals' },
  { to: '/debts', label: 'Debts' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

export function TopBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-white/5 px-4 py-3 flex items-center justify-between lg:hidden">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-purple rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">
            Pocket<span className="gradient-text">Guardian</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Quick Add */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddExpense(true)}
            className="w-9 h-9 gradient-purple rounded-xl flex items-center justify-center"
          >
            <Plus size={20} className="text-white" />
          </motion.button>

          {/* Notifications */}
          <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 transition-all">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
          </Link>

          {/* Avatar / Menu */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 gradient-purple rounded-full flex items-center justify-center text-white text-xs font-bold"
          >
            {user ? getInitials(user.name) : '?'}
          </button>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-64 glass border-l border-white/10 p-5 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-white font-semibold">Menu</p>
                <button onClick={() => setShowMenu(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setShowMenu(false)}
                    className="px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-2 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm"
              >
                <LogOut size={16} /> Log out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick Add Modal */}
      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Expense" size="md">
        <AddExpenseForm onSuccess={() => setShowAddExpense(false)} />
      </Modal>
    </>
  );
}
