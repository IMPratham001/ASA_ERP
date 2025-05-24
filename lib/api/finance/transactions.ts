
import { api } from '../axios';

export const transactionAPI = {
  getAll: () => api.get('/finance/transactions'),
  getById: (id: string) => api.get(`/finance/transactions/${id}`),
  create: (data: any) => api.post('/finance/transactions', data),
  update: (id: string, data: any) => api.put(`/finance/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/finance/transactions/${id}`)
};
