
import { api } from '../axios';

export const budgetAPI = {
  getAll: () => api.get('/finance/budget'),
  getById: (id: string) => api.get(`/finance/budget/${id}`),
  create: (data: any) => api.post('/finance/budget', data),
  update: (id: string, data: any) => api.put(`/finance/budget/${id}`, data),
  delete: (id: string) => api.delete(`/finance/budget/${id}`),
};
