
import { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    // Handle network errors
    if (!error.response) {
      return 'Network error. Please check your connection.';
    }

    // Handle API errors with response
    const status = error.response.status;
    const message = error.response.data?.message;

    switch (status) {
      case 401:
        window.location.href = '/auth/login';
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return message || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message || 'An unexpected error occurred.';
    }
  }

  return 'An unexpected error occurred.';
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response;
};
