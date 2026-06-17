import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import api from '../lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, monthlyBudget?: number) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);
          const { data } = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          localStorage.setItem('pg_token', data.access_token);
          const { data: user } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          set({ token: data.access_token, user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password, monthlyBudget) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', {
            name, email, password, monthly_budget: monthlyBudget,
          });
          localStorage.setItem('pg_token', data.access_token);
          const { data: user } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          set({ token: data.access_token, user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('pg_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: async (data) => {
        const { data: updated } = await api.patch('/auth/me', data);
        set({ user: updated });
      },
    }),
    {
      name: 'pg_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
