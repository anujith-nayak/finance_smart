import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, Legend,
  BarChart, Bar, XAxis, YAxis,
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { useExpenseStore } from '../store/expenseStore';
import { useBudgetStore } from '../store/budgetStore';
import { CATEGORIES } from '../data/categories';
import { formatCurrency, getPercentage } from '../lib/utils';
import { ProgressBar } from '../components/ui/ProgressBar';

const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#8b5cf6', '#14b8a6', '#6b7280'];

const MONTH_OPTIONS = Array.from({ length: 6 }, (_, i) => {
  const d = subMonths(new Date(), i);
  return {
    value: `${d.getMonth() + 1}-${d.getFullYear()}`,
    label: format(d, 'MMMM yyyy'),
  };
});

export function AnalyticsPage() {
  const { expenses, fetchExpenses } = useExpenseStore();
  const { budget, fetchBudget } = useBudgetStore();
  const [selectedPeriod, setSelectedPeriod] = useState(MONTH_OPTIONS[0].value);

  const [selMonth, selYear] = selectedPeriod.split('-').map(Number);

  useEffect(() => {
    fetchExpenses(selMonth, selYear);
    fetchBudget(selMonth, selYear);
  }, [selectedPeriod]);

  const monthlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === selMonth && d.getFullYear() === selYear;
  });

  const totalSpent = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const needsTotal = monthlyExpenses.filter((e) => e.is_need).reduce((s, e) => s + e.amount, 0);
  const wantsTotal = monthlyExpenses.filter((e) => !e.is_need).reduce((s, e) => s + e.amount, 0);
  const impulseTotal = monthlyExpenses.filter((e) => e.is_impulse).reduce((s, e) => s + e.amount, 0);
  const impulseCount = monthlyExpenses.filter((e) => e.is_impulse).length;

  // Category breakdown
  const categoryData = CATEGORIES.map((cat) => {
    const amount = monthlyExpenses
      .filter((e) => e.category === cat.value)
      .reduce((s, e) => s + e.amount, 0);
    return { name: cat.label, value: amount, emoji: cat.emoji, color: cat.bgColor };
  }).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);

  // Daily spending bar chart
  const daysInMonth = new Date(selYear, selMonth, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayStr = `${selYear}-${String(selMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const amount = monthlyExpenses
      .filter((e) => e.date.startsWith(dayStr))
      .reduce((s, e) => s + e.amount, 0);
    return { day: String(day), amount };
  });

  // Need vs Want pie
  const needWantData = [
    { name: 'Needs', value: needsTotal, color: '#10b981' },
    { name: 'Wants', value: wantsTotal, color: '#a855f7' },
  ].filter((d) => d.value > 0);

  const tooltipStyle = {
    contentStyle: { background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 text-sm mt-0.5">Understand your spending habits</p>
        </div>
        <Select
          options={MONTH_OPTIONS}
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="w-44"
        />
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Spent', value: formatCurrency(totalSpent), sub: `of ${formatCurrency(budget?.total_budget ?? 0)} budget`, color: 'text-white' },
          { label: 'Needs', value: formatCurrency(needsTotal), sub: `${getPercentage(needsTotal, totalSpent)}% of spending`, color: 'text-emerald-400' },
          { label: 'Wants', value: formatCurrency(wantsTotal), sub: `${getPercentage(wantsTotal, totalSpent)}% of spending`, color: 'text-purple-400' },
          { label: 'Impulse', value: String(impulseCount), sub: `${formatCurrency(impulseTotal)} total`, color: 'text-orange-400' },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-medium text-gray-400 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
          </Card>
        ))}
      </div>

      {/* Daily spend chart */}
      <Card>
        <h3 className="text-white font-semibold mb-4">Daily Spending</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <RTooltip {...tooltipStyle} formatter={(v: unknown) => [formatCurrency(Number(v)), 'Spent']} />
              <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category breakdown + Need vs Want */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <Card>
          <h3 className="text-white font-semibold mb-4">Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <div className="space-y-2.5">
              {categoryData.map((cat, i) => {
                const pct = getPercentage(cat.value, totalSpent);
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cat.emoji}</span>
                        <span className="text-sm text-gray-300">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{pct}%</span>
                        <span className="text-sm text-white font-medium">{formatCurrency(cat.value)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data for this period</p>
          )}
        </Card>

        {/* Need vs Want */}
        <Card>
          <h3 className="text-white font-semibold mb-4">Needs vs Wants</h3>
          {needWantData.length > 0 ? (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={needWantData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {needWantData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RTooltip {...tooltipStyle} formatter={(v: unknown) => [formatCurrency(Number(v))]} />
                    <Legend
                      formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{formatCurrency(needsTotal)}</p>
                  <p className="text-xs text-gray-400">Needs ({getPercentage(needsTotal, totalSpent)}%)</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{formatCurrency(wantsTotal)}</p>
                  <p className="text-xs text-gray-400">Wants ({getPercentage(wantsTotal, totalSpent)}%)</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No data for this period</p>
          )}
        </Card>
      </div>

      {/* Impulse analysis */}
      <Card>
        <h3 className="text-white font-semibold mb-1">Impulse Spending Analysis</h3>
        <p className="text-gray-400 text-sm mb-4">
          {impulseCount > 0
            ? `${impulseCount} impulse purchase${impulseCount > 1 ? 's' : ''} this month worth ${formatCurrency(impulseTotal)}`
            : 'No impulse purchases this month! Great discipline.'}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
            <p className="text-2xl font-bold text-white">{impulseCount}</p>
            <p className="text-xs text-gray-400">Impulse Purchases</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
            <p className="text-2xl font-bold text-white">{formatCurrency(impulseTotal)}</p>
            <p className="text-xs text-gray-400">Impulse Spend</p>
          </div>
        </div>
        {totalSpent > 0 && (
          <div className="mt-4">
            <div className="flex justify-between mb-1.5 text-sm">
              <span className="text-gray-400">Impulse %</span>
              <span className="text-orange-400 font-medium">{getPercentage(impulseTotal, totalSpent)}%</span>
            </div>
            <ProgressBar value={getPercentage(impulseTotal, totalSpent)} colorMode="custom" color="bg-orange-500" />
          </div>
        )}
      </Card>
    </div>
  );
}
