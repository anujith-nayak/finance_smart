import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { ImpulseDialog } from './ImpulseDialog';
import { RegretToast } from './RegretToast';
import { CATEGORY_OPTIONS, IMPULSE_PRONE_CATEGORIES, getCategoryInfo } from '../data/categories';
import { useExpenseStore } from '../store/expenseStore';
import { useAuthStore } from '../store/authStore';
import type { ExpenseCategory } from '../types';

const schema = z.object({
  amount: z.string().min(1, 'Amount is required').refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').max(100),
  date: z.string().min(1, 'Date is required'),
  is_need: z.string(),
  is_impulse: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface AddExpenseFormProps {
  onSuccess?: () => void;
}

export function AddExpenseForm({ onSuccess }: AddExpenseFormProps) {
  const { addExpense } = useExpenseStore();
  const { user } = useAuthStore();
  const [showImpulse, setShowImpulse] = useState(false);
  const [showRegret, setShowRegret] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: today,
      is_need: 'false',
      is_impulse: 'false',
    },
  });

  const selectedCategory = watch('category') as ExpenseCategory;
  const categoryInfo = selectedCategory ? getCategoryInfo(selectedCategory) : null;

  const onSubmit = (data: FormValues) => {
    const isImpulseProne = IMPULSE_PRONE_CATEGORIES.includes(data.category as ExpenseCategory);
    const isImpulse = data.is_impulse === 'true';

    if (isImpulseProne && !isImpulse) {
      setPendingData(data);
      setShowImpulse(true);
      return;
    }
    submitExpense(data);
  };

  const submitExpense = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await addExpense({
        amount: Number(data.amount),
        category: data.category as ExpenseCategory,
        description: data.description,
        date: data.date,
        is_need: data.is_need === 'true',
        is_impulse: data.is_impulse === 'true',
      });
      reset({ date: today, is_need: 'false', is_impulse: 'false' });
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImpulseConfirm = () => {
    setShowImpulse(false);
    if (pendingData) {
      submitExpense({ ...pendingData, is_impulse: 'true' });
      setShowRegret(true);
    }
  };

  const handleImpulseCancel = () => {
    setShowImpulse(false);
    setPendingData(null);
    reset({ date: today, is_need: 'false', is_impulse: 'false' });
  };

  const handleImpulseIgnore = () => {
    setShowImpulse(false);
    if (pendingData) submitExpense(pendingData);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          placeholder="0"
          step="0.01"
          icon={<DollarSign size={16} />}
          suffix={<span className="text-xs text-gray-500">INR</span>}
          error={errors.amount?.message}
          {...register('amount')}
        />

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Category</label>
          <div className="relative">
            {categoryInfo && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg z-10 pointer-events-none">
                {categoryInfo.emoji}
              </span>
            )}
            <Select
              options={[{ value: '', label: 'Select category' }, ...CATEGORY_OPTIONS]}
              error={errors.category?.message}
              className={categoryInfo ? 'pl-10' : ''}
              {...register('category')}
            />
          </div>
          {errors.category?.message && (
            <p className="text-red-400 text-xs">{errors.category.message}</p>
          )}
        </div>

        {/* Description */}
        <Input
          label="Description"
          placeholder="What did you spend on?"
          icon={<FileText size={16} />}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Date */}
        <Input
          label="Date"
          type="date"
          icon={<Calendar size={16} />}
          error={errors.date?.message}
          {...register('date')}
        />

        {/* Need vs Want + Impulse row */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Type"
            options={[
              { value: 'false', label: '✨ Want' },
              { value: 'true', label: '✅ Need' },
            ]}
            {...register('is_need')}
          />
          <Select
            label="Planned?"
            options={[
              { value: 'false', label: '📋 Planned' },
              { value: 'true', label: '⚡ Impulse' },
            ]}
            {...register('is_impulse')}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          icon={<Tag size={18} />}
          className="w-full justify-center mt-1"
        >
          Add Expense
        </Button>
      </form>

      <ImpulseDialog
        isOpen={showImpulse}
        userName={user?.name ?? 'Friend'}
        category={selectedCategory ?? ''}
        amount={Number(pendingData?.amount ?? 0)}
        onConfirm={handleImpulseConfirm}
        onCancel={handleImpulseCancel}
        onIgnore={handleImpulseIgnore}
      />

      <RegretToast
        isVisible={showRegret}
        userName={user?.name ?? 'Friend'}
        onClose={() => setShowRegret(false)}
      />
    </>
  );
}
