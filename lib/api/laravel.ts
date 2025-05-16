import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const customers = {
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/customers', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/customers/${id}`);
  }
};

export const inventory = {
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/inventory/${id}`);
  }
};

export const products = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  }
};

export default {
  customers,
  inventory,
  products
};