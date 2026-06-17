import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, BarChart3, Users } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/debts', icon: Users, label: 'Debts' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
