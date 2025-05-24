import { create } from 'zustand';
import api from '@/lib/api/axios';

type Store = {
  stores: any[];
  customers: any[];
  loading: boolean;
  error: string | null;
  fetchStores: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
};

export const useStore = create<Store>((set) => ({
  stores: [],
  customers: [],
  loading: false,
  error: null,

  fetchStores: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/stores');
      set({ stores: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch stores',
        loading: false 
      });
    }
  },

  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/customers');
      set({ customers: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch customers',
        loading: false 
      });
    }
  }
}));