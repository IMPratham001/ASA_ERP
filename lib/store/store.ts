import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'super_admin' | 'admin' | 'manager' | 'accountant' | 'inventory' | 'sales';

export type Permission = 'view' | 'create' | 'edit' | 'delete';

export type ModuleAccess = {
  module: string;
  permissions: Permission[];
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  storeId: string | null; // null for super_admin
  moduleAccess: ModuleAccess[];
  lastLogin: string;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  phone: string;
  region: string;
  isMainBranch: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  currency: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  category: string;
  brand: string;
  supplier: string;
  reorderPoint: number;
  tax: number;
  images: string[];
};

export type InventoryItem = {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  minQuantity: number;
  location: string;
  lastUpdated: string;
  batchNumber: string;
  expiryDate: string | null;
};

export type Order = {
  id: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  tax: number;
  discount: number;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export type Transaction = {
  id: string;
  storeId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  reference: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  createdBy: string;
};

export type ActivityLog = {
  id: string;
  userId: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  timestamp: string;
};

interface State {
  user: User | null;
  stores: Store[];
  currentStore: Store | null;
  products: Product[];
  inventory: InventoryItem[];
  orders: Order[];
  transactions: Transaction[];
  activityLogs: ActivityLog[];
  setUser: (user: User | null) => void;
  addStore: (store: Store) => void;
  updateStore: (id: string, store: Partial<Store>) => void;
  setCurrentStore: (store: Store | null) => void;
  setStores: (stores: Store[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  updateInventory: (item: InventoryItem) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addTransaction: (transaction: Transaction) => void;
  logActivity: (log: ActivityLog) => void;
  hasPermission: (module: string, permission: Permission) => boolean;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      stores: [],
      currentStore: null,
      products: [],
      inventory: [],
      orders: [],
      transactions: [],
      activityLogs: [],
      hasPermission: (module: string, permission: string) => {
        const user = get().user;
        if (!user?.moduleAccess) return false;
        try {
          const moduleAccess = user.moduleAccess.find((m) => m.module === module);
          return moduleAccess?.permissions?.includes(permission as Permission) ?? false;
        } catch (error) {
          console.error("Permission check error:", error);
          return false;
        }
      },
      setUser: (user) => set({ user }),
      addStore: (store) =>
        set((state) => ({ stores: [...state.stores, store] })),
      updateStore: (id, store) =>
        set((state) => ({
          stores: state.stores.map((s) =>
            s.id === id ? { ...s, ...store } : s
          ),
        })),
      setCurrentStore: (store) => set({ currentStore: store }),
      setStores: (stores) => set({ stores }),
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        })),
      updateInventory: (item) =>
        set((state) => ({
          inventory: [
            ...state.inventory.filter((i) => i.id !== item.id),
            item,
          ],
        })),
      addOrder: (order) =>
        set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      logActivity: (log) =>
        set((state) => ({
          activityLogs: [...state.activityLogs, log],
        })),
      hasPermission: (module: string, permission: string) => {
        const user = get().user;
        if (!user?.moduleAccess) return false;
        try {
          const moduleAccess = user.moduleAccess.find((m) => m.module === module);
          return moduleAccess?.permissions?.includes(permission) || false;
        } catch (error) {
          console.error("Permission check error:", error);
          return false;
        }
      },
    }),
    {
      name: 'erp-store',
    }
  )
);