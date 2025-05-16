
import axios from 'axios';

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: LARAVEL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory Management
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getById: (id: string) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory', data),
  update: (id: string, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/inventory/${id}`),
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/inventory/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  export: (format: 'csv' | 'pdf') => api.get(`/inventory/export/${format}`, { responseType: 'blob' }),
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
