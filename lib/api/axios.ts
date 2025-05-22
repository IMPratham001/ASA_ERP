
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/mock',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
