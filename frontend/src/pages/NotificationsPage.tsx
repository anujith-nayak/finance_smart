import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Trophy, Info, DollarSign } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore } from '../store/expenseStore';
import { useBudgetStore } from '../store/budgetStore';
import { useDebtStore } from '../store/debtStore';
import { useGoalsStore } from '../store/goalsStore';
import { formatCurrency, getPercentage } from '../lib/utils';
import { useEffect } from 'react';

interface Notification {
  id: string;
  type: 'warning' | 'achievement' | 'reminder' | 'info';
  title: string;
  message: string;
}

export function NotificationsPage() {
  const { user } = useAuthStore();
  const { expenses, fetchExpenses } = useExpenseStore();
  const { budget, categoryBudgets, fetchBudget, fetchCategoryBudgets } = useBudgetStore();
  const { debts, fetchDebts } = useDebtStore();
  const { goals, fetchGoals } = useGoalsStore();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const name = user?.name ?? 'Friend';

  useEffect(() => {
    fetchExpenses(month, year);
    fetchBudget(month, year);
    fetchCategoryBudgets(month, year);
    fetchDebts();
    fetchGoals();
  }, []);

  const monthlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const totalSpent = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budget?.total_budget ?? 0;
  const budgetPct = getPercentage(totalSpent, totalBudget);

  const notifications: Notification[] = [];

  // Budget warnings
  if (totalBudget > 0) {
    if (budgetPct >= 100) {
      notifications.push({
        id: 'budget-exceeded',
        type: 'warning',
        title: 'Budget Exceeded',
        message: `${name}, the budget has been fully consumed. A moment of silence.`,
      });
    } else if (budgetPct >= 90) {
      notifications.push({
        id: 'budget-90',
        type: 'warning',
        title: 'Budget Alert — 90%',
        message: `${name}, you've used ${budgetPct}% of your budget. Emergency territory.`,
      });
    } else if (budgetPct >= 75) {
      notifications.push({
        id: 'budget-75',
        type: 'warning',
        title: 'Budget Warning — 75%',
        message: `${name}, 75% of the budget is gone. The remaining 25% is scared.`,
      });
    }
  }

  // Category budget warnings
  categoryBudgets.forEach((cb) => {
    const catSpent = monthlyExpenses
      .filter((e) => e.category === cb.category)
      .reduce((s, e) => s + e.amount, 0);
    const pct = getPercentage(catSpent, cb.amount);
    if (pct >= 90) {
      notifications.push({
        id: `cat-${cb.id}`,
        type: 'warning',
        title: `${cb.category} Budget ${pct >= 100 ? 'Exceeded' : 'Almost Gone'}`,
        message: `${name}, the ${cb.category} budget ${pct >= 100 ? 'has been exceeded' : 'is almost exhausted'} (${pct}% used).`,
      });
    }
  });

  // Debt reminders
  debts
    .filter((d) => d.status !== 'settled')
    .forEach((debt) => {
      if (debt.type === 'lent') {
        notifications.push({
          id: `debt-${debt.id}`,
          type: 'reminder',
          title: 'Money Owed to You',
          message: `${name}, ${debt.person_name} still owes you ${formatCurrency(debt.amount)}.`,
        });
      } else {
        notifications.push({
          id: `owe-${debt.id}`,
          type: 'reminder',
          title: 'You Owe Someone',
          message: `${name}, ${debt.person_name} would probably appreciate being paid. You owe ${formatCurrency(debt.amount)}.`,
        });
      }
    });

  // Goal progress
  goals.forEach((g) => {
    const pct = getPercentage(g.current_amount, g.target_amount);
    if (pct >= 100) {
      notifications.push({
        id: `goal-done-${g.id}`,
        type: 'achievement',
        title: `Goal Achieved: ${g.name}`,
        message: `${name}, you've reached your savings goal for ${g.name}! 🎉`,
      });
    } else if (pct >= 75) {
      notifications.push({
        id: `goal-75-${g.id}`,
        type: 'info',
        title: `Goal Progress: ${g.name}`,
        message: `${name}, you're ${pct}% of the way to your ${g.name} goal. Almost there!`,
      });
    }
  });

  // Impulse spending
  const impulseCount = monthlyExpenses.filter((e) => e.is_impulse).length;
  if (impulseCount >= 5) {
    notifications.push({
      id: 'impulse-high',
      type: 'warning',
      title: 'High Impulse Spending',
      message: `${name}, you've made ${impulseCount} impulse purchases this month. The data doesn't lie.`,
    });
  }

  const iconMap = {
    warning: <AlertTriangle size={18} className="text-orange-400" />,
    achievement: <Trophy size={18} className="text-yellow-400" />,
    reminder: <DollarSign size={18} className="text-blue-400" />,
    info: <Info size={18} className="text-purple-400" />,
  };

  const bgMap = {
    warning: 'bg-orange-500/10 border-orange-500/20',
    achievement: 'bg-yellow-500/10 border-yellow-500/20',
    reminder: 'bg-blue-500/10 border-blue-500/20',
    info: 'bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="text-gray-400 text-sm mt-0.5">{notifications.length} active alerts</p>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className={`p-4 rounded-2xl border ${bgMap[n.type]} flex items-start gap-3`}>
                <div className="mt-0.5 flex-shrink-0">{iconMap[n.type]}</div>
                <div>
                  <p className="text-white font-medium text-sm">{n.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <Bell className="text-gray-700 mx-auto mb-4" size={48} />
          <p className="text-gray-400 font-medium">All clear!</p>
          <p className="text-gray-500 text-sm mt-1">No alerts right now. You're doing great.</p>
        </Card>
      )}
    </div>
  );
}
