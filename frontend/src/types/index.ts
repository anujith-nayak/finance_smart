// ─── User ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Expense ───────────────────────────────────────────────────────────────
export type ExpenseCategory =
  | 'chocolate'
  | 'chips'
  | 'snacks'
  | 'ice_cream'
  | 'shopping'
  | 'food'
  | 'travel'
  | 'bills'
  | 'education'
  | 'medicine'
  | 'entertainment'
  | 'other';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  is_need: boolean;
  is_impulse: boolean;
  created_at: string;
}

export interface CreateExpenseDto {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  is_need: boolean;
  is_impulse: boolean;
}

// ─── Budget ────────────────────────────────────────────────────────────────
export interface Budget {
  id: string;
  user_id: string;
  month: number;
  year: number;
  total_budget: number;
  created_at: string;
}

export interface CategoryBudget {
  id: string;
  user_id: string;
  category: ExpenseCategory;
  amount: number;
  month: number;
  year: number;
  created_at: string;
}

// ─── Savings Goal ──────────────────────────────────────────────────────────
export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  emoji?: string;
  created_at: string;
}

export interface CreateGoalDto {
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  emoji?: string;
}

// ─── Borrow / Lend ─────────────────────────────────────────────────────────
export type DebtType = 'lent' | 'borrowed';
export type DebtStatus = 'pending' | 'partial' | 'settled';

export interface DebtRecord {
  id: string;
  user_id: string;
  type: DebtType;
  person_name: string;
  amount: number;
  paid_amount: number;
  due_date?: string;
  notes?: string;
  status: DebtStatus;
  created_at: string;
}

export interface CreateDebtDto {
  type: DebtType;
  person_name: string;
  amount: number;
  paid_amount?: number;
  due_date?: string;
  notes?: string;
}

// ─── Analytics ─────────────────────────────────────────────────────────────
export interface MonthlyStats {
  total_spent: number;
  total_budget: number;
  remaining: number;
  total_saved: number;
  needs_total: number;
  wants_total: number;
  impulse_total: number;
  impulse_count: number;
  category_breakdown: Record<string, number>;
}

// ─── Notification ──────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: 'warning' | 'achievement' | 'reminder' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// ─── Onboarding ────────────────────────────────────────────────────────────
export interface OnboardingData {
  name: string;
  email: string;
  password: string;
  monthly_budget?: number;
}
