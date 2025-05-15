
import axios from 'axios';

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://0.0.0.0:8000/api';

const laravelApi = axios.create({
  baseURL: LARAVEL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const auth = {
  login: (credentials: { email: string; password: string }) => 
    laravelApi.post('/auth/login', credentials),
  logout: () => laravelApi.post('/auth/logout'),
};

export const invoices = {
  generate: (id: string) => laravelApi.get(`/invoices/${id}/generate-pdf`),
  email: (id: string) => laravelApi.post(`/invoices/${id}/email`),
};

export default laravelApi;
