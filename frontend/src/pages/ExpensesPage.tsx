import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Pencil, Search, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { AddExpenseForm } from '../components/AddExpenseForm';
import { useExpenseStore } from '../store/expenseStore';
import { getCategoryInfo, CATEGORY_OPTIONS } from '../data/categories';
import { formatCurrency } from '../lib/utils';
import type { Expense } from '../types';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2024, i, 1).toLocaleString('en', { month: 'long' }),
}));

const YEAR_OPTIONS = [2024, 2025, 2026].map((y) => ({ value: String(y), label: String(y) }));

export function ExpensesPage() {
  const { expenses, fetchExpenses, deleteExpense } = useExpenseStore();
  const [showAdd, setShowAdd] = useState(false);
  const [_editExpense, setEditExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  useEffect(() => {
    fetchExpenses(Number(month), Number(year));
  }, [month, year]);

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat ? e.category === filterCat : true;
    return matchSearch && matchCat;
  });

  const totalShown = filtered.reduce((s, e) => s + e.amount, 0);

  // Group by date
  const grouped = filtered.reduce<Record<string, Expense[]>>((acc, e) => {
    const key = e.date.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Expenses</h1>
            <p className="text-gray-400 text-sm mt-0.5">{filtered.length} transactions · {formatCurrency(totalShown)}</p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setShowAdd(true)}>
            Add
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search expenses..."
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Select
                options={[{ value: '', label: 'All Categories' }, ...CATEGORY_OPTIONS]}
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="w-40"
              />
              <Select
                options={MONTH_OPTIONS}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-32"
              />
              <Select
                options={YEAR_OPTIONS}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-24"
              />
            </div>
          </div>
        </Card>

        {/* Expense list */}
        {sortedDates.length > 0 ? (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {format(new Date(date), 'EEEE, MMM d')}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs text-gray-500">
                    {formatCurrency(grouped[date].reduce((s, e) => s + e.amount, 0))}
                  </span>
                </div>
                <Card className="p-0 overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {grouped[date].map((expense) => (
                      <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        onEdit={() => setEditExpense(expense)}
                        onDelete={() => deleteExpense(expense.id)}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="py-16 text-center">
            <Receipt className="text-gray-700 mx-auto mb-4" size={48} />
            <p className="text-gray-400 font-medium">No expenses found</p>
            <p className="text-gray-500 text-sm mt-1">
              {search || filterCat ? 'Try adjusting your filters' : 'Add your first expense!'}
            </p>
          </Card>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Expense">
        <AddExpenseForm onSuccess={() => setShowAdd(false)} />
      </Modal>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 lg:hidden w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/40 z-30"
      >
        <Plus size={26} className="text-white" />
      </motion.button>
    </>
  );
}

function ExpenseRow({ expense, onEdit, onDelete }: { expense: Expense; onEdit: () => void; onDelete: () => void }) {
  const cat = getCategoryInfo(expense.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center text-xl flex-shrink-0`}>
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{expense.description}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-gray-400">{cat.label}</span>
          {expense.is_impulse && <Badge variant="orange">⚡ Impulse</Badge>}
          {expense.is_need ? <Badge variant="green">Need</Badge> : <Badge variant="purple">Want</Badge>}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-white">{formatCurrency(expense.amount)}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
