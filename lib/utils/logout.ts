// utils/logout.ts

import { apiClient } from './axios';
import { handleApiError } from './api';

export const logoutUser = async () => {
  try {
    await apiClient.post('/logout');
    window.location.href = '/auth/login'; // or your login path
  } catch (error) {
    console.error('Logout error:', handleApiError(error));
  }
};
