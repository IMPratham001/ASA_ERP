
import { create } from 'zustand';
import * as api from '@/lib/api/laravel';

interface StoreState {
  inventory: any[];
  products: any[];
  customers: any[];
  loading: boolean;
  error: string | null;

  fetchInventory: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  addCustomer: (data: any) => Promise<void>;
  updateCustomer: (id: string, data: any) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateInventory: (id: string, data: any) => Promise<void>;
  syncProductsWithInventory: () => Promise<void>;
  clearError: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  inventory: [],
  products: [],
  customers: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      const data = await api.customers.getAll();
      if (Array.isArray(data)) {
        set({ customers: data });
      } else {
        console.error('Invalid response format:', data);
        set({ error: 'Invalid response format from server' });
      }
    } catch (error: any) {
      console.error('API Error:', error);
      set({ error: error.message || 'Failed to fetch customers' });
    } finally {
      set({ loading: false });
    }
  },

  addCustomer: async (data: any) => {
    try {
      set({ loading: true, error: null });
      const response = await api.customers.create(data);
      set(state => ({
        customers: [...state.customers, response]
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCustomer: async (id: string, data: any) => {
    try {
      set({ loading: true, error: null });
      const response = await api.customers.update(id, data);
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === id ? response : customer
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteCustomer: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await api.customers.delete(id);
      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchInventory: async () => {
    try {
      set({ loading: true, error: null });
      const data = await api.inventory.getAll();
      set({ inventory: data });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const data = await api.products.getAll();
      set({ products: data });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (data: any) => {
    try {
      set({ loading: true, error: null });
      const response = await api.products.create(data);
      set(state => ({
        products: [...state.products, response]
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id: string, data: any) => {
    try {
      set({ loading: true, error: null });
      const response = await api.products.update(id, data);
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? response : product
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await api.products.delete(id);
      set(state => ({
        products: state.products.filter(product => product.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  syncProductsWithInventory: async () => {
    try {
      set({ loading: true, error: null });
      const [products, inventory] = await Promise.all([
        api.products.getAll(),
        api.inventory.getAll()
      ]);
      
      const mergedProducts = products.map(product => ({
        ...product,
        inventory: inventory.find(item => item.productId === product.id) || null
      }));
      
      set({ 
        products: mergedProducts,
        inventory
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateInventory: async (id: string, data: any) => {
    try {
      set({ loading: true, error: null });
      const response = await api.inventory.update(id, data);
      set(state => ({
        inventory: state.inventory.map(item => 
          item.id === id ? response : item
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
