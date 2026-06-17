import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Receipt, PiggyBank, Target, Users,
  BarChart3, Bell, Settings, LogOut, TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses',      icon: Receipt,         label: 'Expenses' },
  { to: '/budget',        icon: PiggyBank,       label: 'Budget' },
  { to: '/goals',         icon: Target,          label: 'Goals' },
  { to: '/debts',         icon: Users,           label: 'Debts' },
  { to: '/analytics',     icon: BarChart3,       label: 'Analytics' },
  { to: '/notifications', icon: Bell,            label: 'Notifications' },
  { to: '/settings',      icon: Settings,        label: 'Settings' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen fixed left-0 top-0 bottom-0 z-40
      bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900
      border-r border-white/6">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/40">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight leading-none">Pocket</p>
            <p className="text-amber-400 font-bold text-sm tracking-tight leading-none">Guardian</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500/12 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/6">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user ? getInitials(user.name) : 'PG'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-0.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/8 transition-all"
        >
          <LogOut size={16} />
          Sign out
        </motion.button>
      </div>
    </aside>
  );
}
