import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
  getUser: async () => {
    return (await api.get('/auth/me')).data;
  },
};

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
      console.error('Error creating inventory item:', error);
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
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },
  getLowStock: async () => {
    try {
      const response = await api.get('/inventory/low-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock:', error);
      throw error;
    }
  },
};

// Customer Management
export const customerApi = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/customers/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  export: (format: 'csv' | 'pdf') => api.get(`/customers/export/${format}`, { responseType: 'blob' }),
};

// Products Management
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  export: (format: 'csv' | 'pdf') => api.get(`/products/export/${format}`, { responseType: 'blob' }),
};

// Billing Management 
export const billingApi = {
  createInvoice: (data: any) => api.post('/invoices', data),
  getInvoices: () => api.get('/invoices'),
  getInvoiceById: (id: string) => api.get(`/invoices/${id}`),
  updateInvoice: (id: string, data: any) => api.put(`/invoices/${id}`, data),
  deleteInvoice: (id: string) => api.delete(`/invoices/${id}`),
  exportInvoice: (id: string, format: 'pdf' | 'csv') => 
    api.get(`/invoices/${id}/export/${format}`, { responseType: 'blob' }),
};

// Reports
export const reportsApi = {
  getSalesReport: (params: any) => api.get('/reports/sales', { params }),
  getInventoryReport: (params: any) => api.get('/reports/inventory', { params }),
  getCustomerReport: (params: any) => api.get('/reports/customers', { params }),
  exportReport: (type: string, params: any, format: 'pdf' | 'csv') =>
    api.get(`/reports/${type}/export/${format}`, { params, responseType: 'blob' }),
};

export default api;