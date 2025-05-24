
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const isDev = process.env.NODE_ENV === 'development';
const API_URL = isDev ? 'http://0.0.0.0:8000/api' : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your connection.',
        variant: 'destructive'
      });
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    } else {
      const message = error.response?.data?.message || 'An error occurred';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }
    return Promise.reject(error);
  }
);

export { api };
