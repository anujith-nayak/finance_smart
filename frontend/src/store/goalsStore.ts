import { create } from 'zustand';
import type { SavingsGoal, CreateGoalDto } from '../types';
import api from '../lib/api';

interface GoalsStore {
  goals: SavingsGoal[];
  isLoading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (data: CreateGoalDto) => Promise<void>;
  updateGoal: (id: string, data: Partial<CreateGoalDto>) => Promise<void>;
  addToGoal: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalsStore = create<GoalsStore>((set) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/goals');
      set({ goals: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addGoal: async (payload) => {
    const { data } = await api.post('/goals', payload);
    set((s) => ({ goals: [...s.goals, data] }));
  },

  updateGoal: async (id, payload) => {
    const { data } = await api.patch(`/goals/${id}`, payload);
    set((s) => ({ goals: s.goals.map((g) => (g.id === id ? data : g)) }));
  },

  addToGoal: async (id, amount) => {
    const { data } = await api.post(`/goals/${id}/add`, { amount });
    set((s) => ({ goals: s.goals.map((g) => (g.id === id ? data : g)) }));
  },

  deleteGoal: async (id) => {
    await api.delete(`/goals/${id}`);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },
}));
