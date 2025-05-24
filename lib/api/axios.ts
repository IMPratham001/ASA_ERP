
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000/api';
console.log('API URL:', baseURL); // Debug log

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
