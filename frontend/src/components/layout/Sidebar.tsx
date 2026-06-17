import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Receipt, PiggyBank, Target, Users,
  BarChart3, Bell, Settings, LogOut, Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/budget', icon: PiggyBank, label: 'Budget' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/debts', icon: Users, label: 'Debts' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 glass border-r border-white/5 min-h-screen p-4 fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
        <div className="w-9 h-9 gradient-purple rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-none">Pocket</h1>
          <h1 className="gradient-text font-bold text-sm leading-none">Guardian</h1>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive ? 'text-purple-400' : ''} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user ? getInitials(user.name) : 'PG'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Log out
        </motion.button>
      </div>
    </aside>
  );
}
