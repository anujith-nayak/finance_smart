import { create } from 'zustand';
import type { DebtRecord, CreateDebtDto } from '../types';
import api from '../lib/api';

interface DebtStore {
  debts: DebtRecord[];
  isLoading: boolean;
  fetchDebts: () => Promise<void>;
  addDebt: (data: CreateDebtDto) => Promise<void>;
  updateDebt: (id: string, data: Partial<CreateDebtDto>) => Promise<void>;
  settleDebt: (id: string) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  getTotalLent: () => number;
  getTotalBorrowed: () => number;
}

export const useDebtStore = create<DebtStore>((set, get) => ({
  debts: [],
  isLoading: false,

  fetchDebts: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/debts');
      set({ debts: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addDebt: async (payload) => {
    const { data } = await api.post('/debts', payload);
    set((s) => ({ debts: [data, ...s.debts] }));
  },

  updateDebt: async (id, payload) => {
    const { data } = await api.patch(`/debts/${id}`, payload);
    set((s) => ({ debts: s.debts.map((d) => (d.id === id ? data : d)) }));
  },

  settleDebt: async (id) => {
    const { data } = await api.post(`/debts/${id}/settle`);
    set((s) => ({ debts: s.debts.map((d) => (d.id === id ? data : d)) }));
  },

  deleteDebt: async (id) => {
    await api.delete(`/debts/${id}`);
    set((s) => ({ debts: s.debts.filter((d) => d.id !== id) }));
  },

  getTotalLent: () =>
    get()
      .debts.filter((d) => d.type === 'lent' && d.status !== 'settled')
      .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0),

  getTotalBorrowed: () =>
    get()
      .debts.filter((d) => d.type === 'borrowed' && d.status !== 'settled')
      .reduce((sum, d) => sum + (d.amount - d.paid_amount), 0),
}));
