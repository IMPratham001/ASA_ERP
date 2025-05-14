
import { cache } from 'react';
import api from './axios';

export const fetchWithCache = cache(async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
});
