
import axios from 'axios';

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://0.0.0.0:8000/api';

const laravelApi = axios.create({
  baseURL: LARAVEL_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Enable sending cookies with requests
});

// Request interceptor
laravelApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
laravelApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials: { email: string; password: string }) => 
    laravelApi.post('/auth/login', credentials),
  logout: () => laravelApi.post('/auth/logout'),
  me: () => laravelApi.get('/auth/me'),
};

export const api = {
  customers: {
    list: () => laravelApi.get('/customers'),
    create: (data: any) => laravelApi.post('/customers', data),
    update: (id: string, data: any) => laravelApi.put(`/customers/${id}`, data),
    delete: (id: string) => laravelApi.delete(`/customers/${id}`),
  },
  inventory: {
    list: () => laravelApi.get('/inventory'),
    update: (id: string, data: any) => laravelApi.put(`/inventory/${id}`, data),
    stock: (id: string, quantity: number) => 
      laravelApi.patch(`/inventory/${id}/stock`, { quantity }),
  },
  invoices: {
    generate: (id: string) => laravelApi.get(`/invoices/${id}/generate-pdf`),
    email: (id: string) => laravelApi.post(`/invoices/${id}/email`),
  },
};

export default laravelApi;
