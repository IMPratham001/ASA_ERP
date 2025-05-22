
import { api } from '../axios';

export const pdfTemplateAPI = {
  getAll: () => api.get('/templates'),
  getById: (id: string) => api.get(`/templates/${id}`),
  create: (data: any) => api.post('/templates', data),
  update: (id: string, data: any) => api.put(`/templates/${id}`, data),
  delete: (id: string) => api.delete(`/templates/${id}`),
  preview: (id: string) => api.get(`/templates/${id}/preview`),
};
