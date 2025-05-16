import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventory = {
  getAll: async () => (await api.get('/inventory')).data,
  getByProduct: async (productId: string) => (await api.get(`/inventory/product/${productId}`)).data,
  update: async (id: string, data: any) => (await api.put(`/inventory/${id}`, data)).data,
  create: async (data: any) => (await api.post('/inventory', data)).data,
  delete: async (id: string) => await api.delete(`/inventory/${id}`),
  getLowStock: async () => (await api.get('/inventory/low-stock')).data,
};

export const products = {
  getAll: async () => (await api.get('/products')).data,
  create: async (data: any) => (await api.post('/products', data)).data,
  update: async (id: string, data: any) => (await api.put(`/products/${id}`, data)).data,
  delete: async (id: string) => await api.delete(`/products/${id}`),
  sync: async () => (await api.post('/products/sync')).data,
};

export const customers = {
  getAll: async () => (await api.get('/customers')).data,
  create: async (data: any) => (await api.post('/customers', data)).data,
  update: async (id: string, data: any) => (await api.put(`/customers/${id}`, data)).data,
  delete: async (id: string) => await api.delete(`/customers/${id}`),
};

export default {
  inventory,
  products,
  customers,
};