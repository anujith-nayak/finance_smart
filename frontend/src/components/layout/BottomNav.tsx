import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, BarChart3, Users } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/expenses',  icon: Receipt,         label: 'Expenses' },
  { to: '/goals',     icon: Target,          label: 'Goals' },
  { to: '/debts',     icon: Users,           label: 'Debts' },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
      bg-slate-950/95 backdrop-blur-xl border-t border-white/8">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150 min-w-[52px] ${
                isActive ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={21} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
