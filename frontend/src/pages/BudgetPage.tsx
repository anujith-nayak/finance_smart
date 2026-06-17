import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useBudgetStore } from '../store/budgetStore';
import { useExpenseStore } from '../store/expenseStore';
import { CATEGORIES, CATEGORY_OPTIONS } from '../data/categories';
import { formatCurrency, getPercentage, getBudgetColor } from '../lib/utils';
import type { CategoryBudget as _CategoryBudget } from '../types';

export function BudgetPage() {
  const { budget, categoryBudgets, fetchBudget, fetchCategoryBudgets, setMonthlyBudget, setCategoryBudget, deleteCategoryBudget } = useBudgetStore();
  const { expenses } = useExpenseStore();
  const [showSetBudget, setShowSetBudget] = useState(false);
  const [showSetCategory, setShowSetCategory] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [catInput, setCatInput] = useState({ category: '', amount: '' });

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    fetchBudget(month, year);
    fetchCategoryBudgets(month, year);
  }, []);

  const monthlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const totalSpent = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budget?.total_budget ?? 0;
  const budgetPct = getPercentage(totalSpent, totalBudget);

  const getCategorySpent = (category: string) =>
    monthlyExpenses.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0);

  const handleSetBudget = async () => {
    if (!budgetInput || isNaN(Number(budgetInput))) return;
    await setMonthlyBudget(Number(budgetInput), month, year);
    setShowSetBudget(false);
    setBudgetInput('');
  };

  const handleSetCategoryBudget = async () => {
    if (!catInput.category || !catInput.amount) return;
    await setCategoryBudget(catInput.category, Number(catInput.amount), month, year);
    setShowSetCategory(false);
    setCatInput({ category: '', amount: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {new Date(year, month - 1).toLocaleString('en', { month: 'long' })} {year}
          </p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setShowSetBudget(true)}>
          {budget ? 'Update' : 'Set'} Budget
        </Button>
      </div>

      {/* Monthly overview */}
      <Card>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-white font-semibold text-lg">Monthly Overview</h3>
            <p className="text-gray-400 text-sm">
              {totalBudget > 0 ? `${formatCurrency(totalBudget)} total budget` : 'No budget set'}
            </p>
          </div>
          <div className={`text-3xl font-bold ${getBudgetColor(budgetPct)}`}>{budgetPct}%</div>
        </div>

        {totalBudget > 0 ? (
          <>
            <ProgressBar value={budgetPct} height="h-4" className="mb-3" />
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{formatCurrency(totalSpent)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Spent</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(Math.max(totalBudget - totalSpent, 0))}</p>
                <p className="text-xs text-gray-400 mt-0.5">Remaining</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-400">{formatCurrency(Math.max(totalSpent - totalBudget, 0))}</p>
                <p className="text-xs text-gray-400 mt-0.5">Overspent</p>
              </div>
            </div>

            {budgetPct >= 90 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2"
              >
                <AlertTriangle className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-red-300 text-sm">
                  {budgetPct >= 100
                    ? 'Budget exceeded! Time for damage control.'
                    : `${budgetPct}% of budget used. Tread carefully.`}
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <PiggyBank className="text-gray-600 mx-auto mb-3" size={40} />
            <p className="text-gray-400">Set a monthly budget to track spending</p>
          </div>
        )}
      </Card>

      {/* Category Budgets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Category Budgets</h2>
          <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setShowSetCategory(true)}>
            Add
          </Button>
        </div>

        {categoryBudgets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoryBudgets.map((cb) => {
              const spent = getCategorySpent(cb.category);
              const pct = getPercentage(spent, cb.amount);
              const catInfo = CATEGORIES.find((c) => c.value === cb.category);

              return (
                <motion.div key={cb.id} layout>
                  <Card className="group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{catInfo?.emoji}</span>
                        <div>
                          <p className="text-white font-medium text-sm">{catInfo?.label}</p>
                          <p className="text-gray-400 text-xs">{formatCurrency(cb.amount)} budget</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => deleteCategoryBudget(cb.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <ProgressBar value={pct} height="h-2" />
                    <div className="flex justify-between mt-2 text-xs">
                      <span className={getBudgetColor(pct)}>{formatCurrency(spent)} used</span>
                      <span className="text-gray-500">{formatCurrency(Math.max(cb.amount - spent, 0))} left</span>
                    </div>
                    {pct >= 90 && (
                      <p className="text-xs text-orange-400 mt-2 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {pct >= 100 ? 'Category budget exceeded!' : 'Almost at limit!'}
                      </p>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <p className="text-gray-400">No category budgets yet</p>
            <p className="text-gray-500 text-sm mt-1">Add limits per category to stay on track</p>
          </Card>
        )}
      </div>

      {/* Set Monthly Budget Modal */}
      <Modal isOpen={showSetBudget} onClose={() => setShowSetBudget(false)} title="Set Monthly Budget" size="sm">
        <div className="flex flex-col gap-4">
          <Input
            label="Budget Amount"
            type="number"
            placeholder="e.g. 10000"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            suffix={<span className="text-xs text-gray-500">₹</span>}
          />
          {budget && (
            <p className="text-xs text-gray-400">Current budget: {formatCurrency(budget.total_budget)}</p>
          )}
          <Button size="lg" className="w-full justify-center" onClick={handleSetBudget}>
            Save Budget
          </Button>
        </div>
      </Modal>

      {/* Set Category Budget Modal */}
      <Modal isOpen={showSetCategory} onClose={() => setShowSetCategory(false)} title="Category Budget" size="sm">
        <div className="flex flex-col gap-4">
          <Select
            label="Category"
            options={[{ value: '', label: 'Select category' }, ...CATEGORY_OPTIONS]}
            value={catInput.category}
            onChange={(e) => setCatInput((p) => ({ ...p, category: e.target.value }))}
          />
          <Input
            label="Budget Amount"
            type="number"
            placeholder="e.g. 500"
            value={catInput.amount}
            onChange={(e) => setCatInput((p) => ({ ...p, amount: e.target.value }))}
            suffix={<span className="text-xs text-gray-500">₹</span>}
          />
          <Button size="lg" className="w-full justify-center" onClick={handleSetCategoryBudget}>
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}
