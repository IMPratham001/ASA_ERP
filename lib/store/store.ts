import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import * as api from '@/lib/api/laravel';

interface StoreState {
  // State types
  inventory: any[];
  products: any[];
  customers: any[];
  invoices: any[];
  transactions: any[];
  activityLogs: any[];
  error: string | null;
  loading: boolean;
  user: any | null;

  // Actions
  fetchInventory: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  updateInventory: (item: any) => Promise<void>;
  addInventoryItem: (item: any) => Promise<void>;
  importData: (type: string, file: File) => Promise<void>;
  exportData: (type: string, format: 'csv' | 'pdf') => Promise<void>;
  logActivity: (log: any) => void;
  clearErrors: () => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  inventory: [],
  products: [],
  customers: [],
  invoices: [],
  transactions: [],
  activityLogs: [],
  error: null,
  loading: false,
  user: null,

  fetchInventory: async () => {
    try {
      set({ loading: true });
      const response = await api.inventoryApi.getAll();
      set({ inventory: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const response = await api.productsApi.getAll();
      set({ products: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCustomers: async () => {
    try {
      set({ loading: true });
      const response = await api.customerApi.getAll();
      set({ customers: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchInvoices: async () => {
    try {
      set({ loading: true });
      const response = await api.billingApi.getInvoices();
      set({ invoices: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateInventory: async (item) => {
    try {
      set({ loading: true });
      await api.inventoryApi.update(item.id, item);
      get().fetchInventory();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addInventoryItem: async (item) => {
    try {
      set({ loading: true });
      await api.inventoryApi.create(item);
      get().fetchInventory();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  importData: async (type, file) => {
    try {
      set({ loading: true });
      switch (type) {
        case 'inventory':
          await api.inventoryApi.import(file);
          get().fetchInventory();
          break;
        case 'customers':
          await api.customerApi.import(file);
          get().fetchCustomers();
          break;
        case 'products':
          await api.productsApi.import(file);
          get().fetchProducts();
          break;
      }
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  exportData: async (type, format) => {
    try {
      set({ loading: true });
      let response;
      switch (type) {
        case 'inventory':
          response = await api.inventoryApi.export(format);
          break;
        case 'customers':
          response = await api.customerApi.export(format);
          break;
        case 'products':
          response = await api.productsApi.export(format);
          break;
      }

      // Handle file download
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}-export.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logActivity: (log) => set((state) => ({
    activityLogs: [
      {
        ...log,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID()
      },
      ...state.activityLogs
    ].slice(0, 1000),
  })),

  clearErrors: () => set({ error: null }),

  reset: () => set((state) => ({
    ...state,
    transactions: [],
    activityLogs: [],
    error: null,
    loading: false
  }))
}), {
  name: 'erp-store',
  storage: createJSONStorage(() => sessionStorage)
});