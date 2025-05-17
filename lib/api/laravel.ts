
import axios from 'axios';

// Mock data for development
const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' }
];

// Mock API implementation
export const customerAPI = {
  getAll: () => Promise.resolve({ data: mockCustomers }),
  getById: (id: number) => Promise.resolve({ data: mockCustomers.find(c => c.id === id) }),
  create: (data: any) => Promise.resolve({ data: { id: Date.now(), ...data } }),
  update: (id: number, data: any) => Promise.resolve({ data: { id, ...data } }),
  delete: (id: number) => Promise.resolve({ data: { success: true } })
};

// Keep the axios instance for later use
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
