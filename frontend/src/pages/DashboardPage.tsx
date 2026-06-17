import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingDown, TrendingUp, Target, Plus,
  Zap, ArrowRight, PiggyBank, Receipt,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AddExpenseForm } from '../components/AddExpenseForm';
import { useAuthStore } from '../store/authStore';
import { useExpenseStore } from '../store/expenseStore';
import { useBudgetStore } from '../store/budgetStore';
import { useGoalsStore } from '../store/goalsStore';
import { useDebtStore } from '../store/debtStore';
import { formatCurrency, getPercentage, getBudgetColor } from '../lib/utils';
import { getGreeting } from '../data/messages';
import { getCategoryInfo } from '../data/categories';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip,
} from 'recharts';
import { format, subDays } from 'date-fns';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { user } = useAuthStore();
  const { expenses, fetchExpenses } = useExpenseStore();
  const { budget, fetchBudget, fetchCategoryBudgets } = useBudgetStore();
  const { goals, fetchGoals } = useGoalsStore();
  const { debts, fetchDebts, getTotalLent, getTotalBorrowed } = useDebtStore();
  const [showAddExpense, setShowAddExpense] = useState(false);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    fetchExpenses(month, year);
    fetchBudget(month, year);
    fetchCategoryBudgets(month, year);
    fetchGoals();
    fetchDebts();
  }, []);

  const monthlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const totalSpent = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budget?.total_budget ?? 0;
  const remaining = Math.max(totalBudget - totalSpent, 0);
  const budgetPct = getPercentage(totalSpent, totalBudget);
  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0);
  const impulseCount = monthlyExpenses.filter((e) => e.is_impulse).length;

  // 7-day spending chart
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(now, 6 - i);
    const dayStr = format(date, 'yyyy-MM-dd');
    const spent = expenses
      .filter((e) => e.date.startsWith(dayStr))
      .reduce((s, e) => s + e.amount, 0);
    return { day: format(date, 'EEE'), amount: spent };
  });

  const recentExpenses = [...expenses].slice(0, 5);

  const greeting = user ? getGreeting(user.name) : 'Hello!';

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Greeting */}
        <motion.div variants={item} className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{greeting}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {format(now, "MMMM d, yyyy")} · Here's your financial snapshot
            </p>
          </div>
          <Button
            icon={<Plus size={18} />}
            onClick={() => setShowAddExpense(true)}
            className="hidden sm:inline-flex"
          >
            Add Expense
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Spent"
            value={formatCurrency(totalSpent)}
            sub={`of ${formatCurrency(totalBudget)} budget`}
            icon={<TrendingDown size={20} />}
            iconBg="bg-red-500/20"
            iconColor="text-red-400"
          />
          <StatCard
            label="Remaining"
            value={formatCurrency(remaining)}
            sub={`${100 - budgetPct}% left`}
            icon={<PiggyBank size={20} />}
            iconBg="bg-emerald-500/20"
            iconColor="text-emerald-400"
          />
          <StatCard
            label="Total Saved"
            value={formatCurrency(totalSaved)}
            sub={`${goals.length} active goals`}
            icon={<Target size={20} />}
            iconBg="bg-purple-500/20"
            iconColor="text-purple-400"
          />
          <StatCard
            label="Impulse Buys"
            value={String(impulseCount)}
            sub="this month"
            icon={<Zap size={20} />}
            iconBg="bg-orange-500/20"
            iconColor="text-orange-400"
          />
        </motion.div>

        {/* Budget + Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Budget */}
          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Monthly Budget</h3>
                <Link to="/budget" className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                  Manage <ArrowRight size={12} />
                </Link>
              </div>
              {totalBudget > 0 ? (
                <>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatCurrency(totalSpent)}</p>
                      <p className="text-gray-400 text-sm">spent of {formatCurrency(totalBudget)}</p>
                    </div>
                    <span className={`text-2xl font-bold ${getBudgetColor(budgetPct)}`}>{budgetPct}%</span>
                  </div>
                  <ProgressBar value={budgetPct} height="h-3" />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>₹0</span>
                    <span className="text-emerald-400">{formatCurrency(remaining)} left</span>
                    <span>{formatCurrency(totalBudget)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-3">No budget set for this month</p>
                  <Link to="/budget">
                    <Button variant="secondary" size="sm">Set Budget</Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Spending Trend */}
          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">7-Day Spending</h3>
                <Link to="/analytics" className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                  Full report <ArrowRight size={12} />
                </Link>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                      formatter={(v: unknown) => [formatCurrency(Number(v)), 'Spent']}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fill="url(#spendGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Goals + Debts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Goals preview */}
          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Savings Goals</h3>
                <Link to="/goals" className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                  All goals <ArrowRight size={12} />
                </Link>
              </div>
              {goals.length > 0 ? (
                <div className="space-y-3">
                  {goals.slice(0, 3).map((g) => {
                    const pct = getPercentage(g.current_amount, g.target_amount);
                    return (
                      <div key={g.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{g.emoji ?? '🎯'}</span>
                            <span className="text-sm text-white font-medium">{g.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">{pct}%</span>
                        </div>
                        <ProgressBar value={pct} colorMode="goal" height="h-1.5" />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>{formatCurrency(g.current_amount)}</span>
                          <span>{formatCurrency(g.target_amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-3">No goals yet. Start saving!</p>
                  <Link to="/goals">
                    <Button variant="secondary" size="sm" icon={<Plus size={14} />}>Add Goal</Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Debts summary */}
          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Money Tracker</h3>
                <Link to="/debts" className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                  Details <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                  <TrendingUp className="text-emerald-400 mx-auto mb-1" size={20} />
                  <p className="text-2xl font-bold text-white">{formatCurrency(getTotalLent())}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Others owe you</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                  <TrendingDown className="text-red-400 mx-auto mb-1" size={20} />
                  <p className="text-2xl font-bold text-white">{formatCurrency(getTotalBorrowed())}</p>
                  <p className="text-xs text-gray-400 mt-0.5">You owe others</p>
                </div>
              </div>
              {debts.filter((d) => d.status !== 'settled').length === 0 && (
                <p className="text-center text-gray-500 text-xs mt-4">No pending debts 🎉</p>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Recent transactions */}
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Transactions</h3>
              <Link to="/expenses" className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {recentExpenses.length > 0 ? (
              <div className="space-y-2">
                {recentExpenses.map((expense) => {
                  const cat = getCategoryInfo(expense.category);
                  return (
                    <motion.div
                      key={expense.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/3 transition-all cursor-default"
                    >
                      <div className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center text-lg flex-shrink-0`}>
                        {cat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{expense.description}</p>
                        <p className="text-xs text-gray-400">{cat.label} · {format(new Date(expense.date), 'MMM d')}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-white">{formatCurrency(expense.amount)}</p>
                        {expense.is_impulse && (
                          <span className="text-xs text-orange-400">⚡ Impulse</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="text-gray-600 mx-auto mb-3" size={32} />
                <p className="text-gray-400 text-sm">No expenses yet</p>
                <p className="text-gray-500 text-xs mt-1">Add your first expense above</p>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Add Expense Modal */}
      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Expense">
        <AddExpenseForm onSuccess={() => setShowAddExpense(false)} />
      </Modal>

      {/* FAB for mobile */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-20 right-4 lg:hidden w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/40 glow-purple z-30"
      >
        <Plus size={26} className="text-white" />
      </motion.button>
    </>
  );
}

function StatCard({
  label, value, sub, icon, iconBg, iconColor,
}: {
  label: string; value: string; sub: string;
  icon: React.ReactNode; iconBg: string; iconColor: string;
}) {
  return (
    <Card>
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-xl font-bold text-white leading-tight">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </Card>
  );
}
