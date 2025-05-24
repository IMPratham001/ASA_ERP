
import { api } from './axios';

export const pdfAPI = {
  generate: async (template: string, data: any, options = {}) => {
    const response = await api.post('/pdf/generate', {
      template,
      data,
      options,
    });
    return response.data;
  },

  preview: async (template: string, data: any, options = {}) => {
    const response = await api.post('/pdf/preview', {
      template,
      data,
      options,
    });
    return response.data;
  },

  download: async (template: string, data: any, options = {}) => {
    const response = await api.post('/pdf/download', {
      template,
      data,
      options,
    });
    return response.data;
  },

  saveTemplate: async (template: string, version: number) => {
    const response = await api.post('/pdf/templates', {
      template,
      version,
    });
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/pdf/templates');
    return response.data;
  },
};
