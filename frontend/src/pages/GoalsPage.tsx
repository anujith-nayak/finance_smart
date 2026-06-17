import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, TrendingUp, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useGoalsStore } from '../store/goalsStore';
import { formatCurrency, getPercentage } from '../lib/utils';
import type { SavingsGoal } from '../types';
import { format } from 'date-fns';

const goalEmojis = ['🎯', '📱', '💻', '✈️', '🎸', '🏍️', '🏠', '🎓', '💍', '🚗', '⌚', '🎮'];

const schema = z.object({
  name: z.string().min(1, 'Goal name is required').max(50),
  target_amount: z.string().refine((v) => Number(v) > 0, 'Must be a positive number'),
  current_amount: z.string().optional(),
  deadline: z.string().optional(),
  emoji: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function GoalsPage() {
  const { goals, fetchGoals, addGoal, addToGoal, deleteGoal } = useGoalsStore();
  const [showAdd, setShowAdd] = useState(false);
  const [addFunds, setAddFunds] = useState<SavingsGoal | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');

  useEffect(() => { fetchGoals(); }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { emoji: '🎯', current_amount: '0' },
  });

  const onSubmit = async (data: FormValues) => {
    await addGoal({
      name: data.name,
      target_amount: Number(data.target_amount),
      current_amount: Number(data.current_amount ?? 0),
      deadline: data.deadline,
      emoji: selectedEmoji,
    });
    reset();
    setSelectedEmoji('🎯');
    setShowAdd(false);
  };

  const handleAddFunds = async () => {
    if (!addFunds || !fundAmount || Number(fundAmount) <= 0) return;
    await addToGoal(addFunds.id, Number(fundAmount));
    setAddFunds(null);
    setFundAmount('');
  };

  const totalTargets = goals.reduce((s, g) => s + g.target_amount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0);
  const completedGoals = goals.filter((g) => g.current_amount >= g.target_amount);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {formatCurrency(totalSaved)} saved of {formatCurrency(totalTargets)}
          </p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setShowAdd(true)}>New Goal</Button>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-white">{goals.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Active Goals</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-emerald-400">{completedGoals.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Completed</p>
          </Card>
          <Card className="text-center py-4">
            <p className="text-2xl font-bold text-purple-400">{formatCurrency(totalSaved)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Saved</p>
          </Card>
        </div>
      )}

      {/* Goals */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {goals.map((goal) => {
              const pct = getPercentage(goal.current_amount, goal.target_amount);
              const isComplete = pct >= 100;

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="group relative overflow-hidden">
                    {isComplete && (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none rounded-2xl" />
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                          isComplete ? 'bg-emerald-500/20' : 'bg-purple-500/20'
                        }`}>
                          {isComplete ? '✅' : (goal.emoji ?? '🎯')}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{goal.name}</p>
                          {goal.deadline && (
                            <p className="text-xs text-gray-400">
                              Due {format(new Date(goal.deadline), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mb-2">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-white font-medium">{formatCurrency(goal.current_amount)}</span>
                        <span className="text-sm text-gray-400">{formatCurrency(goal.target_amount)}</span>
                      </div>
                      <ProgressBar value={pct} colorMode={isComplete ? 'custom' : 'goal'} color={isComplete ? 'bg-emerald-500' : undefined} height="h-2.5" />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{pct}% saved</span>
                        {!isComplete && (
                          <span className="text-xs text-gray-500">
                            {formatCurrency(goal.target_amount - goal.current_amount)} to go
                          </span>
                        )}
                      </div>
                    </div>

                    {isComplete ? (
                      <div className="flex items-center gap-2 mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle className="text-emerald-400" size={16} />
                        <span className="text-emerald-300 text-sm font-medium">Goal achieved! 🎉</span>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<TrendingUp size={14} />}
                        onClick={() => setAddFunds(goal)}
                        className="w-full justify-center mt-3"
                      >
                        Add Funds
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="py-16 text-center">
          <Target className="text-gray-700 mx-auto mb-4" size={48} />
          <p className="text-gray-400 font-medium">No savings goals yet</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Create your first goal and start saving</p>
          <Button icon={<Plus size={18} />} onClick={() => setShowAdd(true)}>Create Goal</Button>
        </Card>
      )}

      {/* Add Goal Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="New Savings Goal">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Emoji picker */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Goal Icon</label>
            <div className="flex flex-wrap gap-2">
              {goalEmojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setSelectedEmoji(e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    selectedEmoji === e
                      ? 'bg-purple-500/30 border border-purple-500/50 scale-110'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Goal Name"
            placeholder="e.g. New iPhone"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Target Amount"
            type="number"
            placeholder="e.g. 80000"
            suffix={<span className="text-xs text-gray-500">₹</span>}
            error={errors.target_amount?.message}
            {...register('target_amount')}
          />
          <Input
            label="Already Saved (optional)"
            type="number"
            placeholder="0"
            suffix={<span className="text-xs text-gray-500">₹</span>}
            {...register('current_amount')}
          />
          <Input
            label="Deadline (optional)"
            type="date"
            {...register('deadline')}
          />
          <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
            Create Goal
          </Button>
        </form>
      </Modal>

      {/* Add Funds Modal */}
      <Modal isOpen={!!addFunds} onClose={() => { setAddFunds(null); setFundAmount(''); }} title={`Add funds to ${addFunds?.name}`} size="sm">
        <div className="flex flex-col gap-4">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-sm">Current savings</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(addFunds?.current_amount ?? 0)}</p>
          </div>
          <Input
            label="Amount to add"
            type="number"
            placeholder="e.g. 1000"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            suffix={<span className="text-xs text-gray-500">₹</span>}
          />
          <Button size="lg" className="w-full justify-center" onClick={handleAddFunds} icon={<TrendingUp size={18} />}>
            Add Funds
          </Button>
        </div>
      </Modal>
    </div>
  );
}
