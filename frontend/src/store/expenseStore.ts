import { create } from 'zustand';
import type { Expense, CreateExpenseDto } from '../types';
import api from '../lib/api';

interface ExpenseStore {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: (month?: number, year?: number) => Promise<void>;
  addExpense: (data: CreateExpenseDto) => Promise<Expense>;
  updateExpense: (id: string, data: Partial<CreateExpenseDto>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getMonthlyTotal: (month: number, year: number) => number;
  getCategoryTotal: (category: string, month: number, year: number) => number;
  getImpulseCount: (month: number, year: number) => number;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  isLoading: false,

  fetchExpenses: async (month, year) => {
    set({ isLoading: true });
    try {
      const params = month && year ? `?month=${month}&year=${year}` : '';
      const { data } = await api.get(`/expenses${params}`);
      set({ expenses: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addExpense: async (payload) => {
    const { data } = await api.post('/expenses', payload);
    set((s) => ({ expenses: [data, ...s.expenses] }));
    return data;
  },

  updateExpense: async (id, payload) => {
    const { data } = await api.patch(`/expenses/${id}`, payload);
    set((s) => ({
      expenses: s.expenses.map((e) => (e.id === id ? data : e)),
    }));
  },

  deleteExpense: async (id) => {
    await api.delete(`/expenses/${id}`);
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
  },

  getMonthlyTotal: (month, year) => {
    return get()
      .expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getCategoryTotal: (category, month, year) => {
    return get()
      .expenses.filter((e) => {
        const d = new Date(e.date);
        return (
          e.category === category &&
          d.getMonth() + 1 === month &&
          d.getFullYear() === year
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getImpulseCount: (month, year) => {
    return get().expenses.filter((e) => {
      const d = new Date(e.date);
      return e.is_impulse && d.getMonth() + 1 === month && d.getFullYear() === year;
    }).length;
  },
}));
