import { create } from 'zustand';
import type { Budget, CategoryBudget } from '../types';
import api from '../lib/api';

interface BudgetStore {
  budget: Budget | null;
  categoryBudgets: CategoryBudget[];
  isLoading: boolean;
  fetchBudget: (month: number, year: number) => Promise<void>;
  fetchCategoryBudgets: (month: number, year: number) => Promise<void>;
  setMonthlyBudget: (amount: number, month: number, year: number) => Promise<void>;
  setCategoryBudget: (category: string, amount: number, month: number, year: number) => Promise<void>;
  deleteCategoryBudget: (id: string) => Promise<void>;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budget: null,
  categoryBudgets: [],
  isLoading: false,

  fetchBudget: async (month, year) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/budgets?month=${month}&year=${year}`);
      set({ budget: data, isLoading: false });
    } catch {
      set({ budget: null, isLoading: false });
    }
  },

  fetchCategoryBudgets: async (month, year) => {
    try {
      const { data } = await api.get(`/budgets/categories?month=${month}&year=${year}`);
      set({ categoryBudgets: data });
    } catch {
      set({ categoryBudgets: [] });
    }
  },

  setMonthlyBudget: async (amount, month, year) => {
    const { data } = await api.post('/budgets', { total_budget: amount, month, year });
    set({ budget: data });
  },

  setCategoryBudget: async (category, amount, month, year) => {
    const existing = get().categoryBudgets.find(
      (b) => b.category === category && b.month === month && b.year === year
    );
    if (existing) {
      const { data } = await api.patch(`/budgets/categories/${existing.id}`, { amount });
      set((s) => ({
        categoryBudgets: s.categoryBudgets.map((b) => (b.id === existing.id ? data : b)),
      }));
    } else {
      const { data } = await api.post('/budgets/categories', { category, amount, month, year });
      set((s) => ({ categoryBudgets: [...s.categoryBudgets, data] }));
    }
  },

  deleteCategoryBudget: async (id) => {
    await api.delete(`/budgets/categories/${id}`);
    set((s) => ({ categoryBudgets: s.categoryBudgets.filter((b) => b.id !== id) }));
  },
}));
