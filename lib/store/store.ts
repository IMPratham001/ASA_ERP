import { create } from 'zustand';
import { customerAPI } from '@/lib/api/laravel';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: string;
}

interface State {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

interface Actions {
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
}

export const useStore = create<State & Actions>((set) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const customers = await customerAPI.getAll();
      set({ customers, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addCustomer: async (customer) => {
    set({ loading: true, error: null });
    try {
      const newCustomer = await customerAPI.create(customer);
      set((state) => ({
        customers: [...state.customers, newCustomer],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateCustomer: async (id, customer) => {
    set({ loading: true, error: null });
    try {
      const updatedCustomer = await customerAPI.update(id, customer);
      set((state) => ({
        customers: state.customers.map(c => c.id === id ? updatedCustomer : c),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      await customerAPI.delete(id);
      set((state) => ({
        customers: state.customers.filter(c => c.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));