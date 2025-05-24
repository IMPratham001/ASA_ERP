import axios from './axios';
import { API_ROUTES } from './endpoints';

// Auth APIs
export const authAPI = {
  login: (data: any) => axios.post('/auth/login', data),
  register: (data: any) => axios.post('/auth/register', data),
  getCurrentUser: () => axios.get('/user'),
};

// Store APIs
export const storeAPI = {
  list: () => axios.get('/stores'),
  create: (data: any) => axios.post('/stores', data),
  update: (id: string, data: any) => axios.put(`/stores/${id}`, data),
  delete: (id: string) => axios.delete(`/stores/${id}`),
};

// Customer APIs
export const customerAPI = {
  getAll: () => axios.get(API_ROUTES.CUSTOMERS),
  getById: (id: string) => axios.get(`${API_ROUTES.CUSTOMERS}/${id}`),
  create: (data: any) => axios.post(API_ROUTES.CUSTOMERS, data),
  update: (id: string, data: any) => axios.put(`${API_ROUTES.CUSTOMERS}/${id}`, data),
  delete: (id: string) => axios.delete(`${API_ROUTES.CUSTOMERS}/${id}`)
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => axios.get('/dashboard/stats'),
};

// Finance APIs
export const financeAPI = {
  getTransactions: () => axios.get(API_ROUTES.FINANCE.TRANSACTIONS),
  createTransaction: (data: any) => axios.post(API_ROUTES.FINANCE.TRANSACTIONS, data)
};