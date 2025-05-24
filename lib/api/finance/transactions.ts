
import { api } from '../axios';
import { Transaction, DashboardStats } from '@/types/finance';

export const financeAPI = {
  getAll: () => api.get<Transaction[]>('/finance/transactions'),
  getById: (id: string) => api.get<Transaction>(`/finance/transactions/${id}`),
  create: (data: Partial<Transaction>) => api.post<Transaction>('/finance/transactions', data),
  update: (id: string, data: Partial<Transaction>) => api.put<Transaction>(`/finance/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/finance/transactions/${id}`),
  getDashboardStats: () => api.get<DashboardStats>('/finance/dashboard/stats'),
  getCashFlow: () => api.get<any[]>('/finance/cash-flow')
};
