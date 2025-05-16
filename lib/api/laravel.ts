
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventory = {
  getAll: async () => {
    try {
      const response = await api.get('/inventory');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/inventory', data);
      return response.data;
    } catch (error) {
      console.error('Error creating inventory:', error);
      throw error;
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/inventory/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      await api.delete(`/inventory/${id}`);
    } catch (error) {
      console.error('Error deleting inventory:', error);
      throw error;
    }
  },
};

export const products = {
  getAll: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export const customers = {
  getAll: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/customers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/customers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },
};

export default {
  inventory,
  products,
  customers,
};
