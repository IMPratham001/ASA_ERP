
import { api } from '../axios';

export const taxAPI = {
  getAll: () => api.get('/finance/tax'),
  getById: (id: string) => api.get(`/finance/tax/${id}`),
  create: (data: any) => api.post('/finance/tax', data),
  update: (id: string, data: any) => api.put(`/finance/tax/${id}`, data),
  delete: (id: string) => api.delete(`/finance/tax/${id}`),
};
