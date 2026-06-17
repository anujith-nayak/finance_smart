import type { ExpenseCategory } from '../types';

export interface CategoryInfo {
  value: ExpenseCategory;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  isImpulseProne: boolean;
}

export const CATEGORIES: CategoryInfo[] = [
  { value: 'chocolate', label: 'Chocolate', emoji: '🍫', color: 'text-amber-400', bgColor: 'bg-amber-500/20', isImpulseProne: true },
  { value: 'chips', label: 'Chips', emoji: '🥔', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', isImpulseProne: true },
  { value: 'snacks', label: 'Snacks', emoji: '🍿', color: 'text-orange-400', bgColor: 'bg-orange-500/20', isImpulseProne: true },
  { value: 'ice_cream', label: 'Ice Cream', emoji: '🍦', color: 'text-pink-400', bgColor: 'bg-pink-500/20', isImpulseProne: true },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️', color: 'text-purple-400', bgColor: 'bg-purple-500/20', isImpulseProne: true },
  { value: 'food', label: 'Food', emoji: '🍽️', color: 'text-green-400', bgColor: 'bg-green-500/20', isImpulseProne: false },
  { value: 'travel', label: 'Travel', emoji: '✈️', color: 'text-blue-400', bgColor: 'bg-blue-500/20', isImpulseProne: false },
  { value: 'bills', label: 'Bills', emoji: '💡', color: 'text-red-400', bgColor: 'bg-red-500/20', isImpulseProne: false },
  { value: 'education', label: 'Education', emoji: '📚', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', isImpulseProne: false },
  { value: 'medicine', label: 'Medicine', emoji: '💊', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', isImpulseProne: false },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎮', color: 'text-violet-400', bgColor: 'bg-violet-500/20', isImpulseProne: true },
  { value: 'other', label: 'Other', emoji: '📦', color: 'text-gray-400', bgColor: 'bg-gray-500/20', isImpulseProne: false },
];

export const getCategoryInfo = (value: ExpenseCategory): CategoryInfo => {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];
};

export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({
  value: c.value,
  label: `${c.emoji} ${c.label}`,
}));

export const IMPULSE_PRONE_CATEGORIES = CATEGORIES.filter((c) => c.isImpulseProne).map((c) => c.value);
