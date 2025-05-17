"use client";

import { create } from 'zustand';
import { customerAPI } from '@/lib/api/laravel';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: string;
  invoices?: Invoice[];
}

interface CustomOrder {
  id: number;
  customerId: number;
  category: string;
  specifications: string;
  materials: string[];
  artisanId?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: number;
  customer_id: number;
  customer?: Customer;
  invoice_number: string;
  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  due_date: string;
  notes?: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  status: 'active' | 'inactive';
  inventory?: Inventory;
}

interface Inventory {
  id: number;
  product_id: number;
  quantity: number;
  low_stock_threshold: number;
  warehouse_location: string;
  last_restock_date: string;
}



interface ActivityLog {
  id: string;
  type: 'inventory' | 'payment' | 'staff' | 'time';
  action: string;
  details: string;
  timestamp: string;
  userId: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  status: string;
  date: string;
}

interface State {
  customers: Customer[];
  customOrders: CustomOrder[];
  invoices: Invoice[];
  products: Product[];
  timeEntries: TimeEntry[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

interface Actions {
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;

  addCustomOrder: (order: Omit<CustomOrder, 'id'>) => Promise<void>;
  updateCustomOrder: (id: number, order: Partial<CustomOrder>) => Promise<void>;
  fetchCustomOrders: () => Promise<void>;

  fetchInvoices: () => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (id: number, invoice: Partial<Invoice>) => Promise<void>;

  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  updateStock: (id: number, quantity: number) => Promise<void>;
}

export const useStore = create<State & Actions>((set) => ({
  customers: [],
  customOrders: [],
  invoices: [],
  products: [],
  
  payments: [],
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
        customers: state.customers.map(c => c.id === id ? { ...c, ...updatedCustomer } : c),
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

  addCustomOrder: async (order) => {
    set({ loading: true, error: null });
    try {
      // Replace with actual API call
      const newOrder = { id: Date.now(), ...order };
      set((state) => ({
        customOrders: [...state.customOrders, newOrder],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateCustomOrder: async (id, order) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        customOrders: state.customOrders.map(o => o.id === id ? { ...o, ...order } : o),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCustomOrders: async () => {
    set({ loading: true, error: null });
    try {
      // Replace with actual API call
      const orders = [];
      set({ customOrders: orders, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/invoices');
      const invoices = await response.json();
      set({ invoices, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addInvoice: async (invoice) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      });
      const newInvoice = await response.json();

      // Update customer's invoices
      set((state) => ({
        invoices: [...state.invoices, newInvoice],
        customers: state.customers.map(c => 
          c.id === invoice.customer_id 
            ? { ...c, invoices: [...(c.invoices || []), newInvoice] }
            : c
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateInvoice: async (id, invoice) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      });
      const updatedInvoice = await response.json();

      set((state) => ({
        invoices: state.invoices.map(inv => inv.id === id ? updatedInvoice : inv),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      set({ products, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const newProduct = await response.json();
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const updatedProduct = await response.json();
      set((state) => ({
        products: state.products.map(p => p.id === id ? updatedProduct : p),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateStock: async (id, quantity) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/products/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      const updatedProduct = await response.json();
      set((state) => ({
        products: state.products.map(p => p.id === id ? updatedProduct : p),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));