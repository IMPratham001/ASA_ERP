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
  syncProductsWithInventory: () => Promise<void>;
  updateInventory: (id: string, data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  inventory: [],
  products: [],
  customers: [],
  loading: false,
  error: null,

  fetchInventory: async () => {
    try {
      set({ loading: true });
      const data = await api.inventory.getAll();
      set({ inventory: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const data = await api.products.getAll();
      set({ products: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  syncProductsWithInventory: async () => {
    try {
      set({ loading: true });
      await api.products.sync();
      await get().fetchProducts();
      await get().fetchInventory();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateInventory: async (id, data) => {
    try {
      set({ loading: true });
      await api.inventory.update(id, data);
      await get().fetchInventory();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (data: any) => {
    try {
      set({ loading: true });
      await api.products.create(data);
      await get().fetchProducts();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProduct: async (id: string, data: any) => {
    try {
      set({ loading: true });
      await api.products.update(id, data);
      await get().fetchProducts();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true });
      await api.products.delete(id);
      await get().fetchProducts();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));