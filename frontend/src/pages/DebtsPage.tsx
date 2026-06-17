import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, TrendingUp, TrendingDown, CheckCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useDebtStore } from '../store/debtStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../lib/utils';
import type { DebtRecord } from '../types';

const schema = z.object({
  type: z.enum(['lent', 'borrowed']),
  person_name: z.string().min(1, 'Name is required'),
  amount: z.string().refine((v) => Number(v) > 0, 'Must be positive'),
  due_date: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function DebtsPage() {
  const { debts, fetchDebts, addDebt, settleDebt, deleteDebt, getTotalLent, getTotalBorrowed } = useDebtStore();
  const { } = useAuthStore();
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'lent' | 'borrowed'>('all');

  useEffect(() => { fetchDebts(); }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'lent' },
  });

  const onSubmit = async (data: FormValues) => {
    await addDebt({
      type: data.type,
      person_name: data.person_name,
      amount: Number(data.amount),
      due_date: data.due_date,
      notes: data.notes,
    });
    reset();
    setShowAdd(false);
  };

  const filtered = debts.filter((d) => {
    if (activeTab === 'all') return d.status !== 'settled';
    return d.type === activeTab && d.status !== 'settled';
  });

  const settled = debts.filter((d) => d.status === 'settled');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Money Tracker</h1>
          <p className="text-gray-400 text-sm mt-0.5">Track who owes what</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setShowAdd(true)}>Add Record</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center py-5">
          <TrendingUp className="text-emerald-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{formatCurrency(getTotalLent())}</p>
          <p className="text-sm text-gray-400 mt-0.5">Others owe you</p>
        </Card>
        <Card className="text-center py-5">
          <TrendingDown className="text-red-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-white">{formatCurrency(getTotalBorrowed())}</p>
          <p className="text-sm text-gray-400 mt-0.5">You owe others</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['all', 'lent', 'borrowed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'all' ? 'Active' : tab === 'lent' ? 'They Owe You' : 'You Owe'}
          </button>
        ))}
      </div>

      {/* Debt list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onSettle={() => settleDebt(debt.id)}
                onDelete={() => deleteDebt(debt.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="py-12 text-center">
          <Users className="text-gray-700 mx-auto mb-3" size={40} />
          <p className="text-gray-400">No active records</p>
          <p className="text-gray-500 text-sm mt-1">Clean slate! 🎉</p>
        </Card>
      )}

      {/* Settled */}
      {settled.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Settled</h3>
          <div className="space-y-2">
            {settled.slice(0, 5).map((debt) => (
              <div key={debt.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                <CheckCircle className="text-emerald-500 flex-shrink-0" size={16} />
                <p className="text-sm text-gray-400 flex-1">
                  {debt.type === 'lent' ? `${debt.person_name} paid back` : `You paid ${debt.person_name}`} {formatCurrency(debt.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Debt Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Record">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Select
            label="Type"
            options={[
              { value: 'lent', label: '↗️ I lent money' },
              { value: 'borrowed', label: '↙️ I borrowed money' },
            ]}
            {...register('type')}
          />
          <Input
            label="Person's Name"
            placeholder="e.g. Rahul"
            error={errors.person_name?.message}
            {...register('person_name')}
          />
          <Input
            label="Amount"
            type="number"
            placeholder="e.g. 500"
            suffix={<span className="text-xs text-gray-500">₹</span>}
            error={errors.amount?.message}
            {...register('amount')}
          />
          <Input
            label="Due Date (optional)"
            type="date"
            {...register('due_date')}
          />
          <Input
            label="Notes (optional)"
            placeholder="What was it for?"
            {...register('notes')}
          />
          <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
            Save Record
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function DebtCard({ debt, onSettle, onDelete }: {
  debt: DebtRecord;
  userName?: string;
  onSettle: () => void;
  onDelete: () => void;
}) {
  const isLent = debt.type === 'lent';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="group">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isLent ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}>
            {isLent ? <TrendingUp className="text-emerald-400" size={20} /> : <TrendingDown className="text-red-400" size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-medium">
                {isLent ? `${debt.person_name} owes you` : `You owe ${debt.person_name}`}
              </p>
              <Badge variant={isLent ? 'green' : 'red'}>
                {isLent ? '↗️ Lent' : '↙️ Borrowed'}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(debt.amount)}</p>
            {debt.notes && <p className="text-xs text-gray-400 mt-1">{debt.notes}</p>}
            {debt.due_date && (
              <p className="text-xs text-gray-500 mt-0.5">
                Due {format(new Date(debt.due_date), 'MMM d, yyyy')}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Button variant="success" size="sm" onClick={onSettle} icon={<CheckCircle size={14} />}>
              Settle
            </Button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 self-center"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
