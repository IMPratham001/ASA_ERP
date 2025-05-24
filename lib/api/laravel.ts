
import api from './axios';

// Auth APIs
export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/user'),
};

// Store APIs
export const storeAPI = {
  list: () => api.get('/stores'),
  create: (data: any) => api.post('/stores', data),
  update: (id: string, data: any) => api.put(`/stores/${id}`, data),
  delete: (id: string) => api.delete(`/stores/${id}`),
};

// Customer APIs
export const customerAPI = {
  list: () => api.get('/customers'),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Finance APIs
export const financeAPI = {
  getTransactions: () => api.get('/finance/transactions'),
  createTransaction: (data: any) => api.post('/finance/transactions', data),
  getBudget: () => api.get('/finance/budget'),
  updateBudget: (data: any) => api.put('/finance/budget', data),
};
