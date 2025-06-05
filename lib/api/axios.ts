// lib/api/axios.ts
import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// CSRF initialization
async function initCSRF() {
  try {
    console.log('Initializing CSRF token...');
    await axiosInstance.get('/sanctum/csrf-cookie');
    console.log('CSRF token initialized successfully');
  } catch (error) {
    console.warn('CSRF initialization failed:', error);
    // Don't throw error, continue without CSRF for now
  }
}

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Try to initialize CSRF on first request
    if (!axiosInstance.defaults.headers.common['X-XSRF-TOKEN']) {
      await initCSRF();
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });

    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Laravel server not running?');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - Check backend URL and CORS settings');
    } else if (error.response?.status === 404) {
      console.error('API endpoint not found - Route missing in Laravel?');
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  async get(endpoint: string, params = {}) {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  async post(endpoint: string, data = {}) {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },

  async put(endpoint: string, data = {}) {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  },

  async login(credentials: { email: string; password: string; remember_me?: boolean }) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async auditLog(data: { event_type: string; username: string; details: string }) {
    try {
      const response = await axiosInstance.post('/audit/log', data);
      return response.data;
    } catch (error) {
      console.error('Audit log failed:', error);
      throw error;
    }
  },

  // Test connection method
  async testConnection() {
    try {
      const response = await axiosInstance.get('/api/test');
      return response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
};