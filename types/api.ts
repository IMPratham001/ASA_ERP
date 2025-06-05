// types/api.tsimport axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const apiClient = {
  async get(endpoint: string, params = {}) {
    const response = await axiosInstance.get(endpoint, { params });
    return response.data;
  },
  async post(endpoint: string, data = {}) {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  },
  async put(endpoint: string, data = {}) {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
  },
  async delete(endpoint: string) {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  },
};
