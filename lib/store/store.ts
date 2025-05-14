
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: string;
  email: string;
  name: string;
  role: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  category: string;
  brand?: string;
  supplier?: string;
  reorderPoint?: number;
  tax?: number;
  images?: string[];
}

interface InventoryItem {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  minQuantity: number;
  location?: string;
  lastUpdated: string;
  batchNumber?: string;
  expiryDate?: string | null;
}

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  region: string;
  isMainBranch: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface StoreState {
  user: User | null;
  currentStore: Store | null;
  products: Product[];
  inventory: InventoryItem[];
  stores: Store[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setCurrentStore: (store: Store | null) => void;
  addProduct: (product: Product) => void;
  updateInventory: (item: InventoryItem) => void;
  addStore: (store: Store) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      currentStore: null,
      products: [],
      inventory: [],
      stores: [],
      isLoading: false,
      setUser: (user) => set({ user }),
      setCurrentStore: (store) => set({ currentStore: store }),
      addProduct: (product) => set((state) => ({ 
        products: [...state.products, product] 
      })),
      updateInventory: (item) => set((state) => ({ 
        inventory: [...state.inventory, item] 
      })),
      addStore: (store) => set((state) => ({ 
        stores: [...state.stores, store] 
      })),
    }),
    {
      name: 'app-storage',
    }
  )
);
