
import { create } from 'zustand';
import { Budget, TaxSetting, JournalEntry } from '@/types/finance';
import { budgetAPI } from '@/lib/api/finance/budget';
import { taxAPI } from '@/lib/api/finance/tax';

interface FinanceStore {
  budgets: Budget[];
  taxSettings: TaxSetting[];
  journalEntries: JournalEntry[];
  loading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  fetchTaxSettings: () => Promise<void>;
  createBudget: (data: Omit<Budget, 'id'>) => Promise<void>;
  updateTaxSetting: (id: string, data: Partial<TaxSetting>) => Promise<void>;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  budgets: [],
  taxSettings: [],
  journalEntries: [],
  loading: false,
  error: null,
  fetchBudgets: async () => {
    try {
      set({ loading: true });
      const response = await budgetAPI.getAll();
      set({ budgets: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch budgets', loading: false });
    }
  },
  fetchTaxSettings: async () => {
    try {
      set({ loading: true });
      const response = await taxAPI.getAll();
      set({ taxSettings: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tax settings', loading: false });
    }
  },
  createBudget: async (data) => {
    try {
      set({ loading: true });
      await budgetAPI.create(data);
      const response = await budgetAPI.getAll();
      set({ budgets: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to create budget', loading: false });
    }
  },
  updateTaxSetting: async (id, data) => {
    try {
      set({ loading: true });
      await taxAPI.update(id, data);
      const response = await taxAPI.getAll();
      set({ taxSettings: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to update tax setting', loading: false });
    }
  },
}));
